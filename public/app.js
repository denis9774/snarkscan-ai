const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.('#090812');
  tg.setBackgroundColor?.('#080711');
}

const supportedLanguages = ['ru', 'en', 'uk'];
const sessionStorageKey = 'snarkscan_session_id';

function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

function hasDevModeInUrl() {
  return getUrlParams().get('dev') === '1';
}

function getAdminTokenFromUrl() {
  return getUrlParams().get('adminToken') || '';
}

function isDevModeEnabled() {
  return hasDevModeInUrl() && Boolean(getAdminTokenFromUrl());
}

function getSessionId() {
  let sessionId = localStorage.getItem(sessionStorageKey);
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(sessionStorageKey, sessionId);
  }
  return sessionId;
}

const sessionId = getSessionId();

const starPackages = [
  { id: 'basic', title: 'Basic', stars: 25, scans: 5 },
  { id: 'plus', title: 'Plus', stars: 50, scans: 12 },
  { id: 'pro', title: 'Pro', stars: 100, scans: 30 }
];

const i18n = {
  ru: {
    htmlLang: 'ru',
    eyebrow: 'Telegram Mini App · entertainment AI',
    heroTitle: 'Сканируй свой <span>вайб</span>',
    heroCopy: 'AI проанализирует фото, переписку или короткий контекст и выдаст смешной разбор, которым хочется поделиться.',
    modesAria: 'Режимы сканирования',
    languageAria: 'Выбор языка',
    starsAria: 'Баланс Stars',
    modePhotoShort: 'Фото‑скан',
    modeRoastShort: 'Roast me',
    modeChatShort: 'Разбор',
    modeCompareShort: 'Сравнить',
    modePhotoFull: 'Фото‑скан',
    modeRoastFull: 'Roast me',
    modeChatFull: 'Разбор переписки',
    modeCompareFull: 'Сравнение',
    uploadTitle: 'Загрузите фото или сделайте снимок',
    uploadSubtitle: 'Нажмите для выбора файла · до 4.5 MB',
    uploadedTitle: 'Фото загружено. Можно сканировать.',
    or: 'или',
    placeholderPhoto: 'Можешь добавить контекст: «хочу смешной, но не жесткий разбор»',
    placeholderRoast: 'Напиши 2–3 факта о себе: «люблю кофе, откладываю дела, хочу стать богаче»',
    placeholderChat: 'Вставь сообщение или кусок переписки. Не добавляй личные данные.',
    placeholderCompare: 'Добавь контекст: «сравни нас как персонажей сериала / кто главный герой?»',
    scanButton: 'Сканировать вайб',
    scanning: 'AI читает вайб…',
    shareButton: 'Поделиться',
    deepButton: 'Глубокий скан ⭐',
    premiumAria: 'Премиум разбор',
    premiumLabel: 'Премиум разбор',
    premiumPrice: 'от 25 Stars',
    premiumTitle: 'Глубокий AI‑анализ без фильтров',
    premiumCopy: 'Детальный разбор, скрытые сигналы, рекомендации и инсайты.',
    detailsButton: 'Подробнее',
    footerDisclaimer: '<strong>Дисклеймер:</strong> SnarkScan AI создан для развлечения. Результаты не являются объективной оценкой личности, здоровья, внешности или отношений.',
    defaultShare: 'Я прошёл SnarkScan AI.',
    needImage: 'Нужна картинка.',
    imageTooLarge: 'Картинка слишком большая. Лучше до 4.5 MB.',
    scanFailed: 'Что-то пошло не так',
    paymentsNotReady: 'Payments are not connected yet.',
    starsOnlyTelegram: 'Оплата Stars доступна только внутри Telegram Mini App.',
    purchaseKicker: 'Telegram Stars',
    purchaseTitle: 'Купить сканы',
    closeModalAria: 'Закрыть',
    packageScans: 'глубоких сканов',
    starUnit: 'Stars',
    buyPackageAria: 'Купить пакет',
    deepScansBalance: 'Глубокие сканы: {count}',
    deepScansBalanceDev: 'Глубокие сканы: {count} (dev/test)',
    deepScansBalanceServer: 'Глубокие сканы: {count} (server)',
    grantTestScans: 'Выдать тестовые сканы',
    testScansGranted: 'Начислено +5 глубоких сканов.',
    premiumResultReady: 'Глубокий скан готов. Списан 1 скан.',
    notEnoughScans: 'Недостаточно глубоких сканов. Купите пакет, чтобы продолжить.',
    scanSpent: 'Списан 1 глубокий скан.',
    scanReturned: 'Скан возвращён на баланс из-за ошибки.',
    balanceUpdated: 'Баланс обновлён.',
    invoiceOpening: 'Открываем оплату…',
    paymentSuccess: 'Оплата получена. Баланс начислен.',
    invoiceFailed: 'Не удалось открыть оплату.'
  },
  en: {
    htmlLang: 'en',
    eyebrow: 'Telegram Mini App · entertainment AI',
    heroTitle: 'Scan your <span>vibe</span>',
    heroCopy: 'AI analyzes a photo, chat or short context and gives you a funny result worth sharing.',
    modesAria: 'Scan modes',
    languageAria: 'Language selector',
    starsAria: 'Stars balance',
    modePhotoShort: 'Photo scan',
    modeRoastShort: 'Roast me',
    modeChatShort: 'Chat scan',
    modeCompareShort: 'Compare',
    modePhotoFull: 'Photo scan',
    modeRoastFull: 'Roast me',
    modeChatFull: 'Chat analysis',
    modeCompareFull: 'Comparison',
    uploadTitle: 'Upload a photo or take a shot',
    uploadSubtitle: 'Tap to choose a file · up to 4.5 MB',
    uploadedTitle: 'Photo uploaded. Ready to scan.',
    or: 'or',
    placeholderPhoto: 'Add context if you want: “funny, but not too harsh”',
    placeholderRoast: 'Write 2–3 facts about yourself: “coffee lover, procrastinator, wants to get richer”',
    placeholderChat: 'Paste a message or chat. Do not include private data.',
    placeholderCompare: 'Add context: “compare us as TV characters / who is the main character?”',
    scanButton: 'Scan vibe',
    scanning: 'AI is reading the vibe…',
    shareButton: 'Share',
    deepButton: 'Deep scan ⭐',
    premiumAria: 'Premium scan',
    premiumLabel: 'Premium scan',
    premiumPrice: 'from 25 Stars',
    premiumTitle: 'Deep AI analysis without the boring filter',
    premiumCopy: 'Detailed breakdown, hidden signals, recommendations and insights.',
    detailsButton: 'Details',
    footerDisclaimer: '<strong>Disclaimer:</strong> SnarkScan AI is made for entertainment. Results are not an objective assessment of personality, health, appearance or relationships.',
    defaultShare: 'I tried SnarkScan AI.',
    needImage: 'Please upload an image.',
    imageTooLarge: 'The image is too large. Keep it under 4.5 MB.',
    scanFailed: 'Something went wrong',
    paymentsNotReady: 'Payments are not connected yet.',
    starsOnlyTelegram: 'Stars payment is available only inside Telegram Mini App.',
    purchaseKicker: 'Telegram Stars',
    purchaseTitle: 'Buy scans',
    closeModalAria: 'Close',
    packageScans: 'deep scans',
    starUnit: 'Stars',
    buyPackageAria: 'Buy package',
    deepScansBalance: 'Deep scans: {count}',
    deepScansBalanceDev: 'Deep scans: {count} (dev/test)',
    deepScansBalanceServer: 'Deep scans: {count} (server)',
    grantTestScans: 'Grant test scans',
    testScansGranted: '+5 deep scans granted.',
    premiumResultReady: 'Deep scan is ready. 1 scan spent.',
    notEnoughScans: 'Not enough deep scans. Buy a package to continue.',
    scanSpent: '1 deep scan spent.',
    scanReturned: 'The scan was returned to your balance because of an error.',
    balanceUpdated: 'Balance updated.',
    invoiceOpening: 'Opening payment…',
    paymentSuccess: 'Payment received. Balance credited.',
    invoiceFailed: 'Could not open payment.'
  },
  uk: {
    htmlLang: 'uk',
    eyebrow: 'Мінізастосунок Telegram · розважальний ШІ',
    heroTitle: 'Скануй свій <span>вайб</span>',
    heroCopy: 'ШІ проаналізує фото, переписку або короткий контекст і видасть смішний розбір, яким хочеться поділитися.',
    modesAria: 'Режими сканування',
    languageAria: 'Вибір мови',
    starsAria: 'Баланс зірок',
    modePhotoShort: 'Фото‑скан',
    modeRoastShort: 'Рознос',
    modeChatShort: 'Розбір',
    modeCompareShort: 'Порівняти',
    modePhotoFull: 'Фото‑скан',
    modeRoastFull: 'Рознос',
    modeChatFull: 'Розбір переписки',
    modeCompareFull: 'Порівняння',
    uploadTitle: 'Завантаж фото або зроби знімок',
    uploadSubtitle: 'Натисни, щоб вибрати файл · до 4.5 МБ',
    uploadedTitle: 'Фото завантажено. Можна сканувати.',
    or: 'або',
    placeholderPhoto: 'Можеш додати контекст: «хочу смішний, але не жорсткий розбір»',
    placeholderRoast: 'Напиши 2–3 факти про себе: «люблю каву, відкладаю справи, хочу стати багатшим»',
    placeholderChat: 'Встав повідомлення або шматок переписки. Не додавай особисті дані.',
    placeholderCompare: 'Додай контекст: «порівняй нас як персонажів серіалу / хто головний герой?»',
    scanButton: 'Сканувати вайб',
    scanning: 'ШІ читає вайб…',
    shareButton: 'Поділитися',
    deepButton: 'Глибокий скан ⭐',
    premiumAria: 'Преміум розбір',
    premiumLabel: 'Преміум розбір',
    premiumPrice: 'від 25 зірок',
    premiumTitle: 'Глибокий ШІ‑аналіз без нудного фільтра',
    premiumCopy: 'Детальний розбір, приховані сигнали, рекомендації та інсайти.',
    detailsButton: 'Детальніше',
    footerDisclaimer: '<strong>Застереження:</strong> Сервіс створений для розваги. Результати не є об’єктивною оцінкою особистості, здоров’я, зовнішності або стосунків.',
    defaultShare: 'Я пройшов SnarkScan AI.',
    needImage: 'Потрібна картинка.',
    imageTooLarge: 'Картинка завелика. Краще до 4.5 МБ.',
    scanFailed: 'Щось пішло не так',
    paymentsNotReady: 'Payments are not connected yet.',
    starsOnlyTelegram: 'Оплата Stars доступна лише всередині Telegram Mini App.',
    purchaseKicker: 'Telegram Stars',
    purchaseTitle: 'Купити скани',
    closeModalAria: 'Закрити',
    packageScans: 'глибоких сканів',
    starUnit: 'зірок',
    buyPackageAria: 'Купити пакет',
    deepScansBalance: 'Глибокі скани: {count}',
    deepScansBalanceDev: 'Глибокі скани: {count} (dev/test)',
    deepScansBalanceServer: 'Глибокі скани: {count} (server)',
    grantTestScans: 'Видати тестові скани',
    testScansGranted: 'Нараховано +5 глибоких сканів.',
    premiumResultReady: 'Глибокий скан готовий. Списано 1 скан.',
    notEnoughScans: 'Недостатньо глибоких сканів. Купіть пакет, щоб продовжити.',
    scanSpent: 'Списано 1 глибокий скан.',
    scanReturned: 'Скан повернено на баланс через помилку.',
    balanceUpdated: 'Баланс оновлено.',
    invoiceOpening: 'Відкриваємо оплату…',
    paymentSuccess: 'Оплату отримано. Баланс нараховано.',
    invoiceFailed: 'Не вдалося відкрити оплату.'
  }
};

