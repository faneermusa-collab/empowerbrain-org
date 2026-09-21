import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Globe2, MapPin, CreditCard, TrendingUp, Users, DollarSign,
  Building2, ArrowRight, Languages, Wallet, Banknote, Landmark,
  CheckCircle2, Star, BookOpen, Award, ChevronRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import type { Country, ProfitSharing, PaymentMethod, CountryPricingWithCourse } from '@/types/database';

const PAYMENT_ICONS: Record<string, typeof CreditCard> = {
  'credit-card': CreditCard,
  'wallet': Wallet,
  'banknote': Banknote,
  'landmark': Landmark,
};

export default function CountryPortalPage() {
  const { code } = useParams<{ code: string }>();
  const { t } = useLanguage();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [profitSharing, setProfitSharing] = useState<ProfitSharing[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [pricing, setPricing] = useState<CountryPricingWithCourse[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!code || countries.length === 0) return;
    const country = countries.find((c) => c.code.toLowerCase() === code.toLowerCase());
    if (!country) {
      setLoading(false);
      return;
    }
    setSelectedCountry(country);
    Promise.all([
      supabase
        .from('profit_sharing')
        .select('*')
        .eq('country_id', country.id)
        .eq('is_active', true)
        .order('franchise_type', { ascending: true })
        .then(({ data }) => setProfitSharing((data as ProfitSharing[]) ?? [])),
      supabase
        .from('payment_methods')
        .select('*')
        .eq('country_id', country.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .then(({ data }) => setPaymentMethods((data as PaymentMethod[]) ?? [])),
      supabase
        .from('country_pricing')
        .select(`
          id, country_id, course_id, price, original_price, is_active,
          courses ( id, title, slug, short_description, thumbnail_url, category, level, instructor_name )
        `)
        .eq('country_id', country.id)
        .eq('is_active', true)
        .then(({ data }) => setPricing((data as unknown as CountryPricingWithCourse[]) ?? [])),
    ]).finally(() => setLoading(false));
  }, [code, countries]);

  if (loading && countries.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-shimmer shimmer-bg rounded-lg" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 animate-shimmer shimmer-bg rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // Country selector landing
  if (!code) {
    return (
      <div className="overflow-hidden">
        <section className="gradient-mesh border-b border-ink-100">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
                <Globe2 className="h-4 w-4" />
                Global Network
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
                {t('countries.title')}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
                {t('countries.subtitle')}
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {countries.map((country) => (
                <Link
                  key={country.id}
                  to={`/countries/${country.code.toLowerCase()}`}
                  className="card group p-6 text-center transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="text-4xl">{country.flag_emoji}</div>
                  <h3 className="mt-3 text-sm font-bold text-ink-900">{country.name}</h3>
                  <p className="mt-1 text-xs text-ink-500">
                    {country.currency_code} · {country.language.toUpperCase()}
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                    {t('countries.enter')} <ChevronRight className="h-3 w-3 rtl-flip" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!selectedCountry) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Globe2 className="mx-auto h-12 w-12 text-ink-300" />
        <h1 className="mt-4 text-xl font-semibold text-ink-700">Country portal not found</h1>
        <Link to="/countries" className="btn-primary mt-4">View All Countries</Link>
      </div>
    );
  }

  const tierLabels: Record<string, string> = { self: 'Self-Franchisee', single: 'Single Location', multi: 'Multi-Unit' };
  const allLanguages = [selectedCountry.language, ...selectedCountry.additional_languages];

  return (
    <div className="overflow-hidden">
      {/* Country Hero */}
      <section className="relative gradient-mesh border-b border-ink-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link to="/countries" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-600">
            <Globe2 className="h-4 w-4" /> All Countries
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-5xl">{selectedCountry.flag_emoji}</span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {selectedCountry.name} Portal
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-500">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  {selectedCountry.currency_code} ({selectedCountry.currency_symbol})
                </span>
                <span className="flex items-center gap-1.5">
                  <Languages className="h-4 w-4" />
                  {allLanguages.map((l) => l.toUpperCase()).join(' · ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-ink-900">{pricing.length}</p>
              <p className="text-sm text-ink-500">Available Courses</p>
            </div>
            <div className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-ink-900">{profitSharing.length}</p>
              <p className="text-sm text-ink-500">Franchise Tiers</p>
            </div>
            <div className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-ink-900">{paymentMethods.length}</p>
              <p className="text-sm text-ink-500">Payment Methods</p>
            </div>
            <div className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Languages className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-ink-900">{allLanguages.length}</p>
              <p className="text-sm text-ink-500">Languages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Pricing */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ink-900">Course Pricing in {selectedCountry.currency_code}</h2>
          <p className="mt-1 text-sm text-ink-500">Localized prices for students in {selectedCountry.name}</p>

          {pricing.length === 0 ? (
            <div className="mt-4 card p-8 text-center text-sm text-ink-500">
              No localized pricing yet. Default USD prices apply.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pricing.map((item) => (
                <Link
                  key={item.id}
                  to={`/courses/${item.courses.slug}`}
                  className="card group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="relative h-32 overflow-hidden">
                    {item.courses.thumbnail_url && (
                      <img src={item.courses.thumbnail_url} alt={item.courses.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
                    <span className="absolute top-3 left-3 badge bg-white/90 text-ink-700">{item.courses.category}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold leading-snug text-ink-900 line-clamp-2">{item.courses.title}</h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-brand-600">
                        {selectedCountry.currency_symbol}{Number(item.price).toFixed(0)}
                      </span>
                      {item.original_price && item.original_price !== item.price && (
                        <span className="text-xs text-ink-400 line-through">${Number(item.original_price).toFixed(0)} USD</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Profit Sharing + Payment Methods */}
      <section className="py-8 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Profit Sharing */}
            <div>
              <h2 className="text-xl font-bold text-ink-900">Franchise Profit Sharing</h2>
              <p className="mt-1 text-sm text-ink-500">Revenue split for franchisees in {selectedCountry.name}</p>
              <div className="mt-4 space-y-3">
                {profitSharing.map((ps) => (
                  <div key={ps.id} className="card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-ink-900">{tierLabels[ps.franchise_type] ?? ps.franchise_type}</h3>
                      <div className="flex items-center gap-1 text-xs text-ink-400">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Revenue Split
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-brand-50 p-3 text-center">
                        <p className="text-xl font-bold text-brand-700">{ps.franchisee_percent}%</p>
                        <p className="text-xs text-brand-600">Franchisee</p>
                      </div>
                      <div className="rounded-lg bg-ink-50 p-3 text-center">
                        <p className="text-xl font-bold text-ink-700">{ps.empowerbrain_percent}%</p>
                        <p className="text-xs text-ink-500">Empower Brain</p>
                      </div>
                      <div className="rounded-lg bg-accent-50 p-3 text-center">
                        <p className="text-xl font-bold text-accent-700">{ps.referral_bonus_percent}%</p>
                        <p className="text-xs text-accent-600">Referral Bonus</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h2 className="text-xl font-bold text-ink-900">Payment Methods</h2>
              <p className="mt-1 text-sm text-ink-500">Accepted payment options in {selectedCountry.name}</p>
              <div className="mt-4 card overflow-hidden">
                <div className="divide-y divide-ink-100">
                  {paymentMethods.map((pm) => {
                    const Icon = PAYMENT_ICONS[pm.icon_name] ?? CreditCard;
                    return (
                      <div key={pm.id} className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-ink-900">{pm.method_name}</p>
                          <p className="text-xs text-ink-500">{pm.description}</p>
                        </div>
                        <span className="badge bg-ink-50 capitalize text-ink-600">{pm.method_type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Language Support */}
              <div className="mt-4 card p-5">
                <h3 className="text-sm font-semibold text-ink-900">Language Support</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {allLanguages.map((lang) => (
                    <span key={lang} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
                      <Languages className="h-3.5 w-3.5" />
                      {lang === 'ar' ? 'Arabic' : lang === 'en' ? 'English' : lang === 'de' ? 'German' : lang === 'tr' ? 'Turkish' : lang === 'es' ? 'Spanish' : lang.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center text-white">
            <h2 className="text-xl font-bold">Ready to Join in {selectedCountry.name}?</h2>
            <p className="mt-2 text-sm text-brand-100">
              Apply for a franchise or browse courses with localized pricing and payment options.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/franchise" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-50">
                <Building2 className="h-4 w-4" /> Apply for Franchise
              </Link>
              <Link to="/courses" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
                <BookOpen className="h-4 w-4" /> Browse Courses <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
