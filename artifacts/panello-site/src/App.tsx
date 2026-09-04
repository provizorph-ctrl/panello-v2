import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CircleCheck,
  Facebook,
  Instagram,
  Menu,
  MoveUpRight,
  ShieldCheck,
  Thermometer,
  X,
} from 'lucide-react';
import { getHealthCheckQueryKey, setBaseUrl, useCreateLead, useHealthCheck } from '@workspace/api-client-react';

if (import.meta.env.VITE_API_BASE_URL) {
  setBaseUrl(import.meta.env.VITE_API_BASE_URL);
}
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

type Lang = 'ru' | 'kz';

const copy = {
  ru: {
    nav: ['Продукция', 'Почему Panello', 'Решения', 'О компании'],
    eyebrow: 'Термопанели для фасада',
    heroTitle: 'Дом, в который хочется возвращаться',
    heroBody: 'Тёплая архитектура начинается с материала. Panello соединяет выразительную фактуру клинкера и инженерную защиту от сурового климата Казахстана.',
    cta: 'Рассчитать проект',
    explore: 'Смотреть коллекцию',
    heroNote: 'Производим в Казахстане · с 2014 года',
    trust: ['до −40°C', '50 лет', '2 000+ фасадов'],
    introLabel: 'Материал с характером',
    introTitle: 'Фасад, который работает на ваш комфорт',
    introBody: 'Не маскируем основу — раскрываем её. Панели Panello собираются в цельную систему: утепление, влагозащита и готовая фактура в одном решении.',
    details: 'Как это устроено',
    panelLabel: '01 / Система',
    panelTitle: 'Три слоя спокойствия',
    panelBody: 'Клинкерная плитка защищает от времени. Жёсткий утеплитель держит тепло. Армированная основа сохраняет геометрию при сезонных перепадах.',
    layers: ['Фактурный клинкер', 'Экструдированный пенополистирол', 'Армированная основа'],
    catalogLabel: 'Коллекции',
    catalogTitle: 'Выберите настроение фасада',
    catalogBody: 'Пять проверенных фактур — от сдержанной северной графики до тёплой классической кладки.',
    request: 'Запросить образцы',
    processLabel: 'От идеи до фасада',
    processTitle: 'Без сюрпризов на стройке',
    processBody: 'Ведём проект от первого эскиза до последней панели. Вы всегда понимаете, что происходит и сколько это стоит.',
    process: [
      ['01', 'Знакомимся', 'Разбираем задачу, смотрим чертежи или фото дома.'],
      ['02', 'Собираем решение', 'Подбираем фактуру, цвет, узлы и считаем необходимый объём.'],
      ['03', 'Изготавливаем', 'Готовим панели на производстве и организуем доставку по Казахстану.'],
      ['04', 'Устанавливаем', 'Передаём понятную инструкцию или подключаем монтажную бригаду.'],
    ],
    quoteTitle: 'Давайте соберём ваш фасад',
    quoteBody: 'Оставьте контакты — специалист свяжется в течение рабочего дня и подготовит предварительный расчёт.',
    name: 'Ваше имя',
    phone: 'Номер телефона',
    area: 'Площадь фасада, м²',
    submit: 'Получить расчёт',
    submitting: 'Отправляем…',
    successTitle: 'Заявка принята',
    successBody: 'Спасибо. Мы свяжемся с вами в течение рабочего дня.',
    close: 'Закрыть',
    footerBody: 'Фасадные термопанели для домов, которые остаются красивыми надолго.',
    privacy: 'Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.',
    detailsLink: 'Смотреть детали',
    status: 'Производство работает',
  },
  kz: {
    nav: ['Өнімдер', 'Неліктен Panello', 'Шешімдер', 'Компания туралы'],
    eyebrow: 'Қасбетке арналған термопанельдер',
    heroTitle: 'Қайта оралғыңыз келетін үй',
    heroBody: 'Жылы архитектура материалдан басталады. Panello клинкердің әсерлі фактурасын Қазақстанның қатал климатына арналған инженерлік қорғаныспен біріктіреді.',
    cta: 'Жобаны есептеу',
    explore: 'Топтаманы көру',
    heroNote: 'Қазақстанда өндіріледі · 2014 жылдан бері',
    trust: ['−40°C дейін', '50 жыл', '2 000+ қасбет'],
    introLabel: 'Өзіндік сипаты бар материал',
    introTitle: 'Сіздің жайлылығыңыз үшін жұмыс істейтін қасбет',
    introBody: 'Негізді жасырмаймыз — оны ашамыз. Panello панельдері біртұтас жүйе ретінде жиналады: бір шешімдегі жылу оқшаулау, ылғалдан қорғау және дайын фактура.',
    details: 'Бұл қалай жұмыс істейді',
    panelLabel: '01 / Жүйе',
    panelTitle: 'Үш қабат тыныштық',
    panelBody: 'Клинкер плиткасы уақыттан қорғайды. Қатты жылытқыш жылуды сақтайды. Арматураланған негіз маусымдық өзгерістерде геометрияны сақтайды.',
    layers: ['Фактуралы клинкер', 'Экструдталған пенополистирол', 'Арматураланған негіз'],
    catalogLabel: 'Топтамалар',
    catalogTitle: 'Қасбет көңіл-күйін таңдаңыз',
    catalogBody: 'Ұстамды солтүстік графикадан жылы классикалық кірпішке дейінгі бес тексерілген фактура.',
    request: 'Үлгілерге тапсырыс беру',
    processLabel: 'Идеядан қасбетке дейін',
    processTitle: 'Құрылыста тосынсыйсыз',
    processBody: 'Жобаны алғашқы эскизден соңғы панельге дейін жүргіземіз. Сіз әрқашан не болып жатқанын және қанша тұратынын білесіз.',
    process: [
      ['01', 'Танысамыз', 'Мәселені талқылап, сызбаларды немесе үй фотосын қараймыз.'],
      ['02', 'Шешім құрамыз', 'Фактура, түс, тораптарды таңдап, қажетті көлемді есептейміз.'],
      ['03', 'Өндіреміз', 'Панельдерді өндірісте дайындап, Қазақстан бойынша жеткізуді ұйымдастырамыз.'],
      ['04', 'Орнатамыз', 'Түсінікті нұсқаулық береміз немесе монтаж бригадасын қосамыз.'],
    ],
    quoteTitle: 'Қасбетіңізді бірге құрайық',
    quoteBody: 'Байланыс деректерін қалдырыңыз — маман жұмыс күні ішінде хабарласып, алдын ала есеп дайындайды.',
    name: 'Атыңыз',
    phone: 'Телефон нөмірі',
    area: 'Қасбет ауданы, м²',
    submit: 'Есепті алу',
    submitting: 'Жіберілуде…',
    successTitle: 'Өтінім қабылданды',
    successBody: 'Рақмет. Біз сізбен жұмыс күні ішінде байланысамыз.',
    close: 'Жабу',
    footerBody: 'Ұзақ уақыт бойы әдемі болып қалатын үйлерге арналған қасбет термопанельдері.',
    privacy: 'Түймені басу арқылы дербес деректерді өңдеуге келісесіз.',
    detailsLink: 'Толық ақпарат',
    status: 'Өндіріс жұмыс істеуде',
  },
} as const;

