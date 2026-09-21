import {
  Brain, Target, Eye, Lightbulb, Award, Calculator, Layers, Cpu,
  CheckCircle2, ArrowRight, Users, BookOpen, Globe2, Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ABACUS_IMG = 'https://images.pexels.com/photos/7188764/pexels-photo-7188764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const BRAIN_IMG = 'https://images.pexels.com/photos/8378726/pexels-photo-8378726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const STUDENT_IMG = 'https://images.pexels.com/photos/5905965/pexels-photo-5905965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative gradient-mesh border-b border-ink-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
              <Brain className="h-4 w-4" />
              About Empower Brain
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Who We Are
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
              Empower Brain LLC is a leading training and development company specializing in mathematics
              and language education. We are committed to transforming traditional learning methods by
              incorporating mental calculation techniques, structured learning strategies, and innovative
              educational tools.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={ABACUS_IMG}
                  alt="Libyan American Abacus"
                  className="h-[400px] w-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-ink-900">
                Transforming Traditional Learning
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">
                Our patented methodologies — such as the Zargelin Multiplication Chain (ZMC), the RealFlow
                Multiplication Algorithm (RFMA), and the Libyan American Abacus (issued January 2025) —
                eliminate the need for memorization, making learning faster, easier, and more intuitive.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                We are continuously developing new learning methods to shape the future of education through
                in-person training, online platforms, and interactive learning games. Our methods go beyond
                traditional approaches by focusing on logical reasoning, structured patterns, and interactive
                problem-solving techniques.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Calculator, label: 'Libyan American Abacus', sub: 'Patent Issued Jan. 2025' },
                  { icon: Layers, label: 'Zargelin Mathematical Chain', sub: 'ZMC Method' },
                  { icon: Cpu, label: 'RealFlow Multiplier Algorithm', sub: 'Patent Pending' },
                  { icon: BookOpen, label: 'Language Training Programs', sub: 'Effective methodologies' },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
                    <item.icon className="h-6 w-6 text-brand-600" />
                    <div className="mt-2 text-sm font-semibold text-ink-900">{item.label}</div>
                    <div className="text-xs text-ink-500">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3.5 py-1.5 text-sm font-medium text-accent-700">
              <Target className="h-4 w-4" />
              Vision & Mission
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Reshaping Education for Everyone
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              We envision a future where math learning is intuitive, accessible, and free from traditional constraints.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="card p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink-900">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                We strive to be at the forefront of the global training and development industry, with a
                specific focus on mathematics and arithmetic. Our aim is to leverage our innovative techniques
                and collaborate with individuals and institutions worldwide to achieve this goal.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                We cater to the needs of adults, equipping them with the skills and knowledge necessary to
                tackle complex mathematical challenges with ease.
              </p>
            </div>

            <div className="card p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink-900">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                We are dedicated to reshaping education, making learning faster, more efficient, and accessible
                to everyone. Our programs enable individuals to find the most accurate and efficient solutions
                to arithmetic problems, whether through mental calculation or traditional methods.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Eliminate the need for multiplication tables',
                  'Strengthen numerical fluency and computational skills',
                  'Hands-on approaches designed to keep learners engaged',
                  'Adaptable solutions for students, educators, and professionals',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Long-term goals / innovations */}
          <div className="mt-8 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8">
            <h3 className="text-xl font-bold text-ink-900">Our Long-Term Goals</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Calculator, title: 'Libyan American Abacus', desc: 'Patent issued Jan. 2025 — a modern abacus designed to enhance calculation speed and accuracy.' },
                { icon: Layers, title: 'Zargelin Mathematical Chain', desc: 'A structured approach handling all mathematical operations without memorization.' },
                { icon: Cpu, title: 'RealFlow Multiplication Algorithm', desc: 'A fast, efficient system for real-time multiplication (patent pending).' },
                { icon: BookOpen, title: 'ZMC eLearning Calculators', desc: 'Interactive digital tools bringing ZMC to life (patents pending).' },
                { icon: Globe2, title: 'Language Training Programs', desc: 'Effective methodologies for improving language learning and comprehension.' },
                { icon: Sparkles, title: 'Continuous Innovation', desc: 'Always seeking new ways to enhance our programs and provide the best learning experience.' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
                  <item.icon className="h-6 w-6 text-brand-600" />
                  <h4 className="mt-2 text-sm font-bold text-ink-900">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
                <Lightbulb className="h-4 w-4" />
                Our Philosophy
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Empowering Minds, Transforming Lives
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">
                At Empower Brain, we believe that everyone has the potential to achieve greatness in mathematics
                and mental arithmetic, regardless of age, gender, or background. Our philosophy is built on
                the idea that by empowering the mind, we can empower the person.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                We strive to create a supportive and nurturing environment that encourages growth and learning.
                Our programs are designed to challenge and motivate individuals to reach their full potential,
                while promoting a love for mathematics and mental arithmetic.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                We are committed to continuous improvement and innovation, always seeking new ways to enhance
                our programs and provide the best possible learning experience for our students. By working
                together with our students, parents, and partners, we can achieve our shared vision of
                empowering minds and transforming lives.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={BRAIN_IMG}
                  alt="Cognitive development"
                  className="h-[400px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-12 text-center shadow-2xl shadow-brand-600/30 sm:px-16">
            <div className="absolute inset-0 gradient-mesh opacity-30" />
            <div className="relative">
              <Users className="mx-auto h-10 w-10 text-white/80" />
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Join Our Learning Community
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
                Whether you're a student, teacher, professional, or parent — there's a place for you at Empower Brain.
              </p>
              <Link to="/signup" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50 active:scale-[0.98]">
                Get Started <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
