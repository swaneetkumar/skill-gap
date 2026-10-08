// ============================================================================
// Test Suite for Rule-Based Chatbot Engine & Knowledge Base
// Tests all queries from Requirement 15 and edge cases
// ============================================================================

const assert = require("assert");
const fs = require("fs");
const path = require("path");

// Mock browser global environment
global.window = global;
global.localStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; },
  clear() { this.data = {}; }
};
global.sessionStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; },
  clear() { this.data = {}; }
};

// Load datasets
require("./jobs_data.js");
require("./target_roles_data.js");
const knowledgeBase = require("./chatbot_knowledge_base.js");
const chatbot = require("./chatbot.js");

console.log("================================================================");
console.log("🧪 TESTING SKILL GAP FORCE RULE-BASED CHATBOT ENGINE");
console.log("================================================================");

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

// -------------------------------------------------------------
// Suite 1: Knowledge Base JSON & JS Integrity
// -------------------------------------------------------------
console.log("\n--- Suite 1: Knowledge Base JSON & Structure ---");

runTest("chatbot_knowledge_base.json is valid JSON with all required topics", () => {
  const jsonContent = fs.readFileSync(path.join(__dirname, "chatbot_knowledge_base.json"), "utf8");
  const parsed = JSON.parse(jsonContent);
  assert(Array.isArray(parsed), "KB must be an array");
  assert(parsed.length >= 20, `KB must have at least 20 topics, found ${parsed.length}`);
  
  const requiredTopics = [
    "greeting_hi", "greeting_who_are_you", "greeting_thanks", "greeting_bye",
    "platform_what_is", "platform_how_it_works", "platform_skill_gap_meaning",
    "resume_upload", "resume_formats", "resume_extraction", "skills_add_remove", "resume_reupload",
    "jobs_why_seeing", "match_percentage", "jobs_sort", "jobs_load_more",
    "meaning_your_missing_skills", "saved_jobs", "job_apply",
    "target_jobs", "target_jobs_7_roles", "target_jobs_change_role", "target_jobs_pie_chart",
    "sessions_mock_interview", "sessions_mentorship", "sessions_how_to_book",
    "account_edit_profile", "account_photo", "account_projects", "account_logout", "account_password_rules", "account_data_safe"
  ];

  requiredTopics.forEach(topicId => {
    const entry = parsed.find(t => t.id === topicId);
    assert(entry, `Topic '${topicId}' must exist in knowledge base`);
    assert(Array.isArray(entry.keywords) && entry.keywords.length > 0, `${topicId} must have keywords`);
    assert(typeof entry.answer === "string" && entry.answer.length > 20, `${topicId} must have detailed answer`);
    assert(Array.isArray(entry.followUps) && entry.followUps.length > 0, `${topicId} must have followUps`);
    // Rule: Friendly, short answers (2-4 sentences), NO roadmap / where-to-learn content
    assert(!entry.answer.toLowerCase().includes("where to learn"), "Must not include where to learn roadmap");
  });
});

// -------------------------------------------------------------
// Suite 2: Requirement 15 Core Query Verification
// -------------------------------------------------------------
console.log("\n--- Suite 2: Requirement 15 Mandatory Test Queries ---");

// 1. "hi"
runTest("Test 1: 'hi' -> returns welcome greeting", () => {
  const res = chatbot.matchMessage("hi", knowledgeBase);
  assert.strictEqual(res.topicId, "greeting_hi");
  assert(res.answer.toLowerCase().includes("welcome to skill gap force"));
  assert(Array.isArray(res.quickReplies) && res.quickReplies.length > 0);
});

// 2. "resume kaise upload karu"
runTest("Test 2: 'resume kaise upload karu' -> returns resume upload guide", () => {
  const res = chatbot.matchMessage("resume kaise upload karu", knowledgeBase);
  assert.strictEqual(res.topicId, "resume_upload");
  assert(res.answer.toLowerCase().includes("upload resume"));
  assert(Array.isArray(res.quickReplies) && res.quickReplies.length > 0);
});

// 3. "match percentage kaise calculate hota hai"
runTest("Test 3: 'match percentage kaise calculate hota hai' -> returns match formula", () => {
  const res = chatbot.matchMessage("match percentage kaise calculate hota hai", knowledgeBase);
  assert.strictEqual(res.topicId, "match_percentage");
  assert(res.answer.includes("Matched Skills ÷ Required Skills") || res.answer.includes("100%"));
  assert(Array.isArray(res.quickReplies) && res.quickReplies.length > 0);
});

// 4. "mere missing skills kya hain" - without resume/skills
runTest("Test 4a: 'mere missing skills kya hain' (without resume/skills) -> prompts resume upload", () => {
  global.localStorage.clear();
  global.sessionStorage.clear();
  const res = chatbot.matchMessage("mere missing skills kya hain", knowledgeBase);
  assert(res.answer.includes("Upload your resume first"));
  assert(res.quickReplies.some(qr => qr.label.includes("Upload Resume")));
});

