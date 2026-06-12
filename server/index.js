import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMockScan } from './src/snarkEngine.js';
import { createOpenAIScan } from './src/openaiClient.js';
import { verifyTelegramWebAppData } from './src/telegramAuth.js';
import { createDeepScanInvoice, createStarsInvoice, getStarPackage } from './src/telegramPayments.js';
import {
  addBalance,
  BALANCE_PACKAGES,
  getBalance,
  getIdentity,
  refundDeepScan,
  spendDeepScan
} from './src/balances.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, '..', 'public');

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
  try {
    const payload = JSON.parse(rawPayload || '{}');
    if (payload?.product !== 'deep_scans') return null;
    const scans = BALANCE_PACKAGES[payload.packageId];
    if (!scans) return null;
    return { packageId: payload.packageId, scans };
  } catch {
    return null;
  }
}

app.use(attachTelegramUser);

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

app.get('/api/balance', requireTelegramAuth, (req, res) => {
  const identity = getIdentity(req);
  res.json({
    deepScans: getBalance(identity),
    source: 'server'
  });
});

app.post('/api/deep-scan/use', requireTelegramAuth, async (req, res) => {
  const identity = getIdentity(req);

  if (!spendDeepScan(identity)) {
    return res.status(402).json({
      ok: false,
      error: 'Not enough deep scans. Please buy a package to continue.',
      code: 'INSUFFICIENT_DEEP_SCANS',
      deepScans: getBalance(identity)
    });
  }

  try {
    const { mode = 'photo', language = 'ru', text = '', imageDataUrl = '', name = '' } = req.body || {};
    const result = await runScan({ mode, language, text, imageDataUrl, name, deep: true });
    res.json({
      ok: true,
      result,
      deepScans: getBalance(identity),
      message: 'Deep scan spent.'
    });
  } catch (error) {
    refundDeepScan(identity);
    console.error(error);
    res.status(error.status || 500).json({
      ok: false,
      error: 'Could not complete the deep scan. The scan was returned to your balance.',
      code: 'DEEP_SCAN_FAILED',
      deepScans: getBalance(identity)
    });
  }
});

app.post('/api/telegram/webhook', (req, res) => {
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

  addBalance({
    type: 'telegram',
    id: String(telegramUserId),
    key: `telegram:${telegramUserId}`
  }, payload.scans);

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
});
