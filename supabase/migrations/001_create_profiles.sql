-- StudentHub Supabase Database Migration
-- 001_create_profiles.sql

-- 1. Create public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    department TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comment on table and columns
COMMENT ON TABLE public.profiles IS 'Student profiles linked to auth.users';
COMMENT ON COLUMN public.profiles.id IS 'References the auth.users id';
COMMENT ON COLUMN public.profiles.full_name IS 'Full name of the student';
COMMENT ON COLUMN public.profiles.department IS 'Academic department/major of the student';

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Row Level Security Policies

-- Disallow public / anon access completely
-- Only authenticated users matching their own auth.uid() can read
DROP POLICY IF EXISTS "Students can view own profile" ON public.profiles;
CREATE POLICY "Students can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Only authenticated users matching their own auth.uid() can update
DROP POLICY IF EXISTS "Students can update own profile" ON public.profiles;
CREATE POLICY "Students can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Only authenticated users matching their own auth.uid() can insert their profile
DROP POLICY IF EXISTS "Students can insert own profile" ON public.profiles;
CREATE POLICY "Students can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- 4. Trigger Function to automatically create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, department, created_at, updated_at)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'department', ''),
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        updated_at = timezone('utc'::text, now())
    WHERE public.profiles.full_name IS NULL OR public.profiles.full_name = '';

    RETURN new;
END;
$$;

-- 5. Create Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6. Trigger to automatically update updated_at timestamp on profile changes
CREATE OR REPLACE FUNCTION public.handle_profile_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_updated();
