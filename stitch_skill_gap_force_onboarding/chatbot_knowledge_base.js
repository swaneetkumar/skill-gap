// ============================================================================
// Skill Gap Force -- Chatbot Knowledge Base (Rule-based dataset)
// Dual export: window.CHATBOT_KNOWLEDGE_BASE and module.exports
// ============================================================================

(function (global) {
  const CHATBOT_KNOWLEDGE_BASE = [
    {
      id: "greeting_hi",
      keywords: ["hi", "hello", "hey", "namaste", "hlo", "heya", "hola", "namashkar", "pranam", "kese ho", "kaise ho", "kya haal hai", "salam", "wassup", "sup"],
      answer: "Hello! Welcome to Skill Gap Force. I'm your dedicated assistant here to help you evaluate your resume, understand skill gaps, and explore target tech roles.",
      followUps: ["match_percentage", "my_missing_skills", "resume_upload", "target_jobs"]
    },
    {
      id: "greeting_who_are_you",
      keywords: ["who are you", "what can you do", "who r u", "kaun ho tum", "tum kaun ho", "kya kar sakte ho", "about assistant", "who made you", "aap kaun ho", "what is your job", "assistant", "bot", "chatbot", "introduce yourself", "apna introduction do"],
      answer: "I am your Skill Gap Assistant, a rule-based guide built for Skill Gap Force. I can help analyze your skills, explain match calculations, review missing requirements, guide your resume upload, and explore target roles.",
      followUps: ["my_skills", "match_percentage", "target_jobs"]
    },
    {
      id: "greeting_thanks",
      keywords: ["thanks", "thank you", "thx", "shukriya", "dhanyawad", "thank u", "many thanks", "bahut shukriya", "dhanyavad", "shukriya ji"],
      answer: "You're very welcome! I'm always here to help you navigate your career journey. Feel free to ask more questions anytime.",
      followUps: ["jobs_why_seeing", "saved_jobs", "account_edit_profile"]
    },
    {
      id: "greeting_bye",
      keywords: ["bye", "goodbye", "alvida", "see you", "tata", "phir milenge", "cya", "bye bye", "take care", "chalta hu", "bye bot"],
      answer: "Goodbye! Best of luck bridging your skill gaps and preparing for top tech roles. See you again soon!",
      followUps: ["resume_upload", "jobs_why_seeing"]
    },
    {
      id: "platform_what_is",
      keywords: ["what is skill gap force", "skill gap force kya hai", "about platform", "about website", "skill gap force matlab", "what is this platform", "platform info", "what is this app", "kya hai ye app", "about this project", "skill gap force project"],
      answer: "Skill Gap Force is an intelligent career acceleration platform designed to evaluate candidate resumes against live industry benchmarks. It computes exact match scores for top tech jobs and highlights priority missing skills to bridge.",
      followUps: ["platform_how_it_works", "match_percentage", "resume_upload"]
    },
    {
      id: "platform_how_it_works",
      keywords: ["how does it work", "kaise kaam karta hai", "platform kaise kaam karta hai", "how it works", "workflow", "process kya hai", "kaam kaise karta hai", "how does this app work", "how to use platform", "kaise use kare"],
      answer: "Upload your resume in PDF or DOCX format to have your technical skills extracted automatically. The system then calculates real-time match percentages across verified tech jobs and helps you target specific career paths.",
      followUps: ["resume_upload", "match_percentage", "target_jobs"]
    },
    {
      id: "platform_skill_gap_meaning",
      keywords: ["what does skill gap mean", "skill gap kya hota hai", "skill gap matlab", "skill gap meaning", "what is skill gap", "gap ka matlab", "gap kya hota hai", "skill gap kya hai", "skill gap explain karo", "skill gap samjhao"],
      answer: "A skill gap is the difference between the technical competencies required by an employer and the skills currently present in your profile. Pinpointing and closing this gap significantly increases your interview shortlisting rate.",
      followUps: ["my_missing_skills", "match_percentage", "target_jobs"]
    },
    {
      id: "resume_upload",
      keywords: ["how to upload resume", "resume kaise upload kare", "resume upload kaise kare", "upload resume", "resume upload", "kahan upload kare", "resume kaise dale", "resume upload process", "resume kaise upload karu", "upload my resume", "resume kahan dale"],
      answer: "Navigate to the 'Upload Resume & Select Skills' page, then drag and drop your file into the upload box or click to browse. The system validates your file and automatically extracts your technical skills.",
      followUps: ["resume_formats", "resume_extraction", "skills_add_remove"]
    },
    {
      id: "resume_formats",
      keywords: ["supported formats", "file formats", "formats", "file type", "max size", "size limit", "pdf doc docx", "5mb", "kitna size", "kaunse format", "which format", "resume format", "resume size", "formats allowed", "acceptable file types"],
      answer: "We support PDF, DOC, and DOCX resume formats with a maximum file size limit of 5MB. Make sure your document contains selectable text rather than scanned images for accurate skill extraction.",
      followUps: ["resume_upload", "resume_extraction"]
    },
    {
      id: "resume_extraction",
      keywords: ["how skills are auto-extracted", "auto extract kaise hoti hai", "skills extract kaise hoti hai", "extraction process", "resume parsing", "parser kaise kaam karta hai", "auto extract", "skills kaise aati hai", "skills extraction", "parser kya karta hai"],
      answer: "Our backend parses your document using pdfplumber and python-docx, scanning the text against our catalog of over 110 technical skills. Identified skills are automatically populated as interactive badges in your profile.",
      followUps: ["skills_add_remove", "resume_reupload"]
    },
    {
      id: "skills_add_remove",
      keywords: ["add remove skills manually", "skills manually add kaise kare", "remove skill", "skill kaise delete kare", "add skill", "skills kaise badhaye", "manually skills", "skill delete", "skill add", "skills edit kaise kare", "manual skill addition"],
      answer: "On the Upload Resume page, type any skill into the search bar to add it manually to your profile. You can remove any skill chip at any time by clicking the '×' button on that badge.",
      followUps: ["resume_upload", "match_percentage"]
    },
    {
      id: "resume_reupload",
      keywords: ["change resume", "re-upload resume", "resume change kaise kare", "reupload", "resume update kaise kare", "nayi resume kaise dale", "replace resume", "resume badalna", "dusra resume upload karna"],
      answer: "You can re-upload your resume anytime by visiting the Upload Resume page. Click the remove button ('×') on your current resume card and select a new file to re-run skill extraction.",
      followUps: ["resume_upload", "resume_formats"]
    },
    {
      id: "jobs_why_seeing",
      keywords: ["why am i seeing these jobs", "ye jobs kyu dikh rahi hai", "why these jobs", "recommendations reason", "jobs kis base pe aati hai", "jobs kyu aa rahi hai", "job recommendation logic", "why recommended"],
      answer: "Your job recommendations are ranked based on the match percentage between your extracted skills and job requirements. We highlight openings where your background gives you the strongest competitive advantage.",
      followUps: ["match_percentage", "jobs_sort", "jobs_load_more"]
    },
    {
      id: "match_percentage",
      keywords: ["how match % is calculated", "how does match % work", "match percentage kaise calculate hota hai", "match score", "percentage formula", "matched skills / required skills x 100", "formula kya hai", "match kaise nikalte hai", "match percentage formula", "match calculation", "match percentage logic"],
      answer: "Match percentage is calculated as: (Matched Skills ÷ Required Skills) × 100%. For instance, if a job requires 10 skills and your resume matches 8 of them, your match score is exactly 80%.",
      followUps: ["my_missing_skills", "jobs_why_seeing", "saved_jobs"]
    },
    {
      id: "jobs_sort",
      keywords: ["how to sort", "sort kaise kare", "sort options", "sorting", "best match sort", "salary high to low", "salary low to high", "filter jobs", "jobs sort kaise kare", "sorting dropdown"],
      answer: "On the Job Recommendations page, use the Sort dropdown to arrange listings by 'Best Match', 'Salary: High to Low', or 'Salary: Low to High'. This lets you quickly prioritize the most relevant or lucrative roles.",
      followUps: ["match_percentage", "jobs_load_more"]
    },
    {
      id: "jobs_load_more",
      keywords: ["what load more does", "load more kya karta hai", "load more button", "more jobs", "aur jobs dekhna", "load more ka matlab", "more openings", "load more option"],
      answer: "Clicking 'Load More' expands your view with additional verified job openings matching your profile and category affinity. You can explore as many opportunities as you want.",
      followUps: ["jobs_sort", "saved_jobs"]
    },
    {
      id: "meaning_your_missing_skills",
      keywords: ["meaning of your skills and missing skills", "your skills missing skills matlab", "your skills ka matlab", "missing skills ka matlab", "gap difference", "what is your skills", "your skills kya hai", "missing skills kya hota hai"],
      answer: "'Your Skills' indicates the qualifications you already satisfy for that position. 'Missing Skills' points out the key required technologies you lack, helping you focus your preparation effectively.",
      followUps: ["match_percentage", "saved_jobs", "job_apply"]
    },
    {
      id: "saved_jobs",
      keywords: ["how to save a job", "where saved jobs appear", "job save kaise kare", "saved jobs kahan dikhenge", "bell icon", "saved jobs button", "save job", "bookmark job", "saved jobs kahan hai", "saved jobs kaha dekhe", "job bookmark kaise kare"],
      answer: "Click the bookmark icon on any job card to save it to your account. You can view all saved listings by clicking the Saved Jobs button (with the bell/bookmark icon) in the Job Recommendations header.",
      followUps: ["my_saved_jobs", "job_apply", "jobs_why_seeing"]
    },
    {
      id: "job_apply",
      keywords: ["how apply works", "apply kaise kare", "apply button", "apply process", "job me apply kaise kare", "kaise apply kare", "application process", "apply karne ka tarika"],
      answer: "Clicking the 'Apply Now' button redirects you directly to the employer's official job posting or company career portal. This ensures you submit your application through legitimate hiring channels.",
      followUps: ["saved_jobs", "meaning_your_missing_skills"]
    },
    {
      id: "target_jobs",
      keywords: ["what is target your jobs", "target your jobs kya hai", "target jobs matlab", "target role kya hai", "what is target role", "target role matlab", "target your jobs", "target role feature"],
      answer: "Target Your Jobs enables you to benchmark your skillset against 7 industry-standard tech professions. It displays an interactive readiness breakdown and highlights the exact competencies needed to bridge any gap.",
      followUps: ["target_jobs_7_roles", "target_jobs_pie_chart", "target_jobs_change_role"]
    },
    {
      id: "target_jobs_7_roles",
      keywords: ["the 7 roles", "7 roles", "available roles", "roles kaun se hai", "software engineer", "ai engineer", "machine learning engineer", "data scientist", "data engineer", "full-stack developer", "devops engineer", "saat roles", "konse roles hai", "list 7 roles"],
      answer: "The 7 supported roles are: Software Engineer (SDE), AI Engineer, Machine Learning Engineer, Data Scientist, Data Engineer, Full-Stack Developer, and DevOps Engineer. Each role features tailored industry skill benchmarks.",
      followUps: ["target_jobs", "target_jobs_change_role", "my_best_match_role"]
    },
    {
      id: "target_jobs_change_role",
      keywords: ["how to change role", "role change kaise kare", "change target role", "switch role", "dusra role kaise chune", "role kaise badle", "change role button"],
      answer: "On the Target Skill Gap Result page, click the 'Change Role' button in the header or card to return to the 7-role selection grid. You can switch between roles as often as you like.",
      followUps: ["target_jobs_7_roles", "target_jobs_pie_chart"]
    },
    {
      id: "target_jobs_pie_chart",
      keywords: ["what the pie chart means", "pie chart kya hai", "chart matlab", "donut chart", "percentage chart", "chart kya dikhata hai", "pie chart ka matlab", "chart explanation"],
      answer: "The interactive pie chart visualizes your skill readiness for the selected role: teal represents the percentage of required skills you have mastered, while dark/rose indicates your remaining skill gap.",
      followUps: ["target_jobs", "my_missing_skills"]
    },
    {
      id: "sessions_mock_interview",
      keywords: ["what a mock interview is", "mock interview kya hai", "mock interview meaning", "practice mock interview", "interview prep", "mock session", "mock interview", "mock interview details"],
      answer: "Mock interviews provide realistic 1-on-1 technical and behavioral practice sessions tailored to your target job profile. Please note that this feature is currently under active development and coming soon!",
      followUps: ["sessions_mentorship", "sessions_how_to_book"]
    },
    {
      id: "sessions_mentorship",
      keywords: ["what 1:1 mentorship is", "1:1 mentorship kya hai", "mentorship session", "mentor kya karta hai", "silicon valley mentors", "mentorship", "mentorship details", "1 on 1 mentorship"],
      answer: "1:1 Mentorship connects you directly with verified Silicon Valley engineering mentors for personalized career and resume reviews. This feature is also launching soon!",
      followUps: ["sessions_mock_interview", "sessions_how_to_book"]
    },
    {
      id: "sessions_how_to_book",
      keywords: ["how to book", "book kaise kare", "session book kaise kare", "booking process", "slot kaise book kare", "kaise book kare", "book session", "appointment booking"],
      answer: "You can explore mock interviews and mentorship from the Book 1:1 Session page. Full calendar scheduling and instant slot booking will be released very soon.",
      followUps: ["sessions_mock_interview", "sessions_mentorship"]
    },
    {
      id: "account_edit_profile",
      keywords: ["how to edit profile", "profile edit kaise kare", "edit profile", "profile update", "profile kaise badle", "profile update kaise kare", "change details in profile"],
      answer: "Click your user profile avatar in the header and select 'Edit Profile'. From there, you can update your contact information, location, education, experience, and portfolio projects.",
      followUps: ["account_photo", "account_projects"]
    },
    {
      id: "account_photo",
      keywords: ["change photo", "photo kaise change kare", "profile photo", "avatar change", "camera photo", "gallery photo", "photo upload", "dp change", "picture change", "photo kaise badle"],
      answer: "On the Edit Profile page, click your profile picture to select a new image from your gallery or capture one with your device camera. Your new avatar will update immediately across the platform.",
      followUps: ["account_edit_profile", "account_projects"]
    },
    {
      id: "account_projects",
      keywords: ["add projects", "projects add kaise kare", "portfolio projects", "project kaise jode", "github projects", "projects section", "project add karna hai"],
      answer: "In the Edit Profile section, go to the Projects tab and click 'Add Project'. You can add your project name, technologies used, live URL, and GitHub repository link.",
      followUps: ["account_edit_profile", "my_skills"]
    },
    {
      id: "account_logout",
      keywords: ["log out", "logout", "logout kaise kare", "sign out", "account band kaise kare", "exit account", "logout karna hai", "sign out process"],
      answer: "Click your user profile avatar in the header and choose 'Sign Out' from the dropdown menu. This securely ends your session and redirects you to the login screen.",
      followUps: ["account_edit_profile", "account_data_safe"]
    },
    {
      id: "account_password_rules",
      keywords: ["password rules", "password requirements", "password rules kya hai", "password kaisa hona chahiye", "minimum characters", "special symbol", "password policy", "password criteria"],
      answer: "Passwords must be at least 8 characters long and include at least one special symbol (such as !, @, #, $, %, ^, &, or *). This keeps your account protected against unauthorized access.",
      followUps: ["account_data_safe", "account_edit_profile"]
    },
    {
      id: "account_data_safe",
      keywords: ["is my data safe", "data safe hai kya", "security", "privacy", "data safe", "data secure hai", "privacy policy", "data security", "kya mera data safe hai"],
      answer: "Yes, your data is completely secure. Your resume and profile details are encrypted and stored within your private account in Supabase, and we never share your data with unauthorized third parties.",
      followUps: ["account_edit_profile", "resume_upload"]
    }
  ];

  if (typeof window !== "undefined") {
    window.CHATBOT_KNOWLEDGE_BASE = CHATBOT_KNOWLEDGE_BASE;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = CHATBOT_KNOWLEDGE_BASE;
  }
})(typeof window !== "undefined" ? window : global);
