import React, { useState } from 'react';
import { BookOpen, Shield, KeyRound, CheckSquare, Eye, Lock, ThumbsUp, HelpCircle, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { KnowledgeArticle } from '../types';

interface KnowledgeViewProps {
  articles: KnowledgeArticle[];
  safetyChecklists: { [key: string]: boolean };
  toggleChecklist: (key: string) => void;
}

export default function KnowledgeView({ articles, safetyChecklists, toggleChecklist }: KnowledgeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basics' | 'passwords' | '2fa' | 'cards'>('all');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);

  // Password Strength Tester States
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Filter lessons
  const filteredArticles = articles.filter(art => 
    selectedCategory === 'all' || art.category === selectedCategory
  );

  // Password Analysis Algorithm
  const analyzePassword = (pwd: string) => {
    if (!pwd) return { score: 0, text: 'Введите пароль', color: 'text-gray-400 bg-gray-500/10', width: 'w-0', feedback: [] };
    
    let score = 0;
    const feedback: string[] = [];

    // Length
    if (pwd.length >= 12) {
      score += 30;
    } else if (pwd.length >= 8) {
      score += 15;
      feedback.push('Сделайте пароль длиннее (хотя бы 12 символов).');
    } else {
      feedback.push('Слишком короткий пароль! Минимальный стандарт — 8 символов.');
    }

    // Uppercase & Lowercase mix
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) {
      score += 25;
    } else {
      feedback.push('Смешайте заглавные (А-Я, A-Z) и строчные буквы.');
    }

    // Digits
    if (/\d/.test(pwd)) {
      score += 20;
    } else {
      feedback.push('Добавьте как минимум одну цифру.');
    }

    // Special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      score += 25;
    } else {
      feedback.push('Внедрите специальные символы (например, @, #, $, %).');
    }

    // Common dangerous patterns
    const commonStrs = ['123', 'qwerty', 'admin', 'password', 'love', 'marina', 'sasha', 'god', 'sunbee'];
    const pLower = pwd.toLowerCase();
    let hasCommon = false;
    commonStrs.forEach(s => {
      if (pLower.includes(s)) {
        hasCommon = true;
      }
    });

    if (hasCommon) {
      score = Math.max(score - 30, 10);
      feedback.unshift('⚠️ Обнаружены легко угадываемые словарные слова или комбинации клавиш!');
    }

    // Determine results
    let text = 'Очень слабый (Критический) 🔴';
    let color = 'text-red-400 border-red-500/20 bg-red-500/5';
    let width = 'w-1/4 bg-red-500';

    if (score >= 90) {
      text = 'Железобетонный! Броня 🟢';
      color = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      width = 'w-full bg-emerald-500';
    } else if (score >= 60) {
      text = 'Хорошая устойчивость 🟡';
      color = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      width = 'w-2/3 bg-amber-500';
    } else if (score >= 35) {
      text = 'Слабый пароль (Ненадежный) 🟠';
      color = 'text-orange-400 border-orange-500/20 bg-orange-500/5';
      width = 'w-1/3 bg-orange-500';
    }

    return { score, text, color, width, feedback };
  };

  const strength = analyzePassword(password);

  return (
    <div className="py-6 font-sans space-y-10" id="knowledge-tab-view">
      
      {/* 1. Header and Interactive Password Tester */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left side text introduction (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white">База знаний SunBee</h1>
            <p className="text-xs text-gray-500">Системные инструкции, иллюстрированные уроки и интерактивные чеклисты для безопасной жизни в цифровом государстве.</p>
          </div>

          {/* Categories select pills */}
          <div className="flex flex-wrap gap-2 pt-1 border-b border-white/5 pb-4">
            <button
              onClick={() => { setSelectedCategory('all'); setActiveArticle(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                selectedCategory === 'all' && !activeArticle
                  ? 'bg-bee-yellow text-bee-black font-extrabold'
                  : 'bg-bee-dark text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              Все уроки ({articles.length})
            </button>
            {articles.map((art) => (
              <button
                key={art.id}
                onClick={() => {
                  setActiveArticle(art);
                  setSelectedCategory(art.category as any);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  activeArticle?.id === art.id
                    ? 'bg-bee-yellow text-bee-black font-extrabold shadow-md shadow-yellow-500/10'
                    : 'bg-bee-dark text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                🎓 {art.title.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Active Lesson View */}
          {activeArticle ? (
            <div className="bg-bee-dark rounded-2xl border border-bee-border p-6 md:p-8 space-y-6 animate-fade-in text-xs md:text-sm">
              <div className="flex justify-between items-center text-xs font-mono text-gray-500">
                <span className="text-bee-yellow font-bold uppercase">Раздел: {activeArticle.category}</span>
                <span>Время чтения: {activeArticle.readTime}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold font-display text-white">
                {activeArticle.title}
              </h2>

              <p className="text-gray-300 leading-relaxed text-justify">
                {activeArticle.content}
              </p>

              {/* Steps checklist */}
              <div className="space-y-4 pt-3">
                <h3 className="font-bold text-white text-sm uppercase font-mono tracking-wider">Инструкция по шагам:</h3>
                <div className="space-y-3">
                  {activeArticle.steps.map((step, idx) => (
                    <div key={idx} className="bg-bee-black/40 border border-white/5 p-4 rounded-xl space-y-1">
                      <div className="text-xs font-mono font-bold text-bee-yellow">ШАГ {idx + 1}: {step.title}</div>
                      <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal control items list */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-400" /> Отметьте для закрепления:
                </h4>
                <div className="space-y-2">
                  {activeArticle.checklist.map((item, idx) => {
                    const uniqueKey = `${activeArticle.id}-${idx}`;
                    const isChecked = !!safetyChecklists[uniqueKey];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleChecklist(uniqueKey)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-center ${
                          isChecked
                            ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
                            : 'bg-bee-black hover:bg-bee-card border-white/5 text-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-emerald-500 border-transparent text-black font-bold text-[10px]' : 'border-gray-500'
                        }`}>
                          {isChecked && '✓'}
                        </div>
                        <span className="text-xs leading-none">{item}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-500 font-mono italic">
                  * Полноценное закрытие чек-листов увеличивает ваш общий "Индекс цифровой защиты" в личном кабинете.
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-bee-dark/70 rounded-2xl p-8 border border-bee-border flex flex-col justify-center items-center text-center space-y-4">
              <BookOpen className="w-12 h-12 text-gray-500" />
              <h3 className="font-bold text-white text-md">Выберите руководство для изучения</h3>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                Вверху представлены уроки по паролям, 2FA, картам и уловкам фишинга. Выберите любой класс за секунду.
              </p>
            </div>
          )}
        </div>

        {/* Right side interactive password builder (5 cols) */}
        <div className="lg:col-span-5 bg-bee-dark rounded-2xl border border-bee-border p-5 md:p-6 space-y-5" id="password-tester-card">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 text-bee-yellow rounded font-mono text-[10px] font-semibold border border-yellow-500/20">
            <Lock className="w-3.5 h-3.5" /> ИНТЕРАКТИВНЫЙ БАРЬЕР БЕЗОПАСНОСТИ
          </div>

          <div>
            <h2 className="text-lg font-bold font-display text-white">Кардиограмма Силы Паролей</h2>
            <p className="text-xs text-gray-400 leading-relaxed mt-1">
              Проверьте устойчивость вашего мастер-пароля к методу брутфорса и автоматическому подбору словарями.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Password input form element */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wide">Пароль для тестирования</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Например: BrownHoneyBee2026#"
                  className="w-full bg-bee-black border border-bee-border focus:border-bee-yellow rounded-xl py-2.5 pl-4 pr-10 text-xs text-white focus:outline-none placeholder-gray-600 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  {showPassword ? 'Скрыть' : 'Показ'}
                </button>
              </div>
            </div>

            {/* Visual Entropy Meter */}
            {password && (
              <div className="space-y-2 mt-4 animate-fade-in">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Сложность: {password.length} символов</span>
                  <span className={`text-[11px] font-mono border px-2 py-0.5 rounded-md ${strength.color}`}>
                    {strength.text}
                  </span>
                </div>

                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.width}`}></div>
                </div>

                {/* Micro recommendation tips */}
                {strength.feedback.length > 0 && (
                  <div className="bg-bee-black p-3.5 rounded-xl border border-white/5 space-y-1.5 mt-2">
                    <div className="text-[10px] font-mono text-yellow-500 font-bold uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Рекомендации по оптимизации:
                    </div>
                    <div className="space-y-1">
                      {strength.feedback.map((f, fIdx) => (
                        <div key={fIdx} className="text-[11px] text-gray-400 flex items-start gap-1">
                          <span className="text-bee-yellow shrink-0 mt-0.5">•</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {strength.score >= 85 && (
                  <div className="bg-emerald-500/10 text-emerald-300 text-xs p-3 rounded-xl border border-emerald-500/20 flex gap-2 items-center">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Отличный пароль! Этот ключ обеспечит надёжную защиту ваших данных.</span>
                  </div>
                )}
              </div>
            )}

            {/* Simple static rules card */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-bee-yellow" /> Золотые правила создания паролей:
              </div>
              <ul className="text-[11px] text-gray-400 space-y-2">
                <li className="flex gap-2 items-start"><span className="text-bee-yellow">•</span><span>Используйте <strong>генераторы фраз</strong> вместо случайного набора букв.</span></li>
                <li className="flex gap-2 items-start"><span className="text-bee-yellow">•</span><span>Никогда не используйте ИМЕНА родных, свою дату рождения или ники в играх.</span></li>
                <li className="flex gap-2 items-start"><span className="text-bee-yellow">•</span><span>Обязательно включите 2FA — пароль перестанет быть уязвимой точкой отказа.</span></li>
              </ul>
            </div>

          </div>
        </div>

      </section>

    </div>
  );
}
