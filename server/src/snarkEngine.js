const content = {
  ru: {
    buckets: {
      photo: [
        ['главный герой без бюджета', 'mysterious energy', 'тихий luxury', 'хаос в глазах'],
        ['CEO на минималках', 'ночной мыслитель', 'магнит для драм', 'сторис без объяснений'],
        ['premium NPC', 'main character', 'soft villain', 'energy drink philosopher']
      ],
      roast: [
        ['уверенность: громкая', 'планы: туманные', 'аура: опасная', 'логика: в отпуске'],
        ['слишком много вайба', 'слишком мало сна', 'стиль: почти легенда', 'драма: включена'],
        ['деловой хаос', 'милый риск', 'король отложенных дел', 'энергия “я потом”']
      ],
      chat: [
        ['интерес есть', 'играет в холод', 'проверяет реакцию', 'red flag light'],
        ['флирт 50/50', 'ответ без вложений', 'манипуляция слабая', 'есть шанс'],
        ['эмоции скрыты', 'паузит специально', 'держит дистанцию', 'можно ответить мягко']
      ],
      compare: [
        ['главный герой', 'мозг операции', 'хаос-менеджер', 'человек-квест'],
        ['лидер сцены', 'серый кардинал', 'провокатор', 'антигерой'],
        ['магнит внимания', 'стратег', 'мемный персонаж', 'режиссёр драмы']
      ]
    },
    headlines: {
      photo: [
        'AI прочитал вайб. Ситуация неоднозначная, но стиль есть.',
        'Этот снимок выглядит так, будто у тебя есть секретный план.',
        'Вайб пойман: уверенность, хаос и немного дорогой драматургии.'
      ],
      roast: [
        'Разнос готов. Не обижайся, это почти комплимент.',
        'AI включил режим честного друга после третьего кофе.',
        'Твой вайб пережил сканирование. Но не без потерь.'
      ],
      chat: [
        'Переписка пахнет интригой и лёгкой тактикой.',
        'AI видит интерес, но без фанфар. Тут нужна холодная голова.',
        'Это не полный игнор. Это шахматы на минималках.'
      ],
      compare: [
        'Сравнение показало: один несёт сюжет, второй — последствия.',
        'Два вайба вошли в чат. Один явно опаснее.',
        'AI выбрал роли. Спорить можно, но статистика уже драматичная.'
      ]
    },
    roasts: {
      photo: [
        'Ты выглядишь как человек, который говорит “я быстро”, а потом исчезает на 4 часа.',
        'В этом вайбе есть потенциал, но дедлайны тебя явно боятся меньше, чем должны.',
        'Фотография говорит: “я всё контролирую”, глаза отвечают: “не факт”.'
      ],
      roast: [
        'У тебя энергия человека, который открыл 27 вкладок и назвал это стратегией.',
        'Твой план успеха выглядит смело: сначала вдохновение, потом паника, потом кофе.',
        'Ты не хаотичный. Ты просто живёшь в beta-версии собственной легенды.'
      ],
      chat: [
        'Ответ не холодный, но и красную дорожку тебе пока не постелили.',
        'Тут больше “посмотрим”, чем “давай срочно жениться/жениться наоборот”.',
        'Человек отвечает так, будто хочет оставить дверь открытой, но без отопления.'
      ],
      compare: [
        'Первый — сюжет. Второй — непредвиденный поворот в третьем акте.',
        'Один собирает внимание, второй делает вид, что ему всё равно. Классика.',
        'Вместе вы выглядите как проект, который инвестор понял слишком поздно.'
      ]
    },
    advice: {
      photo: [
        'Сделай результат сторис-карточкой и отправь другу: пусть тоже пройдёт скан.',
        'Добавь уверенный caption и не объясняй слишком много — интрига работает лучше.',
        'Не спорь с вайбом. Просто монетизируй его.'
      ],
      roast: [
        'Лучший ответ на roast — отправить его другу и попросить пройти такой же.',
        'Используй это как мем, а не как диагноз. AI просто слишком разговорился.',
        'Сохрани результат. Потом скажешь, что это был character development.'
      ],
      chat: [
        'Ответь коротко, спокойно и без романа на 40 строк. Дай человеку пространство проявиться.',
        'Не дави. Проверь интерес лёгким вопросом, который требует конкретного ответа.',
        'Если человек продолжит отвечать туманом — не строй дворец из трёх эмодзи.'
      ],
      compare: [
        'Отправь карточку обоим. Победитель получает эго, проигравший — мотивацию.',
        'Сделайте реванш с другим фото. AI любит драму, но любит данные ещё больше.',
        'Лучшие дуэты держатся на контрасте. И на том, что кто-то всё-таки отвечает в чате.'
      ]
    },
    share: (vibe, score) => `SnarkScan AI выдал мой вайб: ${vibe} — ${score}/100. Проверь себя тоже.`,
    disclaimer: 'Результат создан AI для развлечения. Это не объективная оценка внешности, личности, здоровья или отношений.',
    upsell: 'Глубокий скан добавит 7 параметров, dating/red-flag анализ и красивую share-карточку.'
  },
  en: {
    buckets: {
      photo: [
        ['main character on a budget', 'mysterious energy', 'quiet luxury', 'chaos in the eyes'],
        ['CEO energy lite', 'night thinker', 'drama magnet', 'stories with no explanation'],
        ['premium NPC', 'main character', 'soft villain', 'energy drink philosopher']
      ],
      roast: [
        ['confidence: loud', 'plans: foggy', 'aura: dangerous', 'logic: on vacation'],
        ['too much vibe', 'not enough sleep', 'style: almost legendary', 'drama: enabled'],
        ['business chaos', 'cute risk', 'king of procrastination', '“I’ll do it later” energy']
      ],
      chat: [
        ['interest detected', 'playing it cold', 'testing your reaction', 'red flag light'],
        ['flirt 50/50', 'low-effort reply', 'minor manipulation', 'there is a chance'],
        ['hidden emotions', 'strategic pause', 'keeps distance', 'soft reply recommended']
      ],
      compare: [
        ['main character', 'brain of the operation', 'chaos manager', 'human side quest'],
        ['scene leader', 'shadow strategist', 'provocateur', 'antihero'],
        ['attention magnet', 'strategist', 'meme character', 'drama director']
      ]
    },
    headlines: {
      photo: [
        'AI read the vibe. The situation is unclear, but the style is there.',
        'This photo looks like you have a secret plan.',
        'Vibe captured: confidence, chaos and a little expensive drama.'
      ],
      roast: [
        'Roast ready. Do not take it personally — it is almost a compliment.',
        'AI switched into “honest friend after coffee” mode.',
        'Your vibe survived the scan. Not without damage.'
      ],
      chat: [
        'This chat smells like intrigue and light strategy.',
        'AI sees interest, but no fireworks yet. Keep a cool head.',
        'This is not a full ignore. This is budget chess.'
      ],
      compare: [
        'Comparison result: one carries the plot, the other carries the consequences.',
        'Two vibes entered the chat. One is clearly more dangerous.',
        'AI assigned the roles. You can argue, but the drama is statistical now.'
      ]
    },
    roasts: {
      photo: [
        'You look like someone who says “two minutes” and disappears for four hours.',
        'This vibe has potential, but deadlines are not afraid of you enough.',
        'The photo says “I am in control.” The eyes say “not confirmed.”'
      ],
      roast: [
        'You have the energy of someone who opened 27 tabs and called it a strategy.',
        'Your success plan is bold: inspiration, panic, then coffee.',
        'You are not chaotic. You are just living in the beta version of your own legend.'
      ],
      chat: [
        'The reply is not cold, but nobody rolled out the red carpet either.',
        'This has more “we’ll see” than “let’s plan the wedding.”',
        'They are keeping the door open, but apparently with no heating.'
      ],
      compare: [
        'The first is the plot. The second is the unexpected twist in act three.',
        'One collects attention, the other pretends not to care. Classic.',
        'Together you look like a project the investor understood too late.'
      ]
    },
    advice: {
      photo: [
        'Turn this into a story card and send it to a friend so they scan too.',
        'Add a confident caption and do not overexplain. Mystery works better.',
        'Do not argue with the vibe. Monetize it.'
      ],
      roast: [
        'The best reply to a roast is sending it to a friend and making them try too.',
        'Use this as a meme, not a diagnosis. AI just got too talkative.',
        'Save the result. Later you can call it character development.'
      ],
      chat: [
        'Reply short and calm. No 40-line novel. Give them room to show interest.',
        'Do not push. Ask one light question that requires a clear answer.',
        'If they keep answering in fog, do not build a palace out of three emojis.'
      ],
      compare: [
        'Send the card to both people. Winner gets ego, loser gets motivation.',
        'Run a rematch with another photo. AI loves drama, but it loves data more.',
        'Great duos work because of contrast — and because someone eventually replies.'
      ]
    },
    share: (vibe, score) => `SnarkScan AI gave me this vibe: ${vibe} — ${score}/100. Try it too.`,
    disclaimer: 'Result generated by AI for entertainment. It is not an objective assessment of appearance, personality, health or relationships.',
    upsell: 'Deep scan adds 7 extra parameters, dating/red-flag analysis and a beautiful share card.'
  },
  uk: {
    buckets: {
      photo: [
        ['головний герой без бюджету', 'загадкова енергія', 'тиха розкіш', 'хаос в очах'],
        ['керівник на мінімалках', 'нічний мислитель', 'магніт для драм', 'сторіс без пояснень'],
        ['преміум другорядний персонаж', 'головний герой', 'м’який лиходій', 'філософ на енергетику']
      ],
      roast: [
        ['впевненість: гучна', 'плани: туманні', 'аура: небезпечна', 'логіка: у відпустці'],
        ['занадто багато вайбу', 'занадто мало сну', 'стиль: майже легенда', 'драма: увімкнена'],
        ['діловий хаос', 'милий ризик', 'король відкладених справ', 'енергія “я потім”']
      ],
      chat: [
        ['інтерес є', 'грає в холод', 'перевіряє реакцію', 'легкий червоний прапорець'],
        ['флірт 50/50', 'відповідь без вкладень', 'слабка маніпуляція', 'шанс є'],
        ['емоції приховані', 'спеціально паузить', 'тримає дистанцію', 'можна відповісти м’яко']
      ],
      compare: [
        ['головний герой', 'мозок операції', 'керівник хаосу', 'людина-квест'],
        ['лідер сцени', 'сірий кардинал', 'провокатор', 'антигерой'],
        ['магніт уваги', 'стратег', 'мемний персонаж', 'режисер драми']
      ]
    },
    headlines: {
      photo: [
        'ШІ прочитав вайб. Ситуація неоднозначна, але стиль є.',
        'Цей знімок виглядає так, ніби в тебе є секретний план.',
        'Вайб спіймано: впевненість, хаос і трохи дорогої драматургії.'
      ],
      roast: [
        'Рознос готовий. Не ображайся, це майже комплімент.',
        'ШІ увімкнув режим чесного друга після третьої кави.',
        'Твій вайб пережив сканування. Але не без втрат.'
      ],
      chat: [
        'Переписка пахне інтригою і легкою тактикою.',
        'ШІ бачить інтерес, але без фанфар. Тут потрібна холодна голова.',
        'Це не повний ігнор. Це шахи на мінімалках.'
      ],
      compare: [
        'Порівняння показало: один несе сюжет, другий — наслідки.',
        'Два вайби зайшли в чат. Один явно небезпечніший.',
        'ШІ обрав ролі. Сперечатися можна, але статистика вже драматична.'
      ]
    },
    roasts: {
      photo: [
        'Ти виглядаєш як людина, яка каже “я швидко”, а потім зникає на 4 години.',
        'У цьому вайбі є потенціал, але дедлайни тебе явно бояться замало.',
        'Фото каже: “я все контролюю”, очі відповідають: “не факт”.'
      ],
      roast: [
        'У тебе енергія людини, яка відкрила 27 вкладок і назвала це стратегією.',
        'Твій план успіху сміливий: спочатку натхнення, потім паніка, потім кава.',
        'Ти не хаотичний. Ти просто живеш у бета-версії власної легенди.'
      ],
      chat: [
        'Відповідь не холодна, але червону доріжку тобі поки не постелили.',
        'Тут більше “подивимось”, ніж “давай планувати весілля”.',
        'Людина тримає двері відчиненими, але без опалення.'
      ],
      compare: [
        'Перший — сюжет. Другий — несподіваний поворот у третьому акті.',
        'Один збирає увагу, другий робить вигляд, що йому все одно. Класика.',
        'Разом ви виглядаєте як проєкт, який інвестор зрозумів запізно.'
      ]
    },
    advice: {
      photo: [
        'Зроби результат сторіс-карткою і відправ другу: нехай теж пройде скан.',
        'Додай впевнений підпис і не пояснюй занадто багато — інтрига працює краще.',
        'Не сперечайся з вайбом. Просто монетизуй його.'
      ],
      roast: [
        'Найкраща відповідь на рознос — відправити його другу і попросити пройти такий самий.',
        'Використовуй це як мем, а не як діагноз. ШІ просто занадто розговорився.',
        'Збережи результат. Потім скажеш, що це був розвиток персонажа.'
      ],
      chat: [
        'Відповідай коротко, спокійно і без роману на 40 рядків. Дай людині простір проявитися.',
        'Не тисни. Перевір інтерес легким питанням, яке потребує конкретної відповіді.',
        'Якщо людина далі відповідатиме туманом — не будуй палац із трьох емодзі.'
      ],
      compare: [
        'Відправ картку обом. Переможець отримує его, той хто програв — мотивацію.',
        'Зробіть реванш з іншим фото. ШІ любить драму, але дані любить ще більше.',
        'Найкращі дуети тримаються на контрасті. І на тому, що хтось усе ж відповідає в чаті.'
      ]
    },
    share: (vibe, score) => `SnarkScan AI видав мій вайб: ${vibe} — ${score}/100. Перевір себе теж.`,
    disclaimer: 'Результат створений ШІ для розваги. Це не об’єктивна оцінка зовнішності, особистості, здоров’я або стосунків.',
    upsell: 'Глибокий скан додасть 7 параметрів, аналіз побачень і червоних прапорців, а також красиву картку для поширення.'
  }
};

