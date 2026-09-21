import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'en' | 'ar';

export const LANGUAGES: { code: Language; label: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

type LanguageContextValue = {
  lang: Language;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.programs': 'Programs',
    'nav.courses': 'Courses',
    'nav.trainer': 'Trainer',
    'nav.franchise': 'Franchise',
    'nav.countries': 'Countries',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    'nav.network': 'Network',
    'nav.signin': 'Sign In',
    'nav.signup': 'Get Started',
    'nav.signout': 'Sign Out',
    'nav.certificates': 'Certificates',
    // Common
    'common.loading': 'Loading...',
    'common.back': 'Back',
    'common.search': 'Search',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    // Landing
    'landing.badge': 'Creative Education for a Creative Generation',
    'landing.title': 'Master Mental Math with Patented Methods',
    'landing.subtitle': 'Learn the Libyan American Abacus, the Zargelin Mathematical Chain (ZMC), and the RealFlow Multiplier Algorithm (RFMA) — all in one platform.',
    'landing.cta': 'Start Learning',
    'landing.explore': 'Explore Courses',
    // Auth
    'auth.welcome': 'Welcome back',
    'auth.signin_subtitle': 'Sign in to continue your learning journey',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signin_btn': 'Sign In',
    'auth.no_account': "Don't have an account?",
    'auth.signup_free': 'Sign up free',
    'auth.signup_title': 'Create your account',
    'auth.signup_subtitle': 'Start your mental math journey today',
    'auth.full_name': 'Full Name',
    'auth.referral_code': 'Referral Code (optional)',
    'auth.signup_btn': 'Create Account',
    'auth.have_account': 'Already have an account?',
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.enrolled': 'Enrolled Courses',
    'dashboard.certificates': 'Certificates',
    'dashboard.referrals': 'Direct Referrals',
    'dashboard.earnings': 'Total Earnings',
    'dashboard.continue': 'Continue Learning',
    'dashboard.recent': 'Recent Practice',
    // Courses
    'courses.title': 'Courses',
    'courses.subtitle': 'Master mental math through our structured curriculum',
    'courses.all': 'All Categories',
    'courses.beginner': 'Beginner',
    'courses.intermediate': 'Intermediate',
    'courses.advanced': 'Advanced',
    'courses.enroll': 'Enroll Now',
    'courses.lessons': 'lessons',
    // Franchise
    'franchise.title': 'Grow With Empower Brain',
    'franchise.subtitle': 'Join a global movement transforming math education',
    'franchise.apply': 'Franchise Application',
    'franchise.select_country': 'Select your country...',
    'franchise.profit_sharing': 'Profit Sharing',
    'franchise.payment_methods': 'Payment Methods',
    // Calculator
    'calc.title': 'ZMC Mental Math Trainer',
    'calc.subtitle': 'Practice mental calculation with the Zargelin Mathematical Chain approach',
    'calc.start': 'Start Practice',
    'calc.score': 'Score',
    'calc.time': 'Time',
    'calc.question': 'Question',
    'calc.correct': 'Correct!',
    'calc.try_again': 'Try Again',
    // Certificates
    'cert.title': 'My Certificates',
    'cert.subtitle': 'Certificates earned by completing courses',
    'cert.empty': 'No certificates yet',
    'cert.empty_desc': 'Complete a course to earn your first certificate.',
    // Countries
    'countries.title': 'Choose Your Country Portal',
    'countries.subtitle': 'Each country has its own Empower Brain sub-portal with localized pricing, language support, franchise terms, profit sharing, and payment methods tailored to your region.',
    'countries.enter': 'Enter Portal',
  },
  ar: {
    // Nav
    'nav.programs': 'البرامج',
    'nav.courses': 'الدورات',
    'nav.trainer': 'المدرب',
    'nav.franchise': 'الامتياز',
    'nav.countries': 'الدول',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.dashboard': 'لوحة التحكم',
    'nav.network': 'الشبكة',
    'nav.signin': 'تسجيل الدخول',
    'nav.signup': 'ابدأ الآن',
    'nav.signout': 'تسجيل الخروج',
    'nav.certificates': 'الشهادات',
    // Common
    'common.loading': 'جارٍ التحميل...',
    'common.back': 'رجوع',
    'common.search': 'بحث',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    // Landing
    'landing.badge': 'تعليم إبداعي لجيل إبداعي',
    'landing.title': 'أتقن الحساب الذهني بطرق حاصلة على براءات اختراع',
    'landing.subtitle': 'تعلم العدسة الليبية الأمريكية وسلسلة زارجيلين الرياضية (ZMC) وخوارزمية التدفق الحقيقي (RFMA) — كلها في منصة واحدة.',
    'landing.cta': 'ابدأ التعلم',
    'landing.explore': 'استكشف الدورات',
    // Auth
    'auth.welcome': 'مرحباً بعودتك',
    'auth.signin_subtitle': 'سجّل الدخول لمتابعة رحلة التعلم',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.signin_btn': 'تسجيل الدخول',
    'auth.no_account': 'ليس لديك حساب؟',
    'auth.signup_free': 'سجّل مجاناً',
    'auth.signup_title': 'أنشئ حسابك',
    'auth.signup_subtitle': 'ابدأ رحلة الحساب الذهني اليوم',
    'auth.full_name': 'الاسم الكامل',
    'auth.referral_code': 'رمز الإحالة (اختياري)',
    'auth.signup_btn': 'إنشاء حساب',
    'auth.have_account': 'لديك حساب بالفعل؟',
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.enrolled': 'الدورات المسجلة',
    'dashboard.certificates': 'الشهادات',
    'dashboard.referrals': 'الإحالات المباشرة',
    'dashboard.earnings': 'إجمالي الأرباح',
    'dashboard.continue': 'متابعة التعلم',
    'dashboard.recent': 'التدريب الأخير',
    // Courses
    'courses.title': 'الدورات',
    'courses.subtitle': 'أتقن الحساب الذهني من خلال منهجنا المنظم',
    'courses.all': 'كل الفئات',
    'courses.beginner': 'مبتدئ',
    'courses.intermediate': 'متوسط',
    'courses.advanced': 'متقدم',
    'courses.enroll': 'سجّل الآن',
    'courses.lessons': 'درس',
    // Franchise
    'franchise.title': 'نمُ مع إمباور برين',
    'franchise.subtitle': 'انضم إلى حركة عالمية تحول تعليم الرياضيات',
    'franchise.apply': 'طلب الامتياز',
    'franchise.select_country': 'اختر دولتك...',
    'franchise.profit_sharing': 'تقاسم الأرباح',
    'franchise.payment_methods': 'طرق الدفع',
    // Calculator
    'calc.title': 'مدرب الحساب الذهني ZMC',
    'calc.subtitle': 'تدرب على الحساب الذهني بطريقة سلسلة زارجيلين الرياضية',
    'calc.start': 'ابدأ التدريب',
    'calc.score': 'النتيجة',
    'calc.time': 'الوقت',
    'calc.question': 'سؤال',
    'calc.correct': 'صحيح!',
    'calc.try_again': 'حاول مرة أخرى',
    // Certificates
    'cert.title': 'شهاداتي',
    'cert.subtitle': 'الشهادات المكتسبة بإكمال الدورات',
    'cert.empty': 'لا توجد شهادات بعد',
    'cert.empty_desc': 'أكمل دورة للحصول على شهادتك الأولى.',
    // Countries
    'countries.title': 'اختر بوابة دولتك',
    'countries.subtitle': 'لكل دولة بوابة فرعية خاصة بها مع تسعير محلي ودعم لغوي وشروط امتياز وتقاسم أرباح وطرق دفع مخصصة لمنطقتك.',
    'countries.enter': 'دخول البوابة',
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('eb_lang');
    if (stored === 'ar' || stored === 'en') return stored;
    const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
    if (browserLang === 'ar') return 'ar';
    return 'en';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem('eb_lang', lang);
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[lang][key] ?? translations.en[key] ?? key;
  };

  const toggleLang = () => setLang((prev) => prev === 'en' ? 'ar' : 'en');

  return (
    <LanguageContext.Provider value={{ lang, dir, t, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
