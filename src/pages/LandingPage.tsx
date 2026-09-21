import { Link } from 'react-router-dom';
import {
  Brain, GraduationCap, TrendingUp, Users, ShieldCheck,
  Zap, Target, Award, ArrowRight, CheckCircle2, Star, Network,
  DollarSign, Calculator, BookOpen, Eye, Lightbulb, Clock,
  Sparkles, Cpu, Layers, Globe2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import type { Course } from '@/types/database';

const HERO_IMG = 'https://images.pexels.com/photos/6693301/pexels-photo-6693301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const BRAIN_IMG = 'https://images.pexels.com/photos/8378726/pexels-photo-8378726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const STUDENT_IMG = 'https://images.pexels.com/photos/5905965/pexels-photo-5905965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const ONLINE_IMG = 'https://images.pexels.com/photos/7013900/pexels-photo-7013900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export default function LandingPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })
      .limit(3)
      .then(({ data }) => {
        setCourses((data as Course[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative gradient-mesh">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                {t('landing.badge')}
              </div>
              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-6xl animate-fade-up">
                Experience the Power of a{' '}
                <span className="block bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                  Smarter Abacus
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-600 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                Designed for everyone to discover the simplicity of a logical abacus — perfect for all ages.
                Master mental math with the Zargelin Mathematical Chain and the Libyan American Abacus.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/signup" className="btn-primary w-full sm:w-auto">
                  {t('landing.cta')}
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </Link>
                <Link to="/programs" className="btn-secondary w-full sm:w-auto">
                  {t('landing.explore')}
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent-500" /> No memorization needed</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent-500" /> For all ages</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent-500" /> Patented methods</span>
              </div>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-brand-900/20">
                <img
                  src={HERO_IMG}
                  alt="Child learning math with a colorful abacus"
                  className="h-[420px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-ink-100 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                    <Calculator className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-ink-900">ZMC Method</div>
                    <div className="text-xs text-ink-500">Multiply without tables</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 hidden rounded-2xl border border-ink-100 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50">
                    <Award className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-ink-900">Patented</div>
                    <div className="text-xs text-ink-500">Jan. 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transform Your Thinking */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={BRAIN_IMG}
                  alt="Mental activity and thought process"
                  className="h-[400px] w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Transform Your Thinking, Multiply Your Potential
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">
                At Empower Brain, we believe that everyone has the potential to master mental math and unlock
                new opportunities. Our programs are designed for learners of all backgrounds, providing a
                supportive and engaging environment where self-reliance and financial literacy thrive through
                the power of mental calculation.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                By developing rapid mental math skills, you'll gain more than just numerical proficiency —
                you'll enhance critical thinking, problem-solving abilities, and confidence in tackling
                real-world challenges.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Zap, label: 'Think Faster' },
                  { icon: Brain, label: 'Calculate Smarter' },
                  { icon: TrendingUp, label: 'Build Confidence' },
                  { icon: Target, label: 'Stay Focused' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
                    <item.icon className="h-5 w-5 text-brand-600" />
                    <span className="text-sm font-semibold text-ink-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovations & Patents */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3.5 py-1.5 text-sm font-medium text-accent-700">
              <Lightbulb className="h-4 w-4" />
              Our Innovations & Patents
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Pioneering New Methods in Math Education
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Empower Brain LLC, led by Dr. Omar Zargelin, has developed multiple innovative mathematical
              calculation methods designed to enhance efficiency, accuracy, and ease of learning.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {/* Libyan American Abacus */}
            <div className="card group p-7 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <Calculator className="h-7 w-7" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="text-lg font-bold text-ink-900">Libyan American Abacus</h3>
                <span className="badge bg-accent-50 text-accent-700">Patent Issued Jan. 2025</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                A modernized abacus that enhances calculation speed and accuracy with fewer rules, simplified
                operations, and a universal multiplication formula — eliminating the need for memorization.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Fewer rules and simplified operations',
                  'Universal multiplication formula',
                  'Supports all four math operations',
                  'Designed for children and adults',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* ZMC */}
            <div className="card group p-7 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <Layers className="h-7 w-7" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="text-lg font-bold text-ink-900">Zargelin Mathematical Chain</h3>
                <span className="badge bg-brand-50 text-brand-700">ZMC</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                A structured, innovative approach designed to handle all mathematical operations — including
                multiplication — in an easy, fast, and effective way, eliminating reliance on memorization.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Carry-free calculation techniques',
                  'Real-time problem solving',
                  'Works with any digit size',
                  'Builds logical reasoning',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* RFMA */}
            <div className="card group p-7 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <Cpu className="h-7 w-7" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="text-lg font-bold text-ink-900">RealFlow Multiplier Algorithm</h3>
                <span className="badge bg-amber-50 text-amber-700">Patent Pending</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                A groundbreaking computing method based on ZMC, designed to revolutionize numerical processing.
                Performs real-time multiplication to infinity without requiring multiplication tables.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Real-time multiplication processing',
                  'Handles any digit size without limits',
                  '100% accuracy across all sizes',
                  'Integrates into digital tools & AI',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ZMC eLearning Calculators */}
          <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 sm:flex-row">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-ink-900">ZMC eLearning Calculators</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Advanced educational tools that bring the Zargelin Mathematical Chain to life in an interactive
                online environment. These calculators reinforce mental computation strategies rather than
                simply displaying results — guiding students step-by-step through addition, subtraction,
                multiplication, and division.
              </p>
            </div>
            <Link to="/programs" className="btn-primary flex-shrink-0">
              Learn More <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
          </div>
        </div>
      </section>

      {/* Abacus Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Abacus Benefits
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Mental arithmetic does more than boost calculation speed — it cultivates deep cognitive abilities.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* General Abacus Benefits */}
            <div className="card p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                  <Brain className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-bold text-ink-900">General Abacus Benefits</h3>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                {[
                  'Boosts calculation skills',
                  'Increases endurance for stress',
                  'Improves problem-solving',
                  'Teaches logical reasoning',
                  'Sharpens concentration',
                  'Develops confidence',
                  'Heightens mental visualization',
                  'Enhances photographic memory',
                  'Sharpens listening skills',
                  'Makes math meaningful and fun',
                  'Solid foundation for arithmetic',
                  'Increases memory power',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Libyan American Abacus Benefits */}
            <div className="card border-brand-200 bg-gradient-to-br from-brand-50/50 to-white p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
                  <Calculator className="h-6 w-6 text-brand-700" />
                </div>
                <h3 className="text-xl font-bold text-ink-900">Libyan American Abacus Benefits</h3>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                {[
                  'Fewer rules, simplified operations',
                  'Reduces cognitive load',
                  'Eliminates complex rules',
                  'Universal multiplication formula',
                  'Unique bead arrangement',
                  'Simplified division process',
                  'Supports negative numbers',
                  'All four operations supported',
                  'Comma separators for clarity',
                  'Adjustable ones digit',
                  'Relies on even numbers',
                  'Reduces training time & cost',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits - Cognitive Skills */}
      <section className="bg-ink-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why It Works: Key Benefits
            </h2>
            <p className="mt-4 text-lg text-ink-400">
              Revolutionizing the way we learn math — building cognitive skills that last a lifetime.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Calculator, title: 'Multiply Without Memorizing', desc: 'ZMC allows students to multiply without memorizing tables. Carry-free techniques ensure quick and precise calculations.' },
              { icon: Lightbulb, title: 'Logical Problem-Solving', desc: 'Encourages logical problem-solving over rote learning. Students solve problems in real-time, building confidence.' },
              { icon: Brain, title: 'Pattern Recognition', desc: 'Develops logical reasoning and pattern recognition. Trains students to apply math skills in practical situations.' },
              { icon: Eye, title: 'Working Memory & Concentration', desc: 'Enhances working memory and concentration. Engages students in active problem-solving to strengthen brain function.' },
              { icon: DollarSign, title: 'Financial Literacy', desc: 'Teaches money management skills through mental math. Helps students and professionals make informed financial decisions.' },
              { icon: Users, title: 'For Everyone', desc: 'Designed for students, teachers, professionals, and parents. Uses interactive tools, abacus training, and speed challenges.' },
            ].map((benefit, i) => (
              <div key={i} className="group rounded-2xl border border-ink-800 bg-ink-900 p-6 transition-all hover:border-brand-600 hover:bg-ink-900/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              What Sets Us Apart?
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, title: 'Unique', desc: 'We use our own counter registered with the Michigan Patent Office.' },
              { icon: BookOpen, title: 'Experience', desc: 'We have many new researches and theories to develop and advance the educational process.' },
              { icon: GraduationCap, title: 'Cutting Edge Education', desc: 'All our programs are in line with modern education curricula.' },
              { icon: Globe2, title: 'Modern Technology', desc: 'We aspire to fuse education with modern technology to better reach today\'s generation.' },
            ].map((item, i) => (
              <div key={i} className="card group p-6 text-center transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-gradient-to-br from-ink-50 to-brand-50/50 p-8 sm:p-12">
            <p className="text-center text-lg leading-relaxed text-ink-700">
              "Our company's fundamental message is <span className="font-bold text-brand-700">Creative Education for a Creative Generation</span>.
              We believe that by implementing interactive educational content, we can engage not only children,
              but parents and trainers all over the world. We aim to harness the power of social media and modern
              technologies for the purposes of providing purposeful and educational content."
            </p>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
                <BookOpen className="h-4 w-4" />
                Our Program
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                A Unique & Transformative Learning Experience
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">
                Designed to eliminate memorization, enhance mental calculation speed, and develop strong
                cognitive skills. Our approach integrates the Zargelin Mathematical Chain (ZMC), the Libyan
                American Abacus, and advanced digital tools.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { icon: Zap, text: 'Mental Calculation & Speed Math — Master math without memorization' },
                  { icon: Brain, text: 'Logical Thinking & Problem-Solving — Build a deeper understanding of numbers' },
                  { icon: DollarSign, text: 'Financial Literacy — Apply mental math to real-life money management' },
                  { icon: GraduationCap, text: 'Academic Growth — Strengthen intellectual development' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
                    <item.icon className="h-5 w-5 flex-shrink-0 text-brand-600" />
                    <span className="text-sm text-ink-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/programs" className="mt-8 btn-primary">
                View Full Program <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={STUDENT_IMG}
                  alt="Student learning math"
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="mt-8 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={ONLINE_IMG}
                  alt="Online learning"
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="-mt-8 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={HERO_IMG}
                  alt="Abacus learning"
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={BRAIN_IMG}
                  alt="Cognitive development"
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Featured Courses</h2>
              <p className="mt-3 text-lg text-ink-600">Start with our most popular mental math programs.</p>
            </div>
            <Link to="/courses" className="hidden btn-ghost sm:flex">
              View All <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="card h-80 animate-shimmer shimmer-bg" />
                ))
              : courses.length === 0
              ? <div className="col-span-full card p-12 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-ink-300" />
                  <h3 className="mt-4 text-lg font-semibold text-ink-700">Courses coming soon</h3>
                  <p className="mt-1 text-sm text-ink-500">Our course catalog is being updated. Check back shortly.</p>
                </div>
              : courses.map((course) => (
                  <Link key={course.id} to={`/courses/${course.slug}`} className="card group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                    <div className="relative h-44 overflow-hidden">
                      {course.thumbnail_url && (
                        <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
                      <span className="absolute bottom-3 left-3 badge bg-white/90 text-ink-700 capitalize">{course.level}</span>
                      <span className="absolute bottom-3 right-3 badge bg-brand-600 text-white">${course.price}</span>
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-medium text-brand-600">{course.category}</span>
                      <h3 className="mt-1.5 text-base font-semibold leading-snug text-ink-900 line-clamp-2">{course.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500 line-clamp-2">{course.short_description}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> 4.8</span>
                        <span>{course.instructor_name}</span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link to="/courses" className="btn-secondary">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* Earn While You Learn */}
      <section className="bg-ink-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Earn While You Learn</h2>
            <p className="mt-4 text-lg text-ink-400">
              Our three-level referral commission system rewards you for building a learning community.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { level: 'Level 1', rate: '20%', desc: 'Direct referrals — people who sign up using your code.', color: 'from-brand-500 to-brand-700' },
              { level: 'Level 2', rate: '10%', desc: 'Referrals of your referrals — your extended network.', color: 'from-accent-500 to-accent-700' },
              { level: 'Level 3', rate: '5%', desc: 'Third-degree connections — passive income potential.', color: 'from-ink-500 to-ink-700' },
            ].map((tier, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-8">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${tier.color} text-2xl font-bold`}>
                  {tier.rate}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{tier.level}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{tier.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/signup" className="btn-primary">
              Get Your Referral Code <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-16 text-center shadow-2xl shadow-brand-600/30 sm:px-16">
            <div className="absolute inset-0 gradient-mesh opacity-30" />
            <div className="relative">
              <Clock className="mx-auto h-10 w-10 text-white/80" />
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to empower your brain?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
                Join thousands of learners mastering mental math and building focus with Empower Brain.
              </p>
              <Link to="/signup" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50 active:scale-[0.98]">
                Create Free Account <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
