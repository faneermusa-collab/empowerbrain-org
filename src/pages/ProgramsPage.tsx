import {
  Brain, Calculator, DollarSign, GraduationCap, BookOpen, Users,
  Zap, Target, ArrowRight, CheckCircle2, Layers, Cpu, Eye,
  Monitor, Building2, School, Lightbulb,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ONLINE_IMG = 'https://images.pexels.com/photos/7013900/pexels-photo-7013900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const OFFLINE_IMG = 'https://images.pexels.com/photos/6502728/pexels-photo-6502728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const STUDENT_IMG = 'https://images.pexels.com/photos/5905965/pexels-photo-5905965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export default function ProgramsPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative gradient-mesh border-b border-ink-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
              <BookOpen className="h-4 w-4" />
              Our Program
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              A Unique & Transformative Learning Experience
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
              Designed to eliminate memorization, enhance mental calculation speed, and develop strong
              cognitive skills. Our approach integrates the Zargelin Mathematical Chain (ZMC), the Libyan
              American Abacus, and advanced digital tools.
            </p>
          </div>
        </div>
      </section>

      {/* Overview - Who is it for */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Designed For Everyone
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              We believe everyone can master mental math and develop strong problem-solving skills with the right approach.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: GraduationCap, title: 'Students', desc: 'Build confidence and excel in academic mathematics.' },
              { icon: School, title: 'Teachers', desc: 'Enhance your teaching with innovative, patented methods.' },
              { icon: Briefcase, title: 'Professionals', desc: 'Sharpen mental agility for career advancement.' },
              { icon: Users, title: 'Parents', desc: 'Support your child\'s cognitive development at home.' },
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
        </div>
      </section>

      {/* Offline Programs */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
                <Building2 className="h-4 w-4" />
                Offline Programs
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                In-Person Training & Workshops
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">
                Our offline programs bring the power of the Libyan American Abacus and ZMC directly to
                classrooms, training centers, and community spaces. Hands-on instruction with certified
                trainers ensures personalized attention and measurable progress.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Academic math support aligned with school curricula',
                  'English and Arabic language training programs',
                  'One-on-one tutoring sessions',
                  'Group workshops and speed challenges',
                  'Realistic problem-solving exercises',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent-500" />
                    <span className="text-sm text-ink-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={OFFLINE_IMG}
                alt="In-person tutoring session"
                className="h-[400px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Online Programs */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={ONLINE_IMG}
                  alt="Online learning platform"
                  className="h-[400px] w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3.5 py-1.5 text-sm font-medium text-accent-700">
                <Monitor className="h-4 w-4" />
                Online Programs
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Learn Anywhere, Anytime
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">
                Our online platform brings the full Empower Brain experience to your screen. Access courses,
                interactive tools, and ZMC eLearning calculators from any device — with structured lessons
                that adapt to your pace.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'ZMC eLearning Calculators for interactive practice',
                  'Self-paced video lessons and exercises',
                  'Progress tracking and achievement badges',
                  'Access on desktop, tablet, and mobile',
                  'Community forums and peer challenges',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent-500" />
                    <span className="text-sm text-ink-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/courses" className="mt-8 btn-primary">
                Browse Online Courses <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Learning Areas */}
      <section className="bg-ink-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key Learning Areas</h2>
            <p className="mt-4 text-lg text-ink-400">
              Our flexible learning approach adapts to different learning styles (VARK — Visual, Auditory,
              Reading/Writing, and Kinesthetic), ensuring an engaging and personalized experience for every student.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Zap, title: 'Mental Calculation & Speed Math', desc: 'Master math without memorization using ZMC and the Libyan American Abacus.' },
              { icon: Brain, title: 'Logical Thinking & Problem-Solving', desc: 'Build a deeper understanding of numbers through structured patterns.' },
              { icon: DollarSign, title: 'Financial Literacy', desc: 'Apply mental math to real-life money management and budgeting.' },
              { icon: GraduationCap, title: 'Academic Growth', desc: 'Strengthen intellectual development for academic excellence.' },
            ].map((item, i) => (
              <div key={i} className="group rounded-2xl border border-ink-800 bg-ink-900 p-6 transition-all hover:border-brand-600">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovative Tools & Techniques */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
              <Lightbulb className="h-4 w-4" />
              Innovative Tools & Techniques
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Empowering Learning with Advanced Tools
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <div className="card p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Layers className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-900">Zargelin Mathematical Chain</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                A breakthrough method that replaces traditional multiplication with neighbor-digit addition,
                allowing learners to multiply without memorizing tables.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Carry-free calculation techniques',
                  'Real-time problem solving',
                  'Works with any digit size',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Calculator className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-900">Libyan American Abacus</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                A modernized abacus that enhances calculation speed and accuracy with fewer rules and
                simplified operations for all four mathematical operations.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Universal multiplication formula',
                  'Supports negative numbers',
                  'Adjustable ones digit',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-900">Visualization & Imagination</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Develop the ability to create a virtual abacus in the mind, visualizing bead movements to
                solve problems mentally with expanding number of rods.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Mental imagery of abacus',
                  'Expanding rod visualization',
                  'Enhanced photographic memory',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Why It Works: Key Benefits
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Revolutionizing the way we learn math.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Calculator, title: 'Multiply Without Memorizing', desc: 'ZMC allows students to multiply without memorizing tables. Carry-free techniques ensure quick and precise calculations.' },
              { icon: Brain, title: 'Logical Problem-Solving', desc: 'Encourages logical problem-solving over rote learning. Students solve problems in real-time, building confidence.' },
              { icon: Target, title: 'Pattern Recognition', desc: 'Develops logical reasoning and pattern recognition. Trains students to apply math skills in practical situations.' },
              { icon: Eye, title: 'Memory & Concentration', desc: 'Enhances working memory and concentration. Engages students in active problem-solving to strengthen brain function.' },
              { icon: DollarSign, title: 'Financial Literacy', desc: 'Teaches money management skills through mental math. Helps make informed financial decisions.' },
              { icon: Cpu, title: 'Interactive Learning', desc: 'Uses interactive tools, abacus training, and speed challenges to keep learning engaging and fun.' },
            ].map((benefit, i) => (
              <div key={i} className="card group p-6 transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink-900">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-16 text-center shadow-2xl shadow-brand-600/30 sm:px-16">
            <div className="absolute inset-0 gradient-mesh opacity-30" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start Your Learning Journey
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
                Submit your data and we will contact you shortly to get started.
              </p>
              <Link to="/signup" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50 active:scale-[0.98]">
                Enroll Now <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Briefcase({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
