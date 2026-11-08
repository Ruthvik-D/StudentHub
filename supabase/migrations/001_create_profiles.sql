-- StudentHub Supabase Database Migration
-- 001_create_profiles.sql (Hardened & Corrected Order)

-- 1. Create public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    department TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documentation metadata
COMMENT ON TABLE public.profiles IS 'Student profiles linked to auth.users with strict RLS and column-level privileges';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users(id)';
COMMENT ON COLUMN public.profiles.full_name IS 'Full name of the student';
COMMENT ON COLUMN public.profiles.department IS 'Academic department/major of the student';
COMMENT ON COLUMN public.profiles.created_at IS 'Timestamp when the profile was first created (immutable, database-enforced)';
COMMENT ON COLUMN public.profiles.updated_at IS 'Timestamp when the profile was last modified (database-enforced)';

-- 2. Clean up any obsolete/legacy RLS policies to prevent permissive leftovers
DROP POLICY IF EXISTS "Students can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Students can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Students can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- 3. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create Strict, Isolated RLS Policies
-- Authenticated students can view ONLY their own profile record
CREATE POLICY "profiles_select_own"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Authenticated students can update ONLY their own profile record
CREATE POLICY "profiles_update_own"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Authenticated students can insert ONLY their own profile record
CREATE POLICY "profiles_insert_own"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- 5. Explicit Least-Privilege Table & Column-Level Grants
-- Revoke all table-level privileges from public, anon, and authenticated roles
REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated;

-- Grant SELECT on all columns to authenticated users
GRANT SELECT ON TABLE public.profiles TO authenticated;

-- Grant INSERT exclusively on user-controllable columns (protects created_at and updated_at)
GRANT INSERT (id, full_name, department) ON TABLE public.profiles TO authenticated;

-- Grant UPDATE exclusively on editable profile attributes (protects id, created_at, and updated_at)
GRANT UPDATE (full_name, department) ON TABLE public.profiles TO authenticated;

-- 6. Clean up any existing triggers and functions before recreation
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
DROP FUNCTION IF EXISTS public.handle_profile_updated();

DROP TRIGGER IF EXISTS on_profile_timestamps ON public.profiles;
DROP FUNCTION IF EXISTS public.handle_profile_timestamps();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 7. Trigger Function: Secure Timestamp Management & created_at Immutability
CREATE OR REPLACE FUNCTION public.handle_profile_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Force database authority: set both timestamps to server now()
        NEW.created_at := pg_catalog.now();
        NEW.updated_at := pg_catalog.now();
    ELSIF TG_OP = 'UPDATE' THEN
        -- Guarantee that original creation timestamp can NEVER be altered
        NEW.created_at := OLD.created_at;
        -- Always refresh updated_at to server now() on every modification
        NEW.updated_at := pg_catalog.now();
    END IF;
    RETURN NEW;
END;
$$;

-- Attach timestamp trigger to public.profiles
CREATE TRIGGER on_profile_timestamps
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_timestamps();

-- 8. Trigger Function: Automatically create profile on new user registration (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, department, created_at, updated_at)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'department', ''),
        pg_catalog.now(),
        pg_catalog.now()
    )
    ON CONFLICT (id) DO UPDATE
    SET
        -- Preserve existing profile information if already set
        full_name = CASE 
            WHEN profiles.full_name IS NULL OR profiles.full_name = '' 
            THEN EXCLUDED.full_name 
            ELSE profiles.full_name 
        END,
        department = CASE 
            WHEN profiles.department IS NULL OR profiles.department = '' 
            THEN EXCLUDED.department 
            ELSE profiles.department 
        END,
        updated_at = pg_catalog.now();

    RETURN new;
END;
$$;

-- Attach registration trigger to auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
