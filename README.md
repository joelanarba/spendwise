# SpendWise

A mobile-first personal finance tracker that helps you understand where your money goes.

## Quick Start

1. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run `supabase/schema.sql` in SQL Editor
   - Enable Email auth in Authentication settings

2. **Configure environment**
   ```bash
   cp env.example .env.local
   # Fill in your Supabase URL and anon key
   ```

3. **Run the app**
   ```bash
   npm install
   npm run dev
   ```

4. **Open in browser**
   - http://localhost:3000

## Features

- **Quick-add transactions** - Log spending in under 5 seconds
- **7 categories** - Food, Transport, Bills, Shopping, Fun, Health, Other
- **Weekly summary** - See spending breakdown by category
- **Week-over-week comparison** - Track if you're spending more or less
- **PWA support** - Install on phone, works offline

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router) |
| Backend | Supabase (Auth + PostgreSQL) |
| Styling | Tailwind CSS |
| PWA | Service Worker + Web Manifest |

## Project Structure

```
esp/
├── src/
│   ├── app/           # Next.js pages
│   ├── components/    # React components
│   └── lib/           # Utilities & Supabase clients
├── public/
│   ├── manifest.json  # PWA manifest
│   ├── sw.js          # Service worker
│   └── icons/         # App icons
├── supabase/
│   └── schema.sql     # Database schema
└── docs/              # Step-by-step documentation
```

## Documentation

- [Step 1: Supabase Setup](supabase/SETUP.md)
- [Step 2: Auth Flow](docs/STEP2_AUTH.md)
- [Step 3: Quick-add UI](docs/STEP3_QUICK_ADD.md)
- [Step 4: Weekly Summary](docs/STEP4_WEEKLY_SUMMARY.md)
- [Step 5: PWA Support](docs/STEP5_PWA.md)

## License

MIT
