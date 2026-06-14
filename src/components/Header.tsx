import React from 'react';
import { Shield, Sparkles, User, AlertCircle, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  safetyScore: number;
}

export default function Header({ activeTab, setActiveTab, safetyScore }: HeaderProps) {
  // Compute safety rank based on the progress score
  const getSafetyRank = (score: number) => {
    if (score >= 90) return { title: 'Мастер Безопасности 🐝', color: 'text-[#F59E0B] border-amber-500/30 bg-amber-500/10' };
    if (score >= 60) return { title: 'Бронированный профи 🛡️', color: 'text-amber-400 border-yellow-500/20 bg-yellow-500/5' };
    if (score >= 30) return { title: 'Осторожный Защитник', color: 'text-sky-400 border-sky-500/20 bg-sky-500/5' };
    return { title: 'Уязвимый новобранец', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' };
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
    <header className="sticky top-0 z-50 bg-bee-black/90 backdrop-blur-md border-b border-bee-border" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Brand logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition group"
        >
          <div className="w-10 h-10 bg-bee-yellow text-bee-black rounded-xl flex items-center justify-center font-extrabold text-xl shadow-lg shadow-yellow-500/10 group-hover:scale-105 transition-transform duration-300">
            🐝
          </div>
          <div>
            <h1 className="text-xl font-black font-display tracking-tight text-white flex items-center gap-1.5 leading-none">
              SunBee <span className="text-xs font-mono px-1.5 py-0.5 bg-yellow-500/10 text-bee-yellow rounded font-semibold border border-yellow-500/20">CYBER</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">Shield & Security</p>
          </div>
        </div>

        {/* Modular navigation links */}
        <nav className="flex flex-wrap justify-center gap-x-1 sm:gap-x-2 md:gap-x-4 gap-y-2 text-xs md:text-sm font-medium">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-bee-yellow text-bee-black font-bold shadow-md shadow-yellow-500/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Dynamic credit meter / user profile summary */}
        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 border px-3 py-1.5 rounded-xl font-mono text-xs ${rank.color}`}>
            <Award className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-gray-500 leading-none">Индекс защиты</div>
              <div className="font-bold leading-normal">{rank.title}</div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('cabin')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer border ${
              activeTab === 'cabin' 
                ? 'bg-bee-card border-bee-yellow text-bee-yellow' 
                : 'bg-white/5 border-white/5 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Личный Кабинет"
            id="nav-cabinet-trigger"
          >
            <User className="w-4 h-4" />
            <span className="text-xs font-semibold">{safetyScore}%</span>
          </button>
        </div>

      </div>
    </header>
  );
}
