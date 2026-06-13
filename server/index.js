import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMockScan } from './src/snarkEngine.js';
import { createOpenAIScan } from './src/openaiClient.js';
import { verifyTelegramWebAppData } from './src/telegramAuth.js';
import { createDeepScanInvoice, createStarsInvoice, decodeInvoicePayload, getStarPackage } from './src/telegramPayments.js';
import {
  addBalance,
  addSupabaseBalance,
  BALANCE_PACKAGES,
  deleteSupabasePayment,
  getBalance,
  getIdentity,
  getSupabaseBalance,
  hasSupabaseConfig,
  hasSupabasePayment,
  insertSupabasePayment,
  refundDeepScan,
  refundSupabaseDeepScan,
  spendDeepScan,
  spendSupabaseDeepScan,
  supabase
} from './src/balances.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, '..', 'public');
const memoryPaymentChargeIds = new Set();
const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL);
const hasSupabaseServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(cors());
app.use(express.json({ limit: '7mb' }));
app.use(express.static(publicDir));

function requireTelegramAuth(req, res, next) {
  if (process.env.REQUIRE_TELEGRAM_AUTH !== 'true') return next();
  const initData = req.headers['x-telegram-init-data'];
  const verification = verifyTelegramWebAppData(initData, process.env.TELEGRAM_BOT_TOKEN);
  if (!verification.ok) {
    return res.status(401).json({ error: 'Telegram auth failed', reason: verification.reason });
  }
  req.telegramUser = verification.user;
  return next();
}

function attachTelegramUser(req, _res, next) {
  if (req.telegramUser || !process.env.TELEGRAM_BOT_TOKEN) return next();
  const initData = req.headers['x-telegram-init-data'];
  const verification = verifyTelegramWebAppData(initData, process.env.TELEGRAM_BOT_TOKEN);
  if (verification.ok) {
    req.telegramUser = verification.user;
  }
  return next();
}

function getAdminToken(req) {
  return req.query?.adminToken || req.body?.adminToken || req.headers['x-admin-test-token'] || '';
}

function requireAdminTestToken(req, res, next) {
  const expectedToken = process.env.ADMIN_TEST_TOKEN;
  if (!expectedToken || getAdminToken(req) !== expectedToken) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }
  return next();
}

function requireTelegramWebhookSecret(req, res, next) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expectedSecret) return next();

  const actualSecret = req.headers['x-telegram-bot-api-secret-token'];
  if (actualSecret !== expectedSecret) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  return next();
}

async function runScan({ mode = 'photo', language = 'ru', text = '', imageDataUrl = '', name = '', deep = false }) {
  const safeMode = ['photo', 'roast', 'chat', 'compare'].includes(mode) ? mode : 'photo';
  const safeLanguage = ['ru', 'en', 'uk'].includes(language) ? language : 'ru';

  if (imageDataUrl && !String(imageDataUrl).startsWith('data:image/')) {
    const error = new Error('imageDataUrl must be a data:image URL');
    error.status = 400;
    throw error;
  }

  if (String(text).length > 4000) {
    const error = new Error('Text is too long. Keep it under 4000 characters.');
    error.status = 400;
    throw error;
  }

  if (process.env.OPENAI_API_KEY) {
    return createOpenAIScan({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
      mode: safeMode,
      text,
      imageDataUrl,
      language: safeLanguage,
      deep: Boolean(deep)
    });
  }

  return createMockScan({ mode: safeMode, language: safeLanguage, text, name, deep: Boolean(deep) });
}

function parseInvoicePayload(rawPayload) {
  const payload = decodeInvoicePayload(rawPayload);
  const scans = BALANCE_PACKAGES[payload?.packageId];
  if (!payload || !scans) return null;
  return { ...payload, scans };
}

async function getBalanceWithFallback(identity) {
  if (!hasSupabaseConfig) {
    return { deepScans: getBalance(identity), source: 'memory' };
  }

  try {
    return { deepScans: await getSupabaseBalance(identity), source: 'supabase' };
  } catch (error) {
    console.error('Supabase balance unavailable:', error.message);
    throw error;
  }
}

