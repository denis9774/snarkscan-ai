import crypto from 'node:crypto';

export function verifyTelegramWebAppData(initData, botToken) {
  if (!initData || !botToken) return { ok: false, reason: 'Missing initData or bot token' };

  const params = new URLSearchParams(initData);
  const receivedHash = params.get('hash');
  if (!receivedHash) return { ok: false, reason: 'Missing hash' };

  params.delete('hash');
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  const received = Buffer.from(receivedHash, 'hex');
  const calculated = Buffer.from(calculatedHash, 'hex');

  if (received.length !== calculated.length) {
    return { ok: false, reason: 'Invalid hash length' };
  }

  const ok = crypto.timingSafeEqual(received, calculated);
  if (!ok) return { ok: false, reason: 'Hash mismatch' };

  let user = null;
  try {
    const userRaw = params.get('user');
    if (userRaw) user = JSON.parse(userRaw);
  } catch {
    user = null;
  }

  return { ok: true, user };
}
