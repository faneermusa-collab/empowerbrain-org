import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Store, Globe2, CheckCircle2, ArrowRight, User,
  Mail, Phone, MapPin, Briefcase, DollarSign, MessageSquare,
  Award, TrendingUp, Users, Star, CreditCard, Languages,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { FranchiseApplication, Country, ProfitSharing, PaymentMethod } from '@/types/database';

const FRANCHISE_TIERS = [
  {
    type: 'self' as const,
    icon: User,
    name: 'Self-Franchisee',
    tagline: 'Start from home',
    description: 'Perfect for individual educators who want to teach Empower Brain programs independently. Run online sessions and build your own student base with our certified curriculum.',
    features: [
      'Certified curriculum access',
      'Online teaching platform',
      'ZMC eLearning calculators',
      'Student progress tracking',
      'Commission earning system',
      'Marketing materials',
    ],
    investment: 'Low',
    color: 'from-brand-500 to-brand-700',
  },
  {
    type: 'single' as const,
    icon: Store,
    name: 'Single Location Franchise',
    tagline: 'One location, full support',
    description: 'Open a dedicated Empower Brain learning center in your community. Ideal for educators who want a physical presence with full branding and operational support.',
    features: [
      'Everything in Self-Franchisee',
      'Physical location branding',
      'On-site training materials',
      'Abacus kits included',
      'Teacher certification program',
      'Regional marketing support',
      'Operational guidelines',
    ],
    investment: 'Medium',
    color: 'from-accent-500 to-accent-700',
    featured: true,
  },
  {
    type: 'multi' as const,
    icon: Globe2,
    name: 'Multi-Unit Franchise',
    tagline: 'Scale across regions',
    description: 'For ambitious entrepreneurs who want to operate multiple Empower Brain locations across a city or region. Includes territory rights and master franchise benefits.',
    features: [
      'Everything in Single Location',
      'Multi-location territory rights',
      'Master franchise discount',
      'Regional trainer certification',
      'Custom marketing campaigns',
      'Priority support channel',
      'Revenue sharing program',
    ],
    investment: 'Premium',
    color: 'from-ink-600 to-ink-800',
  },
];

