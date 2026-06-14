import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import NewsView from './components/NewsView';
import CatalogView from './components/CatalogView';
import KnowledgeView from './components/KnowledgeView';
import CheckerView from './components/CheckerView';
import QuizView from './components/QuizView';
import ReportView from './components/ReportView';
import CabinView from './components/CabinView';

import { INITIAL_NEWS, FRAUD_SCHEMES, KNOWLEDGE_ARTICLES, QUIZZES, INITIAL_REPORTS } from './data';
import { NewsArticle, FraudScheme } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Core database states
  const [news] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [schemes] = useState<FraudScheme[]>(FRAUD_SCHEMES);
  const [articles] = useState(KNOWLEDGE_ARTICLES);
  const [quizzes] = useState(QUIZZES);

  // Expanded focus states
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<FraudScheme | null>(null);

  // Persistent user learning checklists
  const [safetyChecklists, setSafetyChecklists] = useState<{ [key: string]: boolean }>({});
  // Persistent user profile barrier toggles
  const [profileSwitches, setProfileSwitches] = useState<{ [key: string]: boolean }>({});
  // Persistent completed quizzes tracker
  const [completedQuizzes, setCompletedQuizzes] = useState<{ [key: string]: boolean }>({});
  
  // Reported count state (for counting submissions)
  const [reportsCount, setReportsCount] = useState(INITIAL_REPORTS.length);

  // Load persistence states from localStorage on startup
  useEffect(() => {
    try {
      const savedChecklists = localStorage.getItem('sunbee_checklists');
      if (savedChecklists) setSafetyChecklists(JSON.parse(savedChecklists));

      const savedSwitches = localStorage.getItem('sunbee_profile_switches');
      if (savedSwitches) setProfileSwitches(JSON.parse(savedSwitches));

      const savedQuizzesStatus = localStorage.getItem('sunbee_completed_quizzes');
      if (savedQuizzesStatus) setCompletedQuizzes(JSON.parse(savedQuizzesStatus));

      const savedReports = localStorage.getItem('sunbee_reports');
      if (savedReports) {
        const parsed = JSON.parse(savedReports);
        setReportsCount(parsed.length);
      }
    } catch (e) {
      console.warn('Error reloading localStorage values in App.tsx: ', e);
    }
  }, [activeTab]); // re-verify items count when tabs shift because reports registry updates

  // Toggling Checklists
  const toggleChecklist = (key: string) => {
    const updated = { ...safetyChecklists, [key]: !safetyChecklists[key] };
    setSafetyChecklists(updated);
    localStorage.setItem('sunbee_checklists', JSON.stringify(updated));
  };

  // Toggling Profile Switches
  const toggleProfileSwitch = (key: string) => {
    const updated = { ...profileSwitches, [key]: !profileSwitches[key] };
    setProfileSwitches(updated);
    localStorage.setItem('sunbee_profile_switches', JSON.stringify(updated));
  };

  // Completed Quizzes
  const handleCompleteQuiz = (correctCount: number, totalQuestions: number) => {
    // Generate simple rating criteria
    if (correctCount >= Math.ceil(totalQuestions / 2)) {
      const activeQuizId = quizzes.find(q => q.questions.length === totalQuestions)?.id || 'generic-quiz';
      const updated = { ...completedQuizzes, [activeQuizId]: true };
      setCompletedQuizzes(updated);
      localStorage.setItem('sunbee_completed_quizzes', JSON.stringify(updated));
    }
  };

  // Interactive dynamic score resolver math formula
  const computeSafetyScore = () => {
    let score = 15; // base level of entry

    // Calculated checklists (each checked item grants +8, max 40)
    const checklistCount = Object.values(safetyChecklists).filter(Boolean).length;
    score += Math.min(checklistCount * 8, 40);

    // Calculated profile switches (each toggled secure factor grants +10, max 40)
    const activeSwitchesCount = Object.values(profileSwitches).filter(Boolean).length;
    score += Math.min(activeSwitchesCount * 10, 40);

    // Calculated quizzes resolved (+15 for each completed quiz, max 30)
    const processedQuizzesCount = Object.values(completedQuizzes).filter(Boolean).length;
    score += Math.min(processedQuizzesCount * 15, 30);

    return Math.min(score, 100);
  };

  const currentSafetyScore = computeSafetyScore();

  // Helper selectors to simplify jumping between categories from buttons
  const navigateToArticleDetail = (art: NewsArticle) => {
    setSelectedArticle(art);
    setActiveTab('news');
  };

  const navigateToSchemeDetail = (sch: FraudScheme) => {
    setSelectedScheme(sch);
    setActiveTab('catalog');
  };

  const completedChecklistsCount = Object.values(safetyChecklists).filter(Boolean).length;
  const completedQuizzesCount = Object.values(completedQuizzes).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-bee-black text-slate-100 flex flex-col relative overflow-hidden selection:bg-bee-yellow selection:text-bee-black">
      
      {/* Atmospheric Background Glow Elements from the Immersive UI theme */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* 1. Navigational Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // clear temporal detail views on route change
          if (tab !== 'news') setSelectedArticle(null);
          if (tab !== 'catalog') setSelectedScheme(null);
        }} 
        safetyScore={currentSafetyScore}
      />

      {/* 2. Main content router layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {activeTab === 'home' && (
          <HomeView 
            news={news} 
            schemes={schemes} 
            setActiveTab={setActiveTab}
            onSelectArticle={navigateToArticleDetail}
            onSelectScheme={navigateToSchemeDetail}
          />
        )}

        {activeTab === 'news' && (
          <NewsView 
            news={news} 
            selectedArticle={selectedArticle}
            setSelectedArticle={setSelectedArticle}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView 
            schemes={schemes} 
            selectedScheme={selectedScheme}
            setSelectedScheme={setSelectedScheme}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeView 
            articles={articles} 
            safetyChecklists={safetyChecklists}
            toggleChecklist={toggleChecklist}
          />
        )}

        {activeTab === 'checker' && (
          <CheckerView 
            onSelectCategory={(tab) => {
              setActiveTab(tab);
            }} 
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView 
            quizzes={quizzes} 
            onCompleteQuiz={handleCompleteQuiz}
            completedQuizzes={completedQuizzes}
          />
        )}

        {activeTab === 'report' && (
          <ReportView />
        )}

        {activeTab === 'cabin' && (
          <CabinView 
            safetyScore={currentSafetyScore}
            completedChecklistsCount={completedChecklistsCount}
            completedQuizzesCount={completedQuizzesCount}
            submittedReportsCount={reportsCount}
            profileSwitches={profileSwitches}
            toggleProfileSwitch={toggleProfileSwitch}
          />
        )}

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-bee-border bg-bee-black/30 py-8 text-center text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div>🐝 SunBee Cybersecurity Hub. Все права защищены, 2026.</div>
          <div className="text-[10px] text-gray-700">Используйте официальные личные барьеры. Никакая система безопасности не защищает лучше собственной информированности.</div>
        </div>
      </footer>

    </div>
  );
}
