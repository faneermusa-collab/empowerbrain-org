export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  thumbnail_url: string | null;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  instructor_name: string;
  is_published: boolean;
  created_at: string;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
};

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  content_type: 'video' | 'text';
  video_url: string | null;
  content: string;
  duration_minutes: number;
  order_index: number;
  created_at: string;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed';
  enrolled_at: string;
  completed_at: string | null;
  created_at: string;
};

export type LessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at: string | null;
  last_accessed_at: string;
  created_at: string;
};

export type Commission = {
  id: string;
  user_id: string;
  enrollment_id: string;
  amount: number;
  level: number;
  status: 'pending' | 'paid';
  created_at: string;
};

export type CourseReview = {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  referral_code: string;
  referred_by: string | null;
  bio: string;
  phone: string;
  country: string;
  created_at: string;
  updated_at: string;
};

export type DownlineMember = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  referral_code: string;
  level: number;
  referred_by: string | null;
  created_at: string;
  enrollment_count: number;
  earned_amount: number;
};

export type UplineMember = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  referral_code: string;
  level: number;
};

export type CourseWithProgress = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  thumbnail_url: string | null;
  category: string;
  level: string;
  price: number;
  instructor_name: string;
  enrollment_id: string | null;
  progress_count: number;
  total_lessons: number;
};

export type Quiz = {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string;
  passing_score: number;
  max_attempts: number;
  order_index: number;
  created_at: string;
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'a' | 'b' | 'c' | 'd';
  points: number;
  order_index: number;
};

export type QuizAttempt = {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_points: number;
  passed: boolean;
  answers: Record<string, string>;
  started_at: string;
  completed_at: string | null;
};

export type Certificate = {
  id: string;
  user_id: string;
  course_id: string;
  enrollment_id: string;
  certificate_number: string;
  issued_at: string;
};

export type PracticeSession = {
  id: string;
  user_id: string;
  session_type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  total_questions: number;
  time_seconds: number;
  created_at: string;
};

export type FranchiseApplication = {
  id: string;
  user_id: string | null;
  franchise_type: 'self' | 'single' | 'multi';
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  business_experience: string;
  available_capital: string;
  preferred_location: string;
  message: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
};

export type CertificateWithCourse = Certificate & {
  courses: { title: string; slug: string; instructor_name: string };
};

export type Country = {
  id: string;
  code: string;
  name: string;
  flag_emoji: string;
  currency_code: string;
  currency_symbol: string;
  language: string;
  additional_languages: string[];
  is_active: boolean;
  created_at: string;
};

export type CountryPricing = {
  id: string;
  country_id: string;
  course_id: string;
  price: number;
  original_price: number | null;
  is_active: boolean;
};

export type ProfitSharing = {
  id: string;
  country_id: string;
  franchise_type: 'self' | 'single' | 'multi';
  franchisee_percent: number;
  empowerbrain_percent: number;
  referral_bonus_percent: number;
  is_active: boolean;
};

export type PaymentMethod = {
  id: string;
  country_id: string;
  method_name: string;
  method_type: 'card' | 'bank' | 'cash' | 'wallet';
  is_active: boolean;
  display_order: number;
  icon_name: string;
  description: string;
};

export type CountryPricingWithCourse = CountryPricing & {
  courses: { id: string; title: string; slug: string; short_description: string; thumbnail_url: string | null; category: string; level: string; instructor_name: string };
};