const state = {
  mode: 'photo',
  language: getInitialLanguage(),
  imageDataUrl: '',
  lastResult: null,
  deepScans: 0,
  isDevMode: isDevModeEnabled(),
  balanceSource: 'server'
};

Object.assign(i18n.ru, {
  deepScanning: 'Глубокий скан работает...',
  deepScanFailed: 'Не удалось завершить глубокий скан. Скан возвращён на баланс.',
  balanceLoadFailed: 'Не удалось обновить баланс.'
});
Object.assign(i18n.en, {
  deepScanning: 'Deep scan is running...',
  deepScanFailed: 'Could not complete the deep scan. The scan was returned to your balance.',
  balanceLoadFailed: 'Could not update balance.'
});
Object.assign(i18n.uk, {
  deepScanning: 'Глибокий скан працює...',
  deepScanFailed: 'Не вдалося завершити глибокий скан. Скан повернено на баланс.',
  balanceLoadFailed: 'Не вдалося оновити баланс.'
});

const modeButtons = document.querySelectorAll('.mode');
const languageButtons = document.querySelectorAll('.language-button');
const photoInput = document.querySelector('#photoInput');
const dropZone = document.querySelector('#dropZone');
const fileLabel = document.querySelector('#fileLabel');
const preview = document.querySelector('#preview');
const scanText = document.querySelector('#scanText');
const charCount = document.querySelector('#charCount');
const scanButton = document.querySelector('#scanButton');
const resultCard = document.querySelector('#resultCard');
const resultMode = document.querySelector('#resultMode');
const resultTitle = document.querySelector('#resultTitle');
const vibeName = document.querySelector('#vibeName');
const score = document.querySelector('#score');
const bars = document.querySelector('#bars');
const roast = document.querySelector('#roast');
const advice = document.querySelector('#advice');
const disclaimer = document.querySelector('#disclaimer');
const detailedAnalysis = document.querySelector('#detailedAnalysis');
const shareButton = document.querySelector('#shareButton');
const deepButton = document.querySelector('#deepButton');
const premiumInfoButton = document.querySelector('#premiumInfoButton');
const starsButton = document.querySelector('#starsButton');
const barTemplate = document.querySelector('#barTemplate');
const purchaseModal = document.querySelector('#purchaseModal');
const closePurchaseModalButton = document.querySelector('#closePurchaseModal');
const packageList = document.querySelector('#packageList');
const purchaseStatus = document.querySelector('#purchaseStatus');
const deepScansBalance = document.querySelector('#deepScansBalance');
const grantTestScansButton = document.querySelector('#grantTestScansButton');

