/*
# Fix referral code generation in handle_new_user

## Problem
The handle_new_user trigger used gen_random_bytes() which is not available
in this Supabase instance. Replaced with gen_random_uuid() based hex generation.

## Changes
- Updated handle_new_user() to use md5(gen_random_uuid()::text) for random hex
  instead of gen_random_bytes()
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_referrer_id uuid;
  v_referral_code text;
  v_new_code text;
BEGIN
  -- Generate a unique referral code: EB + 6 hex chars from a UUID
  v_new_code := 'EB' || upper(substr(md5(gen_random_uuid()::text), 1, 6));

  -- Look up referrer from signup metadata
  v_referral_code := NEW.raw_user_meta_data->>'referral_code';
  IF v_referral_code IS NOT NULL AND v_referral_code <> '' THEN
    SELECT id INTO v_referrer_id FROM public.profiles WHERE referral_code = upper(v_referral_code);
  END IF;

  INSERT INTO public.profiles (id, email, full_name, referral_code, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    v_new_code,
    v_referrer_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
