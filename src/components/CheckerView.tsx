import React, { useState } from 'react';
import { SearchCheck, ShieldAlert, Sparkles, RefreshCw, Copy, CheckCircle, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';

export default function CheckerView({ onSelectCategory }: { onSelectCategory: (cat: string) => void }) {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: 'Приветствую! Я автоматический эксперт-анализатор SunBee. Вставьте сюда подозрительное СМС-сообщение, письмо, присланную ссылку или телефонный номер. Я проведу мгновенный аудит безопасности и укажу на косвенные признаки мошенничества.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || analyzing) return;

    const currentText = inputText;
    setInputText('');
    setAnalyzing(true);

    const userMsg: ChatMessage = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text: currentText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistory(prev => [...prev, userMsg]);

    // Simulate cyber audit analysis
    setTimeout(() => {
      const lower = currentText.toLowerCase();
      let riskScore = 0;
      const detectedTriggers: string[] = [];
      const recommendations: string[] = [];
      let verdict = 'Угроза не выявлена';

      // Advanced pattern checks:
      
      // 1. Phishing & domain checks
      const domainRegex = /([a-z0-0-]+\.)+[a-z]{2,}/gi;
      const foundUrls = currentText.match(domainRegex) || [];
      if (foundUrls.length > 0) {
        riskScore += 25;
        detectedTriggers.push('Содержит веб-ссылки для перехода');
        
        foundUrls.forEach(url => {
          const uLower = url.toLowerCase();
          if (uLower.includes('sber') && !uLower.includes('sberbank.ru') && !uLower.includes('sber.ru')) {
            riskScore += 45;
            detectedTriggers.push(`Подозрительный адрес, имитирующий Сбербанк: "${url}"`);
          }
          if (uLower.includes('gosuslugi') && !uLower.includes('gosuslugi.ru')) {
            riskScore += 45;
            detectedTriggers.push(`Подозрительный адрес, имитирующий Госуслуги: "${url}"`);
          }
          if (uLower.includes('avito') && !uLower.includes('avito.ru')) {
            riskScore += 40;
            detectedTriggers.push(`Подозрительный адрес, маскирующийся под Авито: "${url}"`);
          }
          if (uLower.includes('t.me') && (uLower.includes('bot') || uLower.includes('join') || uLower.includes('find'))) {
            riskScore += 15;
            detectedTriggers.push('Ссылка ведет на запуск Telegram-ботов или каналов');
          }
          // Suspicious top level domains
          if (uLower.endsWith('.click') || uLower.endsWith('.xyz') || uLower.endsWith('.online') || uLower.endsWith('.club') || uLower.endsWith('.site') || uLower.endsWith('.monster') || uLower.endsWith('.cc')) {
            riskScore += 20;
            detectedTriggers.push(`Доменная зона повышенного риска (${uLower.slice(uLower.lastIndexOf('.'))})`);
          }
          // Hyphen-heavy or spelling errors
          if ((uLower.match(/-/g) || []).length >= 2) {
            riskScore += 15;
            detectedTriggers.push('Домен содержит избыточные дефисы (признак спам-генерирования)');
          }
        });
      }

      // 2. Urgent / Threat triggers
      if (lower.includes('срочно') || lower.includes('немедленно') || lower.includes('в течение') || lower.includes('заблокирован') || lower.includes('блокировк') || lower.includes('штраф')) {
        riskScore += 25;
        detectedTriggers.push('Использование тактики запугивания и срочности');
        recommendations.push('Не поддавайтесь панике. Официальные организации всегда дают время на решение вопросов.');
      }

      // 3. Money / Card triggers
      if (lower.includes('списание') || lower.includes('перевод') || lower.includes('выиграли') || lower.includes('приз') || lower.includes('выигрыш') || lower.includes('компенсация') || lower.includes('выплата') || lower.includes('соцвыплат')) {
        riskScore += 20;
        detectedTriggers.push('Упоминание выигрышей, неожиданных выплат или списаний средств');
        recommendations.push('Никогда не вводите платежные реквизиты для получения бесплатных бонусов или призов.');
      }

      // 4. Verification / Pass / CVC codes triggers
      if (lower.includes('код') || lower.includes('парол') || lower.includes('cvv') || lower.includes('cvc') || lower.includes('подтвержден')) {
        riskScore += 35;
        detectedTriggers.push('Запрос секретных одноразовых кодов авторизации или реквизитов карты');
        recommendations.push('Сотрудники любых ведомств и банков никогда не просят сказать им СМС-коды или пароли.');
      }

      // 5. Boss / VIP status engineering
      if (lower.includes('генеральный') || lower.includes('директор') || lower.includes('проверка') || lower.includes('курирует') || lower.includes('органы') || lower.includes('следователь') || lower.includes('фсб') || lower.includes('мвд')) {
        riskScore += 25;
        detectedTriggers.push('Имитация высокопоставленного руководства или силовых ведомств');
        recommendations.push('Обязательно свяжитесь со звонящим/пишущим через другой проверенный канал связи.');
      }

      // Safe bounds
      riskScore = Math.min(riskScore, 99);
      if (riskScore === 0 && currentText.length > 5) {
        riskScore = 8; // generic minor uncertainty
      }

      // Verdict definition
      if (riskScore >= 70) {
        verdict = 'Критический уровень опасности. Высокая вероятность спланированного мошенничества.';
      } else if (riskScore >= 35) {
        verdict = 'Средний уровень угрозы. Имеются подозрительные косвенные признаки.';
      } else {
        verdict = 'Низкий уровень риска. Прямых признаков мошенничества в тексте не обнаружено.';
      }

      // Standard advice
      if (recommendations.length === 0) {
        recommendations.push('Будьте бдительны. Всегда проверяйте официальные источники перед какими-либо действиями.');
      }
      recommendations.push('Проконсультируйтесь с каталогом видов мошенничества, чтобы увидеть похожие сценарии.');

      const botMsg: ChatMessage = {
        id: `m-b-${Date.now()}`,
        sender: 'assistant',
        text: `Анализ завершен. Оценка риска: ${riskScore}%.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isThreatAnalysis: true,
        analysisResults: {
          riskScore,
          detectedTriggers: detectedTriggers.length > 0 ? detectedTriggers : ['Прямых маркеров угрозы не найдено'],
          verdict,
          recommendations
        }
      };

      setHistory(prev => [...prev, botMsg]);
      setAnalyzing(false);
    }, 1500);
  };

  const loadPreset = (text: string) => {
    setInputText(text);
  };

  const presets = [
    {
      label: 'СМС о доставке',
      text: 'Ваша посылка от Почты задерживается на складе из-за отсутствия оплаты пошлины 14.50 руб. Оплатите до вечера во избежание возврата: post-ru-safe-pay.online'
    },
    {
      label: 'Угроза "ФСБ"',
      text: 'Здравствуйте, это Генеральный директор. В нашем ведомстве проводится внеплановый аудит ФСБ. С Вами сейчас свяжется куратор безопасности Силантьев Владислав Михайлович. Общаться только в Telegram.'
    },
    {
      label: 'Розыгрыш 50тыс',
      text: 'Поздравляем! Вы вошли в топ-10 счастливчиков компании Теле2 и выиграли новый Смартфон или 50 000 руб! Пройдите верификацию карты и заберите приз: tele2-wheel.xyz'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6" id="threat-checker-view">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-bee-yellow rounded-full border border-yellow-500/20 text-sm font-mono mb-3">
          <Sparkles className="w-4 h-4" /> ИНТЕЛЛЕКТУАЛЬНЫЙ СКАНИРУЮЩИЙ МОДУЛЬ
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
          Анализатор Угроз безопасности
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          Автоматический алгоритм анализирует текст сообщений на наличие уловок социальной инженерии, фишинговых шаблонов доменов и признаков психологического давления.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* presets panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-bee-dark/80 rounded-2xl p-5 border border-bee-border">
            <h3 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-bee-yellow" /> Примеры для тестирования
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Выберите один из частых шаблонов мошенничества, чтобы быстро протестировать экспертный анализ системы:
            </p>
            <div className="flex flex-col gap-2.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPreset(p.text)}
                  className="w-full text-left p-3 rounded-xl bg-bee-black hover:bg-bee-card border border-white/5 hover:border-bee-yellow/40 transition text-xs text-gray-300 flex flex-col gap-1 cursor-pointer"
                >
                  <span className="font-bold text-bee-yellow">{p.label}</span>
                  <span className="text-gray-400 line-clamp-1">{p.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-bee-dark to-yellow-950/20 rounded-2xl p-5 border border-bee-yellow/20">
            <h4 className="font-bold text-bee-yellow text-sm mb-2 flex items-center gap-2">
              🛡️ Как работает сканирование?
            </h4>
            <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
              <li>Поиск подозрительных субдоменов</li>
              <li>Проверка доменных зон из группы риска</li>
              <li>Маркеры избыточного давления</li>
              <li>Выявление триггеров кражи CVC / СМС</li>
            </ul>
          </div>
        </div>

        {/* main interactive terminal */}
        <div className="lg:col-span-2 flex flex-col bg-bee-dark rounded-2xl border border-bee-border overflow-hidden glow-yellow h-[550px]">
          {/* Chat header */}
          <div className="bg-bee-black/90 p-4 border-b border-bee-border flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-bee-dark"></span>
                <div className="w-8 h-8 rounded-lg bg-bee-yellow text-bee-black flex items-center justify-center font-bold text-sm">
                  🐝
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-400">АНАЛИТИЧЕСКИЙ БОТ</div>
                <div className="text-sm font-bold text-white">SunBee Threat Scanner V4</div>
              </div>
            </div>
            <button
              onClick={() => {
                setHistory([
                  {
                    id: 'm-init',
                    sender: 'assistant',
                    text: 'Приветствую! Я автоматический эксперт-анализатор SunBee. Вставьте сюда подозрительное СМС-сообщение, письмо, присланную ссылку или телефонный номер. Я проведу мгновенный аудит безопасности и укажу на косвенные признаки мошенничества.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              className="p-1.5 hover:bg-bee-card rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
              title="Очистить историю"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* scrollable message viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
            <AnimatePresence initial={false}>
              {history.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-bee-yellow text-bee-black font-semibold rounded-tr-none'
                        : 'bg-bee-black text-gray-100 border border-bee-border rounded-tl-none'
                    }`}
                  >
                    <div>{m.text}</div>

                    {/* If threat metadata is present, render gorgeous security card */}
                    {m.isThreatAnalysis && m.analysisResults && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 pt-4 border-t border-white/10 text-white space-y-3"
                      >
                        {/* Risk progress meter */}
                        <div>
                          <div className="flex justify-between items-center text-xs font-mono mb-1">
                            <span className="text-gray-400">ВЕРОЯТНОСТЬ МОШЕННИЧЕСТВА:</span>
                            <span
                              className={`font-bold ${
                                m.analysisResults.riskScore >= 70
                                  ? 'text-red-400'
                                  : m.analysisResults.riskScore >= 35
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {m.analysisResults.riskScore}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${
                                m.analysisResults.riskScore >= 70
                                  ? 'bg-red-500'
                                  : m.analysisResults.riskScore >= 35
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${m.analysisResults.riskScore}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Verdict container */}
                        <div
                          className={`p-3 rounded-xl text-xs font-medium border ${
                            m.analysisResults.riskScore >= 70
                              ? 'bg-red-950/40 border-red-500/20 text-red-200'
                              : m.analysisResults.riskScore >= 35
                              ? 'bg-amber-950/40 border-amber-500/20 text-amber-200'
                              : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-200'
                          }`}
                        >
                          <div className="flex gap-2 items-start text-xs md:text-sm">
                            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{m.analysisResults.verdict}</span>
                          </div>
                        </div>

                        {/* Found Indicators */}
                        <div>
                          <div className="text-xs font-mono text-gray-400 mb-1.5 uppercase">Выявленные индикаторы угрозы:</div>
                          <div className="space-y-1">
                            {m.analysisResults.detectedTriggers.map((trig, tIdx) => (
                              <div key={tIdx} className="text-xs flex gap-2 items-center text-gray-300">
                                <span className="w-1.5 h-1.5 bg-bee-yellow rounded-full"></span>
                                <span>{trig}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Practical Recommendations */}
                        <div>
                          <div className="text-xs font-mono text-gray-400 mb-1.5 uppercase">Экспертные рекомендации:</div>
                          <div className="space-y-1 bg-bee-dark/40 p-3 rounded-xl border border-white/5">
                            {m.analysisResults.recommendations.map((rec, rIdx) => (
                              <div key={rIdx} className="text-xs flex gap-2 items-start text-gray-300">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive guidance trigger */}
                        <div className="pt-2 flex justify-between items-center">
                          <button
                            onClick={() => onSelectCategory('catalog')}
                            className="text-xs text-bee-yellow hover:text-white font-medium flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            Посмотреть каталог схем <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1 font-mono">{m.time}</span>
                </div>
              ))}

              {analyzing && (
                <div className="flex flex-col items-start">
                  <div className="bg-bee-black text-gray-300 rounded-2xl rounded-tl-none p-4 border border-bee-border flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 text-bee-yellow animate-spin" />
                    <span className="text-xs font-mono">Цифровая лаборатория анализирует текст...</span>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Form input field at bottom */}
          <form onSubmit={handleAnalyze} className="p-4 bg-bee-black/90 border-t border-bee-border flex gap-2.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={analyzing}
              placeholder="Вставьте СМС, ссылку или текст сообщения здесь..."
              className="flex-1 bg-bee-dark border border-bee-border focus:border-bee-yellow rounded-xl py-3 px-4 text-sm text-white focus:outline-none placeholder-gray-500 min-w-0"
              required
            />
            <button
              type="submit"
              disabled={analyzing || !inputText.trim()}
              className="bg-bee-yellow disabled:bg-bee-dark disabled:text-gray-600 disabled:border-white/5 text-bee-black font-bold px-5 py-3 rounded-xl hover:bg-bee-yellow-light transition text-sm flex items-center gap-2 cursor-pointer shrink-0 border border-transparent"
              id="analyze-threat-button"
            >
              <SearchCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Сканировать</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