applyLanguage(state.language);

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modeButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    state.mode = button.dataset.mode;
    scanText.placeholder = t(`placeholder${capitalize(state.mode === 'chat' ? 'chat' : state.mode === 'compare' ? 'compare' : state.mode)}`);
    if (resultMode) resultMode.textContent = modeLabel(state.mode);
    tg?.HapticFeedback?.selectionChanged?.();
  });
});

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyLanguage(button.dataset.lang);
    tg?.HapticFeedback?.selectionChanged?.();
  });
});

scanText.addEventListener('input', () => {
  charCount.textContent = String(scanText.value.length);
});

photoInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  await loadImageFile(file);
});

['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
  });
});

dropZone.addEventListener('drop', async (event) => {
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  await loadImageFile(file);
});

scanButton.addEventListener('click', async () => {
  scanButton.disabled = true;
  scanButton.querySelector('strong').textContent = t('scanning');
  tg?.HapticFeedback?.impactOccurred?.('medium');
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({
        mode: state.mode,
        language: state.language,
        text: scanText.value.trim(),
        imageDataUrl: state.imageDataUrl,
        imageBase64: state.imageDataUrl,
        name: tg?.initDataUnsafe?.user?.first_name || ''
      })
    });
    const data = await response.json();
    if (!data.ok) throw new Error(data.error || 'Scan failed');
    state.lastResult = data.result;
    renderResult(data.result);
  } catch (error) {
    alert(error.message || t('scanFailed'));
  } finally {
    scanButton.disabled = false;
    scanButton.querySelector('strong').textContent = t('scanButton');
  }
});

