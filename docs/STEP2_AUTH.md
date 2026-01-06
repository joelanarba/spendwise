# Step 2: Auth Flow Setup

## Files Created

| File | Purpose |
|------|---------|
| `src/lib/supabase/client.ts` | Browser-side Supabase client |
| `src/lib/supabase/server.ts` | Server-side Supabase client (for Server Components) |
| `src/lib/supabase/middleware.ts` | Session refresh + route protection |
| `src/middleware.ts` | Next.js middleware entry point |
| `src/app/auth/callback/route.ts` | Magic link callback handler |
| `src/app/auth/signout/route.ts` | Sign out handler |
| `src/app/login/page.tsx` | Login page with magic link form |
| `src/app/dashboard/page.tsx` | Protected dashboard (post-login) |
| `src/app/page.tsx` | Public landing page |

---

## Configuration Required

### 1. Create `.env.local`

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Then fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key
```

Get these from: **Supabase Dashboard → Settings → API**

### 2. Configure Email Auth in Supabase

1. Go to **Authentication → Providers**
2. Enable **Email**
3. For MVP, set "Confirm email" to **OFF** (faster onboarding)
4. Set Site URL to: `http://localhost:3000`
5. Add redirect URL: `http://localhost:3000/auth/callback`

---

## Auth Flow Diagram

```
┌──────────────────┐
│   Landing Page   │  (/)
│   "Get Started"  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Login Page    │  (/login)
│  Enter email     │
│  "Send magic     │
│   link"          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Email Inbox    │
│  Click link      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Auth Callback    │  (/auth/callback)
│ Exchange code    │
│ for session      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Dashboard      │  (/dashboard)
│  (Protected)     │
└──────────────────┘
```

---

## Route Protection

The middleware automatically:

1. **Public routes** (`/`, `/login`, `/auth/*`): Allow all users
2. **Protected routes** (everything else): Redirect to `/login` if not authenticated
3. **Login page**: Redirect to `/dashboard` if already authenticated

---

## Testing the Auth Flow

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000`

3. Click "Get Started Free"

4. Enter your email and click "Send magic link"

5. Check your email and click the link

6. You should be redirected to `/dashboard`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing Supabase environment variables" | Create `.env.local` with your credentials |
| Magic link not arriving | Check spam folder, verify Supabase email settings |
| Callback error | Ensure redirect URL is added in Supabase Auth settings |
| Stuck on login after clicking link | Clear cookies and try again |

---

## Next Step

Once auth is working, proceed to **STEP 3: Quick-add Transaction UI**.
