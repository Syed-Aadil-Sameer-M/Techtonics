/*
# Auto-confirm new user emails

1. Modified Functions
- `handle_new_user()`: now also sets `email_confirmed_at` on the new auth.users row
  so that signup immediately grants a session without requiring email verification.

2. Purpose
- Email confirmation was enabled on the project, blocking new signups from
  getting a session. The app is designed for immediate access after signup.
  This makes the trigger auto-confirm the email as part of user creation.

3. Security
- No RLS changes. The function remains SECURITY DEFINER with execute revoked
  from anon and authenticated roles.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Auto-confirm the email so signUp returns a session immediately
  NEW.email_confirmed_at := now();

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
$function$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
