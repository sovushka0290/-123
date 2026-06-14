import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle, Info, Terminal, AlertTriangle, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { FraudScheme } from '../types';

interface CatalogViewProps {
  schemes: FraudScheme[];
  selectedScheme: FraudScheme | null;
  setSelectedScheme: (scheme: FraudScheme | null) => void;
}

export default function CatalogView({ schemes, selectedScheme, setSelectedScheme }: CatalogViewProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Set default if empty
  const currentScheme = selectedScheme || schemes[0];

  return (
    <div className="py-6 font-sans" id="catalog-tab-view">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white">Каталог мошеннических схем</h1>
        <p className="text-xs text-gray-500">Энциклопедия современных методов социальной инженерии, обмана и вымогательства. Изучите врага в лицо.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Interactive Sidebar Selector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <div className="text-xs font-mono text-gray-500 uppercase px-1 mb-1">Доступные категории угроз:</div>
          
          <div className="space-y-2">
            {schemes.map((sch) => {
              const isSelected = currentScheme?.id === sch.id;
              return (
                <button
                  key={sch.id}
                  onClick={() => {
                    setSelectedScheme(sch);
                    setActiveCategory(sch.id);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    isSelected
                      ? 'bg-bee-yellow text-bee-black font-extrabold border-transparent shadow-lg shadow-yellow-500/10 scale-[1.01]'
                      : 'bg-bee-dark hover:bg-bee-card text-gray-300 border-bee-border hover:border-bee-yellow/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{isSelected ? '🐝' : '📂'}</span>
                    <div className="text-xs md:text-sm">{sch.name}</div>
                  </div>
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono ${
                    sch.dangerLevel === 'high' 
                      ? isSelected ? 'bg-black/10 text-black' : 'bg-red-500/10 text-red-400'
                      : isSelected ? 'bg-black/10 text-black' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {sch.dangerLevel === 'high' ? 'Крит' : 'Ср'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-bee-dark/40 rounded-xl border border-bee-border mt-3">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-bee-yellow" /> Помочь сообществу
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
              Столкнулись со схемой, которой нет в списке? Заполните анонимную форму, и наши инженеры опубликуют её после модерации.
            </p>
            <button
              onClick={() => {
                const b = document.getElementById('nav-report');
                if (b) b.click();
              }}
              className="text-xs font-bold text-bee-yellow hover:text-white"
            >
              Сообщить об угрозе &rarr;
            </button>
          </div>
        </div>

        {/* Right Side: Deep Visual Playbook (8 cols) */}
        <div className="lg:col-span-8">
          {currentScheme ? (
            <div className="bg-bee-dark rounded-3xl border border-bee-border p-6 md:p-8 space-y-6 animate-fade-in">
              
              {/* Header Box */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold font-display text-white">{currentScheme.name}</h2>
                  <div className="text-[10px] text-bee-yellow font-mono mt-1 flex items-center gap-1.5 uppercase font-semibold">
                    <Shield className="w-3.5 h-3.5" /> Защитный протокол SunBee активен
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">Класс опасности:</span>
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded-md border ${
                    currentScheme.dangerLevel === 'high'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {currentScheme.dangerLevel === 'high' ? 'КРИТИЧЕСКИ ВЫСОКИЙ' : 'СРЕДНИЙ'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-400 font-mono uppercase tracking-wide flex items-center gap-2">
                  <Info className="w-4 h-4 text-bee-yellow" /> ЧТО ЭТО ТАКОЕ?
                </h3>
                <p className="text-xs md:text-sm text-gray-200 leading-relaxed text-justify">
                  {currentScheme.description}
                </p>
              </div>

              {/* Tactics list using bullet points */}
              <div className="p-4 bg-bee-black/50 rounded-2xl border border-white/5 space-y-2.5">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-rose-400" /> Основной инструментарий манипуляций
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentScheme.tactics.map((t, idx) => (
                    <span key={idx} className="bg-red-500/5 text-red-300 border border-red-500/10 px-2.5 py-1 rounded-md text-[10px] font-mono">
                      ● {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Danger triggers / Clues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-bee-card/50 p-5 rounded-2xl border border-bee-border space-y-3">
                  <h4 className="text-xs font-bold text-[#F59E0B] font-mono tracking-wide uppercase flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-bee-yellow" /> Ключевые Признаки обмана
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-300">
                    {currentScheme.signs.map((sign, idx) => (
                      <li key={idx} className="flex gap-2 items-start leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-bee-yellow rounded-full mt-1.5 shrink-0"></span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-bee-card/50 p-5 rounded-2xl border border-bee-border space-y-3">
                  <h4 className="text-xs font-bold text-[#10B981] font-mono tracking-wide uppercase flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Алгоритм Самозащиты
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-300">
                    {currentScheme.defenseTips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2 items-start leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Real-life Case examples */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wide flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> ПРИМЕРЫ ИЗ ЖИЗНИ
                </h4>
                <div className="space-y-3">
                  {currentScheme.examples.map((ex, idx) => (
                    <div key={idx} className="p-4 bg-bee-black/40 border-l-2 border-red-500/30 rounded-r-xl text-xs text-gray-300 italic leading-relaxed">
                      "{ex}"
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-bee-dark text-center p-12 rounded-2xl">
              <p className="text-gray-400">Выберите тип мошенничества в левом меню для изучения подробных признаков и инструкций защиты.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
