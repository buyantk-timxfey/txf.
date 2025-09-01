// ====== ПАРАМЕТРЫ ======
const PHRASES = [
  "Подключение…",
  "Анализ данных…",
  "Генерация решений…",
  "Запуск txf."
];
const HOLD_MS = 1100;   // 1–1.5 сек на фразу
const GAP_MS  = 120;    // минимальная пауза между фразами

// Адаптация скорости печати под устройство/настройки
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const deviceMem = navigator.deviceMemory || 4; // грубая эвристика
const TYPE_DELAY = 1;  // задержка 1 мс между порциями
const STEP = 6;        // сразу печатаем по 6 символов

// Цветной HTML-код (размеченный span’ами для подсветки) + меню
const COLORED_HTML = [
  `<span class="t-comm">&lt;!-- txf. — One-man studio: menu --&gt;</span>`,
  `<span class="t-angle">&lt;</span><span class="t-tag">!DOCTYPE</span> <span class="t-attr">html</span><span class="t-angle">&gt;</span>`,
  `<span class="t-angle">&lt;</span><span class="t-tag">html</span> <span class="t-attr">lang</span><span class="t-punc">=</span><span class="t-str">"ru"</span><span class="t-angle">&gt;</span>`,
  `  <span class="t-angle">&lt;</span><span class="t-tag">head</span><span class="t-angle">&gt;</span>`,
  `    <span class="t-angle">&lt;</span><span class="t-tag">meta</span> <span class="t-attr">charset</span><span class="t-punc">=</span><span class="t-str">"utf-8"</span><span class="t-angle">&gt;</span>`,
  `    <span class="t-angle">&lt;</span><span class="t-tag">title</span><span class="t-angle">&gt;</span>txf. — One-man studio<span class="t-angle">&lt;/</span><span class="t-tag">title</span><span class="t-angle">&gt;</span>`,
  `  <span class="t-angle">&lt;/</span><span class="t-tag">head</span><span class="t-angle">&gt;</span>`,
  `  <span class="t-angle">&lt;</span><span class="t-tag">body</span><span class="t-angle">&gt;</span>`,
  `    <span class="t-angle">&lt;</span><span class="t-tag">header</span> <span class="t-attr">class</span><span class="t-punc">=</span><span class="t-str">"hero"</span><span class="t-angle">&gt;</span>`,
  `      <span class="t-angle">&lt;</span><span class="t-tag">nav</span><span class="t-angle">&gt;</span>`,
  `        <span class="t-angle">&lt;</span><span class="t-tag">ul</span><span class="t-angle">&gt;</span>`,
  `          <span class="t-angle">&lt;</span><span class="t-tag">li</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;</span><span class="t-tag">a</span> <span class="t-attr">href</span><span class="t-punc">=</span><span class="t-str code-link" data-target="#about" role="link" tabindex="0">"#Познакомиться ближе"</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">a</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">li</span><span class="t-angle">&gt;</span>`,
  `          <span class="t-angle">&lt;</span><span class="t-tag">li</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;</span><span class="t-tag">a</span> <span class="t-attr">href</span><span class="t-punc">=</span><span class="t-str code-link" data-target="#work" role="link" tabindex="0">"#Работы"</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">a</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">li</span><span class="t-angle">&gt;</span>`,
  `          <span class="t-angle">&lt;</span><span class="t-tag">li</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;</span><span class="t-tag">a</span> <span class="t-attr">href</span><span class="t-punc">=</span><span class="t-str code-link" data-target="#services" role="link" tabindex="0">"#Услуги"</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">a</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">li</span><span class="t-angle">&gt;</span>`,
  `          <span class="t-angle">&lt;</span><span class="t-tag">li</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;</span><span class="t-tag">a</span> <span class="t-attr">href</span><span class="t-punc">=</span><span class="t-str code-link" data-target="#contacts" role="link" tabindex="0">"#Контакты"</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">a</span><span class="t-angle">&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">li</span><span class="t-angle">&gt;</span>`,
  `        <span class="t-angle">&lt;/</span><span class="t-tag">ul</span><span class="t-angle">&gt;</span>`,
  `      <span class="t-angle">&lt;/</span><span class="t-tag">nav</span><span class="t-angle">&gt;</span>`,
  `      <span class="t-angle">&lt;</span><span class="t-tag">h1</span><span class="t-angle">&gt;</span><span class="t-comm">&lt;!-- focus on the brand --&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">h1</span><span class="t-angle">&gt;</span>`,
  `    <span class="t-angle">&lt;/</span><span class="t-tag">header</span><span class="t-angle">&gt;</span>`,
  `    <span class="t-angle">&lt;</span><span class="t-tag">main</span><span class="t-angle">&gt;</span>`,
  `      <span class="t-comm">&lt;!-- контент собирается ниже, см. секции страницы --&gt;</span>`,
  `      <span class="t-angle">&lt;</span><span class="t-tag">section</span> <span class="t-attr">id</span><span class="t-punc">=</span><span class="t-str">"about"</span><span class="t-angle">&gt;</span><span class="t-comm">&lt;!-- … --&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">section</span><span class="t-angle">&gt;</span>`,
  `      <span class="t-angle">&lt;</span><span class="t-tag">section</span> <span class="t-attr">id</span><span class="t-punc">=</span><span class="t-str">"work"</span><span class="t-angle">&gt;</span><span class="t-comm">&lt;!-- … --&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">section</span><span class="t-angle">&gt;</span>`,
  `      <span class="t-angle">&lt;</span><span class="t-tag">section</span> <span class="t-attr">id</span><span class="t-punc">=</span><span class="t-str">"services"</span><span class="t-angle">&gt;</span><span class="t-comm">&lt;!-- … --&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">section</span><span class="t-angle">&gt;</span>`,
  `      <span class="t-angle">&lt;</span><span class="t-tag">section</span> <span class="t-attr">id</span><span class="t-punc">=</span><span class="t-str">"contacts"</span><span class="t-angle">&gt;</span><span class="t-comm">&lt;!-- … --&gt;</span><span class="t-angle">&lt;/</span><span class="t-tag">section</span><span class="t-angle">&gt;</span>`,
  `    <span class="t-angle">&lt;/</span><span class="t-tag">main</span><span class="t-angle">&gt;</span>`,
  `  <span class="t-angle">&lt;/</span><span class="t-tag">body</span><span class="t-angle">&gt;</span>`,
  `<span class="t-angle">&lt;/</span><span class="t-tag">html</span><span class="t-angle">&gt;</span>`
].join("\n");

