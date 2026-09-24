/*
# Add missing columns for frontend compatibility

1. Modified Tables
- procurex_purchase_requests: add `quantity` (integer, default 1), `location` (text, default '')
- procurex_purchase_orders: add `material` (text, default ''), `quantity` (integer, default 0), `notes` (text, nullable)
- procurex_inventory: add `stock_level` (text, default 'OK') for computed stock level caching

2. Purpose
- The frontend expects these columns to exist directly on the tables rather than
  deriving them from JSONB `items` arrays. This simplifies the data access layer.

3. Security
- No security changes. RLS remains enabled with existing policies.
*/

ALTER TABLE procurex_purchase_requests ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1;
ALTER TABLE procurex_purchase_requests ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT '';
ALTER TABLE procurex_purchase_requests ADD COLUMN IF NOT EXISTS material text NOT NULL DEFAULT '';

ALTER TABLE procurex_purchase_orders ADD COLUMN IF NOT EXISTS material text NOT NULL DEFAULT '';
ALTER TABLE procurex_purchase_orders ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 0;
ALTER TABLE procurex_purchase_orders ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE procurex_inventory ADD COLUMN IF NOT EXISTS stock_level text NOT NULL DEFAULT 'OK';
