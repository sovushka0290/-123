import React, { useState } from 'react';
import { HelpCircle, Shield, Award, CheckCircle2, XCircle, ArrowRight, RefreshCw, Bookmark, Sparkles } from 'lucide-react';
import { Quiz, QuizQuestion } from '../types';

interface QuizViewProps {
  quizzes: Quiz[];
  onCompleteQuiz: (correctCount: number, totalQuestions: number) => void;
  completedQuizzes: { [key: string]: boolean };
}

export default function QuizView({ quizzes, onCompleteQuiz, completedQuizzes }: QuizViewProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = (qz: Quiz) => {
    setSelectedQuiz(qz);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (optIndex: number) => {
    if (answered) return;
    setSelectedOpt(optIndex);
    setAnswered(true);

    const question = selectedQuiz!.questions[currentIdx];
    if (optIndex === question.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < selectedQuiz!.questions.length) {
      setCurrentIdx(nextIdx);
      setSelectedOpt(null);
      setAnswered(false);
    } else {
      setQuizFinished(true);
      onCompleteQuiz(score, selectedQuiz!.questions.length);
    }
  };

  const exitQuiz = () => {
    setSelectedQuiz(null);
  };

  return (
    <div className="py-6 font-sans max-w-4xl mx-auto" id="quiz-tab-view">
      
      {/* 1. If no quiz has been selected (List of all quizes) */}
      {!selectedQuiz ? (
        <div className="space-y-6">
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white">Интерактивный Кибер-Квиз</h1>
            <p className="text-xs text-gray-500">Проверьте теоретические навыки распознавания уловок мошенников. Каждый пройденный тест повышает ваш уровень цифровой защиты!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((qz) => {
              const isFinishedAlready = !!completedQuizzes[qz.id];
              return (
                <div
                  key={qz.id}
                  className="bg-bee-dark border border-bee-border rounded-2xl p-6 flex flex-col justify-between hover:border-bee-yellow/40 transition group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-bee-yellow border border-yellow-500/20 flex items-center justify-center font-bold">
                        🐝
                      </div>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                        isFinishedAlready ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-gray-500'
                      }`}>
                        {isFinishedAlready ? 'Пройдено ✓' : 'Доступно'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-md font-bold text-white group-hover:text-bee-yellow transition leading-snug">{qz.title}</h3>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{qz.description}</p>
                    </div>

                    <div className="text-[10px] font-mono text-gray-500">
                      Всего вопросов: <strong className="text-gray-300">{qz.questions.length}</strong> | Время на прохождение: ~2 мин
                    </div>
                  </div>

                  <button
                    onClick={() => startQuiz(qz)}
                    className="w-full mt-6 py-2.5 bg-bee-yellow hover:bg-bee-yellow-light text-bee-black font-extrabold rounded-xl transition text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isFinishedAlready ? 'Пройти повторно' : 'Запустить Квиз'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-bee-dark to-yellow-950/20 p-5 rounded-2xl border border-bee-yellow/20 flex gap-3 items-start max-w-2xl mx-auto">
            <Sparkles className="w-8 h-8 text-bee-yellow shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 leading-relaxed">
              <strong>Почему игровые тесты важны?</strong> Обучение через ошибки в искусственной тестовой среде помогает развить мышечную память цифровой настороженности. Ошибайтесь здесь, чтобы никогда не ошибиться при реальном звонке или письме!
            </div>
          </div>
        </div>
      ) : (
        /* 2. Active Quiz State Execution */
        <div className="bg-bee-dark rounded-3xl border border-bee-border p-6 md:p-8 space-y-6">
          
          {/* Active Header bar progress */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold text-bee-yellow font-display uppercase tracking-wider">{selectedQuiz.title}</h3>
              <p className="text-xs text-gray-500">
                {!quizFinished && `Вопрос ${currentIdx + 1} из ${selectedQuiz.questions.length}`}
              </p>
            </div>
            <button
              onClick={exitQuiz}
              className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1 bg-white/5 rounded-lg transition hover:bg-white/10 cursor-pointer"
            >
              Выйти к списку
            </button>
          </div>

          {/* If the active quiz isn't completed yet */}
          {!quizFinished ? (
            <div className="space-y-6 font-sans">
              
              {/* Question text */}
              <div className="bg-bee-black p-5 rounded-2xl border border-white/5 flex gap-3 text-xs md:text-sm">
                <HelpCircle className="w-5 h-5 text-bee-yellow shrink-0 mt-0.5" />
                <h4 className="font-bold text-white leading-relaxed">
                  {selectedQuiz.questions[currentIdx].text}
                </h4>
              </div>

              {/* Options selectors */}
              <div className="space-y-3">
                {selectedQuiz.questions[currentIdx].options.map((opt, idx) => {
                  const isCorrectIdx = idx === selectedQuiz.questions[currentIdx].correctIndex;
                  const isSelectedIdx = idx === selectedOpt;
                  
                  let styleClass = 'bg-bee-black hover:bg-bee-card border-white/5 text-gray-300 hover:border-bee-yellow/40';
                  
                  if (answered) {
                    if (isCorrectIdx) {
                      styleClass = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 font-bold';
                    } else if (isSelectedIdx) {
                      styleClass = 'bg-rose-950/40 border-rose-500/40 text-rose-200';
                    } else {
                      styleClass = 'bg-bee-black/40 border-white/5 text-gray-500 pointer-events-none opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={answered}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs md:text-sm flex gap-3 items-start leading-relaxed ${
                        answered ? 'cursor-default' : 'cursor-pointer'
                      } ${styleClass}`}
                    >
                      <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center font-bold text-xs ${
                        answered 
                          ? isCorrectIdx ? 'bg-emerald-500 border-transparent text-black' : isSelectedIdx ? 'bg-rose-500 border-transparent text-black' : 'border-gray-500 text-gray-500'
                          : 'border-white/20 text-gray-400'
                      }`}>
                        {answered ? isCorrectIdx ? '✓' : isSelectedIdx ? '✗' : String.fromCharCode(65 + idx) : String.fromCharCode(65 + idx)}
                      </div>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation / Rationale after answering */}
              {answered && (
                <div className="bg-bee-black/60 p-5 rounded-2xl border border-white/5 space-y-2 animate-fade-in">
                  <div className="text-xs font-mono font-bold text-bee-yellow uppercase flex items-center gap-1">
                    <Shield className="w-4 h-4 text-bee-yellow" /> Экспертный разбор ситуации:
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed text-justify">
                    {selectedQuiz.questions[currentIdx].explanation}
                  </p>
                  
                  {/* Next triggering button */}
                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-5 py-2 bg-bee-yellow hover:bg-bee-yellow-light text-bee-black font-extrabold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      Далее <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* 3. Final Score Summary screen for the active quiz */
            <div className="text-center py-8 space-y-6 font-sans">
              
              <div className="relative inline-block">
                <Award className="w-16 h-16 text-bee-yellow mx-auto animate-bounce" />
                <span className="absolute bottom-0 right-2 bg-emerald-500 text-black font-bold text-xs px-1.5 py-0.5 rounded-full">
                  {score}/{selectedQuiz.questions.length}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold font-display text-white">Тест Завершен!</h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Вы правильно ответили на <strong className="text-white">{score}</strong> из {selectedQuiz.questions.length} ситуаций. Наш алгоритм обновил вашу карту цифровой защищенности.
                </p>
              </div>

              {/* Quality Verdict container */}
              <div className="bg-bee-black border border-white/5 max-w-md mx-auto p-4 rounded-xl text-xs text-gray-300 leading-relaxed">
                {score === selectedQuiz.questions.length ? (
                  <span className="text-emerald-400 font-bold block mb-1">🐝 Мастерский результат!</span>
                ) : score >= 2 ? (
                  <span className="text-bee-yellow font-bold block mb-1">👍 Отличные базовые знания!</span>
                ) : (
                  <span className="text-rose-400 font-bold block mb-1">⚠️ Высокие риски мошенничества!</span>
                )}
                Разбор ответов и аналитика занесены в ваш личный кабинет. Вы можете перепройти этот квиз в любое время для закрепления.
              </div>

              <div>
                <button
                  onClick={exitQuiz}
                  className="px-6 py-2.5 bg-bee-yellow hover:bg-bee-yellow-light text-bee-black font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Вернуться во все квизы
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