// ====== DOM refs ======
const phraseSlot  = document.getElementById('phraseSlot');
const coderStage  = document.getElementById('coderStage');
const codeStream  = document.getElementById('codeStream');
const brandMark   = document.getElementById('brandMark');
const scrollDown  = document.getElementById('scrollDown');

// ====== Intro helpers ======
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function showPhrase(text){
  phraseSlot.classList.add('no-transition');
  phraseSlot.textContent = ''; // мгновенно очистить
  void phraseSlot.offsetHeight; // reflow
  phraseSlot.textContent = text;
  phraseSlot.classList.remove('no-transition');
}

// эффект машинки
async function typePhrase(node, text, perCharMs=14, chunk=2){
  node.textContent = '';
  if (prefersReduced){ node.textContent = text; return; }
  let i = 0;
  while(i < text.length){
    node.textContent += text.slice(i, i+chunk);
    i += chunk;
    await sleep(perCharMs);
  }
}

// ====== Intro logic (последовательность с эффектами) ======
async function runIntro(){
  // 1) Подключение… + мигающий курсор
  phraseSlot.classList.add('blink');
  showPhrase(PHRASES[0]);
  await sleep(HOLD_MS);
  phraseSlot.classList.remove('blink');
  phraseSlot.textContent = '';
  await sleep(GAP_MS);

  // 2) Анализ данных… (машинка)
  await typePhrase(phraseSlot, PHRASES[1], 14, 2);
  await sleep(HOLD_MS);
  phraseSlot.textContent = '';
  await sleep(GAP_MS);

  // 3) Генерация решений… (машинка + лёгкий глитч)
  phraseSlot.classList.add('glitch');
  await typePhrase(phraseSlot, PHRASES[2], 14, 2);
  await sleep(HOLD_MS);
  phraseSlot.classList.remove('glitch');
  phraseSlot.textContent = '';
  await sleep(GAP_MS);

  // 4) Запуск txf. (резко)
  showPhrase(PHRASES[3]);
  await sleep(600);

  switchToCoder();
}

// ====== Coder stage ======
function switchToCoder(){
  document.querySelector('.intro').style.display = 'none';
  coderStage.classList.remove('hidden');
  coderStage.setAttribute('aria-hidden','false');

  // бренд появляется сразу, в духе интро-фраз
  brandMark.classList.remove('pop-flash'); // сброс на случай повторного входа
  void brandMark.offsetHeight;             // reflow
  brandMark.classList.add('pop-flash');

  // «печатаем» код — параллельно
  typeColored(codeStream, COLORED_HTML, TYPE_DELAY, STEP);

  // показать стрелку
  setArrowVisible(true);
}

async function typeColored(node, coloredHTML, delay, step){
  node.innerHTML = '';
  let i = 0;
  const s = Math.max(1, step|0);
  const d = Math.max(0, delay);
  while (i < coloredHTML.length){
    node.innerHTML = coloredHTML.slice(0, i + s);
    i += s;
    if (d > 0) await sleep(d);
  }
}

// ====== Arrow & scroll ======
function setArrowVisible(v){
  if(!scrollDown) return;
  scrollDown.style.opacity = v ? '1' : '0';
  scrollDown.style.pointerEvents = v ? 'auto' : 'none';
}
if (scrollDown){
  scrollDown.addEventListener('click', ()=>{
    document.documentElement.style.scrollBehavior = 'auto'; // резко
    // якорь сам сработает по href
  });
}

// ====== In-code menu clicks ======
codeStream.addEventListener('click', (e)=>{
  const link = e.target.closest('.code-link');
  if(!link) return;
  const sel = link.dataset.target;
  const el = document.querySelector(sel);
  if(el){
    document.documentElement.style.scrollBehavior = 'auto';
    el.scrollIntoView(true);
  }
});
// клавиатура (Enter/Space)
codeStream.addEventListener('keydown', (e)=>{
  const tgt = e.target.closest('.code-link');
  if(!tgt) return;
  if(e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    const el = document.querySelector(tgt.dataset.target);
    if(el){
      document.documentElement.style.scrollBehavior = 'auto';
      el.scrollIntoView(true);
    }
  }
});

// ====== VisualViewport support for mobile ======
if (window.visualViewport){
  const vv = window.visualViewport;
  const setVVH = ()=> document.documentElement.style.setProperty('--vvh', vv.height + 'px');
  vv.addEventListener('resize', setVVH);
  vv.addEventListener('scroll', setVVH);
  setVVH();
}

// ====== Start ======
window.addEventListener('load', ()=>{
  setArrowVisible(false); // скрыта до кода
  runIntro();
}, { once:true });
