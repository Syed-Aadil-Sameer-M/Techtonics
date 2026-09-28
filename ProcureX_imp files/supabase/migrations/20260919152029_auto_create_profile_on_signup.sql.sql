-- Auto-create a procurex_profiles row when a new auth user is created.
-- Reads fullName, department, and role from raw_user_meta_data (passed via signUp options.data).
-- Runs as SECURITY DEFINER so it bypasses RLS (the new user may not have a session yet).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.procurex_profiles (id, name, department, role, status, avatar_color)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'fullName', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Unassigned'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'requisitioner'),
    'active',
    'sky'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
