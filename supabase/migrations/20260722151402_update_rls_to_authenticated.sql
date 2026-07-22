/*
# Update RLS policies to authenticated-only

1. Security Changes
- products: switch from anon+authenticated to authenticated-only CRUD (admin app now has login)
- delivery_settings: switch from anon+authenticated to authenticated-only CRUD
2. Notes
- Admin must sign in with email/password to access any data
- Owner check uses auth.uid() is not needed since this is a single-admin app, but we restrict to authenticated
*/

-- Products: drop old anon policies, create authenticated-only
DROP POLICY IF EXISTS "anon_select_products" ON products;
DROP POLICY IF EXISTS "anon_insert_products" ON products;
DROP POLICY IF EXISTS "anon_update_products" ON products;
DROP POLICY IF EXISTS "anon_delete_products" ON products;

DROP POLICY IF EXISTS "auth_select_products" ON products;
CREATE POLICY "auth_select_products" ON products FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- Delivery settings: drop old anon policies, create authenticated-only
DROP POLICY IF EXISTS "anon_select_delivery" ON delivery_settings;
DROP POLICY IF EXISTS "anon_insert_delivery" ON delivery_settings;
DROP POLICY IF EXISTS "anon_update_delivery" ON delivery_settings;
DROP POLICY IF EXISTS "anon_delete_delivery" ON delivery_settings;

DROP POLICY IF EXISTS "auth_select_delivery" ON delivery_settings;
CREATE POLICY "auth_select_delivery" ON delivery_settings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_delivery" ON delivery_settings;
CREATE POLICY "auth_insert_delivery" ON delivery_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_delivery" ON delivery_settings;
CREATE POLICY "auth_update_delivery" ON delivery_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);