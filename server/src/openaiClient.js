import OpenAI from 'openai';

const LANGUAGE_NAMES = {
  ru: 'Russian',
  en: 'English',
  uk: 'Ukrainian'
};

const IMAGE_DATA_URL_LIMIT = 6_200_000;
const IMAGE_URL_LIMIT = 2048;

const regularSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'badge', 'score', 'vibes', 'summary', 'roast', 'advice', 'shareText'],
  properties: {
    title: { type: 'string' },
    badge: { type: 'string' },
    score: { type: 'integer', minimum: 0, maximum: 100 },
    vibes: {
      type: 'array',
      minItems: 3,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'value'],
        properties: {
          label: { type: 'string' },
          value: { type: 'integer', minimum: 0, maximum: 100 }
        }
      }
    },
    summary: { type: 'string' },
    roast: { type: 'string' },
    advice: { type: 'string' },
    shareText: { type: 'string' }
  }
};

const deepSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'badge', 'score', 'vibes', 'summary', 'details', 'roast', 'advice', 'hiddenSignals', 'shareText'],
  properties: {
    title: { type: 'string' },
    badge: { type: 'string', const: 'DEEP SCAN' },
    score: { type: 'integer', minimum: 0, maximum: 100 },
    vibes: {
      type: 'array',
      minItems: 5,
      maxItems: 7,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'value'],
        properties: {
          label: { type: 'string' },
          value: { type: 'integer', minimum: 0, maximum: 100 }
        }
      }
    },
    summary: { type: 'string' },
    details: { type: 'string' },
    roast: { type: 'string' },
    advice: { type: 'string' },
    hiddenSignals: { type: 'string' },
    shareText: { type: 'string' }
  }
};

function buildSystemPrompt(language = 'ru', deep = false) {
  const languageName = LANGUAGE_NAMES[language] || LANGUAGE_NAMES.ru;
  const depthRules = deep
    ? 'This is a paid DEEP SCAN. Make it feel premium: richer, more specific, 5-7 vibe parameters, a detailed breakdown, hidden signals, and a shareable punchline.'
    : 'This is a regular scan. Keep it compact, funny, and easy to share.';

  return `
You are SnarkScan AI, an entertainment-only Telegram Mini App.
Create playful, viral vibe scans in ${languageName}. The result must be funny, social, meme-ready, and not boring.

Safety disclaimer and boundaries:
- This is entertainment AI vibe analysis, not a diagnosis or objective truth.
- Do not make medical, psychological, psychiatric, criminal, or objective personality diagnoses.
- Do not identify a real person or claim you know who they are.
- Do not infer or evaluate protected traits, including race, ethnicity, nationality, religion, disability, age, sexuality, gender identity, pregnancy, or health.
- Do not rank objective beauty, worth, intelligence, income, class, or attractiveness.
- Keep roasts light and friendly. No cruelty, hate, harassment, sexualization, or toxic insults.

${depthRules}
Return ONLY strict JSON. No markdown. No extra text.
`;
}

function buildUserPrompt({ mode, text, language, deep, hasImage }) {
  const modeMap = {
    photo: 'Analyze the image as an entertainment vibe scan. Discuss visible style, composition, energy, and context only. Do not identify the person or infer sensitive traits.',
    roast: 'Create a playful roast from the user context. Keep it teasing, affectionate, and non-toxic.',
    chat: 'Analyze the pasted chat/message as entertainment: vibe, pacing, subtext, suggested reply, and shareable joke. Do not overclaim intent.',
    compare: 'Compare the provided vibes as fictional/social energy. Do not rank human worth, beauty, or protected traits.',
    deep: 'Run a premium deep entertainment vibe scan with richer observations and hidden social signals.'
  };

  const languageRule = `Output language: ${LANGUAGE_NAMES[language] || LANGUAGE_NAMES.ru}.`;
  const imageRule = hasImage
    ? 'Image input is attached. Use it only for safe entertainment vibe observations.'
    : 'No image is attached. Base the scan on user text/context only.';

  return [
    modeMap[mode] || modeMap.photo,
    languageRule,
    imageRule,
    deep ? 'Badge must be exactly "DEEP SCAN". Deep result must be noticeably richer than a regular result.' : '',
    `User text/context: ${text || 'No text provided.'}`
  ].filter(Boolean).join('\n');
}

function buildTextFormat(deep) {
  return {
    format: {
      type: 'json_schema',
      name: deep ? 'snarkscan_deep_result' : 'snarkscan_result',
      strict: true,
      schema: deep ? deepSchema : regularSchema
    }
  };
}

