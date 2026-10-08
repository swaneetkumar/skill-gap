# Skill Gap Force -- Resume Skill Extractor Backend

A fast, lightweight Python Flask service that extracts skills from uploaded resumes (**PDF**, **DOC**, **DOCX**) using **case-insensitive keyword matching** (no AI / LLM / external API keys required).

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.9+ installed on your system.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Backend Server
```bash
python app.py
```
Or on Windows, simply double-click `start_server.bat`.

The server will start at:
```
http://localhost:5000
```

---

## 📡 API Reference

### Health Check
```http
GET http://localhost:5000/health
```
**Response:**
```json
{
  "status": "online",
  "total_skills_supported": 164,
  "pdfplumber": true,
  "python_docx": true
}
```

---

### Extract Skills from Resume
```http
POST http://localhost:5000/extract-skills
Content-Type: multipart/form-data
```

**Form Parameter:**
- `resume`: Binary file (PDF, DOC, or DOCX, max 5MB)

**Response:**
```json
{
  "filename": "john_doe_resume.pdf",
  "count": 7,
  "skills": [
    "Python",
    "React",
    "Docker",
    "SQL",
    "Git",
    "Machine Learning",
    "Communication"
  ]
}
```

---

## 🔍 How Keyword Matching Works

1. **Text Extraction**:
   - Uses `pdfplumber` for high-fidelity text extraction from PDFs.
   - Uses `python-docx` for `.docx` documents (with fallback for legacy `.doc`).

2. **Accurate Word Boundary Matching**:
   - Uses regex with boundary lookarounds `(?<![a-zA-Z0-9])` and `(?![a-zA-Z0-9])`.
   - Prevents substring false positives (e.g. `"React"` does not match inside `"Reaction"`, `"Java"` does not falsely match `"JavaScript"`).
   - Accurately handles special symbols like `C++`, `C#`, `.NET`, `Node.js`, and single-letter languages like `C` and `R`.

3. **160+ Curated Skills**:
   - **Programming**: Python, JavaScript, TypeScript, Java, C++, C#, C, Go, Rust, Swift, Kotlin, Ruby, PHP, Scala, R, Bash, etc.
   - **Web Technologies**: HTML, CSS, React, Vue.js, Angular, Next.js, Node.js, Express.js, Django, Flask, FastAPI, Spring Boot, Tailwind CSS, etc.
   - **Tools & DevOps**: Git, Docker, Kubernetes, Linux, AWS, Azure, GCP, Figma, Jira, Postman, etc.
   - **Data & AI**: SQL, MySQL, PostgreSQL, MongoDB, Data Analysis, Machine Learning, Deep Learning, NLP, TensorFlow, PyTorch, Pandas, etc.
   - **Soft Skills**: Communication, Leadership, Project Management, Agile, Scrum, Problem Solving, Time Management, etc.
