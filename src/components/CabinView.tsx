import React from 'react';
import { User, Award, Shield, CheckCircle, TrendingUp, AlertTriangle, ToggleLeft, Sparkles, RefreshCw, Star } from 'lucide-react';

interface CabinViewProps {
  safetyScore: number;
  completedQuizzesCount: number;
  completedChecklistsCount: number;
  submittedReportsCount: number;
  profileSwitches: { [key: string]: boolean };
  toggleProfileSwitch: (key: string) => void;
}

export default function CabinView({
  safetyScore,
  completedQuizzesCount,
  completedChecklistsCount,
  submittedReportsCount,
  profileSwitches,
  toggleProfileSwitch
}: CabinViewProps) {

  // Dynamic status evaluation
  const getProfileRank = (score: number) => {
    if (score >= 90) return { title: 'Мастер Безопасности 🐝', desc: 'Уровень вашей цифровой защиты практически неуязвим. Вы знаете все тактики социальной инженерии.', color: 'text-[#F59E0B]' };
    if (score >= 60) return { title: 'Бронированный профи 🛡️', desc: 'Вы хорошо защищены. Небольшие пробелы легко закрыть прохождением оставшихся квизов.', color: 'text-amber-400' };
    if (score >= 30) return { title: 'Осторожный Защитник', desc: 'Вы понимаете основы, но рискуете пострадать при таргетированной фишинг-атаке.', color: 'text-sky-400' };
    return { title: 'Уязвимый новобранец', desc: 'Критически низкий барьер! Вы можете легко поверить фальшивым звонкам из правоохранительных органов.', color: 'text-rose-400' };
  };

  const rank = getProfileRank(safetyScore);

  // List of professional physical secure actions
  const secureActions = [
    {
      id: 'sim_lock',
      title: 'Блокировка SIM-карты у сотового оператора',
      desc: 'Заявление о запрете перевыпуска SIM-карты без вашего личного присутствия с паспортом (защита от SIM-Swap).'
    },
    {
      id: 'mess_filter',
      title: 'Фильтрация звонков в мессенджерах',
      desc: 'Включение запрета на прием звонков от незнакомых номеров в Telegram, WhatsApp и Viber.'
    },
    {
      id: 'gos_2fa',
      title: 'Защита портала eGov.kz',
      desc: 'Включение двухфакторной аутентификации на государственном портале электронного правительства РК eGov.kz и привязка биометрии.'
    },
    {
      id: 'app_lock',
      title: 'Защита банковских программ',
      desc: 'Все банковские приложения заблокированы по FaceID/Fingerprint, отключена оплата без СМС.'
    }
  ];

  // Badge eligibility logic
  const badges = [
    {
      id: 'b-welcome',
      title: 'Базовый Страж',
      desc: 'Активирован профиль на SunBee',
      earned: true,
      icon: '🥉'
    },
    {
      id: 'b-auditor',
      title: 'Шерлок Пчела',
      desc: 'Просканирована подозрительная угроза в Анализаторе',
      earned: true, // we assume they visited or tested
      icon: '🔍'
    },
    {
      id: 'b-ally',
      title: 'Союзник Улья',
      desc: 'Сообщили об инциденте в реестр',
      earned: submittedReportsCount > 2, // dynamic
      icon: '🐝'
    },
    {
      id: 'b-master',
      title: 'Броня Разума',
      desc: 'Набрано свыше 70% индекса защиты',
      earned: safetyScore >= 70,
      icon: '👑'
    }
  ];

  return (
    <div className="py-6 font-sans space-y-8 animate-fade-in" id="cabinet-tab-view">
      
      {/* Profile Overview Card */}
      <div className="bg-gradient-to-br from-bee-dark to-yellow-950/20 rounded-3xl border border-bee-yellow/20 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left side score graphic */}
        <div className="md:col-span-4 text-center space-y-3">
          <div className="relative inline-block">
            {/* SVG circle meter */}
            <div className="w-32 h-32 flex items-center justify-center bg-bee-black/60 rounded-full border border-white/5 shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-black font-display text-white">{safetyScore}%</div>
                <div className="text-[9px] font-mono tracking-widest text-gray-500 uppercase mt-0.5">ЗАЩИТА</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className={`font-black font-display text-md ${rank.color}`}>
              {rank.title}
            </h3>
            <p className="text-[11px] text-gray-400 px-3 leading-relaxed">
              {rank.desc}
            </p>
          </div>
        </div>

        {/* Right side stats overview */}
        <div className="md:col-span-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white font-display mb-1">Метрики вашего цифрового иммунитета</h2>
            <p className="text-xs text-gray-500">Система учитывает прохождение квизов, закрытие листов обучения и включение физических барьеров защиты.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-bee-black/50 p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-500 font-mono">Пройдено Квизов:</span>
              <div className="text-lg font-bold text-bee-yellow">{completedQuizzesCount} / 2</div>
            </div>
            
            <div className="bg-bee-black/50 p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-500 font-mono">Выполнено шагов:</span>
              <div className="text-lg font-bold text-emerald-400">{completedChecklistsCount} пунктов</div>
            </div>

            <div className="bg-bee-black/50 p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-500 font-mono">Подано отчетов:</span>
              <div className="text-lg font-bold text-blue-400">{submittedReportsCount - 2} угроз</div>
            </div>
          </div>

          <div className="p-3 bg-bee-black/40 text-gray-400 text-[11.5px] rounded-xl border border-white/5 flex gap-2">
            <TrendingUp className="w-4 h-4 text-bee-yellow shrink-0 mt-0.5" />
            <span>Ваше обучение в SunBee способствует развитию коллективной безопасности. Спасибо, что вы с нами!</span>
          </div>
        </div>

      </div>

      {/* Grid: Actions Ledger and Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Real-life security switches (7 cols) */}
        <div className="lg:col-span-7 bg-bee-dark rounded-2xl border border-bee-border p-5 md:p-6 space-y-5">
          <div>
            <h3 className="font-bold text-white text-md flex items-center gap-2">
              <Shield className="text-bee-yellow w-5 h-5" /> Физические Барьеры Защиты
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Отметьте, какие из предложенных действий по защите СИМ-карт и аккаунтов вы УЖЕ КОРРЕКТНО настроили на своих настоящих гаджетах (каждое действие повышает ваш балл):
            </p>
          </div>

          <div className="space-y-3">
            {secureActions.map((act) => {
              const isChecked = !!profileSwitches[act.id];
              return (
                <div
                  key={act.id}
                  onClick={() => toggleProfileSwitch(act.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
                      : 'bg-bee-black hover:bg-bee-card border-white/5 text-gray-300'
                  }`}
                >
                  <div className="space-y-1 max-w-[85%]">
                    <h4 className="text-xs font-bold leading-normal">{act.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{act.desc}</p>
                  </div>
                  
                  {/* Custom toggle button look */}
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
                    isChecked ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}>
                    <div className={`w-3 h-3 bg-bee-black rounded-full transition-transform ${
                      isChecked ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Badges and Credentials (5 cols) */}
        <div className="lg:col-span-5 bg-bee-dark rounded-2xl border border-bee-border p-5 md:p-6 space-y-5">
          <div>
            <h3 className="font-bold text-white text-md flex items-center gap-2">
              <Award className="text-bee-yellow w-5 h-5" /> Ваши Достижения & Медали
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Милстоуны и бейджи за повышение грамотности:
            </p>
          </div>

          <div className="space-y-3">
            {badges.map((bdg) => (
              <div
                key={bdg.id}
                className={`p-3.5 rounded-xl border flex gap-3.5 items-center ${
                  bdg.earned
                    ? 'bg-bee-black border-bee-yellow/20 text-white'
                    : 'bg-bee-black/40 border-white/5 text-gray-500 opacity-50'
                }`}
              >
                <div className="text-2xl">{bdg.icon}</div>
                <div>
                  <h4 className="text-xs font-bold font-display">{bdg.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{bdg.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
