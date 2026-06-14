import React, { useState } from 'react';
import { Search, Flame, Eye, Calendar, ArrowLeft, ArrowUpRight, FolderOpen, AlertCircle } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsViewProps {
  news: NewsArticle[];
  selectedArticle: NewsArticle | null;
  setSelectedArticle: (art: NewsArticle | null) => void;
}

export default function NewsView({ news, selectedArticle, setSelectedArticle }: NewsViewProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'leaks' | 'scams' | 'alerts' | 'advice'>('all');

  const categories = [
    { id: 'all', label: 'Все новости' },
    { id: 'alerts', label: '🚨 Экстренные Угрозы' },
    { id: 'leaks', label: '🔒 Утечки Данных' },
    { id: 'scams', label: '⚠️ Схемы Обмана' },
    { id: 'advice', label: '🎓 Советы и Практика' },
  ];

  // Filter products based on categories & search term
  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.summary.toLowerCase().includes(search.toLowerCase()) ||
                          item.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedArticle) {
    const art = selectedArticle;
    return (
      <div className="py-6 max-w-4xl mx-auto space-y-6" id="news-article-detail">
        <button
          onClick={() => setSelectedArticle(null)}
          className="px-4 py-2 bg-bee-dark hover:bg-bee-card border border-bee-border text-gray-300 hover:text-white rounded-xl transition text-xs flex items-center gap-2 font-mono cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Вернуться к списку новостей
        </button>

        <article className="bg-bee-dark rounded-3xl border border-bee-border overflow-hidden p-6 md:p-10 space-y-6">
          <div className="flex flex-wrap gap-3 items-center justify-between text-xs font-mono text-gray-500">
            <span className="px-3 py-1 bg-red-400/10 text-red-400 rounded-lg border border-red-400/20 uppercase font-bold text-[10px]">
              {art.tag}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {art.date}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views} просмотров</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold font-display leading-tight text-white">
            {art.title}
          </h1>

          <div className="p-4 bg-bee-black/40 border-l-4 border-bee-yellow rounded-r-xl text-sm italic text-gray-300 leading-relaxed">
            {art.summary}
          </div>

          <div className="text-gray-300 space-y-4 text-justify leading-relaxed text-sm md:text-base">
            {art.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono text-gray-500">
            <span>Источник информации: <strong className="text-gray-400">{art.source}</strong></span>
            <div className="flex gap-2 text-red-400 font-semibold items-center bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10">
              <AlertCircle className="w-4 h-4" />
              <span>Опасность угрозы: {art.dangerLevel === 'high' ? 'КРИТИЧЕСКАЯ' : art.dangerLevel === 'medium' ? 'СРЕДНЯЯ' : 'НИЗКАЯ'}</span>
            </div>
          </div>
        </article>

        {/* Action alert box for cybersecurity learning */}
        <div className="bg-gradient-to-r from-bee-dark to-yellow-950/20 border border-yellow-500/20 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-bold text-white text-md mb-1">Остерегайтесь подобных схем</h4>
            <p className="text-xs text-gray-400">Пройдите интерактивные опросники или обратитесь во вспомогательный чекер для анализа схожих сообщений.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedArticle(null);
                // navigate or scroll
                const checker = document.getElementById('nav-checker');
                if (checker) checker.click();
              }}
              className="px-4 py-2 bg-bee-yellow text-bee-black font-extrabold rounded-lg text-xs hover:bg-bee-yellow-light transition cursor-pointer"
            >
              Запустить Чекер
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 font-sans" id="news-tab-view">
      {/* Search and headline text */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white">Мониторинг угроз и Утечки</h1>
          <p className="text-xs text-gray-500">Сводки инцидентов безопасности, обнаруженные по всей сети сотрудниками SunBee Security Lab.</p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 group-focus-within:text-bee-yellow transition" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по новостям и тегам..."
            className="w-full bg-bee-dark border border-bee-border focus:border-bee-yellow rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-bee-yellow placeholder-gray-500"
          />
        </div>
      </div>

      {/* category selectors */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1" id="news-category-filters">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition ${
              activeCategory === c.id
                ? 'bg-bee-yellow text-bee-black font-extrabold'
                : 'bg-bee-dark text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="bg-bee-dark border border-bee-border rounded-2xl overflow-hidden hover:border-bee-yellow/40 hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
            >
              <div className="p-5 md:p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-yellow-500/10 text-bee-yellow border border-yellow-500/20 rounded-md text-[9px] font-mono font-semibold uppercase">
                    {item.tag}
                  </span>
                  <div className="flex gap-3 text-[10px] font-mono text-gray-500">
                    <span>{item.date}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-md font-bold text-white group-hover:text-bee-yellow transition leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-justify text-gray-400 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-5 md:px-6 pt-0 border-t border-white/5 flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${
                  item.dangerLevel === 'high' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  ОПАСНОСТЬ: {item.dangerLevel === 'high' ? 'ВЫСОКАЯ' : 'СРЕДНЯЯ'}
                </span>
                <button
                  onClick={() => setSelectedArticle(item)}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-bee-yellow hover:text-bee-black rounded-lg text-[10px] font-bold text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Разбор защиты <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bee-dark/40 border border-bee-border text-center py-16 rounded-2xl max-w-xl mx-auto space-y-3">
          <FolderOpen className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-md font-bold text-white">Список пуст</h3>
          <p className="text-xs text-gray-500">По вашему запросу не найдено ни одного предупреждения безопасности.</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all'); }}
            className="text-xs text-bee-yellow underline hover:text-white"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}