export default function FranchisePage() {
  const { user, profile } = useAuth();
  const [selectedTier, setSelectedTier] = useState<'self' | 'single' | 'multi'>('single');
  const [submitted, setSubmitted] = useState(false);
  const [existingApp, setExistingApp] = useState<FranchiseApplication | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [profitSharing, setProfitSharing] = useState<ProfitSharing[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    business_experience: '',
    available_capital: '',
    preferred_location: '',
    message: '',
  });

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        full_name: profile.full_name || '',
        email: profile.email || '',
      }));
      supabase
        .from('franchise_applications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setExistingApp(data as FranchiseApplication);
        });
    }
  }, [profile]);

  useEffect(() => {
    supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
      .then(({ data }) => {
        setCountries((data as Country[]) ?? []);
      });
  }, []);

  useEffect(() => {
    if (!selectedCountryId) return;
    Promise.all([
      supabase
        .from('profit_sharing')
        .select('*')
        .eq('country_id', selectedCountryId)
        .eq('is_active', true)
        .order('franchise_type', { ascending: true })
        .then(({ data }) => setProfitSharing((data as ProfitSharing[]) ?? [])),
      supabase
        .from('payment_methods')
        .select('*')
        .eq('country_id', selectedCountryId)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .then(({ data }) => setPaymentMethods((data as PaymentMethod[]) ?? [])),
    ]);
  }, [selectedCountryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const insertData: Record<string, unknown> = {
      franchise_type: selectedTier,
      ...form,
    };
    if (user) insertData.user_id = user.id;

    const { error } = await supabase.from('franchise_applications').insert(insertData);
    if (!error) {
      setSubmitted(true);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative gradient-mesh border-b border-ink-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
              <Building2 className="h-4 w-4" />
              Franchise Opportunities
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Grow With Empower Brain
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
              Join a global movement transforming math education. Choose the franchise model that fits
              your goals and become part of the Empower Brain family.
            </p>
          </div>
        </div>
      </section>

      {/* Existing Application Status */}
      {existingApp && !submitted && (
        <section className="border-b border-ink-100 bg-accent-50">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent-600" />
              <p className="text-sm text-accent-800">
                You have a franchise application on file ({existingApp.franchise_type} tier) — status:{' '}
                <span className="font-semibold capitalize">{existingApp.status.replace('_', ' ')}</span>.
                Submitted on {new Date(existingApp.created_at).toLocaleDateString()}.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Franchise Tiers */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Choose Your Franchise Model
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Three flexible options designed for different goals and investment levels.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {FRANCHISE_TIERS.map((tier) => (
              <div
                key={tier.type}
                className={`card relative p-8 transition-all hover:shadow-xl ${
                  selectedTier === tier.type ? 'ring-2 ring-brand-500' : ''
                } ${tier.featured ? 'lg:-translate-y-4' : ''}`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tier.color} text-white`}>
                  <tier.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{tier.name}</h3>
                <p className="text-sm text-brand-600 font-medium">{tier.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{tier.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-ink-400">Investment:</span>
                  <span className="text-sm font-bold text-ink-900">{tier.investment}</span>
                </div>
                <ul className="mt-5 space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedTier(tier.type)}
                  className={`mt-6 w-full rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    selectedTier === tier.type
                      ? 'bg-brand-600 text-white'
                      : 'border border-ink-200 text-ink-700 hover:border-brand-300 hover:text-brand-700'
                  }`}
                >
                  {selectedTier === tier.type ? 'Selected' : 'Select This Option'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country-Specific Profit Sharing & Payments */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Country-Specific Terms
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Each country has its own profit sharing, pricing, and payment methods. Select your country to see the details.
            </p>
          </div>

          <div className="mt-10 max-w-md mx-auto">
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3">
              <Globe2 className="h-5 w-5 text-brand-500" />
              <select
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-ink-700 outline-none"
              >
                <option value="">Select your country...</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.flag_emoji} {c.name} ({c.currency_code})</option>
                ))}
              </select>
            </div>
          </div>

          {selectedCountryId && (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Profit Sharing */}
              <div className="card p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand-600" />
                  <h3 className="text-lg font-semibold text-ink-900">Profit Sharing</h3>
                </div>
                {profitSharing.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-500">No profit sharing data for this country yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {profitSharing.map((ps) => (
                      <div key={ps.id} className="rounded-xl border border-ink-100 p-4">
                        <p className="text-sm font-semibold text-ink-900 capitalize">{ps.franchise_type === 'self' ? 'Self-Franchisee' : ps.franchise_type === 'single' ? 'Single Location' : 'Multi-Unit'}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-lg bg-brand-50 p-2">
                            <p className="text-lg font-bold text-brand-700">{ps.franchisee_percent}%</p>
                            <p className="text-xs text-brand-600">You</p>
                          </div>
                          <div className="rounded-lg bg-ink-50 p-2">
                            <p className="text-lg font-bold text-ink-700">{ps.empowerbrain_percent}%</p>
                            <p className="text-xs text-ink-500">HQ</p>
                          </div>
                          <div className="rounded-lg bg-accent-50 p-2">
                            <p className="text-lg font-bold text-accent-700">{ps.referral_bonus_percent}%</p>
                            <p className="text-xs text-accent-600">Referral</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="card p-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand-600" />
                  <h3 className="text-lg font-semibold text-ink-900">Payment Methods</h3>
                </div>
                {paymentMethods.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-500">No payment methods configured for this country yet.</p>
                ) : (
                  <div className="mt-4 divide-y divide-ink-100">
                    {paymentMethods.map((pm) => (
                      <div key={pm.id} className="flex items-center gap-3 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-ink-900">{pm.method_name}</p>
                          <p className="text-xs text-ink-500">{pm.description}</p>
                        </div>
                        <span className="badge bg-ink-50 capitalize text-ink-600">{pm.method_type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedCountryId && (
            <div className="mt-6 text-center">
              <Link to={`/countries/${(countries.find((c) => c.id === selectedCountryId)?.code ?? '').toLowerCase()}`} className="btn-secondary">
                <Globe2 className="h-4 w-4" /> View Full Country Portal
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Franchise With Us */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Why Franchise With Empower Brain?
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, title: 'Patented Methods', desc: 'Teach exclusive, patented methodologies — ZMC, RFMA, and the Libyan American Abacus.' },
              { icon: TrendingUp, title: 'Growing Market', desc: 'Mental math education is a rapidly expanding global market with high demand.' },
              { icon: Users, title: 'Proven Curriculum', desc: 'Structured courses with interactive tools, assessments, and progress tracking.' },
              { icon: Star, title: 'Brand Recognition', desc: 'Benefit from the Empower Brain brand and our ongoing marketing efforts.' },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20" id="apply">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Franchise Application
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Fill out the form below and our team will contact you within 48 hours.
            </p>
          </div>

          {submitted ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-accent-200 bg-accent-50 p-12 text-center">
              <CheckCircle2 className="h-14 w-14 text-accent-600" />
              <h3 className="mt-4 text-lg font-bold text-ink-900">Application Submitted!</h3>
              <p className="mt-2 text-sm text-ink-600">
                Thank you for your interest in franchising with Empower Brain. Our team will review your
                application and contact you within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 card p-8 space-y-5">
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-2.5">
                <Building2 className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-medium text-brand-700">
                  Applying for: <span className="font-bold capitalize">{FRANCHISE_TIERS.find((t) => t.type === selectedTier)?.name}</span>
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={User} label="Full Name" required>
                  <input type="text" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field" placeholder="Your name" />
                </Field>
                <Field icon={Mail} label="Email" required>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" />
                </Field>
                <Field icon={Phone} label="Phone" required>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="(555) 123-4567" />
                </Field>
                <Field icon={MapPin} label="Country" required>
                  <select required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field">
                    <option value="">Select your country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.name}>{c.flag_emoji} {c.name}</option>
                    ))}
                  </select>
                </Field>
                <Field icon={MapPin} label="City">
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" placeholder="Your city" />
                </Field>
                <Field icon={Briefcase} label="Business Experience">
                  <input type="text" value={form.business_experience} onChange={(e) => setForm({ ...form, business_experience: e.target.value })} className="input-field" placeholder="Years of experience" />
                </Field>
                <Field icon={DollarSign} label="Available Capital">
                  <input type="text" value={form.available_capital} onChange={(e) => setForm({ ...form, available_capital: e.target.value })} className="input-field" placeholder="e.g. $10,000 - $50,000" />
                </Field>
                <Field icon={MapPin} label="Preferred Location">
                  <input type="text" value={form.preferred_location} onChange={(e) => setForm({ ...form, preferred_location: e.target.value })} className="input-field" placeholder="Where would you like to operate?" />
                </Field>
              </div>

              <Field icon={MessageSquare} label="Additional Message">
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" placeholder="Tell us about yourself and why you want to franchise with Empower Brain..." />
              </Field>

              <button type="submit" className="btn-primary w-full">
                Submit Application <ArrowRight className="h-4 w-4 rtl-flip" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ icon: Icon, label, required, children }: { icon: typeof User; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-700">
        <Icon className="h-3.5 w-3.5 text-ink-400" />
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      {children}
    </div>
  );
}
