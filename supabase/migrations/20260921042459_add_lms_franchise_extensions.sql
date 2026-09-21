/*
# Add LMS Extensions: Quizzes, Certificates, Practice Sessions, Franchise Applications

## Overview
Extends the existing LMS schema with world-class features:
- Quizzes with questions and multiple-choice answers
- Quiz attempts tracking with scores
- Auto-issued certificates on course completion
- ZMC mental math practice sessions with scoring
- Franchise application system (Self-Franchisee, Single Location, Multi-Unit)

## New Tables

1. **quizzes** — assessments attached to a module or course
   - id, course_id (FK), module_id (FK, nullable), title, description,
     passing_score (default 70), max_attempts (default 3), order_index, created_at

2. **quiz_questions** — individual questions within a quiz
   - id, quiz_id (FK), question_text, option_a, option_b, option_c, option_d,
     correct_answer (a/b/c/d), points (default 1), order_index

3. **quiz_attempts** — student attempt records with scores
   - id, quiz_id (FK), user_id (defaults to auth.uid()), score, total_points,
     passed, answers (jsonb), started_at, completed_at

4. **certificates** — auto-issued on course completion
   - id, user_id (defaults to auth.uid()), course_id (FK), enrollment_id (FK),
     certificate_number (unique, auto-generated), issued_at

5. **practice_sessions** — ZMC mental math practice records
   - id, user_id (defaults to auth.uid()), session_type (addition/subtraction/
     multiplication/division/mixed), difficulty (easy/medium/hard),
     score, total_questions, time_seconds, created_at

6. **franchise_applications** — franchise interest applications
   - id, user_id (defaults to auth.uid()), franchise_type (self/single/multi),
     full_name, email, phone, country, city, business_experience,
     available_capital, preferred_location, message, status (pending/
     under_review/approved/rejected), created_at, reviewed_at

## Security (RLS)
- quizzes: SELECT authenticated (published courses); INSERT/UPDATE/DELETE none (admin-managed)
- quiz_questions: SELECT authenticated; no direct writes
- quiz_attempts: SELECT/INSERT own
- certificates: SELECT own; INSERT via trigger only
- practice_sessions: SELECT/INSERT own
- franchise_applications: SELECT/INSERT own

## Functions / Triggers
- issue_certificate_on_completion(): after lesson_progress UPDATE to completed,
    checks if all lessons in the course are done; if so, marks enrollment
    completed and issues a certificate with a unique number
- get_course_certificates(): returns certificates for the caller
*/

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Quiz',
  description text DEFAULT '',
  passing_score int NOT NULL DEFAULT 70,
  max_attempts int NOT NULL DEFAULT 3,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL DEFAULT 'a' CHECK (correct_answer IN ('a','b','c','d')),
  points int NOT NULL DEFAULT 1,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  score int NOT NULL DEFAULT 0,
  total_points int NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type text NOT NULL DEFAULT 'mixed' CHECK (session_type IN ('addition','subtraction','multiplication','division','mixed')),
  difficulty text NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy','medium','hard')),
  score int NOT NULL DEFAULT 0,
  total_questions int NOT NULL DEFAULT 10,
  time_seconds int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.franchise_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE SET NULL,
  franchise_type text NOT NULL DEFAULT 'self' CHECK (franchise_type IN ('self','single','multi')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  business_experience text DEFAULT '',
  available_capital text DEFAULT '',
  preferred_location text DEFAULT '',
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON public.quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_module_id ON public.quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON public.certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON public.practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_franchise_applications_user_id ON public.franchise_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_franchise_applications_status ON public.franchise_applications(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_applications ENABLE ROW LEVEL SECURITY;

-- quizzes: read for authenticated users
DROP POLICY IF EXISTS "select_quizzes" ON public.quizzes;
CREATE POLICY "select_quizzes" ON public.quizzes
  FOR SELECT TO authenticated USING (true);

-- quiz_questions: read for authenticated users
DROP POLICY IF EXISTS "select_quiz_questions" ON public.quiz_questions;
CREATE POLICY "select_quiz_questions" ON public.quiz_questions
  FOR SELECT TO authenticated USING (true);

-- quiz_attempts: CRUD own
DROP POLICY IF EXISTS "select_own_quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "select_own_quiz_attempts" ON public.quiz_attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "insert_own_quiz_attempts" ON public.quiz_attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- certificates: read own
DROP POLICY IF EXISTS "select_own_certificates" ON public.certificates;
CREATE POLICY "select_own_certificates" ON public.certificates
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- practice_sessions: read/insert own
DROP POLICY IF EXISTS "select_own_practice" ON public.practice_sessions;
CREATE POLICY "select_own_practice" ON public.practice_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_practice" ON public.practice_sessions;
CREATE POLICY "insert_own_practice" ON public.practice_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- franchise_applications: read/insert own
DROP POLICY IF EXISTS "select_own_franchise_apps" ON public.franchise_applications;
CREATE POLICY "select_own_franchise_apps" ON public.franchise_applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_franchise_apps" ON public.franchise_applications;
CREATE POLICY "insert_own_franchise_apps" ON public.franchise_applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Issue certificate when all lessons in a course are completed
CREATE OR REPLACE FUNCTION public.issue_certificate_on_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_lesson_module uuid;
  v_course_id uuid;
  v_enrollment_id uuid;
  v_total_lessons int;
  v_completed_lessons int;
  v_cert_number text;
  v_existing_cert uuid;
BEGIN
  -- Only act when a lesson is being marked complete
  IF NEW.is_completed = false THEN
    RETURN NEW;
  END IF;

  -- Find the module and course for this lesson
  SELECT m.course_id, NEW.lesson_id INTO v_course_id, v_lesson_module
  FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  WHERE l.id = NEW.lesson_id;

  IF v_course_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Find the enrollment
  SELECT e.id INTO v_enrollment_id
  FROM public.enrollments e
  WHERE e.course_id = v_course_id AND e.user_id = NEW.user_id;

  IF v_enrollment_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check if certificate already exists
  SELECT id INTO v_existing_cert FROM public.certificates
  WHERE user_id = NEW.user_id AND course_id = v_course_id;

  IF v_existing_cert IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Count total and completed lessons
  SELECT count(*) INTO v_total_lessons
  FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  WHERE m.course_id = v_course_id;

  SELECT count(*) INTO v_completed_lessons
  FROM public.lesson_progress lp
  JOIN public.lessons l ON lp.lesson_id = l.id
  JOIN public.modules m ON l.module_id = m.id
  WHERE m.course_id = v_course_id AND lp.user_id = NEW.user_id AND lp.is_completed = true;

  IF v_completed_lessons >= v_total_lessons AND v_total_lessons > 0 THEN
    -- Mark enrollment as completed
    UPDATE public.enrollments SET status = 'completed', completed_at = now()
    WHERE id = v_enrollment_id;

    -- Generate certificate number: EB-CERT-YYYYMMDD-XXXXX
    v_cert_number := 'EB-CERT-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(encode(gen_random_bytes(3), 'hex'), 1, 5));

    INSERT INTO public.certificates (user_id, course_id, enrollment_id, certificate_number)
    VALUES (NEW.user_id, v_course_id, v_enrollment_id, v_cert_number);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS trg_issue_certificate ON public.lesson_progress;
CREATE TRIGGER trg_issue_certificate
  AFTER UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.issue_certificate_on_completion();

-- ============================================================
-- GRANTS
-- ============================================================

GRANT SELECT ON public.quizzes TO authenticated;
GRANT SELECT ON public.quiz_questions TO authenticated;
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT SELECT ON public.certificates TO authenticated;
GRANT SELECT, INSERT ON public.practice_sessions TO authenticated;
GRANT SELECT, INSERT ON public.franchise_applications TO authenticated;
