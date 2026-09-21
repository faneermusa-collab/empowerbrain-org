import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut, LayoutDashboard, BookOpen, Network, Menu, X, Info, Phone, GraduationCap, Calculator, Award, Building2, Globe2, Languages, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/30">
            <Brain className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            Empower<span className="text-brand-600">Brain</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link to="/programs" className="btn-ghost">{t('nav.programs')}</Link>
          <Link to="/courses" className="btn-ghost">{t('nav.courses')}</Link>
          <Link to="/calculator" className="btn-ghost">{t('nav.trainer')}</Link>
          <Link to="/franchise" className="btn-ghost">{t('nav.franchise')}</Link>
          <Link to="/countries" className="btn-ghost">{t('nav.countries')}</Link>
          <Link to="/about" className="btn-ghost">{t('nav.about')}</Link>
          <Link to="/contact" className="btn-ghost">{t('nav.contact')}</Link>
          {user && <Link to="/dashboard" className="btn-ghost">{t('nav.dashboard')}</Link>}
          {user && <Link to="/network" className="btn-ghost">{t('nav.network')}</Link>}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
              aria-label="Select language"
            >
              <Languages className="h-4 w-4" />
              {LANGUAGES.find((l) => l.code === lang)?.label}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute end-0 mt-2 w-44 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-xl shadow-ink-200/40">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-ink-50 ${lang === l.code ? 'font-semibold text-brand-600' : 'text-ink-700'}`}
                  >
                    <span className="text-base">{l.flag}</span>
                    {l.label}
                    {lang === l.code && <Check className="ms-auto h-4 w-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {user ? (
            <>
              <div className="flex items-center gap-2.5 rounded-xl bg-ink-50 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-sm font-semibold text-brand-700">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-ink-700">{profile?.full_name || 'User'}</span>
              </div>
              <button onClick={handleSignOut} className="btn-ghost text-ink-500 hover:text-error-600">
                <LogOut className="h-4 w-4 rtl-flip" />
                {t('nav.signout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">{t('nav.signin')}</Link>
              <Link to="/signup" className="btn-primary">{t('nav.signup')}</Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="mb-2 flex w-full items-center gap-2 rounded-lg bg-ink-50 px-3 py-2.5 text-sm font-medium text-ink-700"
              >
                <Languages className="h-4 w-4" />
                {LANGUAGES.find((l) => l.code === lang)?.label}
                <ChevronDown className={`ms-auto h-3.5 w-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="mb-2 overflow-hidden rounded-lg border border-ink-100 bg-white py-1">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-ink-50 ${lang === l.code ? 'font-semibold text-brand-600' : 'text-ink-700'}`}
                    >
                      <span className="text-base">{l.flag}</span>
                      {l.label}
                      {lang === l.code && <Check className="ms-auto h-4 w-4 text-brand-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link to="/programs" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              <GraduationCap className="h-4 w-4" /> {t('nav.programs')}
            </Link>
            <Link to="/courses" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              <BookOpen className="h-4 w-4" /> {t('nav.courses')}
            </Link>
            <Link to="/calculator" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              <Calculator className="h-4 w-4" /> {t('nav.trainer')}
            </Link>
            <Link to="/franchise" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              <Building2 className="h-4 w-4" /> {t('nav.franchise')}
            </Link>
            <Link to="/countries" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              <Globe2 className="h-4 w-4" /> {t('nav.countries')}
            </Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              <Info className="h-4 w-4" /> {t('nav.about')}
            </Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              <Phone className="h-4 w-4" /> {t('nav.contact')}
            </Link>
            {user && (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                  <LayoutDashboard className="h-4 w-4" /> {t('nav.dashboard')}
                </Link>
                <Link to="/certificates" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                  <Award className="h-4 w-4" /> {t('nav.certificates')}
                </Link>
                <Link to="/network" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                  <Network className="h-4 w-4" /> {t('nav.network')}
                </Link>
                <button onClick={handleSignOut} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-ink-50">
                  <LogOut className="h-4 w-4 rtl-flip" /> {t('nav.signout')}
                </button>
              </>
            )}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1">{t('nav.signin')}</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1">{t('nav.signup')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
