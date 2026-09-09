# DICE Scholarship Exam Portal

**Digital Institute of Computer Education (DICE)**  
Professional • Secure • Adaptive Scholarship & Merit Examination System

ڈجیٹل انسٹیٹیوٹ آف کمپیوٹر ایجوکیشن کا جدید، محفوظ اور اسمارٹ اسکالرشپ و قابلیت امتحانی پورٹل

---

## Security Features (Updated)

- **Server-side Admin Authentication** — Password is never checked in the browser
- **Rate limiting** on admin login (max 8 attempts, then 15-min lockout)
- **Security headers** (X-Frame-Options, X-Content-Type-Options, etc.)
- **Input sanitization** on exam submissions
- Admin password controlled via environment variable `ADMIN_SECRET`

---

## Features

### Student Portal
- Secure Roll Number based login
- Adaptive 25-question diagnostic exam (IQ + Computer Aptitude + Ethics/Mustahiq)
- Multi-language support (Urdu / Roman Urdu / English)
- Results & Leaderboard

### Admin / Examiner Portal
- Secure server-verified login
- Submission management & AI-assisted grading (Gemini)
- Comprehensive student reports
- Scholarship tier allocation (Platinum / Gold / Silver / Bronze)

---

## Quick Start (Local)

```bash
bun install          # or npm install
cp .env.example .env
# Edit .env → add GEMINI_API_KEY and a strong ADMIN_SECRET
bun run dev
```

Open http://localhost:3000

---

## Deployment on Vercel

1. Connect this GitHub repository to Vercel
2. In Vercel → Project → Settings → Environment Variables add:
   - `GEMINI_API_KEY` = your key
   - `ADMIN_SECRET` = a strong unique password (very important)
3. Deploy from `main` branch

Every push to `main` automatically triggers a new production deployment.

---

## Login Credentials

### Student Login
- Format: `A` + Even digit + `B` + Odd digit  
  Examples: `A2B3`, `A4B7`, `A0B1`, `A8B5`
- Special allowed: `A3B4`

### Admin / Examiner Login
- Use the **Admin Access** button on the login page
- Password = value of `ADMIN_SECRET` environment variable
- If `ADMIN_SECRET` is not set, temporary fallback is used (change it immediately in production)

---

## Important Production Notes

1. **Always set `ADMIN_SECRET`** in Vercel environment variables
2. Never commit real passwords or API keys
3. Current data storage is in-memory + localStorage hybrid (suitable for moderate traffic). For large scale, consider adding a proper database (e.g. Vercel KV / Postgres)

---

## License

Private — Digital Institute of Computer Education