shareButton.addEventListener('click', async () => {
  const text = state.lastResult?.shareText || t('defaultShare');
  tg?.HapticFeedback?.impactOccurred?.('light');
  if (navigator.share) {
    try {
      await navigator.share({ title: 'SnarkScan AI', text });
      return;
    } catch {}
  }
  const url = `https://t.me/share/url?text=${encodeURIComponent(text)}`;
  if (tg?.openTelegramLink) tg.openTelegramLink(url);
  else window.open(url, '_blank');
});

deepButton.addEventListener('click', handleDeepScanClick);
premiumInfoButton.addEventListener('click', openPurchaseModal);
starsButton.addEventListener('click', openPurchaseModal);
closePurchaseModalButton.addEventListener('click', closePurchaseModal);
grantTestScansButton.addEventListener('click', grantTestScans);
purchaseModal.addEventListener('click', (event) => {
  if (event.target === purchaseModal) closePurchaseModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !purchaseModal.hidden) closePurchaseModal();
});

refreshServerBalance();

function getInitialLanguage() {
  const saved = localStorage.getItem('snarkscan-language');
  if (supportedLanguages.includes(saved)) return saved;
  const telegramCode = tg?.initDataUnsafe?.user?.language_code?.slice(0, 2);
  if (telegramCode === 'uk') return 'uk';
  if (telegramCode === 'en') return 'en';
  return 'ru';
}