async function spendDeepScanWithFallback(identity) {
  if (!hasSupabaseConfig) {
    const ok = spendDeepScan(identity);
    return { ok, deepScans: getBalance(identity), source: 'memory' };
  }

  try {
    const result = await spendSupabaseDeepScan(identity);
    return { ...result, source: 'supabase' };
  } catch (error) {
    console.error('Supabase spend unavailable:', error.message);
    const ok = spendDeepScan(identity);
    return { ok, deepScans: getBalance(identity), source: 'memory' };
  }
}

async function refundDeepScanBySource(identity, source) {
  if (source === 'supabase') {
    try {
      return await refundSupabaseDeepScan(identity);
    } catch (error) {
      console.error('Supabase refund failed:', error.message);
      return 0;
    }
  }

  return refundDeepScan(identity);
}

app.use(attachTelegramUser);
app.use('/api/dev', requireAdminTestToken);
app.use('/api/test', requireAdminTestToken);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'SnarkScan AI', ai: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/scan', requireTelegramAuth, async (req, res) => {
  try {
    const { mode = 'photo', language = 'ru', text = '', imageDataUrl = '', name = '', deep = false } = req.body || {};
    const result = await runScan({ mode, language, text, imageDataUrl, name, deep });

    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    const fallback = createMockScan({ mode: req.body?.mode || 'photo', language: req.body?.language || 'ru', text: req.body?.text || '', deep: Boolean(req.body?.deep) });
    res.status(200).json({ ok: true, result: fallback, warning: error.message || 'AI failed, returned mock result' });
  }
});

app.get('/api/balance', requireTelegramAuth, async (req, res) => {
  try {
    const identity = getIdentity(req);
    const balance = await getBalanceWithFallback(identity);
    res.json(balance);
  } catch {
    res.status(503).json({ error: 'Balance unavailable' });
  }
});

app.post('/api/dev/grant-test-scans', requireTelegramAuth, async (req, res) => {
  try {
    const identity = getIdentity(req);
    const count = Number(req.body?.count) || 5;
    const safeCount = Math.max(1, Math.min(100, count));
    const deepScans = hasSupabaseConfig
      ? await addSupabaseBalance(identity, safeCount)
      : addBalance(identity, safeCount);

    res.json({
      ok: true,
      deepScans,
      added: safeCount,
      source: hasSupabaseConfig ? 'supabase' : 'memory'
    });
  } catch (error) {
    console.error('Test scans grant failed:', error.message);
    res.status(503).json({ ok: false, error: 'Could not grant test scans.' });
  }
});

app.post('/api/deep-scan/use', requireTelegramAuth, async (req, res) => {
  const identity = getIdentity(req);
  const spend = await spendDeepScanWithFallback(identity);

  if (!spend.ok) {
    return res.status(402).json({
      ok: false,
      error: 'Not enough deep scans. Please buy a package to continue.',
      code: 'INSUFFICIENT_DEEP_SCANS',
      deepScans: spend.deepScans,
      source: spend.source
    });
  }

  try {
    const { mode = 'photo', language = 'ru', text = '', imageDataUrl = '', name = '' } = req.body || {};
    const result = await runScan({ mode, language, text, imageDataUrl, name, deep: true });
    res.json({
      ok: true,
      result,
      deepScans: spend.deepScans,
      source: spend.source,
      message: 'Deep scan spent.'
    });
  } catch (error) {
    const deepScans = await refundDeepScanBySource(identity, spend.source);
    console.error(error);
    res.status(error.status || 500).json({
      ok: false,
      error: 'Could not complete the deep scan. The scan was returned to your balance.',
      code: 'DEEP_SCAN_FAILED',
      deepScans,
      source: spend.source
    });
  }
});

