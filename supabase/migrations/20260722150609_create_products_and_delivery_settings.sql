/*
# Create products and delivery_settings tables

1. New Tables
- `products`: stores all product information (name, price, stock, description, image, category, active status)
- `delivery_settings`: single-row config table for Lebanon delivery settings (delivery time estimate, delivery fee, free delivery threshold, active areas)
2. Security
- RLS enabled on both tables
- anon + authenticated CRUD (single-tenant admin app, no sign-in required)
3. Notes
- products table has: id, name, price, stock, description, image_url, category, is_active, created_at, updated_at
- delivery_settings table has: id, delivery_time_days, delivery_fee, free_delivery_threshold, is_active
- delivery_settings has a single row enforced by a check constraint on id = 1
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS delivery_settings (
  id integer PRIMARY KEY DEFAULT 1,
  delivery_time_days integer NOT NULL DEFAULT 3,
  delivery_fee numeric(10, 2) NOT NULL DEFAULT 5.00,
  free_delivery_threshold numeric(10, 2) NOT NULL DEFAULT 50.00,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE delivery_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_delivery" ON delivery_settings;
CREATE POLICY "anon_select_delivery" ON delivery_settings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_delivery" ON delivery_settings;
CREATE POLICY "anon_insert_delivery" ON delivery_settings FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_delivery" ON delivery_settings;
CREATE POLICY "anon_update_delivery" ON delivery_settings FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_delivery" ON delivery_settings;
CREATE POLICY "anon_delete_delivery" ON delivery_settings FOR DELETE
TO anon, authenticated USING (true);

INSERT INTO delivery_settings (id, delivery_time_days, delivery_fee, free_delivery_threshold, is_active)
VALUES (1, 3, 5.00, 50.00, true)
ON CONFLICT (id) DO NOTHING;