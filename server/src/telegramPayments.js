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

  const response = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: `SnarkScan ${pack.title}`,
      description: `${pack.scans} deep scans for SnarkScan AI.`,
      payload: JSON.stringify({
        product: 'deep_scans',
        packageId: pack.id,
        user_key: userKey,
        scans: pack.scans,
        userId: userId || null,
        sessionId: sessionId || null,
        ts: Date.now()
      }),
      currency: 'XTR',
      prices: [{ label: `${pack.title} package`, amount: pack.stars }],
      start_parameter: `deep_scans_${pack.id}`,
      photo_url: publicAppUrl ? `${publicAppUrl.replace(/\/$/, '')}/og-card.png` : undefined
    })
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || 'Telegram invoice creation failed');
  }
  return data.result;
}

export async function createDeepScanInvoice({ botToken, publicAppUrl, userId, stars = 25 }) {
  const packageId = stars >= 100 ? 'pro' : stars >= 50 ? 'plus' : 'basic';
  return createStarsInvoice({ botToken, publicAppUrl, userId, packageId });
}
