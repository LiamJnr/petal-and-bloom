# Petal & Bloom — Florist Website

This site remains a static Cloudflare Pages project, with Cloudflare Pages
Functions and D1 added for secure server-side payment handling. GitHub pushes
continue to deploy the storefront as they do today.

## Payment architecture (in progress)

- The browser will send its cart and recipient/delivery details to `/api/checkout`.
- A Pages Function will validate the data, create a pending D1 order, then create
  a Lemon Squeezy checkout without exposing private API credentials.
- Lemon Squeezy will notify `/api/webhook` after payment; that endpoint will
  verify the signature and mark the D1 order paid.
- The confirmation route (`?view=order-confirmed&order=…`) polls a minimal
  order-status endpoint and clears the flower bag only after that paid status
  is recorded.
- Delivery-preview fields remain on the checkout screen for presentation only;
  they are never read, persisted, or sent to Cloudflare or Lemon Squeezy.

The local foundation is in place: `wrangler.toml`, `schema.sql`, and
`.env.example`. No payment code or secrets have been added yet.

### One-time Cloudflare configuration (do this before the checkout endpoint is deployed)

1. In Cloudflare D1, create `petal-and-bloom-db`.
2. The D1 database ID is recorded in `wrangler.toml`.
3. Run the schema against the remote database:

   ```bash
   npx wrangler d1 execute petal-and-bloom-db --remote --file=./schema.sql
   ```

4. In the existing Cloudflare Pages project, add a D1 binding named `DB` that
   points to that database. `wrangler.toml` alone does not create the production
   Pages binding.
5. In Pages → Settings → Environment variables, add the values named in
   `.env.example` as encrypted secrets. Use Lemon Squeezy test credentials and
   `LEMONSQUEEZY_TEST_MODE=true` initially.

Do not add any of those secret values to GitHub.

### Lemon Squeezy webhook

After the next GitHub deployment, create a Lemon Squeezy webhook pointing to:

```
https://YOUR_PAGES_DOMAIN/api/webhook
```

Subscribe it to `order_created` and `order_refunded`. Copy its signing secret
to the `LEMONSQUEEZY_WEBHOOK_SECRET` encrypted Pages variable (Preview and
Production). The webhook signature is verified before any order is updated.

### Local Pages testing

After copying `.env.example` to `.dev.vars` and filling it with Lemon Squeezy
test credentials, run:

```bash
npx wrangler d1 execute petal-and-bloom-db --local --file=./schema.sql
npx wrangler pages dev . --port=8788
```

Do not add `--d1=DB` to the Pages command: the D1 binding is read from
`wrangler.toml`, which makes Pages use the same local database initialized by
the preceding command.

### Database migration: remove previously stored delivery data

Before deploying the buyer-only checkout endpoint, run this once against each
environment's D1 database:

```bash
npx wrangler d1 execute petal-and-bloom-db --remote --file=./migrations/0001_replace_delivery_data.sql
```

The migration keeps existing order rows, deliberately erases their old delivery
payloads, and adds buyer-only metadata. It is safe to run before deployment:
the currently deployed checkout remains compatible until GitHub deploys the
new buyer-only endpoint.

## Setup

1. Open `index.html`.
2. Replace the sample flower images in `/images/` with your own images using the same filenames, or change the image paths in the HTML.
3. Find each comment that says:
   `REPLACE # WITH YOUR LEMON SQUEEZY CHECKOUT URL`
4. Replace the `href="#"` on that product's Order button with the corresponding Lemon Squeezy checkout URL.
5. Replace the Birthday Bloom Box `href="#"` with your birthday package checkout URL.
6. Upload the folder to any static host such as GitHub Pages, Netlify, Vercel, or your own hosting.

## Product links

Example:

<a class="order-btn" href="YOUR_LEMON_SQUEEZY_CHECKOUT_URL" target="_blank" rel="noopener">Order</a>

The site has no backend or shopping cart. Lemon Squeezy handles checkout and payment.

## Included

- Responsive desktop/tablet/mobile design
- Feminine florist aesthetic
- Product collection
- Bouquet/Gift filters
- Special Birthday Event Package
- Mobile navigation
- Lemon Squeezy checkout placeholders
- Accessible image alt text
- SEO description
