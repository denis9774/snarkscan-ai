import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMockScan } from './src/snarkEngine.js';
import { createOpenAIScan } from './src/openaiClient.js';
import { verifyTelegramWebAppData } from './src/telegramAuth.js';
import { createDeepScanInvoice } from './src/telegramPayments.js';

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

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'SnarkScan AI', ai: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/scan', requireTelegramAuth, async (req, res) => {
  try {
    const { mode = 'photo', language = 'ru', text = '', imageDataUrl = '', name = '' } = req.body || {};
    const safeMode = ['photo', 'roast', 'chat', 'compare'].includes(mode) ? mode : 'photo';
    const safeLanguage = ['ru', 'en', 'uk'].includes(language) ? language : 'ru';

    if (imageDataUrl && !String(imageDataUrl).startsWith('data:image/')) {
      return res.status(400).json({ error: 'imageDataUrl must be a data:image URL' });
    }

    if (String(text).length > 4000) {
      return res.status(400).json({ error: 'Text is too long. Keep it under 4000 characters.' });
    }

    let result;
    if (process.env.OPENAI_API_KEY) {
      result = await createOpenAIScan({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL,
        mode: safeMode,
        text,
        imageDataUrl,
        language: safeLanguage
      });
    } else {
      result = createMockScan({ mode: safeMode, language: safeLanguage, text, name });
    }

    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    const fallback = createMockScan({ mode: req.body?.mode || 'photo', language: req.body?.language || 'ru', text: req.body?.text || '' });
    res.status(200).json({ ok: true, result: fallback, warning: error.message || 'AI failed, returned mock result' });
  }
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
      error: 'Stars invoice is not configured yet',
      details: error.message
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`SnarkScan AI is running on http://localhost:${port}`);
});