const collections = [
  { name: 'Sary-Arka', kz: 'Сары-Арқа', tone: 'Тёплая охра', color: '#c59d73', accent: '#81634c' },
  { name: 'Kokshe', kz: 'Көкше', tone: 'Северный камень', color: '#929b99', accent: '#586867' },
  { name: 'Alatau', kz: 'Алатау', tone: 'Графитовая линия', color: '#4f5c5b', accent: '#293b3d' },
  { name: 'Zhetysu', kz: 'Жетісу', tone: 'Светлая глина', color: '#d4c4aa', accent: '#a38266' },
  { name: 'Arman', kz: 'Арман', tone: 'Белый известняк', color: '#b9b5a8', accent: '#7c7c71' },
];

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 ${light ? 'text-[#f7f3e9]' : 'text-[#263b3f]'}`} data-testid="brand-wordmark">
      <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#e47e5d]">
        <span className="block h-3.5 w-3.5 rotate-45 border-[2px] border-[#f7f3e9]" />
      </span>
      <span className="text-[1.15rem] font-extrabold tracking-[-.06em]">panello<span className="text-[#e47e5d]">.</span></span>
    </span>
  );
}

function Header({ lang, setLang, onQuote }: { lang: Lang; setLang: (lang: Lang) => void; onQuote: () => void }) {
  const [open, setOpen] = useState(false);
  const t = copy[lang];
  const handleNav = () => setOpen(false);
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container-panello flex h-[76px] items-center justify-between">
        <a href="#top" aria-label="Panello home" data-testid="link-home"><Wordmark /></a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {t.nav.map((label, i) => (
            <a key={label} href={['#catalog', '#system', '#solutions', '#about'][i]} className="text-[12px] font-semibold tracking-[.02em] text-[#f7f3e9]/80 transition hover:text-[#f7f3e9]" data-testid={`link-nav-${i}`}>{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-[#f7f3e9]/20 bg-[#263b3f]/20 p-1 backdrop-blur-md sm:flex" data-testid="language-switcher">
            {(['ru', 'kz'] as const).map((value) => (
              <button key={value} type="button" onClick={() => setLang(value)} className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] transition ${lang === value ? 'bg-[#f7f3e9] text-[#263b3f]' : 'text-[#f7f3e9]/65 hover:text-[#f7f3e9]'}`} data-testid={`button-language-${value}`}>{value}</button>
            ))}
          </div>
          <button type="button" onClick={onQuote} className="hidden items-center gap-2 rounded-full bg-[#e47e5d] px-4 py-2.5 text-[11px] font-bold text-[#fff8ed] shadow-[0_8px_20px_rgba(228,126,93,.2)] transition hover:-translate-y-0.5 hover:bg-[#d86d4d] sm:flex" data-testid="button-header-quote">
            <span>{t.cta}</span><ArrowUpRight />
          </button>
          <button type="button" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-[#f7f3e9]/20 text-[#f7f3e9] sm:hidden" aria-label="Open menu" data-testid="button-mobile-menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="absolute inset-x-3 top-[68px] rounded-2xl border border-[#f7f3e9]/15 bg-[#263b3f] p-4 shadow-2xl sm:hidden">
          {t.nav.map((label, i) => <a onClick={handleNav} href={['#catalog', '#system', '#solutions', '#about'][i]} key={label} className="block border-b border-[#f7f3e9]/10 px-3 py-3 text-sm font-semibold text-[#f7f3e9]" data-testid={`link-mobile-nav-${i}`}>{label}</a>)}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex gap-1 rounded-full bg-[#f7f3e9]/10 p-1">
              {(['ru', 'kz'] as const).map((value) => <button key={value} type="button" onClick={() => setLang(value)} className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase ${lang === value ? 'bg-[#f7f3e9] text-[#263b3f]' : 'text-[#f7f3e9]'}`} data-testid={`button-mobile-language-${value}`}>{value}</button>)}
            </div>
            <button type="button" onClick={() => { setOpen(false); onQuote(); }} className="rounded-full bg-[#e47e5d] px-4 py-2.5 text-xs font-bold text-[#fff8ed]" data-testid="button-mobile-quote">{t.cta}</button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ lang, setLang, onQuote }: { lang: Lang; setLang: (lang: Lang) => void; onQuote: () => void }) {
  const t = copy[lang];
  return (
    <section id="top" className="relative min-h-[720px] overflow-hidden bg-[#263b3f] text-[#f7f3e9] lg:min-h-[790px]">
      <img src="/panello-facade-hero.png" alt="Дом с фасадом из термопанелей Panello" className="absolute inset-0 h-full w-full object-cover object-[59%_center] opacity-85" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,44,47,.98)_0%,rgba(24,44,47,.77)_30%,rgba(24,44,47,.15)_72%,rgba(24,44,47,.12)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(24,44,47,.65),transparent_38%)]" />
      <Header lang={lang} setLang={setLang} onQuote={onQuote} />
      <div className="container-panello relative z-10 flex min-h-[720px] items-end pb-14 pt-32 lg:min-h-[790px] lg:items-center lg:pb-0">
        <div className="max-w-[650px]">
          <div className="reveal-up mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.22em] text-[#f6aa8d]" data-testid="text-hero-eyebrow"><span className="h-px w-8 bg-[#e47e5d]" />{t.eyebrow}</div>
          <h1 className="reveal-up-delay font-display text-[clamp(3.4rem,7.2vw,6.8rem)] font-semibold leading-[.92] tracking-[-.06em] text-balance" data-testid="text-hero-title">{t.heroTitle}</h1>
          <p className="reveal-up-delay-2 mt-7 max-w-[480px] text-[14px] leading-7 text-[#f7f3e9]/75 sm:text-[16px]" data-testid="text-hero-body">{t.heroBody}</p>
          <div className="reveal-up-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onQuote} className="group flex items-center gap-3 rounded-full bg-[#e47e5d] px-5 py-3.5 text-[12px] font-bold text-[#fff8ed] transition hover:-translate-y-1 hover:bg-[#d86d4d]" data-testid="button-hero-quote">{t.cta}<span className="grid h-6 w-6 place-items-center rounded-full bg-[#fff8ed]/20 transition group-hover:rotate-45"><ArrowUpRight size={14} /></span></button>
            <a href="#catalog" className="flex items-center gap-2 rounded-full border border-[#f7f3e9]/25 px-5 py-3.5 text-[12px] font-bold text-[#f7f3e9] transition hover:border-[#f7f3e9]/60" data-testid="link-hero-catalog">{t.explore}<ArrowDownRight size={14} /></a>
          </div>
          <p className="mt-7 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#f7f3e9]/45" data-testid="text-hero-note">{t.heroNote}</p>
        </div>
      </div>
      <div className="container-panello absolute bottom-0 left-1/2 z-10 hidden -translate-x-1/2 justify-end lg:flex">
        <div className="flex items-center gap-8 border-l border-[#f7f3e9]/20 px-7 py-4 backdrop-blur-sm">
          {t.trust.map((item, i) => <div key={item} className="text-right"><div className="font-display text-2xl text-[#f7f3e9]">{item}</div><div className="mt-1 text-[9px] uppercase tracking-[.15em] text-[#f7f3e9]/50">{['климат', 'гарантия', 'проектов'][i]}</div></div>)}
        </div>
      </div>
    </section>
  );
}

function Intro({ lang, onQuote }: { lang: Lang; onQuote: () => void }) {
  const t = copy[lang];
  return (
    <section className="bg-[#f7f3e9] py-24 sm:py-32" id="about">
      <div className="container-panello grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
        <div className="lg:pt-10">
          <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#e47e5d]"><span className="h-px w-7 bg-[#e47e5d]" />02 / {t.introLabel}</div>
          <h2 className="font-display max-w-[540px] text-[clamp(2.8rem,5vw,5rem)] leading-[.98] tracking-[-.055em] text-[#263b3f]" data-testid="text-intro-title">{t.introTitle}</h2>
          <p className="mt-7 max-w-[440px] text-[14px] leading-7 text-[#647275]" data-testid="text-intro-body">{t.introBody}</p>
          <button type="button" onClick={onQuote} className="mt-8 flex items-center gap-3 text-[12px] font-bold text-[#263b3f] transition hover:text-[#e47e5d]" data-testid="button-intro-quote">{t.details}<span className="grid h-7 w-7 place-items-center rounded-full border border-[#263b3f]/25"><ArrowRight size={14} /></span></button>
        </div>
        <div className="relative min-h-[390px] overflow-hidden rounded-[24px] bg-[#ddcdb6] sm:min-h-[500px]">
          <img src="/panello-facade-hero.png" alt="Деталь фасада и оконного проёма" className="h-full w-full object-cover object-[74%_center] mix-blend-multiply opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(224,203,173,.78),transparent_54%)]" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between sm:bottom-8 sm:left-8 sm:right-8">
            <div className="max-w-[215px] rounded-2xl border border-[#f7f3e9]/60 bg-[#f7f3e9]/80 p-4 backdrop-blur-md">
              <div className="mb-3 flex items-center gap-2 text-[#e47e5d]"><Thermometer size={16} /><span className="font-mono-ui text-[9px] uppercase tracking-[.12em]">thermal comfort</span></div>
              <p className="font-display text-xl leading-tight text-[#263b3f]">Тепло остаётся внутри. Характер — снаружи.</p>
            </div>
            <div className="hidden h-20 w-20 rotate-[-12deg] items-center justify-center rounded-full border border-[#f7f3e9]/70 text-center text-[9px] font-bold uppercase leading-3 tracking-[.1em] text-[#f7f3e9] sm:flex">Made<br />in<br />KZ</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemSection({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <section id="system" className="overflow-hidden bg-[#e8e0d3] py-24 sm:py-32">
      <div className="container-panello grid items-center gap-14 lg:grid-cols-[1fr_.85fr] lg:gap-24">
        <div className="relative mx-auto w-full max-w-[620px]">
          <div className="relative aspect-[1.18] overflow-hidden rounded-[22px] bg-[#c5b6a1] shadow-[var(--shadow-lift)]">
            <img src="/panello-facade-hero.png" alt="Фасадная панель Panello вблизи" className="h-full w-full object-cover object-[32%_center] grayscale-[.2] mix-blend-multiply opacity-65" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(38,59,63,.5),transparent_65%)]" />
            <div className="absolute left-[13%] top-[24%] h-[48%] w-px bg-[#f7f3e9]/70" />
            <div className="absolute bottom-[17%] left-[13%] h-px w-[48%] bg-[#f7f3e9]/70" />
            <div className="absolute left-[7%] top-[45%] flex items-center gap-2 text-[#f7f3e9]"><span className="h-2 w-2 rounded-full bg-[#e47e5d]" /><span className="font-mono-ui text-[9px] uppercase tracking-[.15em]">12–14 mm</span></div>
            <div className="absolute bottom-[11%] left-[40%] flex items-center gap-2 text-[#f7f3e9]"><span className="h-2 w-2 rounded-full bg-[#e47e5d]" /><span className="font-mono-ui text-[9px] uppercase tracking-[.15em]">80 mm</span></div>
          </div>
          <div className="absolute -bottom-6 -right-3 flex h-28 w-28 rotate-6 flex-col items-center justify-center rounded-full bg-[#e47e5d] text-center text-[#fff8ed] shadow-lg sm:-right-8" data-testid="badge-system"><ShieldCheck size={22} /><span className="mt-1 text-[9px] font-bold uppercase leading-3 tracking-[.1em]">Built for<br />Kazakhstan</span></div>
        </div>
        <div>
          <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#e47e5d]"><span className="h-px w-7 bg-[#e47e5d]" />{t.panelLabel}</div>
          <h2 className="font-display text-[clamp(2.8rem,5vw,4.8rem)] leading-[.96] tracking-[-.055em] text-[#263b3f]" data-testid="text-system-title">{t.panelTitle}</h2>
          <p className="mt-6 max-w-[450px] text-[14px] leading-7 text-[#667375]" data-testid="text-system-body">{t.panelBody}</p>
          <div className="mt-9 divide-y divide-[#263b3f]/15 border-y border-[#263b3f]/15">
            {t.layers.map((layer, i) => <div key={layer} className="flex items-center gap-4 py-4"><span className="font-mono-ui text-[10px] text-[#e47e5d]">0{i + 1}</span><span className="text-[13px] font-semibold text-[#263b3f]">{layer}</span><span className="ml-auto h-2 w-2 rounded-full" style={{ backgroundColor: ['#c59d73', '#929b99', '#4f5c5b'][i] }} /></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Catalog({ lang, onQuote }: { lang: Lang; onQuote: () => void }) {
  const t = copy[lang];
  const [active, setActive] = useState(0);
  const item = collections[active];
  return (
    <section id="catalog" className="bg-[#f7f3e9] py-24 sm:py-32">
      <div className="container-panello">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div><div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#e47e5d]"><span className="h-px w-7 bg-[#e47e5d]" />03 / {t.catalogLabel}</div><h2 className="font-display max-w-[650px] text-[clamp(2.8rem,5vw,5rem)] leading-[.95] tracking-[-.055em] text-[#263b3f]" data-testid="text-catalog-title">{t.catalogTitle}</h2><p className="mt-5 max-w-[450px] text-[14px] leading-7 text-[#647275]">{t.catalogBody}</p></div>
          <button type="button" onClick={onQuote} className="group flex shrink-0 items-center gap-3 self-start rounded-full border border-[#263b3f]/25 px-5 py-3 text-[12px] font-bold text-[#263b3f] transition hover:border-[#e47e5d] hover:text-[#e47e5d] md:self-end" data-testid="button-catalog-request">{t.request}<ArrowRight size={15} className="transition group-hover:translate-x-1" /></button>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="relative min-h-[430px] overflow-hidden rounded-[22px] p-7 sm:min-h-[540px] sm:p-10" style={{ background: `linear-gradient(145deg, ${item.color}, ${item.accent})` }} data-testid={`card-collection-active-${active}`}>
            <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 24px, rgba(255,255,255,.55) 25px), repeating-linear-gradient(90deg, transparent 0, transparent 44px, rgba(38,59,63,.3) 45px)' }} />
            <div className="relative flex h-full min-h-[375px] flex-col justify-between">
              <div className="flex items-start justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#f7f3e9]/70">{String(active + 1).padStart(2, '0')} / 05</span><span className="rounded-full border border-[#f7f3e9]/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-[#f7f3e9]">Premium series</span></div>
              <div><p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#f7f3e9]/70">{lang === 'ru' ? item.tone : item.kz}</p><h3 className="mt-2 font-display text-[clamp(3rem,7vw,6rem)] leading-[.85] tracking-[-.06em] text-[#f7f3e9]" data-testid="text-active-collection">{lang === 'ru' ? item.name : item.kz}</h3></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {collections.map((collection, i) => <button type="button" key={collection.name} onClick={() => setActive(i)} className={`group relative min-h-[185px] overflow-hidden rounded-[18px] p-4 text-left transition hover:-translate-y-1 sm:min-h-[210px] ${active === i ? 'ring-2 ring-[#e47e5d] ring-offset-2 ring-offset-[#f7f3e9]' : ''}`} style={{ background: `linear-gradient(145deg, ${collection.color}, ${collection.accent})` }} data-testid={`button-collection-${i}`}><div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 19px, rgba(255,255,255,.55) 20px), repeating-linear-gradient(90deg, transparent 0, transparent 37px, rgba(38,59,63,.35) 38px)' }} /><span className="relative font-mono-ui text-[9px] text-[#f7f3e9]/70">0{i + 1}</span><span className="relative mt-16 block font-display text-xl leading-none text-[#f7f3e9] sm:mt-20">{lang === 'ru' ? collection.name : collection.kz}</span><span className="relative mt-2 block text-[9px] uppercase tracking-[.12em] text-[#f7f3e9]/70">{lang === 'ru' ? collection.tone : 'Таңдаулы фактура'}</span></button>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <section id="solutions" className="bg-[#263b3f] py-24 text-[#f7f3e9] sm:py-32">
      <div className="container-panello">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#f6aa8d]"><span className="h-px w-7 bg-[#e47e5d]" />04 / {t.processLabel}</div><h2 className="font-display text-[clamp(2.8rem,5vw,5rem)] leading-[.95] tracking-[-.055em]" data-testid="text-process-title">{t.processTitle}</h2><p className="mt-6 max-w-[350px] text-[14px] leading-7 text-[#f7f3e9]/60">{t.processBody}</p></div><div className="grid border-t border-[#f7f3e9]/20 sm:grid-cols-2">{t.process.map(([number, title, body]) => <div key={number} className="border-b border-[#f7f3e9]/20 py-7 sm:nth-[odd]:border-r sm:nth-[odd]:pr-8 sm:nth-[even]:pl-8"><div className="flex items-center justify-between"><span className="font-mono-ui text-[11px] text-[#e47e5d]">{number}</span><ArrowDownRight size={17} className="text-[#f7f3e9]/35" /></div><h3 className="mt-10 font-display text-2xl">{title}</h3><p className="mt-3 max-w-[270px] text-[13px] leading-6 text-[#f7f3e9]/55">{body}</p></div>)}</div></div>
      </div>
    </section>
  );
}

function QuoteModal({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const t = copy[lang];
  const createLead = useCreateLead();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (!open) { setSubmitted(false); setError(''); setName(''); setPhone(''); setArea(''); } }, [open]);
  if (!open) return null;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length < 2 || phone.trim().length < 10 || Number(area) < 1) { setError(lang === 'ru' ? 'Проверьте заполнение полей.' : 'Өрістердің толтырылуын тексеріңіз.'); return; }
    setError('');
    createLead.mutate({ data: { name: name.trim(), phone: phone.trim(), area: Number(area) } }, { onSuccess: () => setSubmitted(true), onError: () => setError(lang === 'ru' ? 'Не удалось отправить заявку. Попробуйте ещё раз.' : 'Өтінімді жіберу мүмкін болмады. Қайталап көріңіз.') });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#263b3f]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={t.quoteTitle}>
      <div className="relative w-full max-w-[520px] rounded-t-[26px] bg-[#f7f3e9] p-7 shadow-2xl sm:rounded-[26px] sm:p-10" data-testid="dialog-quote">
        <button type="button" onClick={onClose} aria-label={t.close} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-[#263b3f]/8 text-[#263b3f] transition hover:bg-[#263b3f]/15" data-testid="button-close-quote"><X size={17} /></button>
        {submitted ? <div className="py-12 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d5e2d8] text-[#397161]"><CircleCheck size={30} /></div><h2 className="mt-6 font-display text-4xl text-[#263b3f]" data-testid="text-quote-success">{t.successTitle}</h2><p className="mx-auto mt-3 max-w-[310px] text-sm leading-6 text-[#647275]">{t.successBody}</p><button type="button" onClick={onClose} className="mt-8 rounded-full bg-[#263b3f] px-6 py-3 text-xs font-bold text-[#f7f3e9]" data-testid="button-success-close">{t.close}</button></div> : <><div className="mb-8 pr-8"><div className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#e47e5d]">Panello / estimate</div><h2 className="mt-3 font-display text-[clamp(2.4rem,7vw,4rem)] leading-[.95] tracking-[-.05em] text-[#263b3f]" data-testid="text-quote-title">{t.quoteTitle}</h2><p className="mt-4 text-sm leading-6 text-[#647275]">{t.quoteBody}</p></div><form onSubmit={submit} className="space-y-4"><label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-[#647275]">{t.name}</span><input value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-xl border border-[#263b3f]/15 bg-[#fffaf2] px-4 text-sm text-[#263b3f] outline-none transition placeholder:text-[#263b3f]/30 focus:border-[#e47e5d]" placeholder="Алексей" data-testid="input-lead-name" /></label><label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-[#647275]">{t.phone}</span><input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="h-12 w-full rounded-xl border border-[#263b3f]/15 bg-[#fffaf2] px-4 text-sm text-[#263b3f] outline-none transition placeholder:text-[#263b3f]/30 focus:border-[#e47e5d]" placeholder="+7 700 000 00 00" data-testid="input-lead-phone" /></label><label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-[#647275]">{t.area}</span><input value={area} onChange={(e) => setArea(e.target.value)} type="number" min="1" className="h-12 w-full rounded-xl border border-[#263b3f]/15 bg-[#fffaf2] px-4 text-sm text-[#263b3f] outline-none transition placeholder:text-[#263b3f]/30 focus:border-[#e47e5d]" placeholder="148" data-testid="input-lead-area" /></label>{error && <p className="text-xs font-semibold text-[#b44d3f]" data-testid="status-quote-error">{error}</p>}<button type="submit" disabled={createLead.isPending} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#e47e5d] text-sm font-bold text-[#fff8ed] transition hover:bg-[#d86d4d] disabled:cursor-wait disabled:opacity-70" data-testid="button-submit-lead">{createLead.isPending ? t.submitting : t.submit}<ArrowRight size={16} /></button><p className="text-center text-[10px] leading-4 text-[#647275]/70">{t.privacy}</p></form></>}
      </div>
    </div>
  );
}

function Footer({ lang, onQuote }: { lang: Lang; onQuote: () => void }) {
  const t = copy[lang];
  const { data: health } = useHealthCheck({ query: { staleTime: 60_000, queryKey: getHealthCheckQueryKey() } });
  return (
    <footer className="bg-[#f7f3e9]">
      <div className="container-panello py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_.6fr_.6fr]"><div><Wordmark /><p className="mt-6 max-w-[300px] text-sm leading-6 text-[#647275]">{t.footerBody}</p><button type="button" onClick={onQuote} className="mt-7 flex items-center gap-2 text-xs font-bold text-[#263b3f] transition hover:text-[#e47e5d]" data-testid="button-footer-quote">{t.cta}<MoveUpRight size={15} /></button></div><div><div className="font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#e47e5d]">Explore</div><div className="mt-5 space-y-3 text-sm font-semibold text-[#263b3f]"><a href="#catalog" className="block transition hover:text-[#e47e5d]" data-testid="link-footer-catalog">{t.nav[0]}</a><a href="#system" className="block transition hover:text-[#e47e5d]" data-testid="link-footer-system">{t.nav[1]}</a><a href="#solutions" className="block transition hover:text-[#e47e5d]" data-testid="link-footer-process">{t.nav[2]}</a></div></div><div><div className="font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#e47e5d]">Contact</div><a href="tel:+77001234567" className="mt-5 block text-sm font-bold text-[#263b3f]" data-testid="link-footer-phone">+7 700 123 45 67</a><p className="mt-2 text-sm text-[#647275]">Алматы · Астана<br />Пн–Пт, 09:00–18:00</p><div className="mt-5 flex gap-2"><a href="#about" className="grid h-8 w-8 place-items-center rounded-full border border-[#263b3f]/15 text-[#263b3f]" aria-label="Instagram" data-testid="link-footer-instagram"><Instagram size={14} /></a><a href="#about" className="grid h-8 w-8 place-items-center rounded-full border border-[#263b3f]/15 text-[#263b3f]" aria-label="Facebook" data-testid="link-footer-facebook"><Facebook size={14} /></a></div></div></div>
        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#263b3f]/12 pt-5 text-[10px] text-[#647275] sm:flex-row"><span>© 2024 Panello Kazakhstan</span><span className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${health?.status === 'ok' ? 'bg-[#5f9c77]' : 'bg-[#e47e5d]'}`} />{health?.status === 'ok' ? t.status : 'Panello'}</span><span>Made for lasting homes</span></div>
      </div>
    </footer>
  );
}

function Home() {
  const [lang, setLang] = useState<Lang>('ru');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const t = copy[lang];
  return (
    <div className="noise-overlay min-h-[100dvh] overflow-x-hidden bg-[#f7f3e9]" data-testid="page-panello-home">
      <Hero lang={lang} setLang={setLang} onQuote={() => setQuoteOpen(true)} />
      <div className="bg-[#263b3f] text-[#f7f3e9] lg:hidden"><div className="container-panello grid grid-cols-3 divide-x divide-[#f7f3e9]/15 py-5">{t.trust.map((item, i) => <div key={item} className="px-3 text-center first:pl-0 last:pr-0"><div className="font-display text-lg">{item}</div><div className="mt-1 text-[8px] uppercase tracking-[.12em] text-[#f7f3e9]/50">{['климат', 'гарантия', 'проектов'][i]}</div></div>)}</div></div>
      <Intro lang={lang} onQuote={() => setQuoteOpen(true)} />
      <SystemSection lang={lang} />
      <Catalog lang={lang} onQuote={() => setQuoteOpen(true)} />
      <Process lang={lang} />
      <section className="bg-[#e47e5d] py-20 text-[#fff8ed] sm:py-28"><div className="container-panello grid items-end gap-8 md:grid-cols-[1fr_auto]"><div><div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#fff8ed]/70"><span className="h-px w-7 bg-[#fff8ed]/70" />05 / Panello</div><h2 className="font-display max-w-[760px] text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.06em]" data-testid="text-cta-title">{t.quoteTitle}</h2></div><button type="button" onClick={() => setQuoteOpen(true)} className="group flex items-center gap-3 rounded-full bg-[#263b3f] px-5 py-3.5 text-xs font-bold text-[#f7f3e9] transition hover:-translate-y-1" data-testid="button-cta-quote">{t.cta}<span className="grid h-6 w-6 place-items-center rounded-full bg-[#e47e5d]"><ArrowUpRight size={14} /></span></button></div></section>
      <Footer lang={lang} onQuote={() => setQuoteOpen(true)} />
      <QuoteModal lang={lang} open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;