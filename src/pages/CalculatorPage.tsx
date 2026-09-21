import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Calculator, Clock, CheckCircle2, XCircle, RefreshCw,
  Trophy, Zap, Brain, Target, TrendingUp, Play, Award,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'mixed';
type Difficulty = 'easy' | 'medium' | 'hard';
type MathOp = '+' | '-' | '×';

type Question = {
  a: number;
  b: number;
  op: MathOp;
  answer: number;
  options: number[];
};

const DIFFICULTY_CONFIG: Record<Difficulty, { min: number; max: number; time: number }> = {
  easy: { min: 1, max: 20, time: 60 },
  medium: { min: 10, max: 99, time: 90 },
  hard: { min: 50, max: 999, time: 120 },
};

function generateQuestion(op: Operation, difficulty: Difficulty): Question {
  const config = DIFFICULTY_CONFIG[difficulty];
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  let actualOp: MathOp;
  if (op === 'mixed') {
    const ops: MathOp[] = ['+', '-', '×'];
    actualOp = ops[Math.floor(Math.random() * ops.length)];
  } else if (op === 'addition') {
    actualOp = '+';
  } else if (op === 'subtraction') {
    actualOp = '-';
  } else {
    actualOp = '×';
  }

  let a = rand(config.min, config.max);
  let b = rand(config.min, config.max);
  let answer: number;

  switch (actualOp) {
    case '+':
      answer = a + b;
      break;
    case '-':
      if (b > a) [a, b] = [b, a];
      answer = a - b;
      break;
    case '×':
      if (difficulty === 'easy') { a = rand(1, 10); b = rand(1, 10); }
      else if (difficulty === 'medium') { a = rand(2, 15); b = rand(2, 15); }
      answer = a * b;
      break;
    default:
      answer = a + b;
  }

  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = rand(-10, 10);
    if (offset !== 0) options.add(Math.max(0, answer + offset));
  }

  return {
    a, b, op: actualOp, answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  };
}

