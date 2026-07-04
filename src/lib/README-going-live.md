# StareX — how the app works & how to go fully live

## What works right now (today, no setup)

The whole product is functional in the browser using a local data engine
(`src/lib/store.js`) that persists to `localStorage` and updates the UI in
real time (even across two browser tabs — open the owner console in one tab
and a customer in another).

**Customer side**
- Sign up / log in (real accounts, validated email + password)
- Book a pickup → creates a real order
- Dashboard with live order tracking, stats, recent orders
- My Orders (full history + filters + live status timeline)
- Account (profile, saved addresses, laundry preferences)

**Owner side (`/admin`)**
- Incoming-orders queue with a live "N new" badge — this is how you know
  an order arrived the moment it happens
- Accept an order, then advance it through each stage
  (Placed → Confirmed → Picked up → Washing → Folding → Out for delivery → Delivered)
- Every status change instantly updates the customer's tracking view
- KPIs (new / in-progress / today / revenue / customers / rating)
- Customers list

### Demo logins (on the login page: "Try it instantly")
- **Owner:** `owner@starex.ca` / `starex2025`
- **Customer:** `ava@example.com` / `password`

To wipe demo data and start clean, run in the browser console:
`localStorage.clear()` then refresh.

---

## The one limitation

`localStorage` lives in a single browser on a single device. So today, an
order placed on a customer's phone won't appear on your laptop's owner
console — each device has its own copy. That's fine for demos and testing,
but to run the real business you need a shared cloud database so every
device sees the same orders. That's the "go live" step below.

---

## Going fully live (shared cloud database) — recommended: Supabase

Supabase gives you real accounts + a shared database + real-time updates,
with a generous free tier. Because the whole app already talks to ONE file
(`src/lib/store.js`), going live means swapping the inside of that file's
functions for Supabase calls — no page or component has to change.

**Steps (about 30–45 min):**
1. Create a free project at https://supabase.com
2. Create two tables: `profiles` (id, name, email, phone, role, addresses jsonb, prefs jsonb)
   and `orders` (all the fields you see in `createOrder` in `store.js`).
3. Turn on Supabase Auth (email/password) — replaces `login` / `signup`.
4. Install the client: `npm i @supabase/supabase-js`
5. Rewrite the bodies of the functions in `store.js`
   (`login`, `signup`, `createOrder`, `getAllOrders`, `advanceOrder`, etc.)
   to call Supabase instead of `localStorage`. Use Supabase Realtime so the
   owner console still updates the instant an order arrives.
6. Add your Supabase URL + anon key to a `.env` file.

I can do this whole step for you once you create the Supabase account and
share the project URL + anon key (the anon key is safe to use in the app).

**Then deploy** the site (Vercel or Netlify, free): connect the repo, it
builds `freshdrop/`, and you're live at a real URL. Point your domain at it.

---

## Suggested "next features" (from competitors like Rinse, Cleanly, Poplin)
- SMS/email notifications on each status change (Twilio / Resend)
- Real payments at delivery (Stripe) instead of the current estimate
- Subscription plans (weekly pickups) tied to the pricing page
- Driver view (a stripped-down admin for the person doing pickups)
- Referral credits
