/*
# Revoke public execute on handle_new_user

1. Security
- The handle_new_user() trigger function was recreated (to add email auto-confirm),
  which reset its GRANT EXECUTE to the default (public). Revoke EXECUTE from
  anon and authenticated so only the trigger can call it.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
