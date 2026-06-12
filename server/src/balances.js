export const userBalances = new Map();

export const BALANCE_PACKAGES = {
  basic: 5,
  plus: 12,
  pro: 30
};

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey);

async function supabaseRequest(path, { method = 'GET', headers = {}, body } = {}) {
  if (!hasSupabaseConfig) {
    const error = new Error('Supabase is not configured');
    error.code = 'SUPABASE_NOT_CONFIGURED';
    throw error;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      'Content-Type': 'application/json',
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || data?.hint || `Supabase request failed: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function encodeFilter(value) {
  return encodeURIComponent(String(value));
}

export function getIdentity(req) {
  const telegramId = req.telegramUser?.id || req.body?.userId || req.query?.userId || null;
  if (telegramId) {
    return {
      type: 'telegram',
      id: String(telegramId),
      key: `telegram:${telegramId}`
    };
  }

  const sessionId =
    req.headers['x-snarkscan-session-id'] ||
    req.body?.sessionId ||
    req.query?.sessionId ||
    req.ip ||
    'anonymous';

  return {
    type: 'anonymous',
    id: String(sessionId),
    key: `anonymous:${sessionId}`
  };
}

export function getBalance(identity) {
  return userBalances.get(identity.key) || 0;
}

export function setBalance(identity, count) {
  const nextBalance = Math.max(0, Number(count) || 0);
  userBalances.set(identity.key, nextBalance);
  return nextBalance;
}

export function addBalance(identity, count) {
  return setBalance(identity, getBalance(identity) + count);
}

export function spendDeepScan(identity) {
  const currentBalance = getBalance(identity);
  if (currentBalance <= 0) return false;
  setBalance(identity, currentBalance - 1);
  return true;
}

export function refundDeepScan(identity) {
  return addBalance(identity, 1);
}

export async function getSupabaseBalance(identity) {
  const rows = await supabaseRequest(`user_balances?user_key=eq.${encodeFilter(identity.key)}&select=deep_scans&limit=1`);
  if (rows?.[0]) return Number(rows[0].deep_scans) || 0;

  const inserted = await supabaseRequest('user_balances?select=deep_scans', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: {
      user_key: identity.key,
      telegram_user_id: identity.type === 'telegram' ? identity.id : null,
      deep_scans: 0
    }
  });

  return Number(inserted?.[0]?.deep_scans) || 0;
}

export async function addSupabaseBalance(identity, count) {
  const currentBalance = await getSupabaseBalance(identity);
  const nextBalance = Math.max(0, currentBalance + Number(count || 0));
  const updated = await supabaseRequest(`user_balances?user_key=eq.${encodeFilter(identity.key)}&select=deep_scans`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: {
      deep_scans: nextBalance,
      telegram_user_id: identity.type === 'telegram' ? identity.id : null,
      updated_at: new Date().toISOString()
    }
  });
  return Number(updated?.[0]?.deep_scans) || nextBalance;
}

export async function spendSupabaseDeepScan(identity) {
  const currentBalance = await getSupabaseBalance(identity);
  if (currentBalance <= 0) return { ok: false, deepScans: currentBalance };

  const updated = await supabaseRequest(
    `user_balances?user_key=eq.${encodeFilter(identity.key)}&deep_scans=eq.${currentBalance}&select=deep_scans`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: {
        deep_scans: currentBalance - 1,
        telegram_user_id: identity.type === 'telegram' ? identity.id : null,
        updated_at: new Date().toISOString()
      }
    }
  );

  if (!updated?.[0]) {
    return spendSupabaseDeepScan(identity);
  }

  return { ok: true, deepScans: Number(updated[0].deep_scans) || 0 };
}

export async function refundSupabaseDeepScan(identity) {
  return addSupabaseBalance(identity, 1);
}

export async function hasSupabasePayment(telegramPaymentChargeId) {
  const rows = await supabaseRequest(
    `payments?telegram_payment_charge_id=eq.${encodeFilter(telegramPaymentChargeId)}&select=id&limit=1`
  );
  return Boolean(rows?.[0]);
}

export async function insertSupabasePayment({
  telegramPaymentChargeId,
  providerPaymentChargeId,
  identity,
  packageId,
  starsAmount,
  deepScansAdded,
  payload
}) {
  const inserted = await supabaseRequest('payments?select=id', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: {
      telegram_payment_charge_id: telegramPaymentChargeId,
      provider_payment_charge_id: providerPaymentChargeId || null,
      user_key: identity.key,
      telegram_user_id: identity.type === 'telegram' ? identity.id : null,
      package_id: packageId,
      stars_amount: starsAmount,
      deep_scans_added: deepScansAdded,
      payload
    }
  });
  return inserted?.[0] || null;
}

export async function deleteSupabasePayment(telegramPaymentChargeId) {
  await supabaseRequest(`payments?telegram_payment_charge_id=eq.${encodeFilter(telegramPaymentChargeId)}`, {
    method: 'DELETE'
  });
}