// 4. "mere missing skills kya hain" - with active booking context
runTest("Test 4b: 'mere missing skills kya hain' (with booking context) -> lists identified missing skills", () => {
  global.localStorage.setItem("userSelectedSkills", JSON.stringify(["JavaScript", "React"]));
  global.sessionStorage.setItem("currentBookingJob", JSON.stringify({
    jobTitle: "Senior Frontend Engineer",
    company: "Stripe",
    missingSkills: [{ name: "TypeScript" }, { name: "System Design" }]
  }));
  const res = chatbot.matchMessage("mere missing skills kya hain", knowledgeBase);
  assert(res.answer.includes("Senior Frontend Engineer"));
  assert(res.answer.includes("TypeScript"));
  assert(res.answer.includes("System Design"));
});

// 5. "mere saved jobs dikhao" - without saved jobs
runTest("Test 5a: 'mere saved jobs dikhao' (no saved jobs) -> tells user no jobs saved", () => {
  global.localStorage.removeItem("userSavedJobIds");
  const res = chatbot.matchMessage("mere saved jobs dikhao", knowledgeBase);
  assert(res.answer.includes("haven't saved any jobs"));
});

// 5. "mere saved jobs dikhao" - with saved jobs
runTest("Test 5b: 'mere saved jobs dikhao' (with saved jobs) -> lists user's saved jobs and companies", () => {
  global.localStorage.setItem("userSavedJobIds", JSON.stringify(["stripe-senior-frontend", "linear-product-engineer"]));
  const res = chatbot.matchMessage("mere saved jobs dikhao", knowledgeBase);
  assert(res.answer.includes("2 saved"));
  assert(res.answer.includes("Senior Frontend Engineer"));
  assert(res.answer.includes("Stripe"));
  assert(res.answer.includes("Linear"));
});

// 6. "random gibberish" -> fallback
runTest("Test 6: 'random gibberish' -> returns friendly fallback with quick replies", () => {
  const res = chatbot.matchMessage("random gibberish xzqwerty", knowledgeBase);
  assert.strictEqual(res.topicId, "fallback");
  assert(res.answer.includes("I can't help with that yet"));
  assert(res.quickReplies.length >= 4);
  assert(res.quickReplies.some(qr => qr.label === "How does match % work?"));
});

// 7. "docker kahan se seekhu" -> must give the fallback per requirement 9
runTest("Test 7: 'docker kahan se seekhu' -> returns friendly fallback (NO external learning roadmap)", () => {
  const res = chatbot.matchMessage("docker kahan se seekhu", knowledgeBase);
  assert.strictEqual(res.topicId, "fallback");
  assert(res.answer.includes("I can't help with that yet"));
  assert(res.quickReplies.length >= 4);
});

// -------------------------------------------------------------
// Suite 3: Personalized Profile Intelligence
// -------------------------------------------------------------
console.log("\n--- Suite 3: Personalized Profile Intelligence ---");

runTest("Personalized 'my skills' -> lists user's verified skills", () => {
  global.localStorage.setItem("userSelectedSkills", JSON.stringify(["Python", "Machine Learning", "PyTorch", "SQL"]));
  const res = chatbot.matchMessage("my skills", knowledgeBase);
  assert(res.answer.includes("4 verified skills"));
  assert(res.answer.includes("Python"));
  assert(res.answer.includes("Machine Learning"));
});

runTest("Personalized 'my best match role' -> computes highest matching target role", () => {
  // Candidate with AI & ML skills should best match AI Engineer or ML Engineer
  global.localStorage.setItem("userSelectedSkills", JSON.stringify([
    "Python", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "NLP", "LLM"
  ]));
  const res = chatbot.matchMessage("my best match role", knowledgeBase);
  assert(res.answer.includes("AI Engineer") || res.answer.includes("Machine Learning Engineer"));
  assert(res.answer.includes("% match"));
});

// -------------------------------------------------------------
// Suite 4: Hinglish & Multi-word Keyword Ranking
// -------------------------------------------------------------
console.log("\n--- Suite 4: Hinglish & Multi-word Ranking ---");

runTest("Hinglish query: '7 roles kaun se hai' -> maps to target_jobs_7_roles", () => {
  const res = chatbot.matchMessage("7 roles kaun se hai", knowledgeBase);
  assert.strictEqual(res.topicId, "target_jobs_7_roles");
  assert(res.answer.includes("Software Engineer (SDE)"));
});

runTest("Hinglish query: 'profile edit kaise kare' -> maps to account_edit_profile", () => {
  const res = chatbot.matchMessage("profile edit kaise kare", knowledgeBase);
  assert.strictEqual(res.topicId, "account_edit_profile");
});

runTest("Tie-breaker & Multi-word weighting: 'what is skill gap' matches platform_skill_gap_meaning over platform_what_is", () => {
  const res = chatbot.matchMessage("what does skill gap mean", knowledgeBase);
  assert.strictEqual(res.topicId, "platform_skill_gap_meaning");
});

console.log("\n================================================================");
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed} ✅`);
console.log(`FAILED: ${failed} ❌`);
console.log("================================================================");

if (failed > 0) process.exit(1);