app.post('/api/telegram/webhook', requireTelegramWebhookSecret, async (req, res) => {
  const message = req.body?.message;
  const payment = message?.successful_payment;
  if (!payment) {
    return res.json({ ok: true });
  }

  const payload = parseInvoicePayload(payment.invoice_payload);
  const telegramUserId = message?.from?.id;
  if (!payload || !telegramUserId) {
    return res.json({ ok: true });
  }

  const telegramPaymentChargeId = payment.telegram_payment_charge_id;
  if (!telegramPaymentChargeId) {
    return res.json({ ok: true });
  }

  const identity = {
    type: 'telegram',
    id: String(telegramUserId),
    key: payload.userKey || `telegram:${telegramUserId}`
  };

  try {
    if (hasSupabaseConfig) {
      const alreadyProcessed = await hasSupabasePayment(telegramPaymentChargeId);
      if (alreadyProcessed) return res.json({ ok: true });

      await insertSupabasePayment({
        telegramPaymentChargeId,
        providerPaymentChargeId: payment.provider_payment_charge_id,
        identity,
        packageId: payload.packageId,
        starsAmount: payment.total_amount,
        deepScansAdded: payload.scans,
        payload: payload.raw
      });

      try {
        await addSupabaseBalance(identity, payload.scans);
      } catch (error) {
        await deleteSupabasePayment(telegramPaymentChargeId);
        throw error;
      }
    } else if (!memoryPaymentChargeIds.has(telegramPaymentChargeId)) {
      memoryPaymentChargeIds.add(telegramPaymentChargeId);
      addBalance(identity, payload.scans);
    }
  } catch (error) {
    console.error('Telegram payment processing failed:', error.message);
  }

  res.json({ ok: true });
});

app.post('/api/create-invoice', requireTelegramAuth, async (req, res) => {
  try {
    const userId = req.telegramUser?.id || req.body?.userId || null;
    const invoiceLink = await createDeepScanInvoice({
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      publicAppUrl: process.env.PUBLIC_APP_URL,
      userId,
      stars: 15
    });
    res.json({ ok: true, invoiceLink });
  } catch (error) {
    console.error(error);
    res.status(501).json({
      ok: false,
      error: 'Stars invoice is not configured yet'
    });
  }
});

app.post('/api/stars/create-invoice', requireTelegramAuth, async (req, res) => {
  try {
    const { packageId } = req.body || {};
    const pack = getStarPackage(packageId);
    if (!pack) {
      return res.status(400).json({
        ok: false,
        error: 'Unknown Stars package.'
      });
    }

    const identity = getIdentity(req);
    const userId = identity.type === 'telegram' ? identity.id : null;
    const sessionId = identity.type === 'anonymous' ? identity.id : null;
    const invoiceLink = await createStarsInvoice({
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      publicAppUrl: process.env.PUBLIC_APP_URL,
      userId,
      sessionId,
      userKey: identity.key,
      packageId: pack.id
    });

    res.json({
      ok: true,
      invoiceLink,
      package: {
        id: pack.id,
        title: pack.title,
        stars: pack.stars,
        scans: pack.scans
      }
    });
  } catch (error) {
    console.error(error);
    const status = error.code === 'PAYMENTS_NOT_CONNECTED' ? 501 : 500;
    res.status(status).json({
      ok: false,
      error: error.code === 'PAYMENTS_NOT_CONNECTED' ? 'Payments are not connected yet.' : 'Telegram invoice creation failed.'
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`SnarkScan AI is running on http://localhost:${port}`);
  console.log(`Supabase env present: ${Boolean(hasSupabaseUrl && hasSupabaseServiceRoleKey)}`);
  console.log(`SUPABASE_URL present: ${hasSupabaseUrl}`);
  console.log(`SUPABASE_SERVICE_ROLE_KEY present: ${hasSupabaseServiceRoleKey}`);
  console.log(`Supabase client enabled: ${Boolean(hasSupabaseConfig && supabase)}`);
});