export default function CalculatorPage() {
  const { user } = useAuth();
  const [operation, setOperation] = useState<Operation>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [playing, setPlaying] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [totalSessions, setTotalSessions] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (user) {
      supabase
        .from('practice_sessions')
        .select('score, total_questions')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setTotalSessions(data.length);
            const best = data.reduce((max, s) => Math.max(max, s.score), 0);
            setBestScore(best);
          }
        });
    }
  }, [user]);

  const startGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const newQuestions = Array.from({ length: 10 }, () => generateQuestion(operation, difficulty));
    setQuestions(newQuestions);
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setFinished(false);
    setTimeLeft(config.time);
    setPlaying(true);
    startTimeRef.current = Date.now();
  }, [operation, difficulty]);

  useEffect(() => {
    if (!playing || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFinished(true);
          setPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, finished]);

  const handleAnswer = (answer: number) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === questions[currentIdx].answer) {
      setScore((s) => s + 1);
    }
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setFinished(true);
        setPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 800);
  };

  const saveSession = async () => {
    if (!user) return;
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    await supabase.from('practice_sessions').insert({
      user_id: user.id,
      session_type: operation,
      difficulty,
      score,
      total_questions: questions.length,
      time_seconds: elapsed,
    });
    setTotalSessions((s) => s + 1);
    if (bestScore === null || score > bestScore) setBestScore(score);
  };

  useEffect(() => {
    if (finished) saveSession();
  }, [finished]);

  const opLabels: Record<Operation, string> = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    mixed: 'Mixed',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
          <Calculator className="h-6 w-6 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink-900">ZMC Mental Math Trainer</h1>
          <p className="text-sm text-ink-500">Practice mental calculation with the Zargelin Mathematical Chain approach</p>
        </div>
      </div>

      {/* Stats */}
      {user && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <Trophy className="mx-auto h-5 w-5 text-amber-500" />
            <p className="mt-2 text-xl font-bold text-ink-900">{bestScore ?? '—'}</p>
            <p className="text-xs text-ink-500">Best Score</p>
          </div>
          <div className="card p-4 text-center">
            <Zap className="mx-auto h-5 w-5 text-brand-500" />
            <p className="mt-2 text-xl font-bold text-ink-900">{totalSessions}</p>
            <p className="text-xs text-ink-500">Sessions</p>
          </div>
          <div className="card p-4 text-center">
            <Target className="mx-auto h-5 w-5 text-accent-500" />
            <p className="mt-2 text-xl font-bold text-ink-900">{bestScore !== null ? `${Math.round((bestScore / 10) * 100)}%` : '—'}</p>
            <p className="text-xs text-ink-500">Best Accuracy</p>
          </div>
        </div>
      )}

      {!playing && !finished && (
        /* Setup Screen */
        <div className="mt-6 card p-8">
          <h2 className="text-lg font-semibold text-ink-900">Configure Your Practice</h2>
          <p className="mt-1 text-sm text-ink-500">Choose an operation and difficulty level to begin.</p>

          <div className="mt-6">
            <label className="text-sm font-medium text-ink-700">Operation Type</label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.keys(opLabels) as Operation[]).map((op) => (
                <button
                  key={op}
                  onClick={() => setOperation(op)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                    operation === op
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-ink-200 text-ink-600 hover:border-brand-300'
                  }`}
                >
                  {opLabels[op]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-ink-700">Difficulty</label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition-all ${
                    difficulty === diff
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-ink-200 text-ink-600 hover:border-brand-300'
                  }`}
                >
                  {diff}
                  <span className="block text-xs font-normal text-ink-400">{DIFFICULTY_CONFIG[diff].max} max</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg bg-ink-50 px-4 py-3 text-sm text-ink-600">
            <Clock className="h-4 w-4 text-ink-400" />
            <span>Time limit: <span className="font-semibold">{DIFFICULTY_CONFIG[difficulty].time} seconds</span> · 10 questions</span>
          </div>

          <button onClick={startGame} className="mt-6 btn-primary w-full">
            <Play className="h-4 w-4" /> Start Practice
          </button>
        </div>
      )}

      {playing && !finished && questions.length > 0 && (
        /* Game Screen */
        <div className="mt-6">
          {/* Progress bar */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink-700">Question {currentIdx + 1} of {questions.length}</span>
              <span className="text-sm text-ink-500">Score: <span className="font-bold text-accent-600">{score}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-ink-400" />
              <span className={`font-mono text-sm font-bold ${timeLeft <= 10 ? 'text-error-600' : 'text-ink-700'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all" style={{ width: `${((currentIdx) / questions.length) * 100}%` }} />
          </div>

          {/* Question */}
          <div className="mt-6 card p-8 text-center">
            <p className="text-sm text-ink-500">Solve this problem</p>
            <div className="mt-4 font-display text-5xl font-extrabold text-ink-900 sm:text-6xl">
              {questions[currentIdx].a} {questions[currentIdx].op} {questions[currentIdx].b} = ?
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {questions[currentIdx].options.map((opt) => {
                const isCorrect = opt === questions[currentIdx].answer;
                const isSelected = opt === selectedAnswer;
                let style = 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50';
                if (showResult) {
                  if (isCorrect) style = 'border-accent-500 bg-accent-50 text-accent-700';
                  else if (isSelected) style = 'border-error-500 bg-error-50 text-error-700';
                  else style = 'border-ink-100 text-ink-400';
                }
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={showResult}
                    className={`rounded-xl border-2 px-4 py-4 text-xl font-bold transition-all ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {selectedAnswer === questions[currentIdx].answer ? (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                    <CheckCircle2 className="h-5 w-5" /> Correct!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-error-600">
                    <XCircle className="h-5 w-5" /> Answer: {questions[currentIdx].answer}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {finished && (
        /* Results Screen */
        <div className="mt-6 card p-8 text-center">
          {score >= 8 ? (
            <Award className="mx-auto h-14 w-14 text-amber-500" />
          ) : score >= 6 ? (
            <TrendingUp className="mx-auto h-14 w-14 text-brand-500" />
          ) : (
            <Brain className="mx-auto h-14 w-14 text-ink-400" />
          )}
          <h2 className="mt-4 text-2xl font-bold text-ink-900">
            {score >= 8 ? 'Excellent!' : score >= 6 ? 'Good Job!' : 'Keep Practicing!'}
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            You scored <span className="font-bold text-ink-900">{score}</span> out of{' '}
            <span className="font-bold text-ink-900">{questions.length}</span>
            {' '}({Math.round((score / questions.length) * 100)}%)
          </p>

          <div className="mx-auto mt-6 max-w-xs">
            <div className="h-3 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-700" style={{ width: `${(score / questions.length) * 100}%` }} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={startGame} className="btn-primary">
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
