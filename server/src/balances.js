import { createClient } from '@supabase/supabase-js';

export const userBalances = new Map();

export const BALANCE_PACKAGES = {
  basic: 5,
  plus: 12,
  pro: 30
};

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey);
export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

function requireSupabaseClient() {
  if (!supabase) {
    const error = new Error('Supabase is not configured');
    error.code = 'SUPABASE_NOT_CONFIGURED';
    throw error;
  }
  return supabase;
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
  const client = requireSupabaseClient();
  const { data: existing, error: selectError } = await client
    .from('user_balances')
    .select('deep_scans')
    .eq('user_key', identity.key)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return Number(existing.deep_scans) || 0;

  const { data: inserted, error: insertError } = await client
    .from('user_balances')
    .insert({
      user_key: identity.key,
      telegram_user_id: identity.type === 'telegram' ? identity.id : null,
      deep_scans: 0
    })
    .select('deep_scans')
    .single();

  if (insertError) throw insertError;
  return Number(inserted?.deep_scans) || 0;
}

export async function addSupabaseBalance(identity, count) {
  const client = requireSupabaseClient();
  const currentBalance = await getSupabaseBalance(identity);
  const nextBalance = Math.max(0, currentBalance + Number(count || 0));
  const { data: updated, error } = await client
    .from('user_balances')
    .update({
      deep_scans: nextBalance,
      telegram_user_id: identity.type === 'telegram' ? identity.id : null,
      updated_at: new Date().toISOString()
    })
    .eq('user_key', identity.key)
    .select('deep_scans')
    .single();

  if (error) throw error;
  return Number(updated?.deep_scans) || nextBalance;
}

export async function spendSupabaseDeepScan(identity) {
  const client = requireSupabaseClient();
  const currentBalance = await getSupabaseBalance(identity);
  if (currentBalance <= 0) return { ok: false, deepScans: currentBalance };

  const { data: updated, error } = await client
    .from('user_balances')
    .update({
      deep_scans: currentBalance - 1,
      telegram_user_id: identity.type === 'telegram' ? identity.id : null,
      updated_at: new Date().toISOString()
    })
    .eq('user_key', identity.key)
    .eq('deep_scans', currentBalance)
    .select('deep_scans')
    .maybeSingle();

  if (error) throw error;
  if (!updated) {
    return spendSupabaseDeepScan(identity);
  }

  return { ok: true, deepScans: Number(updated.deep_scans) || 0 };
}

export async function refundSupabaseDeepScan(identity) {
  return addSupabaseBalance(identity, 1);
}

export async function hasSupabasePayment(telegramPaymentChargeId) {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('payments')
    .select('id')
    .eq('telegram_payment_charge_id', telegramPaymentChargeId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
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
  const client = requireSupabaseClient();
  const { data: inserted, error } = await client
    .from('payments')
    .insert({
      telegram_payment_charge_id: telegramPaymentChargeId,
      provider_payment_charge_id: providerPaymentChargeId || null,
      user_key: identity.key,
      telegram_user_id: identity.type === 'telegram' ? identity.id : null,
      package_id: packageId,
      stars_amount: starsAmount,
      deep_scans_added: deepScansAdded,
      payload
    })
    .select('id')
    .single();

  if (error) throw error;
  return inserted || null;
}

export async function deleteSupabasePayment(telegramPaymentChargeId) {
  const client = requireSupabaseClient();
  const { error } = await client
    .from('payments')
    .delete()
    .eq('telegram_payment_charge_id', telegramPaymentChargeId);

  if (error) throw error;
}
