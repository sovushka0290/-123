import React, { useState, useEffect } from 'react';
import { ShieldAlert, Send, Clock, BookOpen, AlertCircle, Sparkles, CheckCircle2, MessageSquare, Search, ThumbsUp } from 'lucide-react';
import { UserReport } from '../types';
import { INITIAL_REPORTS } from '../data';

export default function ReportView() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [search, setSearch] = useState('');
  
  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('Фишинг (Phishing)');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Upvotes state tracking
  const [upvotes, setUpvotes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const saved = localStorage.getItem('sunbee_reports');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        setReports(INITIAL_REPORTS);
      }
    } else {
      setReports(INITIAL_REPORTS);
      localStorage.setItem('sunbee_reports', JSON.stringify(INITIAL_REPORTS));
    }

    const savedVotes = localStorage.getItem('sunbee_report_votes');
    if (savedVotes) {
      try {
        setUpvotes(JSON.parse(savedVotes));
      } catch (e) {
        setUpvotes({});
      }
    }
  }, []);

  const handleVote = (id: string) => {
    const currentVotes = upvotes[id] || 0;
    const newVotes = { ...upvotes, [id]: currentVotes + 1 };
    setUpvotes(newVotes);
    localStorage.setItem('sunbee_report_votes', JSON.stringify(newVotes));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newReport: UserReport = {
      id: `r-${Date.now()}`,
      name: name.trim() || 'Аноним',
      type,
      description: description.trim(),
      contactInfo: contactInfo.trim() || undefined,
      status: 'approved', // instantly approve for the mock preview
      date: new Date().toLocaleDateString('ru-RU')
    };

    const nextReports = [newReport, ...reports];
    setReports(nextReports);
    localStorage.setItem('sunbee_reports', JSON.stringify(nextReports));

    // Reset form states
    setName('');
    setDescription('');
    setContactInfo('');
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4500);
  };

  // Filter existing cases
  const filteredReports = reports.filter(item => 
    item.type.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    (item.name && item.name.toLowerCase().includes(search.toLowerCase()))
  );

  const fraudTypes = [
    'Фишинг (Phishing)',
    'Вишинг (Телефонные звонки)',
    'Смишинг (SMS-сообщения)',
    'Инвестиционный обман',
    'Романтическое мошенничество',
    'Поддельные интернет-магазины',
    'Криптовалютные аферы',
    'Взлом аккаунта/Соцсети',
    'Другая угроза'
  ];

  return (
    <div className="py-6 font-sans space-y-10" id="report-tab-view">
      
      {/* 2-column layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Submission form (5 cols) */}
        <div className="lg:col-span-5 bg-bee-dark rounded-2xl border border-bee-border p-5 md:p-6 space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <ShieldAlert className="text-bee-yellow w-5 h-5" /> Заявить об угрозе
            </h2>
            <p className="text-xs text-gray-500">
              Поделитесь деталями подозрительного звонка или письма, с которым вы столкнулись. Ваш отчет поможет предотвратить потерю средств другими людьми.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-500/10 text-emerald-300 p-6 rounded-2xl border border-emerald-500/20 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="font-bold text-sm uppercase">Данные успешно отправлены!</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Спасибо за помощь в укреплении кибер-купола SunBee. Ваша информация была проанализирована алгоритмами и добавлена в общий реестр инцидентов.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Имя или Псевдоним (необязательно)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Иван С."
                  className="w-full bg-bee-black border border-bee-border focus:border-bee-yellow rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Threat Type */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Категория инцидента</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-bee-black border border-bee-border focus:border-bee-yellow rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                >
                  {fraudTypes.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Описание ситуации (Максимум деталей)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  placeholder="Опишите, с какого номера звонили/писали, что именно требовали сделать, какие ссылки присылали..."
                  className="w-full bg-bee-black border border-bee-border focus:border-bee-yellow rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-gray-600 resize-none leading-relaxed"
                />
              </div>

              {/* Contacts */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase">Контакты для уточнения (необязательно)</label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Telegram / Email / Телефон"
                  className="w-full bg-bee-black border border-bee-border focus:border-bee-yellow rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                />
                <p className="text-[10px] text-gray-500 font-mono italic">Данная информация не публикуется в открытом реестре.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-bee-yellow hover:bg-bee-yellow-light text-bee-black font-extrabold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer border border-transparent shadow shadow-yellow-500/10"
              >
                <Send className="w-4 h-4" /> Опубликовать инцидент
              </button>

            </form>
          )}

          {/* Simple security advise widget */}
          <div className="bg-bee-black p-4 rounded-xl border border-white/5 space-y-1 text-xs">
            <div className="font-bold text-bee-yellow flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Анонимная Защита
            </div>
            <p className="text-gray-400 text-justify leading-relaxed">
              Мы уважаем конфиденциальность. Вы праве не указывать личные имена или контакты. Важнее всего предоставить точный текст СМС или алгоритм звонка.
            </p>
          </div>
        </div>

        {/* Right Col: Shared incident logs from users (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-3">
            <div>
              <h2 className="text-xl font-bold font-display text-white">Реестр Мошеннических Нападений</h2>
              <p className="text-xs text-gray-500">База реальных кейсов от пользователей SunBee в режиме реального времени.</p>
            </div>

            {/* Micro search */}
            <div className="relative w-full md:w-56 group">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-bee-yellow transition" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по базе..."
                className="w-full bg-bee-dark border border-bee-border focus:border-bee-yellow rounded-lg py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredReports.length > 0 ? (
              filteredReports.map((r) => {
                const voteCount = upvotes[r.id] || 0;
                return (
                  <div
                    key={r.id}
                    className="bg-bee-dark border border-bee-border p-4 rounded-xl space-y-3 relative group hover:border-bee-yellow/20 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start text-xs font-mono">
                      <div className="flex gap-2 items-center">
                        <span className="w-2.5 h-2.5 rounded bg-amber-500 flex items-center justify-center font-bold text-[8px] text-bee-black">🐝</span>
                        <span className="font-bold text-white text-[11px]">{r.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 text-[10px]">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {r.date}</span>
                        <span>Подал: <strong>{r.name}</strong></span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed text-justify bg-bee-black/40 p-3.5 rounded-lg border border-white/5">
                      {r.description}
                    </p>

                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 pt-1">
                      <div className="flex gap-1.5 items-center bg-red-500/5 text-red-400 px-2.5 py-1 rounded border border-red-500/10">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>ПОДТВЕРЖДЕНО КИБЕРАНАЛИЗОМ</span>
                      </div>

                      {/* Vote Button */}
                      <button
                        onClick={() => handleVote(r.id)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-yellow-500/10 text-gray-300 hover:text-bee-yellow rounded-lg transition-transform hover:scale-105 cursor-pointer border border-transparent hover:border-yellow-500/10 font-bold"
                      >
                        <ThumbsUp className="w-3 h-3" /> Полезно ({voteCount})
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-bee-dark/40 border border-bee-border text-center py-16 rounded-xl max-w-md mx-auto space-y-2">
                <MessageSquare className="w-10 h-10 text-gray-600 mx-auto" />
                <h3 className="font-bold text-white text-xs">Записи не обнаружены</h3>
                <p className="text-[11px] text-gray-500">Попробуйте ввести другие критерии поиска или добавьте ваш личный кейс первым.</p>
              </div>
            )}
          </div>
        </div>

      </section>

    </div>
  );
}
