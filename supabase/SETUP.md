# Supabase Setup Guide

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project (remember your database password)

---

## Step 1: Run the Schema

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `schema.sql` and paste it
5. Click **Run** (or press Ctrl/Cmd + Enter)

You should see: `Success. No rows returned`

---

## Step 2: Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should see 3 tables:
   - `profiles`
   - `transactions`
   - `budgets`

---

## Step 3: Verify RLS is Enabled

1. Click on each table
2. Click the **shield icon** (RLS) in the top right
3. Confirm it shows "RLS Enabled" with the policies listed

---

## Step 4: Get Your API Keys

1. Go to **Settings** > **API**
2. Copy these values (you'll need them for the frontend):

```
Project URL: https://xxxxx.supabase.co
anon (public) key: eyJhbGci...
```

**Never expose your `service_role` key in frontend code.**

---

## Step 5: Configure Auth Providers

For MVP, enable these in **Authentication** > **Providers**:

### Email (Magic Link)
1. Toggle **Email** ON
2. Set "Confirm email" to OFF (for faster onboarding in MVP)
3. Optionally enable "Magic Link" for passwordless login

### Phone (Optional, for global reach)
1. Toggle **Phone** ON
2. Configure Twilio credentials if you want SMS OTP

---

## Schema Summary

### profiles
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Links to auth.users |
| display_name | TEXT | Optional |
| currency | TEXT | 3-letter code, default 'USD' |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_at | TIMESTAMPTZ | Auto-updated |

### transactions
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated |
| user_id | UUID | Owner (FK to profiles) |
| amount | DECIMAL(12,2) | Must be > 0 |
| category | ENUM | food, transport, bills, shopping, entertainment, health, other |
| note | TEXT | Max 200 chars, optional |
| transaction_date | DATE | When the expense occurred |
| created_at | TIMESTAMPTZ | When logged |

### budgets
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated |
| user_id | UUID | Owner (FK to profiles) |
| category | ENUM | Same categories as transactions |
| weekly_limit | DECIMAL(12,2) | Must be > 0 |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_at | TIMESTAMPTZ | Auto-updated |

---

## Indexes Created

| Index | Purpose |
|-------|---------|
| `idx_transactions_user_date` | Fast lookup of recent transactions per user |
| `idx_transactions_user_category` | Filter transactions by category |
| `idx_transactions_date_range` | Weekly summary queries |
| `idx_budgets_user` | Quick budget lookup |

---

## RLS Policies Summary

All tables enforce Row Level Security:

- **profiles**: Users can only read/update their own row
- **transactions**: Full CRUD only on own transactions
- **budgets**: Full CRUD only on own budgets

This means even if someone has your API key, they cannot access other users' data.

---

## Testing the Schema

After applying, run this test query in SQL Editor:

```sql
-- This should return the enum values
SELECT unnest(enum_range(NULL::transaction_category));
```

Expected output:
```
food
transport
bills
shopping
entertainment
health
other
```

---

## Next Step

Once confirmed, proceed to **STEP 2: Auth Flow** to set up the frontend authentication.
