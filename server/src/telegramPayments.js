export async function createDeepScanInvoice({ botToken, publicAppUrl, userId, stars = 15 }) {
  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is required to create a Stars invoice');
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'SnarkScan Deep Scan',
      description: 'A deeper entertainment-only vibe report with extra roast, advice and share card.',
      payload: JSON.stringify({ product: 'deep_scan', userId: userId || null, ts: Date.now() }),
      currency: 'XTR',
      prices: [{ label: 'Deep Scan', amount: Number(stars) }],
      start_parameter: 'deep_scan',
      photo_url: publicAppUrl ? `${publicAppUrl.replace(/\/$/, '')}/og-card.png` : undefined
    })
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || 'Telegram invoice creation failed');
  }
  return data.result;
}
