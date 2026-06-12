# SnarkScan AI — Telegram Mini App MVP

**SnarkScan AI** — развлекательное Telegram Mini App: фото‑скан вайба, мягкий roast, разбор переписки и сравнение друзей. Главная вирусная механика: пользователь получает смешной результат и делится им в чат.

> Важно: приложение позиционируется только как развлечение. Оно не должно обещать объективную оценку внешности, личности, здоровья, отношений, дохода или других чувствительных характеристик.


## Важно про внешний вид

Не открывай `public/index.html` прямо из ZIP/папки через `file://` — так браузер может не загрузить стили, скрипты и API. Запускай через сервер:

```bash
npm install
npm run dev
```

Потом открывай `http://localhost:3000`.

В этой версии UI уже обновлён до premium mobile-first дизайна: тёмный интерфейс, neon/glass cards, нормальные tabs, upload-zone, premium-card и адаптация под Telegram Mini App.

## Что уже есть

- Готовый экран Mini App.
- 4 режима: `Фото‑скан`, `Roast me`, `Разбор переписки`, `Сравнить`.
- Mock AI‑движок — работает без ключей и оплаты.
- Опциональная интеграция OpenAI через `OPENAI_API_KEY`.
- Проверка Telegram `initData` для production‑режима.
- Заготовка платежей Telegram Stars через `createInvoiceLink`.
- Кнопка “Поделиться” для вирусного распространения.

## Быстрый запуск локально

```bash
npm install
cp .env.example .env
npm run dev
```

Открой:

```text
http://localhost:3000
```

Без `OPENAI_API_KEY` приложение использует локальные mock‑результаты. Это нормально для первого теста.

## Подключение AI

В `.env` добавь:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=your-current-model
```

После этого `/api/scan` будет пытаться генерировать результат через Responses API. Если AI‑запрос упадёт, сервер вернёт mock‑результат, чтобы MVP не ломался.

## Подключение Telegram Mini App

1. Создай бота через `@BotFather`.
2. Разверни проект на HTTPS‑домене: Render, Railway, Fly.io, VPS, Vercel + serverless adapter или другой хостинг.
3. В `.env` укажи:

```env
TELEGRAM_BOT_TOKEN=123456:bot_token
PUBLIC_APP_URL=https://your-domain.com
REQUIRE_TELEGRAM_AUTH=true
```

4. В BotFather задай Web App URL / Menu Button на `https://your-domain.com`.
5. Открой Mini App из Telegram и проверь, что запросы уходят с `x-telegram-init-data`.

## Telegram Stars

Кнопка “Глубокий скан ⭐” вызывает `/api/create-invoice`. Для цифровых товаров Telegram использует валюту `XTR`. В MVP invoice уже подготовлен, но нужно:

- реальный `TELEGRAM_BOT_TOKEN`;
- HTTPS‑домен;
- запуск из Telegram;
- обработка успешных платежей через webhook бота — это следующий шаг.

## Структура

```text
snarkscan-ai/
  public/
    index.html       # Mini App UI
    styles.css       # mobile-first glass UI
    app.js           # client logic + Telegram WebApp integration
  server/
    index.js         # Express server + API routes
    src/
      snarkEngine.js       # local mock results
      openaiClient.js      # optional OpenAI Responses API call
      telegramAuth.js      # Telegram initData validation
      telegramPayments.js  # Stars invoice link
  .env.example
  package.json
```

## Первый реальный MVP‑тест

Цель — не “идеальный AI”, а вирусность.

1. Дать 20–30 людям ссылку на Mini App.
2. Попросить каждого сделать 2 действия: пройти скан и отправить результат другу.
3. Смотреть метрики:
   - сколько людей сделали первый скан;
   - сколько нажали “Поделиться”;
   - сколько вернулись на следующий день;
   - сколько хотели бы “глубокий скан”.

## Следующие задачи

- Добавить генерацию share‑картинки PNG.
- Добавить webhook Telegram для successful_payment.
- Добавить базу данных: пользователи, лимиты, история сканов, premium access.
- Добавить ежедневный бесплатный лимит и streak.
- Добавить режимы: `Dating Scan`, `Red Flag Detector`, `Кто ты в фильме`, `AI‑аура дня`.
- Сделать отдельную landing page для рекламы.

## Тональность продукта

Сильная подача:

> AI скажет то, что друзья постеснялись.

Мягкий дисклеймер:

> Только для развлечения. Не принимай близко к сердцу.

Нельзя писать:

- “AI объективно оценит твою красоту”;
- “AI определит твой психологический тип по фото”;
- “AI скажет, любит ли он/она тебя точно”.

Можно писать:

- “AI прочитает твой вайб в мемном формате”;
- “Развлекательный разбор переписки”;
- “Смешной roast без токсичности”.

## Обновление: языки и заголовок

В этой версии добавлен переключатель языка в верхней части приложения:

- RU — русский
- EN — английский
- UA — украинский

Выбранный язык сохраняется в `localStorage`, поэтому при следующем открытии Mini App интерфейс остаётся на выбранном языке. Язык также отправляется на backend в `/api/scan`, поэтому mock-результаты и OpenAI-результаты возвращаются на выбранном языке.

Также исправлена визуальная обрезка последней буквы в большом заголовке `Сканируй свой вайб`: увеличен `line-height` и добавлен небольшой внутренний отступ у hero-title.
