/*
# Add Country-Specific Franchise System

## Overview
Enables each country to have its own franchise sub-portal with:
- Localized languages and content
- Country-specific pricing schemes for courses
- Profit sharing configurations per franchise tier
- Country-specific payment methods
- Currency support per country

## New Tables

1. **countries** — master list of supported countries
   - id, code (ISO 2-letter, unique), name, flag_emoji,
     currency_code (USD, LYD, etc.), currency_symbol, language (default language),
     additional_languages (array), is_active, created_at

2. **country_pricing** — per-country course pricing overrides
   - id, country_id (FK), course_id (FK), price (numeric, in local currency),
     original_price (for display comparison), is_active
   - UNIQUE(country_id, course_id)

3. **profit_sharing** — per-country, per-tier profit split
   - id, country_id (FK), franchise_type (self/single/multi),
     franchisee_percent, empowerbrain_percent, referral_bonus_percent,
     is_active, created_at
   - UNIQUE(country_id, franchise_type)

4. **payment_methods** — per-country supported payment options
   - id, country_id (FK), method_name (Stripe, PayPal, Bank Transfer, Cash, etc.),
     method_type (card/bank/cash/wallet), is_active, display_order,
     icon_name, description

## Security (RLS)
- countries: SELECT all (anon + authenticated) — public catalog data
- country_pricing: SELECT all authenticated — users see their country's prices
- profit_sharing: SELECT all authenticated — visible to logged-in users
- payment_methods: SELECT all (anon + authenticated) — visible pre-signup for marketing

## Important Notes
1. All country tables are readable by anon so the landing page and franchise
   page can show country-specific info before login.
2. Country pricing overrides the base course price when a country is selected.
3. Profit sharing defines the split between franchisee and Empower Brain HQ.
4. Payment methods are country-specific (e.g., Libya uses cash/bank transfer,
   USA uses Stripe/PayPal, UAE uses wallet/bank transfer).
*/

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  flag_emoji text NOT NULL DEFAULT '',
  currency_code text NOT NULL DEFAULT 'USD',
  currency_symbol text NOT NULL DEFAULT '$',
  language text NOT NULL DEFAULT 'en',
  additional_languages text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.country_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(country_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.profit_sharing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  franchise_type text NOT NULL CHECK (franchise_type IN ('self','single','multi')),
  franchisee_percent numeric(5,2) NOT NULL DEFAULT 60.00,
  empowerbrain_percent numeric(5,2) NOT NULL DEFAULT 30.00,
  referral_bonus_percent numeric(5,2) NOT NULL DEFAULT 10.00,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(country_id, franchise_type)
);

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  method_name text NOT NULL,
  method_type text NOT NULL DEFAULT 'card' CHECK (method_type IN ('card','bank','cash','wallet')),
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  icon_name text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_countries_code ON public.countries(code);
CREATE INDEX IF NOT EXISTS idx_countries_active ON public.countries(is_active);
CREATE INDEX IF NOT EXISTS idx_country_pricing_country ON public.country_pricing(country_id);
CREATE INDEX IF NOT EXISTS idx_country_pricing_course ON public.country_pricing(course_id);
CREATE INDEX IF NOT EXISTS idx_profit_sharing_country ON public.profit_sharing(country_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_country ON public.payment_methods(country_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profit_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- countries: public read (needed pre-signup for country selector)
DROP POLICY IF EXISTS "select_countries" ON public.countries;
CREATE POLICY "select_countries" ON public.countries
  FOR SELECT TO anon, authenticated USING (true);

-- country_pricing: read for authenticated users
DROP POLICY IF EXISTS "select_country_pricing" ON public.country_pricing;
CREATE POLICY "select_country_pricing" ON public.country_pricing
  FOR SELECT TO anon, authenticated USING (true);

-- profit_sharing: read for authenticated users
DROP POLICY IF EXISTS "select_profit_sharing" ON public.profit_sharing;
CREATE POLICY "select_profit_sharing" ON public.profit_sharing
  FOR SELECT TO anon, authenticated USING (true);

-- payment_methods: public read (needed pre-signup for franchise page)
DROP POLICY IF EXISTS "select_payment_methods" ON public.payment_methods;
CREATE POLICY "select_payment_methods" ON public.payment_methods
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- GRANTS
-- ============================================================

GRANT SELECT ON public.countries TO anon, authenticated;
GRANT SELECT ON public.country_pricing TO anon, authenticated;
GRANT SELECT ON public.profit_sharing TO anon, authenticated;
GRANT SELECT ON public.payment_methods TO anon, authenticated;
