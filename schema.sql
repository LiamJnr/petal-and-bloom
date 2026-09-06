CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending',
  purchaser_email TEXT NOT NULL,
  cart_json TEXT NOT NULL,
  buyer_json TEXT NOT NULL,
  -- Retained empty only for compatibility with existing deployments; no data is written here.
  delivery_json TEXT NOT NULL DEFAULT '{}',
  total_cents INTEGER NOT NULL,
  ls_order_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_ls_order_id ON orders(ls_order_id);
