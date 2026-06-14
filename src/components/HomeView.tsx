import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, ArrowRight, Newspaper, Terminal, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    <div className="space-y-12 py-4" id="home-view">
      {/* 1. Hero Showcase Container */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative rounded-3xl overflow-hidden py-16 px-6 md:px-12 bg-gradient-to-br from-slate-950 via-slate-900 to-yellow-950/15 border border-bee-border glow-yellow"
      >
        {/* Background visual effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20 text-xs font-mono font-bold">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
            ЗАПУЩЕНА ВЕБ-ПЛАТФОРМА SUNBEE v2.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black font-display leading-[1.1] tracking-tight text-white">
            Купол безопасности для вашей <span className="text-gradient-gold">цифровой жизни</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
            SunBee — это современный интеллектуальный щит против фишинга, телефонного давления и утечек данных. Мы собираем актуальные схемы киберугроз, обучаем методам самозащиты и помогаем распознать опасность в один клик.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('checker')}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black px-6 py-3.5 rounded-xl transition duration-300 shadow-lg shadow-yellow-500/10 flex items-center gap-2 text-sm cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5" /> Проверить СМС или Ссылку
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('quiz')}
              className="bg-white/5 border border-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition text-sm flex items-center gap-2 cursor-pointer"
            >
              Пройти интерактивный тест <ArrowRight className="w-4 h-4 text-yellow-400" />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* 2. Live Cybercrime Statistics Dashboard */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4" id="stats-grid">
        {[
          { title: 'Потери граждан в РФ', value: '156 млрд ₽', desc: 'Сумма похищенных средств злоумышленниками методами социальной инженерии за прошлый год.', color: 'text-rose-400' },
          { title: 'Основной канал угроз', value: '84% звонков', desc: 'Переместились в мессенджеры Telegram, WhatsApp и Viber под масками Госуслуг и сотрудников ЦБ.', color: 'text-yellow-400' },
          { title: 'Новые поддельные домены', value: '> 12 000 в сутки', desc: 'Фишинговых страниц создается ежедневно для обмана покупателей на маркетплейсах.', color: 'text-amber-500' },
          { title: 'Эффективность СМС-кодов', value: '92% взломов', desc: 'Происходят из-за добровольной передачи СМС-кода третьим лицам под психологическим манипулированием.', color: 'text-emerald-400' }
        ].map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: 'spring' }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="ios-card p-6 rounded-2xl flex flex-col justify-between cursor-default"
          >
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{card.title}</div>
            <div className={`text-2xl md:text-3xl font-black font-display ${card.color} my-3`}>{card.value}</div>
            <p className="text-[11px] text-justify text-slate-400 leading-normal">{card.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* 3. Hot Threats & Quick Evaluation Calculator */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols: Trending Warnings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h2 className="text-xl md:text-2xl font-bold font-display text-white flex items-center gap-2">
              <AlertTriangle className="text-yellow-400 w-5 h-5 animate-pulse" /> Экстренные Предупреждения Угроз
            </h2>
            <button
              onClick={() => setActiveTab('news')}
              className="text-xs text-yellow-400 hover:text-white font-mono hover:underline cursor-pointer transition-colors duration-200"
            >
              Смотреть все новости ({news.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.slice(0, 2).map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="ios-card rounded-2xl p-5 flex flex-col justify-between group cursor-default"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded-md text-[9px] font-mono border border-red-500/20 uppercase font-bold">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                  </div>
                  <h3 className="text-md font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                
                <button
                  onClick={() => onSelectArticle(item)}
                  className="mt-4 pt-3 border-t border-white/5 text-xs text-yellow-400 font-bold hover:text-white flex items-center justify-between cursor-pointer ios-transition"
                >
                  Читать подробный разбор защиты <ArrowRight className="w-3.5 h-3.5 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Quick link categories */}
          <div className="ios-glass rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Угрозы по типам мошенничества:</h3>
            <div className="flex flex-wrap gap-2.5">
              {schemes.map((sch) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={sch.id}
                  onClick={() => onSelectScheme(sch)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-xs text-slate-300 border border-white/5 hover:border-yellow-400/30 transition cursor-pointer font-medium"
                >
                  🐝 {sch.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 col: Risk Calculator */}
        <div className="lg:col-span-1 ios-glass rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <h2 className="text-lg font-bold font-display text-white mb-1.5 flex items-center gap-2">
              <ShieldCheck className="text-yellow-400 w-5 h-5 animate-pulse" /> Экспресс Тест Риска
            </h2>
            <p className="text-xs text-slate-400 mb-5 leading-normal">
              Узнайте вашу степень уязвимости перед профессиональными методами социальной инженерии за 40 секунд.
            </p>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 min-h-[220px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {calcResult === null ? (
                  <motion.div
                    key={calcStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2.5">
                      <span>Вопрос {calcStep + 1} из {riskQuestions.length}</span>
                      <span className="text-yellow-400">В реальном времени</span>
                    </div>
                    
                    <h4 className="text-xs font-semibold text-white mb-4 leading-relaxed">
                      {riskQuestions[calcStep].text}
                    </h4>

                    <div className="space-y-2">
                      {riskQuestions[calcStep].options.map((opt, oIdx) => (
                        <motion.button
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.99 }}
                          key={oIdx}
                          onClick={() => handleRiskAnswer(oIdx)}
                          className="w-full text-left text-xs bg-slate-900/40 hover:bg-slate-800/80 p-2.5 rounded-lg text-slate-300 hover:text-white border border-white/5 hover:border-yellow-400/20 transition cursor-pointer"
                        >
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 text-center py-2"
                  >
                    <CheckCircle2 className="w-10 h-10 text-yellow-400 mx-auto animate-bounce" />
                    <div>
                      <h4 className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">РЕЗУЛЬТАТ АУДИТА:</h4>
                      <p className="text-xs text-slate-200 mt-2 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-white/5 text-justify">
                        {calcResult}
                      </p>
                    </div>
                    <button
                      onClick={resetRiskCalc}
                      className="text-xs font-mono text-yellow-400 hover:text-white border-b border-yellow-400 hover:border-white pb-0.5 cursor-pointer transition-all"
                    >
                      Пройти заново
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 p-3 bg-red-500/5 text-red-400 text-[11px] rounded-lg border border-red-500/10 flex gap-2 items-start">
            <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-tight">Методы манипуляций постоянно усложняются. Никакой искусственный интеллект не защитит вас лучше собственной бдительности.</span>
          </div>

        </div>

      </section>
    </div>
  );
}
