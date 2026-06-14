import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, ArrowRight, Newspaper, Terminal, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { NewsArticle, FraudScheme } from '../types';

interface HomeViewProps {
  news: NewsArticle[];
  schemes: FraudScheme[];
  setActiveTab: (tab: string) => void;
  onSelectArticle: (article: NewsArticle) => void;
  onSelectScheme: (scheme: FraudScheme) => void;
}

export default function HomeView({ news, schemes, setActiveTab, onSelectArticle, onSelectScheme }: HomeViewProps) {
  // Mini threat level quiz states
  const [calcStep, setCalcStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const riskQuestions = [
    {
      text: 'Как часто вы перепроверяете адресную строку при вводе паролей?',
      options: ['Всегда, сверяю каждую букву', 'Редко, доверяю поисковой выдаче', 'Никогда не обращаю внимания']
    },
    {
      text: 'Вам звонят из "службы безопасности" с сообщением о блокировке карты. Ваши действия?',
      options: ['Повешу трубку и перезвоню в банк сам', 'Выслушаю инструкции, чтобы понять угрозу', 'Назову данные для быстрой отмены блокировки']
    },
    {
      text: 'Используете ли вы один и тот же пароль на разных сайтах?',
      options: ['Нет, все пароли абсолютно разные', 'Только для неважных сайтов (форумы, игры)', 'Да, везде использую единый удобный пароль']
    }
  ];

  const handleRiskAnswer = (optionIdx: number) => {
    const nextAnswers = [...answers, optionIdx];
    setAnswers(nextAnswers);
    if (calcStep < riskQuestions.length - 1) {
      setCalcStep(calcStep + 1);
    } else {
      // Calculate risk
      const sum = nextAnswers.reduce((a, b) => a + b, 0);
      let threatLevel = '';
      if (sum <= 1) {
        threatLevel = 'НИЗКИЙ: Вы отлично осведомлены об угрозах безопасности. Продолжайте поддерживать цифровую гигиену!';
      } else if (sum <= 3) {
        threatLevel = 'СРЕДНИЙ: Вы знаете основы, но имеете слабые места. Рекомендуем прочесть статьи по 2FA и паролям.';
      } else {
        threatLevel = 'КРИТИЧЕСКИЙ: Вы находитесь в зоне повышенного риска! Мошенник сможет легко завладеть вашими аккаунтами. Срочно перейдите к тестам и базам знаний.';
      }
      setCalcResult(threatLevel);
    }
  };

  const resetRiskCalc = () => {
    setCalcStep(0);
    setAnswers([]);
    setCalcResult(null);
  };

  return (
    <div className="space-y-12 py-6" id="home-view">
      {/* 1. Hero Showcase Container */}
      <section className="relative rounded-3xl overflow-hidden py-16 px-6 md:px-12 bg-gradient-to-br from-bee-dark via-bee-black to-yellow-950/20 border border-bee-border glow-yellow">
        {/* Background visual effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-bee-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-bee-yellow rounded-full border border-yellow-500/20 text-xs font-mono">
            <span className="flex h-2 w-2 rounded-full bg-bee-yellow animate-pulse"></span>
            ЗАПУЩЕНА ВЕБ-ПЛАТФОРМА SUNBEE v2.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-white">
            Купол безопасности для вашей <span className="text-transparent bg-clip-text bg-gradient-to-r from-bee-yellow to-amber-300">цифровой жизни</span>
          </h1>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
            SunBee — это современный интеллектуальный щит против фишинга, телефонного давления и утечек данных. Мы собираем актуальные схемы киберугроз, обучаем методам самозащиты и помогаем распознать опасность в один клик.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setActiveTab('checker')}
              className="bg-bee-yellow text-bee-black font-extrabold px-6 py-3.5 rounded-xl hover:bg-bee-yellow-light transition hover:shadow-lg hover:shadow-yellow-500/10 flex items-center gap-2 text-sm cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5" /> Проверить СМС или Ссылку
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition text-sm flex items-center gap-2 cursor-pointer"
            >
              Пройти интерактивный тест <ArrowRight className="w-4 h-4 text-bee-yellow" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Live Cybercrime Statistics Dashboard */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4" id="stats-grid">
        <div className="bg-bee-dark/70 border border-bee-border p-6 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-mono text-gray-500 uppercase">Потери граждан в РФ</div>
          <div className="text-3xl font-bold font-display text-red-400 my-2">156 млрд ₽</div>
          <p className="text-xs text-justify text-gray-400">Сумма похищенных средств злоумышленниками методами социальной инженерии за прошлый год.</p>
        </div>
        
        <div className="bg-bee-dark/70 border border-bee-border p-6 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-mono text-gray-500 uppercase">Основной канал угроз</div>
          <div className="text-3xl font-bold font-display text-bee-yellow my-2">84% звонков</div>
          <p className="text-xs text-justify text-gray-400">Переместились в мессенджеры Telegram, WhatsApp и Viber под масками Госуслуг и сотрудников ЦБ.</p>
        </div>

        <div className="bg-bee-dark/70 border border-bee-border p-6 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-mono text-gray-500 uppercase">Новые поддельные домены</div>
          <div className="text-3xl font-bold font-display text-amber-500 my-2">&gt; 12 000 в сутки</div>
          <p className="text-xs text-justify text-gray-400">Фишинговых страниц создается ежедневно для обмана покупателей на маркетплейсах.</p>
        </div>

        <div className="bg-bee-dark/70 border border-bee-border p-6 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-mono text-gray-500 uppercase">Эффективность СМС-кодов</div>
          <div className="text-3xl font-bold font-display text-emerald-400 my-2">92% взломов</div>
          <p className="text-xs text-justify text-gray-400">Происходят из-за добровольной передачи СМС-кода третьим лицам под психологическим манипулированием.</p>
        </div>
      </section>

      {/* 3. Hot Threats & Quick Evaluation Calculator */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols: Trending Warnings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h2 className="text-xl md:text-2xl font-bold font-display text-white flex items-center gap-2">
              <AlertTriangle className="text-bee-yellow w-5 h-5 animate-pulse" /> Экстренные Предупреждения Угроз
            </h2>
            <button
              onClick={() => setActiveTab('news')}
              className="text-xs text-bee-yellow hover:text-white font-mono hover:underline cursor-pointer"
            >
              Смотреть все новости ({(news.length)})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.slice(0, 2).map((item) => (
              <div 
                key={item.id}
                className="bg-bee-dark hover:bg-bee-dark/90 border border-bee-border rounded-xl p-5 flex flex-col justify-between hover:border-bee-yellow/40 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded-md text-[10px] font-mono border border-red-500/20 uppercase font-semibold">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{item.date}</span>
                  </div>
                  <h3 className="text-md font-bold text-white mb-2 group-hover:text-bee-yellow transition leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                
                <button
                  onClick={() => onSelectArticle(item)}
                  className="mt-4 pt-3 border-t border-white/5 text-xs text-bee-yellow font-bold hover:text-white flex items-center justify-between cursor-pointer"
                >
                  Читать подробный разбор защиты <ArrowRight className="w-3 h-3 text-bee-yellow" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick link categories */}
          <div className="bg-bee-dark/40 border border-bee-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Угрозы по типам мошенничества:</h3>
            <div className="flex flex-wrap gap-2.5">
              {schemes.map((sch) => (
                <button
                  key={sch.id}
                  onClick={() => onSelectScheme(sch)}
                  className="px-3.5 py-2 rounded-xl bg-bee-black hover:bg-bee-card text-xs text-gray-300 border border-white/5 hover:border-bee-yellow/30 transition cursor-pointer"
                >
                  🐝 {sch.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 col: Risk Calculator */}
        <div className="lg:col-span-1 bg-bee-dark/90 border border-bee-border rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-bee-yellow/5 rounded-full blur-2xl pointer-events-none"></div>

          <h2 className="text-lg font-bold font-display text-white mb-1.5 flex items-center gap-2">
            <ShieldCheck className="text-bee-yellow w-5 h-5" /> Экспресс Тест Риска
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            Узнайте вашу степень уязвимости перед профессиональными методами социальной инженерии за 40 секунд.
          </p>

          <div className="bg-bee-black/60 p-4 rounded-xl border border-white/5 min-h-[160px] flex flex-col justify-between">
            {calcResult === null ? (
              <div>
                <div className="flex justify-between text-[11px] font-mono text-gray-500 mb-2">
                  <span>Вопрос {calcStep + 1} из {riskQuestions.length}</span>
                  <span className="text-bee-yellow">Интерактивный расчет</span>
                </div>
                
                <h4 className="text-xs md:text-sm font-semibold text-white mb-4">
                  {riskQuestions[calcStep].text}
                </h4>

                <div className="space-y-2">
                  {riskQuestions[calcStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleRiskAnswer(oIdx)}
                      className="w-full text-left text-xs bg-bee-dark hover:bg-bee-card p-2.5 rounded-lg text-gray-300 hover:text-white border border-white/5 hover:border-bee-yellow/40 transition cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-2">
                <CheckCircle2 className="w-10 h-10 text-bee-yellow mx-auto animate-bounce" />
                <div>
                  <h4 className="text-xs font-mono text-gray-400 uppercase">РЕЗУЛЬТАТ АУДИТА:</h4>
                  <p className="text-xs text-gray-200 font-semibold mt-1.5 leading-relaxed bg-bee-dark/80 p-3 rounded-xl border border-white/5 text-justify">
                    {calcResult}
                  </p>
                </div>
                <button
                  onClick={resetRiskCalc}
                  className="text-xs font-mono text-bee-yellow hover:text-white border-b border-bee-yellow hover:border-white pb-0.5 cursor-pointer"
                >
                  Пройти заново
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-red-500/5 text-red-400 text-[11px] rounded-lg border border-red-500/10 flex gap-2 items-start">
            <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Методы манипуляций постоянно усложняются. Никакой искусственный интеллект не защитит вас лучше собственной бдительности.</span>
          </div>

        </div>

      </section>
    </div>
  );
}
