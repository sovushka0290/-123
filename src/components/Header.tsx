import React from 'react';
import { Shield, Sparkles, User, AlertCircle, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  safetyScore: number;
}

export default function Header({ activeTab, setActiveTab, safetyScore }: HeaderProps) {
  // Compute safety rank based on the progress score
  const getSafetyRank = (score: number) => {
    if (score >= 90) return { title: 'Мастер Безопасности 🐝', color: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' };
    if (score >= 60) return { title: 'Бронированный профи 🛡️', color: 'text-amber-400 border-amber-500/10 bg-amber-500/5' };
    if (score >= 30) return { title: 'Осторожный Защитник', color: 'text-cyan-400 border-cyan-500/10 bg-cyan-500/5' };
    return { title: 'Уязвимый новобранец', color: 'text-rose-400 border-rose-500/10 bg-rose-500/5' };
  };

  const rank = getSafetyRank(safetyScore);

  const menuItems = [
    { id: 'home', label: 'Главная' },
    { id: 'news', label: 'Угрозы и Новости' },
    { id: 'catalog', label: 'Виды мошенничества' },
    { id: 'knowledge', label: 'База знаний' },
    { id: 'checker', label: 'Анализатор Угроз' },
    { id: 'quiz', label: 'Тесты & Квизы' },
    { id: 'report', label: 'Сообщить о схеме' },
  ];

  return (
    <header className="sticky top-0 z-50 ios-glass border-b border-bee-border" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
        
        {/* Brand logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition group"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-[0_0_20px_rgba(250,204,21,0.25)] group-hover:scale-105 ios-transition">
            🐝
          </div>
          <div>
            <h1 className="text-xl font-black font-display tracking-tight text-white flex items-center gap-1.5 leading-none">
              SunBee <span className="text-[10px] font-mono px-1.5 py-0.5 bg-yellow-400/10 text-yellow-400 rounded font-bold border border-yellow-400/20">CYBER</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-1">Shield & Security</p>
          </div>
        </div>

        {/* Modular navigation links with fluid iOS active slider */}
        <nav className="flex flex-wrap justify-center gap-1 bg-slate-950/40 p-1.5 rounded-2xl border border-white/5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors duration-300 ${
                  isActive 
                    ? 'text-slate-950' 
                    : 'text-slate-400 hover:text-white'
                }`}
                id={`nav-${item.id}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="header-active-capsule"
                    className="absolute inset-0 bg-gradient-to-tr from-yellow-400 to-yellow-300 rounded-xl z-0 shadow-lg shadow-yellow-400/10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic credit meter / user profile summary */}
        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 border px-3 py-1.5 rounded-xl font-mono text-xs ios-transition ${rank.color}`}>
            <Award className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-slate-500 leading-none">Индекс защиты</div>
              <div className="font-bold leading-normal">{rank.title}</div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('cabin')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl ios-transition border ${
              activeTab === 'cabin' 
                ? 'bg-slate-900 border-yellow-400 text-yellow-400' 
                : 'bg-white/5 border-white/5 text-slate-300 hover:text-white hover:bg-slate-800/80 shadow-md'
            }`}
            title="Личный Кабинет"
            id="nav-cabinet-trigger"
          >
            <User className="w-4 h-4" />
            <span className="text-xs font-bold leading-none">{safetyScore}%</span>
          </button>
        </div>

      </div>
    </header>
  );
}
