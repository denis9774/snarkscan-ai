export const STAR_PACKAGES = {
  basic: {
    id: 'basic',
    title: 'Basic',
    stars: 25,
    scans: 5
  },
  plus: {
    id: 'plus',
    title: 'Plus',
    stars: 50,
    scans: 12
  },
  pro: {
    id: 'pro',
    title: 'Pro',
    stars: 100,
    scans: 30
  }
};

export function getStarPackage(packageId) {
  return STAR_PACKAGES[packageId] || null;
}

function encodeBase64Url(value) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decodeBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function createInvoicePayload({ packageId, userKey }) {
  const payload = encodeBase64Url(JSON.stringify({ p: packageId, u: userKey }));
  const payloadLength = Buffer.byteLength(payload, 'utf8');

  if (payloadLength < 1 || payloadLength > 128) {
    const error = new Error('Telegram invoice payload must be 1-128 bytes.');
    error.code = 'INVOICE_PAYLOAD_INVALID';
    error.payloadLength = payloadLength;
    throw error;
  }

  return payload;
}

export function decodeInvoicePayload(rawPayload) {
  if (typeof rawPayload !== 'string' || Buffer.byteLength(rawPayload, 'utf8') < 1) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(rawPayload));
    if (typeof payload?.p !== 'string') return null;
    return {
      packageId: payload.p,
      userKey: typeof payload.u === 'string' ? payload.u : null,
      raw: payload
    };
  } catch {}

  try {
    const payload = JSON.parse(rawPayload);
    if (payload?.product !== 'deep_scans') return null;
    return {
      packageId: payload.packageId,
      userKey: payload.user_key || payload.userKey || null,
      raw: payload
    };
  } catch {
    return null;
  }
}

export async function createStarsInvoice({ botToken, publicAppUrl, userId, sessionId, userKey, packageId }) {
  if (!botToken) {
    const error = new Error('Payments are not connected yet.');
    error.code = 'PAYMENTS_NOT_CONNECTED';
    throw error;
  }

  const pack = getStarPackage(packageId);
  if (!pack) {
    const error = new Error('Unknown Stars package.');
    error.code = 'UNKNOWN_PACKAGE';
    throw error;
  }

  const payload = createInvoicePayload({ packageId: pack.id, userKey });
  const payloadLength = Buffer.byteLength(payload, 'utf8');

  let data;
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `SnarkScan ${pack.title}`,
        description: `${pack.scans} deep scans for SnarkScan AI.`,
        payload,
        currency: 'XTR',
        provider_token: '',
        prices: [{ label: `${pack.title} package`, amount: pack.stars }],
        start_parameter: `deep_scans_${pack.id}`,
        photo_url: publicAppUrl ? `${publicAppUrl.replace(/\/$/, '')}/og-card.png` : undefined
      })
    });

    data = await response.json();
  } catch (error) {
    console.error('Telegram createInvoiceLink failed:', {
      message: error.message || 'Telegram invoice creation failed',
      packageId: pack.id,
      payloadLength
    });
    throw error;
  }

  if (!data.ok) {
    const error = new Error(data.description || 'Telegram invoice creation failed');
    console.error('Telegram createInvoiceLink failed:', {
      message: error.message,
      packageId: pack.id,
      payloadLength
    });
    throw error;
  }
  return data.result;
}

export async function createDeepScanInvoice({ botToken, publicAppUrl, userId, stars = 25 }) {
  const packageId = stars >= 100 ? 'pro' : stars >= 50 ? 'plus' : 'basic';
  const userKey = userId ? `telegram:${userId}` : null;
  return createStarsInvoice({ botToken, publicAppUrl, userId, userKey, packageId });
}
