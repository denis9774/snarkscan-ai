const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.('#090812');
  tg.setBackgroundColor?.('#080711');
}

const supportedLanguages = ['ru', 'en', 'uk'];

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
    starsDemo: 'В MVP это демо-баланс. Реальные Stars подключаются через BotFather и платежный invoice.',
    paymentsNotReady: 'Платежи Stars пока не настроены. MVP уже работает в бесплатном режиме. '
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
    starsDemo: 'In the MVP this is a demo balance. Real Stars are connected through BotFather and a payment invoice.',
    paymentsNotReady: 'Stars payments are not configured yet. The MVP already works in free mode. '
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
    starsDemo: 'У демоверсії це тестовий баланс. Реальні зірки підключаються через BotFather і платіжний рахунок.',
    paymentsNotReady: 'Платежі зірками поки не налаштовані. Демоверсія вже працює у безкоштовному режимі. '
  }
};

const state = {
  mode: 'photo',
  language: getInitialLanguage(),
  imageDataUrl: '',
  lastResult: null
};

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
const shareButton = document.querySelector('#shareButton');
const deepButton = document.querySelector('#deepButton');
const premiumInfoButton = document.querySelector('#premiumInfoButton');
const starsButton = document.querySelector('#starsButton');
const barTemplate = document.querySelector('#barTemplate');

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
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': tg?.initData || ''
      },
      body: JSON.stringify({
        mode: state.mode,
        language: state.language,
        text: scanText.value.trim(),
        imageDataUrl: state.imageDataUrl,
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

deepButton.addEventListener('click', openDeepScanInvoice);
premiumInfoButton.addEventListener('click', openDeepScanInvoice);
starsButton.addEventListener('click', () => alert(t('starsDemo')));

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

async function openDeepScanInvoice() {
  try {
    const response = await fetch('/api/create-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': tg?.initData || ''
      },
      body: JSON.stringify({ userId: tg?.initDataUnsafe?.user?.id || null, language: state.language })
    });
    const data = await response.json();
    if (!data.ok) throw new Error(data.details || data.error);
    if (tg?.openInvoice) tg.openInvoice(data.invoiceLink);
    else window.open(data.invoiceLink, '_blank');
  } catch (error) {
    alert(t('paymentsNotReady') + (error.message || ''));
  }
}

function renderResult(result) {
  resultCard.hidden = false;
  resultMode.textContent = modeLabel(state.mode);
  resultTitle.textContent = result.title;
  vibeName.textContent = result.vibeName;
  score.textContent = `${result.score}/100`;
  roast.textContent = result.roast;
  advice.textContent = result.advice;
  disclaimer.textContent = result.disclaimer;
  bars.innerHTML = '';

  (result.percentages || []).slice(0, 5).forEach((item) => {
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
