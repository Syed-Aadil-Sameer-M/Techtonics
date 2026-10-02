/*
# Revoke anon role access on all procurement tables

## Why
This app requires authentication (login/signup screens). The `anon` role
currently has SELECT, INSERT, UPDATE, DELETE on every procurement table,
meaning anyone with the public anon key can read, create, modify, or delete
all procurement data without signing in. This removes that access.

## Changes
- Revoke all privileges from `anon` on all procurex_* tables.
- Keep `authenticated` role privileges and existing policies unchanged
  (all tables use `USING (true)` which is acceptable for this shared-
  workspace procurement app where all signed-in users share the same data).

## Tables affected
- procurex_app_state
- procurex_audit_logs
- procurex_dispatches
- procurex_inventory
- procurex_notifications
- procurex_profiles
- procurex_purchase_orders
- procurex_purchase_requests
- procurex_suppliers
- procurex_tasks
- procurex_users

## Security
- anon role loses all access — unauthenticated requests return no rows.
- authenticated role retains access — signed-in users continue to work.
- RLS remains enabled on all tables.
*/

REVOKE ALL ON procurex_audit_logs FROM anon;
REVOKE ALL ON procurex_inventory FROM anon;
REVOKE ALL ON procurex_notifications FROM anon;
REVOKE ALL ON procurex_profiles FROM anon;
REVOKE ALL ON procurex_purchase_orders FROM anon;
REVOKE ALL ON procurex_purchase_requests FROM anon;
REVOKE ALL ON procurex_suppliers FROM anon;
REVOKE ALL ON procurex_tasks FROM anon;
