export const userBalances = new Map();

export const BALANCE_PACKAGES = {
  basic: 5,
  plus: 12,
  pro: 30
};

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
