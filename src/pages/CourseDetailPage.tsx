import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, PlayCircle, CheckCircle2, Circle, Clock,
  BookOpen, Lock, ChevronDown, ChevronRight, Star, Award, User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Course, Module, Lesson, LessonProgress, Quiz, QuizQuestion, QuizAttempt } from '@/types/database';

type ModuleWithLessons = Module & { lessons: Lesson[] };

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moduleQuizzes, setModuleQuizzes] = useState<Record<string, Quiz[]>>({});
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    setError(null);
    const { data: courseData, error: courseErr } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (courseErr || !courseData) {
      setError('Course not found');
      setLoading(false);
      return;
    }

    setCourse(courseData as Course);

    const { data: moduleData } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', (courseData as Course).id)
      .order('order_index', { ascending: true });

    const moduleList = (moduleData ?? []) as Module[];
    const modulesWithLessons: ModuleWithLessons[] = [];

    for (const mod of moduleList) {
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', mod.id)
        .order('order_index', { ascending: true });
      modulesWithLessons.push({ ...mod, lessons: (lessonData ?? []) as Lesson[] });
    }

    setModules(modulesWithLessons);

    // Load quizzes for each module
    const quizMap: Record<string, Quiz[]> = {};
    for (const mod of moduleList) {
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('module_id', mod.id)
        .order('order_index', { ascending: true });
      if (quizData && quizData.length > 0) {
        quizMap[mod.id] = quizData as Quiz[];
      }
    }
    setModuleQuizzes(quizMap);

    if (user) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', (courseData as Course).id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (enrollment) {
        setEnrollmentId(enrollment.id);

        const allLessonIds = modulesWithLessons.flatMap((m) => m.lessons.map((l) => l.id));
        if (allLessonIds.length > 0) {
          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('lesson_id', allLessonIds);

          const progressMap: Record<string, LessonProgress> = {};
          for (const p of (progressData ?? []) as LessonProgress[]) {
            progressMap[p.lesson_id] = p;
          }
          setProgress(progressMap);

          const firstIncomplete = modulesWithLessons
            .flatMap((m) => m.lessons)
            .find((l) => !progressMap[l.id]?.is_completed);
          if (firstIncomplete) {
            setActiveLesson(firstIncomplete);
            setExpandedModule(firstIncomplete.module_id);
          } else if (modulesWithLessons[0]?.lessons[0]) {
            setActiveLesson(modulesWithLessons[0].lessons[0]);
            setExpandedModule(modulesWithLessons[0].id);
          }
        }
      } else if (modulesWithLessons[0]?.lessons[0]) {
        setActiveLesson(modulesWithLessons[0].lessons[0]);
        setExpandedModule(modulesWithLessons[0].id);
      }
    } else if (modulesWithLessons[0]?.lessons[0]) {
      setActiveLesson(modulesWithLessons[0].lessons[0]);
      setExpandedModule(modulesWithLessons[0].id);
    }

    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!user || !course) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    const { data, error: enrollErr } = await supabase
      .from('enrollments')
      .insert({ user_id: user.id, course_id: course.id })
      .select('id')
      .single();

    setEnrolling(false);
    if (enrollErr) {
      if (enrollErr.code === '23505') {
        // Already enrolled
        loadCourse();
      } else {
        setError(enrollErr.message);
      }
    } else if (data) {
      setEnrollmentId(data.id);
    }
  };

  const markComplete = useCallback(async (lesson: Lesson) => {
    if (!user || !enrollmentId) return;
    const existing = progress[lesson.id];

    if (existing) {
      const newCompleted = !existing.is_completed;
      const { data } = await supabase
        .from('lesson_progress')
        .update({
          is_completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('*')
        .single();

      if (data) {
        setProgress((prev) => ({ ...prev, [lesson.id]: data as LessonProgress }));
      }
    } else {
      const { data } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: lesson.id,
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (data) {
        setProgress((prev) => ({ ...prev, [lesson.id]: data as LessonProgress }));
      }
    }
  }, [user, enrollmentId, progress]);

  const selectLesson = async (lesson: Lesson) => {
    if (!enrollmentId) return;
    setActiveLesson(lesson);

    if (user && !progress[lesson.id]) {
      const { data } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: lesson.id,
          is_completed: false,
          last_accessed_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (data) {
        setProgress((prev) => ({ ...prev, [lesson.id]: data as LessonProgress }));
      }
    } else if (user && progress[lesson.id]) {
      await supabase
        .from('lesson_progress')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('id', progress[lesson.id].id);
    }
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = Object.values(progress).filter((p) => p.is_completed).length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const startQuiz = async (quiz: Quiz) => {
    setQuizLoading(true);
    const { data: qData } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('order_index', { ascending: true });
    setQuizQuestions((qData ?? []) as QuizQuestion[]);
    setQuizAnswers({});
    setQuizResult(null);
    setActiveQuiz(quiz);

    if (user) {
      const { data: attData } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quiz.id)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });
      setQuizAttempts((attData ?? []) as QuizAttempt[]);
    }
    setQuizLoading(false);
  };

  const submitQuiz = async () => {
    if (!activeQuiz || !user || quizQuestions.length === 0) return;
    let score = 0;
    let total = 0;
    for (const q of quizQuestions) {
      total += q.points;
      if (quizAnswers[q.id] === q.correct_answer) score += q.points;
    }
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = pct >= activeQuiz.passing_score;

    const { data } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: activeQuiz.id,
        user_id: user.id,
        score,
        total_points: total,
        passed,
        answers: quizAnswers,
        completed_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (data) {
      setQuizAttempts((prev) => [data as QuizAttempt, ...prev]);
    }
    setQuizResult({ score, total, passed });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-32 animate-shimmer shimmer-bg rounded-lg" />
        <div className="mt-6 h-64 animate-shimmer shimmer-bg rounded-2xl" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <BookOpen className="mx-auto h-12 w-12 text-ink-300" />
        <h1 className="mt-4 text-xl font-semibold text-ink-700">{error || 'Course not found'}</h1>
        <Link to="/courses" className="btn-primary mt-4">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </Link>

      {/* Course Header */}
      <div className="mt-4 overflow-hidden rounded-2xl bg-ink-950">
        {course.thumbnail_url && (
          <div className="relative h-48 overflow-hidden sm:h-64">
            <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-brand-600 text-white">{course.category}</span>
                <span className="badge bg-white/20 text-white capitalize">{course.level}</span>
              </div>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{course.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-ink-300">{course.short_description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-400">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {course.instructor_name}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {totalLessons} lessons</span>
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> 4.8</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Lesson Content */}
        <div className="lg:col-span-2">
          {!enrollmentId ? (
            <div className="card p-8 text-center">
              <Lock className="mx-auto h-10 w-10 text-brand-500" />
              <h2 className="mt-4 text-lg font-semibold text-ink-900">Enroll to Start Learning</h2>
              <p className="mt-1 text-sm text-ink-500">Get full access to all {totalLessons} lessons in this course.</p>
              <button onClick={handleEnroll} disabled={enrolling} className="btn-primary mt-4">
                {enrolling ? 'Enrolling...' : `Enroll for $${course.price}`}
              </button>
              <p className="mt-3 text-xs text-ink-400">Instant access. No waiting.</p>
            </div>
          ) : activeLesson ? (
            <div className="card p-6 animate-fade-in">
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <span className="capitalize">{course.category}</span>
                <ChevronRight className="h-3 w-3 rtl-flip" />
                <span>{modules.find((m) => m.id === activeLesson.module_id)?.title}</span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-ink-900">{activeLesson.title}</h2>
              <div className="mt-2 flex items-center gap-3 text-sm text-ink-400">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {activeLesson.duration_minutes} min</span>
                <span className="capitalize">{activeLesson.content_type}</span>
              </div>

              {activeLesson.content_type === 'video' && activeLesson.video_url ? (
                <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-ink-900">
                  <video src={activeLesson.video_url} controls className="h-full w-full" />
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/50 p-6">
                  <p className="leading-relaxed text-ink-700 whitespace-pre-line">{activeLesson.content}</p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
                <button
                  onClick={() => markComplete(activeLesson)}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                    progress[activeLesson.id]?.is_completed
                      ? 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {progress[activeLesson.id]?.is_completed ? (
                    <><CheckCircle2 className="h-4 w-4" /> Completed</>
                  ) : (
                    <><Circle className="h-4 w-4" /> Mark as Complete</>
                  )}
                </button>

                <div className="flex gap-2">
                  {(() => {
                    const allLessons = modules.flatMap((m) => m.lessons);
                    const idx = allLessons.findIndex((l) => l.id === activeLesson.id);
                    return (
                      <>
                        {idx > 0 && (
                          <button
                            onClick={() => selectLesson(allLessons[idx - 1])}
                            className="btn-secondary"
                          >
                            <ArrowLeft className="h-4 w-4" /> Previous
                          </button>
                        )}
                        {idx < allLessons.length - 1 && (
                          <button
                            onClick={() => selectLesson(allLessons[idx + 1])}
                            className="btn-primary"
                          >
                            Next <ChevronRight className="h-4 w-4 rtl-flip" />
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-sm text-ink-500">No lessons available yet.</p>
            </div>
          )}

          {/* Quiz Panel */}
          {activeQuiz && enrollmentId && (
            <div className="mt-6 card p-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink-900">{activeQuiz.title}</h3>
                  <p className="text-sm text-ink-500">{activeQuiz.description}</p>
                </div>
                <button onClick={() => { setActiveQuiz(null); setQuizResult(null); }} className="text-sm text-ink-400 hover:text-ink-700">
                  Close
                </button>
              </div>

              {quizLoading ? (
                <div className="mt-6 h-40 animate-shimmer shimmer-bg rounded-xl" />
              ) : quizResult ? (
                <div className="mt-6 text-center">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${quizResult.passed ? 'bg-accent-100' : 'bg-amber-100'}`}>
                    <span className="text-2xl font-bold {quizResult.passed ? 'text-accent-600' : 'text-amber-600'}">{Math.round((quizResult.score / quizResult.total) * 100)}%</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink-900">
                    {quizResult.passed ? 'Congratulations! You passed!' : 'Keep practicing — try again!'}
                  </p>
                  <p className="text-xs text-ink-500">Score: {quizResult.score} / {quizResult.total}</p>
                  <button onClick={() => startQuiz(activeQuiz)} className="btn-secondary mt-4">Retake Quiz</button>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {quizAttempts.length >= activeQuiz.max_attempts && (
                    <div className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
                      You have used all {activeQuiz.max_attempts} attempts. Maximum attempts reached.
                    </div>
                  )}
                  {quizQuestions.map((q, i) => (
                    <div key={q.id} className="rounded-xl border border-ink-100 p-4">
                      <p className="text-sm font-semibold text-ink-900">{i + 1}. {q.question_text}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {(['a', 'b', 'c', 'd'] as const).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                            className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                              quizAnswers[q.id] === opt
                                ? 'border-brand-500 bg-brand-50 text-brand-700'
                                : 'border-ink-200 text-ink-600 hover:border-brand-300'
                            }`}
                          >
                            <span className="font-medium uppercase mr-2">{opt})</span>
                            {q[`option_${opt}` as keyof QuizQuestion] as string}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < quizQuestions.length || quizAttempts.length >= activeQuiz.max_attempts}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Quiz ({Object.keys(quizAnswers).length}/{quizQuestions.length} answered)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Course Description */}
          <div className="mt-6 card p-6">
            <h3 className="text-lg font-semibold text-ink-900">About This Course</h3>
            <p className="mt-3 leading-relaxed text-ink-600">{course.description}</p>
          </div>
        </div>

        {/* Sidebar: Curriculum + Progress */}
        <div className="lg:col-span-1">
          {enrollmentId && (
            <div className="card mb-4 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink-900">Your Progress</h3>
                <span className="text-sm font-bold text-brand-600">{progressPct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="mt-2 text-xs text-ink-500">{completedLessons} of {totalLessons} lessons completed</p>
              {progressPct === 100 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-700">
                  <Award className="h-4 w-4" /> Course completed! Congratulations!
                </div>
              )}
            </div>
          )}

          <div className="card overflow-hidden">
            <div className="border-b border-ink-100 p-4">
              <h3 className="text-sm font-semibold text-ink-900">Course Curriculum</h3>
              <p className="mt-0.5 text-xs text-ink-500">{modules.length} modules &middot; {totalLessons} lessons</p>
            </div>

            <div className="divide-y divide-ink-100">
              {modules.map((mod) => (
                <div key={mod.id}>
                  <button
                    onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                    className="flex w-full items-center justify-between p-4 text-left hover:bg-ink-50/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink-900">{mod.title}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {mod.lessons.length} lessons
                        {moduleQuizzes[mod.id] && moduleQuizzes[mod.id].length > 0 && (
                          <span className="ml-1 text-brand-600">· {moduleQuizzes[mod.id].length} quiz{moduleQuizzes[mod.id].length > 1 ? 'zes' : ''}</span>
                        )}
                      </p>
                    </div>
                    {expandedModule === mod.id ? <ChevronDown className="h-4 w-4 text-ink-400" /> : <ChevronRight className="h-4 w-4 text-ink-400" />}
                  </button>

                  {expandedModule === mod.id && (
                    <div className="bg-ink-50/30 px-2 pb-2">
                      {mod.lessons.map((lesson) => {
                        const isCompleted = progress[lesson.id]?.is_completed;
                        const isActive = activeLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => enrollmentId && selectLesson(lesson)}
                            disabled={!enrollmentId}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all ${
                              isActive ? 'bg-brand-50' : 'hover:bg-ink-50'
                            } ${!enrollmentId ? 'cursor-not-allowed opacity-60' : ''}`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-500" />
                            ) : enrollmentId ? (
                              <PlayCircle className="h-4 w-4 shrink-0 text-ink-400" />
                            ) : (
                              <Lock className="h-4 w-4 shrink-0 text-ink-300" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${isActive ? 'font-semibold text-brand-700' : 'text-ink-700'}`}>{lesson.title}</p>
                              <p className="text-xs text-ink-400">{lesson.duration_minutes} min</p>
                            </div>
                          </button>
                        );
                      })}
                      {/* Quiz link for this module */}
                      {moduleQuizzes[mod.id]?.map((quiz) => (
                        <button
                          key={quiz.id}
                          onClick={() => startQuiz(quiz)}
                          className="flex w-full items-center gap-2.5 rounded-lg bg-brand-50/50 px-3 py-2.5 text-left transition-all hover:bg-brand-50"
                        >
                          <Award className="h-4 w-4 shrink-0 text-brand-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-brand-700">{quiz.title}</p>
                            <p className="text-xs text-ink-400">Pass: {quiz.passing_score}% · Max {quiz.max_attempts} attempts</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
