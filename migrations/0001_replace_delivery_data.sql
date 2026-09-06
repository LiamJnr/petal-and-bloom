-- Add buyer-only metadata without interrupting the currently deployed API.
ALTER TABLE orders ADD COLUMN buyer_json TEXT NOT NULL DEFAULT '{}';

-- Remove data collected by earlier versions. New orders keep this legacy field
-- empty while the new buyer_json field is the only metadata written by checkout.
UPDATE orders SET delivery_json = '{}';