function t(key) {
  return i18n[state.language]?.[key] || i18n.ru[key] || key;
}

function formatMessage(key, values = {}) {
  return t(key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '');
}

function apiHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'x-telegram-init-data': tg?.initData || '',
    'x-snarkscan-session-id': sessionId
  };
  const adminToken = getAdminTokenFromUrl();
  if (adminToken) headers['x-admin-test-token'] = adminToken;
  return headers;
}

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function modeLabel(mode) {
  const map = {
    photo: 'modePhotoFull',
    roast: 'modeRoastFull',
    chat: 'modeChatFull',
    compare: 'modeCompareFull'
  };
  return t(map[mode] || 'modePhotoFull');
}

function applyLanguage(language) {
  state.language = supportedLanguages.includes(language) ? language : 'ru';
  localStorage.setItem('snarkscan-language', state.language);
  document.documentElement.lang = t('htmlLang');

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });

  languageButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === state.language);
  });

  scanText.placeholder = t(`placeholder${capitalize(state.mode === 'chat' ? 'chat' : state.mode === 'compare' ? 'compare' : state.mode)}`);
  scanButton.querySelector('strong').textContent = t('scanButton');
  if (resultMode) resultMode.textContent = modeLabel(state.mode);
  if (state.imageDataUrl) fileLabel.textContent = t('uploadedTitle');
  updateDeepScansBalance();
  updateDevControls();
  renderStarPackages();
}

async function loadImageFile(file) {
  if (!file.type.startsWith('image/')) {
    alert(t('needImage'));
    return;
  }
  if (file.size > 4_500_000) {
    alert(t('imageTooLarge'));
    return;
  }
  state.imageDataUrl = await fileToDataUrl(file);
  preview.src = state.imageDataUrl;
  preview.hidden = false;
  dropZone.classList.add('has-preview');
  fileLabel.textContent = t('uploadedTitle');
  tg?.HapticFeedback?.notificationOccurred?.('success');
}

function openPurchaseModal() {
  renderStarPackages();
  updateDevControls();
  setPurchaseStatus('');
  purchaseModal.hidden = false;
  document.body.classList.add('modal-open');
  closePurchaseModalButton.focus();
  tg?.HapticFeedback?.selectionChanged?.();
}

function closePurchaseModal() {
  purchaseModal.hidden = true;
  document.body.classList.remove('modal-open');
}

