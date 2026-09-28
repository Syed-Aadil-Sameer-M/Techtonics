/*
# Revoke all execute on handle_new_user

1. Security
- Revoke EXECUTE from all roles including PUBLIC to prevent the trigger
  function from being callable via the REST API.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
