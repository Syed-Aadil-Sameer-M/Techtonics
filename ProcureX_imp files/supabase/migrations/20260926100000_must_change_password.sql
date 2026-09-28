ALTER TABLE public.procurex_profiles
  ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, now());

  INSERT INTO public.procurex_profiles (id, name, department, role, status, avatar_color, must_change_password)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'fullName', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Unassigned'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'requisitioner'),
    'active',
    'sky',
    true
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