function renderStarPackages() {
  if (!packageList) return;
  packageList.innerHTML = '';
  starPackages.forEach((pack) => {
    const button = document.createElement('button');
    button.className = 'package-option';
    button.type = 'button';
    button.dataset.packageId = pack.id;
    button.setAttribute('aria-label', `${t('buyPackageAria')} ${pack.title}`);
    button.innerHTML = `
      <span>
        <span class="package-name"><span>★</span>${pack.title}</span>
        <span class="package-scans">${pack.scans} ${t('packageScans')}</span>
      </span>
      <span class="package-price">${pack.stars} ${t('starUnit')}</span>
    `;
    button.addEventListener('click', () => buyStarsPackage(pack.id));
    packageList.appendChild(button);
  });
}

function setDeepScans(count) {
  state.deepScans = Math.max(0, count);
  updateDeepScansBalance();
}

function updateDeepScansBalance() {
  if (!deepScansBalance) return;
  const key = state.isDevMode ? 'deepScansBalanceDev' : 'deepScansBalanceServer';
  deepScansBalance.textContent = formatMessage(key, { count: state.deepScans });
}

function updateDevControls() {
  if (!grantTestScansButton) return;
  state.isDevMode = isDevModeEnabled();
  grantTestScansButton.hidden = !state.isDevMode;
}

