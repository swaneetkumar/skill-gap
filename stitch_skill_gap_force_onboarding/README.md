# ⚡ Skill Gap Force

> **Precision Career & Skill Gap Engine** — Empowering career growth through real-time skill matching, resume parsing, and personalized career recommendations.

---

## 🌟 Overview

**Skill Gap Force** is a modern, comprehensive career platform designed to help job seekers and professionals analyze skill gaps, discover tailored job opportunities, book 1:1 mentorship sessions, and interact with a dedicated career assistant.

The platform is designed with a sleek, high-contrast dark theme, seamless Supabase authentication, live camera profile capture, and automated resume parsing.

---

## ✨ Features

- 🌓 **Curated Dark Mode Experience**: Consistent dark aesthetic across all pages (Landing, Signup, Login, Resume Upload, Job Recommendations, Detail, Saved Jobs, Sessions, and Profile).
- 📸 **Live Photo Capture & Avatar Sync**: Capture a live selfie during signup, automatically uploaded to Supabase Storage with instant session persistence across logins.
- 📄 **Resume Parsing & Skills Setup**: Upload resumes (`.pdf`, `.docx`) with validation and extraction powered by a Python backend.
- 🎯 **Target Jobs & Skill Gap Analysis**: View real-time match percentages, missing skill breakdowns, and actionable upskilling roadmaps.
- 🤖 **Interactive Skill Gap Assistant**: Built-in floating chatbot with quick-reply suggestions, responsive rule-based answers, and helpful career guidance.
- 🔒 **Secure Authentication & Cloud Storage**: Fully integrated with Supabase for user authentication, database records, and avatar storage.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System & Tokens), JavaScript (ES6+)
- **Backend / Services**: Supabase (Auth, Postgres DB, Storage Buckets), Python backend (`app.py`) for resume extraction
- **Icons & Typography**: Google Fonts (Inter / Space Grotesk), Lucide / Material Icons

---

## 🚀 Getting Started

### 1. Prerequisites
- Modern web browser (Chrome, Edge, Firefox)
- Python 3.8+ (for resume extraction backend)

### 2. Running the Python Backend (Optional for Resume Parsing)
```bash
python app.py
```
*The backend runs on `http://localhost:8000`.*

### 3. Launching the Web App
Open `index.html` directly in your browser or run a simple local web server:
```bash
# Using Python
python -m http.server 3000

# Or using Node.js / npx
npx serve .
```
Navigate to `http://localhost:3000` to start exploring.

---

## 📂 Project Structure

```
├── index.html                                    # Main Landing Page
├── supabaseClient.js                             # Supabase integration & auth helpers
├── app.py                                        # Python backend for resume parsing
├── styles/                                       # Design tokens & dark mode styling
├── skill_gap_force_onboarding_signup/           # Registration with webcam capture
├── skill_gap_force_onboarding_login/            # Authentication & session restore
├── skill_gap_force_resume_skills_setup/         # Resume upload & parsing
├── skill_gap_force_job_recommendations/         # Tailored job recommendations
├── skill_gap_force_job_detail/                  # Detailed job specification & apply
├── skill_gap_force_saved_jobs/                  # Saved & bookmarked jobs
├── skill_gap_force_book_1:1_session/            # 1:1 Mentorship & Assistant chatbot
└── skill_gap_force_edit_profile/                # User profile & avatar management
```

---

## 📄 License

This project is created for educational and professional career engine development.
