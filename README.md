# DICE Scholarship Exam Portal

**Digital Institute of Computer Education (DICE)**  
Smart, Secure & Adaptive Scholarship & Merit Examination System

ڈجیٹل انسٹیٹیوٹ آف کمپیوٹر ایجوکیشن کا جدید اسکالرشپ و قابلیت امتحانی پورٹل

---

## Features

- **Student Portal**
  - Secure Roll Number based login
  - Adaptive 25-question diagnostic exam (IQ + Computer Aptitude + Ethics/Mustahiq)
  - Multi-language support (Urdu / Roman Urdu / English)
  - Real-time result & leaderboard

- **Admin / Examiner Portal**
  - Submission management
  - AI-assisted grading (Gemini)
  - Comprehensive student reports
  - Scholarship tier allocation (Platinum / Gold / Silver / Bronze)

- **Technical**
  - React 19 + Vite + Tailwind CSS
  - Express backend + Google Gemini AI
  - Hybrid localStorage + API persistence

---

## Quick Start (Local)

```bash
# Install dependencies
bun install   # or npm install

# Copy environment file
cp .env.example .env
# Add your GEMINI_API_KEY in .env

# Run development server
bun run dev
```

Open http://localhost:3000

---

## Deployment (Vercel)

1. Connect this GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
3. Deploy from `main` branch

Every push to `main` will automatically trigger a new production deployment.

---

## Login Credentials

### Student Login
- Format: `A` + Even digit + `B` + Odd digit  
  Examples: `A2B3`, `A4B7`, `A0B1`, `A8B5`
- Special allowed: `A3B4`

### Admin / Examiner Login
- Use the Admin access button on login page
- Default security key: `@#$%^&*`

> **Security Note**: For production, change the admin key and consider moving verification to the backend.

---

## Project Structure

```
src/
├── components/
│   ├── LoginGateway/     # Entry point
│   ├── ExamTaking/       # Adaptive exam runner
│   ├── StudentPortal/    # Student dashboard
│   ├── AdminChecking/    # Admin dashboard + Grading studio
│   └── ResultSearching/  # Result cards
├── services/
│   ├── questionEngine.ts # 25-question adaptive engine
│   ├── examService.ts    # API + localStorage layer
│   └── scienceFilter.ts
├── data/                 # Questions, translations, mock data
└── types.ts
```

---

## License

Private - Digital Institute of Computer Education