async function grantTestScans() {
  if (!state.isDevMode) return;

  grantTestScansButton.disabled = true;
  try {
    const response = await fetch('/api/dev/grant-test-scans', {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({
        count: 5,
        userId: tg?.initDataUnsafe?.user?.id || null,
        sessionId
      })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || 'Forbidden');
    state.balanceSource = data.source === 'memory' ? 'memory' : 'server';
    setDeepScans(Number(data.deepScans) || 0);
    setPurchaseStatus(t('testScansGranted'), 'success');
    tg?.HapticFeedback?.notificationOccurred?.('success');
  } catch {
    setPurchaseStatus(t('balanceLoadFailed'), 'error');
    tg?.HapticFeedback?.notificationOccurred?.('error');
  } finally {
    grantTestScansButton.disabled = false;
  }
}

async function refreshServerBalance({ showStatus = false } = {}) {
  try {
    const response = await fetch('/api/balance', {
      headers: apiHeaders()
    });
    const data = await response.json();
    if (!response.ok || !['supabase', 'memory', 'server'].includes(data.source)) throw new Error('Balance unavailable');
    state.balanceSource = data.source === 'memory' ? 'memory' : 'server';
    setDeepScans(Number(data.deepScans) || 0);
    if (showStatus) setPurchaseStatus(t('balanceUpdated'), 'success');
  } catch {
    state.balanceSource = 'server';
    setDeepScans(0);
    if (showStatus) setPurchaseStatus(t('balanceLoadFailed'), 'error');
  }
}

async function handleDeepScanClick() {
  if (state.deepScans <= 0) {
    openPurchaseModal();
    setPurchaseStatus(t('notEnoughScans'), 'error');
    return;
  }

  await runServerDeepScan();
}

async function runServerDeepScan() {
  deepButton.disabled = true;
  deepButton.textContent = t('deepScanning');
  setPurchaseStatus(t('scanSpent'), 'success');

  try {
    const response = await fetch('/api/deep-scan/use', {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({
        mode: state.mode,
        language: state.language,
        text: scanText.value.trim(),
        imageDataUrl: state.imageDataUrl,
        imageBase64: state.imageDataUrl,
        name: tg?.initDataUnsafe?.user?.first_name || '',
        userId: tg?.initDataUnsafe?.user?.id || null,
        sessionId
      })
    });
    const data = await response.json();
    setDeepScans(Number(data.deepScans) || 0);
    if (response.status === 402) {
      openPurchaseModal();
      setPurchaseStatus(t('notEnoughScans'), 'error');
      return;
    }
    if (!data.ok) throw new Error('Deep scan failed');

    renderResult(data.result);
    state.lastResult = data.result;
    setPurchaseStatus(t('premiumResultReady'), 'success');
    tg?.HapticFeedback?.notificationOccurred?.('success');
  } catch {
    setPurchaseStatus(t('scanReturned'), 'error');
    await refreshServerBalance();
    alert(t('deepScanFailed'));
    tg?.HapticFeedback?.notificationOccurred?.('error');
  } finally {
    deepButton.disabled = false;
    deepButton.textContent = t('deepButton');
  }
}

function setPurchaseStatus(message, type = '') {
  purchaseStatus.textContent = message;
  purchaseStatus.classList.toggle('error', type === 'error');
  purchaseStatus.classList.toggle('success', type === 'success');
}

function setPackagesDisabled(disabled) {
  packageList.querySelectorAll('.package-option').forEach((button) => {
    button.disabled = disabled;
  });
}

async function buyStarsPackage(packageId) {
  setPackagesDisabled(true);
  setPurchaseStatus(t('invoiceOpening'));
  try {
    if (!tg || typeof tg.openInvoice !== 'function') {
      setPurchaseStatus(t('starsOnlyTelegram'), 'error');
      return;
    }

    const response = await fetch('/api/stars/create-invoice', {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({
        packageId,
        userId: tg?.initDataUnsafe?.user?.id || null,
        sessionId,
        language: state.language
      })
    });
    const data = await response.json();
    if (!data.ok || !data.invoiceLink) throw new Error(data.error || data.details || t('invoiceFailed'));

    tg.openInvoice(data.invoiceLink, async (status) => {
      if (status === 'paid') {
        await refreshServerBalance();
        setPurchaseStatus(t('paymentSuccess'), 'success');
        tg?.HapticFeedback?.notificationOccurred?.('success');
      } else if (status === 'failed') {
        setPurchaseStatus(t('invoiceFailed'), 'error');
        tg?.HapticFeedback?.notificationOccurred?.('error');
      } else {
        setPurchaseStatus('');
      }
    });
  } catch (error) {
    const message = String(error?.message || error || '');
    const isUnsupportedInvoice = message.includes('WebAppMethodUnsupported');
    setPurchaseStatus(isUnsupportedInvoice ? t('starsOnlyTelegram') : error.message || t('paymentsNotReady'), 'error');
    tg?.HapticFeedback?.notificationOccurred?.('error');
  } finally {
    setPackagesDisabled(false);
  }
}

function renderResult(result) {
  const resultVibes = result.vibes || result.percentages || [];
  const resultBadge = result.badge || result.label || result.vibeName || '';
  const resultSummary = result.summary || '';
  const resultDetails = result.details || result.detailedAnalysis || '';
  const resultHiddenSignals = result.hiddenSignals || '';

  resultCard.hidden = false;
  resultCard.classList.toggle('deep-result', Boolean(result.deep));
  resultMode.textContent = result.deep ? (resultBadge || 'DEEP SCAN') : modeLabel(state.mode);
  resultTitle.textContent = result.title;
  vibeName.textContent = resultBadge || result.vibeName || result.title;
  score.textContent = `${result.score}/100`;
  roast.textContent = result.roast;
  advice.textContent = result.advice;
  disclaimer.textContent = result.disclaimer;
  if (detailedAnalysis) {
    const analysisText = [resultSummary, resultDetails, resultHiddenSignals].filter(Boolean).join('\n\n');
    detailedAnalysis.hidden = !analysisText;
    detailedAnalysis.textContent = analysisText;
  }
  bars.innerHTML = '';

  resultVibes.slice(0, result.deep ? 7 : 5).forEach((item) => {
    const node = barTemplate.content.cloneNode(true);
    node.querySelector('.bar-label').textContent = item.label;
    node.querySelector('.bar-value').textContent = `${item.value}%`;
    const fill = node.querySelector('.bar-fill');
    bars.appendChild(node);
    requestAnimationFrame(() => {
      fill.style.width = `${Math.max(3, Math.min(100, item.value))}%`;
    });
  });

  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