function normalizeDataUrl(value) {
  const dataUrl = String(value || '').trim();
  if (!dataUrl) return '';
  if (!dataUrl.startsWith('data:image/')) {
    const error = new Error('Image must be a data:image URL.');
    error.status = 400;
    throw error;
  }
  if (dataUrl.length > IMAGE_DATA_URL_LIMIT) {
    const error = new Error('Image is too large. Keep it under 4.5 MB.');
    error.status = 413;
    throw error;
  }
  return dataUrl;
}

function normalizeImageUrl(value) {
  const imageUrl = String(value || '').trim();
  if (!imageUrl) return '';
  if (!/^https?:\/\//i.test(imageUrl)) {
    const error = new Error('imageUrl must be an http(s) URL.');
    error.status = 400;
    throw error;
  }
  if (imageUrl.length > IMAGE_URL_LIMIT) {
    const error = new Error('imageUrl is too long.');
    error.status = 400;
    throw error;
  }
  return imageUrl;
}

export function normalizeImageInput({ imageDataUrl = '', imageBase64 = '', imageUrl = '' } = {}) {
  if (imageUrl) return normalizeImageUrl(imageUrl);
  if (imageBase64) {
    const value = String(imageBase64).trim();
    return normalizeDataUrl(value.startsWith('data:image/') ? value : `data:image/jpeg;base64,${value}`);
  }
  return normalizeDataUrl(imageDataUrl);
}

function getOutputText(response) {
  if (response.output_text) return response.output_text;
  return response.output?.flatMap(item => item.content || [])
    .find(item => item.type === 'output_text')?.text || '';
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Number.isFinite(Number(value)) ? Math.round(Number(value)) : 75));
}

function normalizeResult(result, { mode, language, deep }) {
  const vibes = Array.isArray(result.vibes) ? result.vibes : [];
  const safeVibes = vibes.slice(0, deep ? 7 : 5).map(item => ({
    label: String(item?.label || 'Vibe'),
    value: clampScore(item?.value)
  }));

  const badge = deep ? 'DEEP SCAN' : String(result.badge || result.title || 'VIBE');
  const summary = String(result.summary || '');
  const details = deep ? String(result.details || summary) : '';
  const hiddenSignals = deep ? String(result.hiddenSignals || '') : '';

  return {
    mode,
    deep: Boolean(deep),
    title: String(result.title || (deep ? 'Deep scan complete' : 'Vibe scan complete')),
    badge,
    vibeName: badge,
    score: clampScore(result.score),
    vibes: safeVibes,
    percentages: safeVibes,
    summary,
    details,
    detailedAnalysis: deep ? [summary, details, hiddenSignals].filter(Boolean).join('\n\n') : summary,
    roast: String(result.roast || ''),
    advice: String(result.advice || ''),
    hiddenSignals,
    shareText: String(result.shareText || ''),
    disclaimer: language === 'en'
      ? 'Entertainment AI vibe analysis. Not an objective assessment or diagnosis.'
      : language === 'uk'
        ? 'Розважальний AI-аналіз вайбу. Це не обʼєктивна оцінка і не діагноз.'
        : 'Развлекательный AI-анализ вайба. Это не объективная оценка и не диагноз.',
    upsell: deep ? '' : undefined
  };
}

export async function createOpenAIScan({ apiKey, model, mode, text, imageDataUrl, imageBase64, imageUrl, language = 'ru', deep = false }) {
  if (!apiKey) throw new Error('OPENAI_API_KEY is missing');

  const safeLanguage = ['ru', 'en', 'uk'].includes(language) ? language : 'ru';
  const safeMode = ['photo', 'roast', 'chat', 'compare', 'deep'].includes(mode) ? mode : 'photo';
  const safeImage = normalizeImageInput({ imageDataUrl, imageBase64, imageUrl });

  const client = new OpenAI({ apiKey });
  const userContent = [{
    type: 'input_text',
    text: buildUserPrompt({
      mode: deep ? 'deep' : safeMode,
      text,
      language: safeLanguage,
      deep,
      hasImage: Boolean(safeImage)
    })
  }];

  if (safeImage && (safeMode === 'photo' || safeMode === 'compare' || deep)) {
    userContent.push({ type: 'input_image', image_url: safeImage });
  }

  const response = await client.responses.create({
    model: model || 'gpt-5.5',
    input: [
      { role: 'system', content: [{ type: 'input_text', text: buildSystemPrompt(safeLanguage, deep) }] },
      { role: 'user', content: userContent }
    ],
    text: buildTextFormat(deep)
  });

  const outputText = getOutputText(response);
  if (!outputText) throw new Error('OpenAI returned no text output');

  return normalizeResult(JSON.parse(outputText), {
    mode: safeMode,
    language: safeLanguage,
    deep
  });
}