function seededNumber(input) {
  const str = String(input || Date.now());
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function pick(list, seed, offset = 0) {
  return list[(seed + offset) % list.length];
}

function generatePercentages(labels, seed) {
  const values = [
    28 + (seed % 35),
    15 + ((seed >>> 3) % 28),
    10 + ((seed >>> 5) % 25),
    5 + ((seed >>> 7) % 18)
  ];
  const total = values.reduce((a, b) => a + b, 0);
  return labels.slice(0, 4).map((label, index) => ({
    label,
    value: Math.max(3, Math.round((values[index] / total) * 100))
  }));
}

const deepContent = {
  ru: {
    title: 'Глубокий скан завершён',
    label: 'DEEP SCAN',
    vibeName: 'премиум вайб с драматическим послевкусием',
    parameters: ['Харизма', 'Социальная магия', 'Скрытая драма', 'Самоирония', 'Флирт-радар', 'Red-flag иммунитет', 'Мемный потенциал'],
    analysis: 'Обычный скан видит поверхность, а глубокий уже копает в сценарий. Здесь заметен вайб человека, который умеет выглядеть уверенно, даже когда внутри открыт Excel с хаосом. Сильная сторона - быстро собирать внимание и превращать неловкость в стиль. Риск - иногда играть в загадочность так долго, что люди начинают искать инструкцию.',
    roast: 'Ты выглядишь как премиум-подписка на интригу: красиво, дорого, но половина функций спрятана в настройках.',
    advice: 'Оставь загадочность, но добавь ясности в ключевых местах. Тогда вайб будет не просто цеплять, а ещё и работать на тебя.',
    share: (score) => `Мой DEEP SCAN в SnarkScan AI: ${score}/100. Вайб официально разобран глубже, чем мои жизненные планы.`
  },
  en: {
    title: 'Deep scan complete',
    label: 'DEEP SCAN',
    vibeName: 'premium chaos with main-character polish',
    parameters: ['Charisma', 'Social signal', 'Hidden drama', 'Self-irony', 'Flirt radar', 'Red-flag immunity', 'Meme potential'],
    analysis: 'A regular scan catches the surface; this deep scan reads the pattern. The vibe says you can make uncertainty look intentional and turn small awkward moments into style. The strongest signal is social gravity: people notice the energy before they understand it. The weak spot is over-mystery, where the plot gets so subtle that the audience needs subtitles.',
    roast: 'You give premium mystery subscription: great branding, strong presence, and a few important features hidden behind settings.',
    advice: 'Keep the intrigue, but add one clear signal when it matters. That turns the vibe from entertaining into dangerously effective.',
    share: (score) => `My SnarkScan AI DEEP SCAN: ${score}/100. The vibe got audited harder than my life choices.`
  },
  uk: {
    title: 'Глибокий скан завершено',
    label: 'DEEP SCAN',
    vibeName: 'преміум вайб із контрольованим хаосом',
    parameters: ['Харизма', 'Соціальна магія', 'Прихована драма', 'Самоіронія', 'Флірт-радар', 'Імунітет до red flags', 'Мемний потенціал'],
    analysis: 'Звичайний скан бачить поверхню, а глибокий уже читає сценарій між рядками. Тут вайб людини, яка може виглядати впевнено навіть тоді, коли всередині відкрито десять вкладок із хаосом. Сильний бік - збирати увагу і робити з незручності стиль. Ризик - інколи так довго грати в загадковість, що іншим хочеться попросити інструкцію.',
    roast: 'Твій вайб як преміум-підписка на інтригу: виглядає дорого, але частина функцій захована десь у налаштуваннях.',
    advice: 'Залишай інтригу, але додавай ясність у важливі моменти. Так вайб буде не просто чіпляти, а працювати на тебе.',
    share: (score) => `Мій DEEP SCAN у SnarkScan AI: ${score}/100. Вайб розібрано глибше, ніж мої плани на тиждень.`
  }
};

function generateDeepPercentages(labels, seed) {
  return labels.slice(0, 7).map((label, index) => ({
    label,
    value: 61 + ((seed >>> (index + 1)) % 36)
  }));
}

function createDeepMockScan({ mode, language, seed }) {
  const pack = deepContent[language] || deepContent.ru;
  const score = 82 + (seed % 15);

  return {
    mode,
    deep: true,
    label: pack.label,
    title: pack.title,
    vibeName: pack.vibeName,
    score,
    percentages: generateDeepPercentages(pack.parameters, seed),
    detailedAnalysis: pack.analysis,
    roast: pack.roast,
    advice: pack.advice,
    shareText: pack.share(score),
    disclaimer: content[language]?.disclaimer || content.ru.disclaimer,
    upsell: ''
  };
}

export function createMockScan({ mode = 'photo', language = 'ru', text = '', name = 'ты', deep = false }) {
  const safeMode = ['photo', 'roast', 'chat', 'compare'].includes(mode) ? mode : 'photo';
  const safeLanguage = ['ru', 'en', 'uk'].includes(language) ? language : 'ru';
  const pack = content[safeLanguage];
  const seed = seededNumber(`${safeMode}:${safeLanguage}:${text}:${name}:${new Date().toISOString().slice(0, 10)}`);

  if (deep) {
    return createDeepMockScan({ mode: safeMode, language: safeLanguage, seed });
  }

  const labelSet = pick(pack.buckets[safeMode], seed);
  const percentages = generatePercentages(labelSet, seed);
  const vibe = pick(labelSet, seed, 2);
  const resultScore = 62 + (seed % 32);

  return {
    mode: safeMode,
    title: pick(pack.headlines[safeMode], seed, 1),
    vibeName: vibe,
    score: resultScore,
    percentages,
    roast: pick(pack.roasts[safeMode], seed, 3),
    advice: pick(pack.advice[safeMode], seed, 4),
    shareText: pack.share(vibe, resultScore),
    disclaimer: pack.disclaimer,
    upsell: pack.upsell
  };
}
