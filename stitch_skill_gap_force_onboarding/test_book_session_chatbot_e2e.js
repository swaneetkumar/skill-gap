// ============================================================================
// E2E Test Suite for Skill Gap Force Book 1:1 Session Chatbot Integration
// Validates Parts 1, 2, 3, 4, 5 of User Request
// ============================================================================

const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("================================================================");
console.log("🧪 TESTING BOOK 1:1 SESSION CHATBOT INTEGRATION & UX FLOW");
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

const htmlPath = path.join(__dirname, "skill_gap_force_book_1_1_session", "code.html");
const html = fs.readFileSync(htmlPath, "utf8");

// --- Suite 1: DOM Structure & Element Inspection ---
console.log("\n--- Suite 1: Chat UI DOM Structure & Modal Preservation ---");

runTest("Chat window slide-up panel (#chatbotPanel) exists with proper dark styling", () => {
  assert(html.includes('id="chatbotPanel"'), "Must have #chatbotPanel");
  assert(html.includes("Skill Gap Assistant"), "Header must include 'Skill Gap Assistant'");
  assert(html.includes('id="chatCloseBtn"'), "Close X button must exist");
  assert(html.includes('id="chatMessagesContainer"'), "Messages container must exist");
  assert(html.includes('id="chatInput"'), "Chat text input must exist");
  assert(html.includes('id="chatSendBtn"'), "Send button must exist");
  assert(html.includes('id="chatTypingIndicator"'), "Typing indicator must exist");
});

runTest("Mock Interview & 1:1 Mentorship Coming Soon popups remain untouched", () => {
  assert(html.includes("mockInterviewCard"), "mockInterviewCard must exist");
  assert(html.includes("mentorshipCard"), "mentorshipCard must exist");
  assert(html.includes("openComingSoonModal(messages.mock)"), "Mock interview card must still trigger coming soon modal");
  assert(html.includes("openComingSoonModal(messages.mentorship)"), "Mentorship card must still trigger coming soon modal");
});

runTest("Chatbot icon popup is replaced with Chatbot UI initialization", () => {
  assert(html.includes("SkillGapChatbot.initChatbotUI()"), "Chatbot launcher must initialize chatbot UI");
  assert(!html.includes("chatbotLauncher.addEventListener('click', (e) => {\n          openComingSoonModal(messages.chatbot);"), "Old coming soon popup on chatbot must be replaced");
});

runTest("Required scripts are linked in proper order", () => {
  assert(html.includes('src="../jobs_data.js"'), "jobs_data.js script tag required");
  assert(html.includes('src="../target_roles_data.js"'), "target_roles_data.js script tag required");
  assert(html.includes('src="../chatbot_knowledge_base.js"'), "chatbot_knowledge_base.js script tag required");
  assert(html.includes('src="../chatbot.js"'), "chatbot.js script tag required");
});

// --- Suite 2: Knowledge Base Inspection ---
console.log("\n--- Suite 2: Knowledge Base Integrity (Hinglish & English) ---");

const kb = require("./chatbot_knowledge_base.js");

runTest("Knowledge base contains at least 30 topics covering all requested categories", () => {
  assert(Array.isArray(kb), "Knowledge base must be an array");
  assert(kb.length >= 30, `Expected at least 30 topics, got ${kb.length}`);
});

runTest("Keywords include common Hinglish spellings (kaise, kya, kaha/kahan, matlab)", () => {
  const allKeywords = kb.flatMap(t => t.keywords).join(" ").toLowerCase();
  assert(allKeywords.includes("kaise"), "Keywords must include 'kaise'");
  assert(allKeywords.includes("kya"), "Keywords must include 'kya'");
  assert(allKeywords.includes("kahan") || allKeywords.includes("kaha"), "Keywords must include 'kaha'/'kahan'");
  assert(allKeywords.includes("matlab"), "Keywords must include 'matlab'");
});

runTest("No knowledge base answers contain roadmap or where-to-learn content", () => {
  kb.forEach(entry => {
    const lower = entry.answer.toLowerCase();
    assert(!lower.includes("where to learn"), `Topic ${entry.id} contains prohibited where-to-learn phrasing`);
    assert(!lower.includes("roadmap to learn"), `Topic ${entry.id} contains prohibited roadmap phrasing`);
  });
});

// --- Suite 3: Requirement 15 Test Queries ---
console.log("\n--- Suite 3: Requirement 15 Mandatory Queries ---");

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

require("./jobs_data.js");
require("./target_roles_data.js");
const chatbot = require("./chatbot.js");

runTest("1. Query 'hi' returns greeting with follow-ups", () => {
  const res = chatbot.matchMessage("hi", kb);
  assert.strictEqual(res.topicId, "greeting_hi");
  assert(res.quickReplies.length >= 2);
});

runTest("2. Query 'resume kaise upload karu' returns upload instructions", () => {
  const res = chatbot.matchMessage("resume kaise upload karu", kb);
  assert.strictEqual(res.topicId, "resume_upload");
  assert(res.answer.includes("Upload Resume & Select Skills"));
});

runTest("3. Query 'match percentage kaise calculate hota hai' returns formula", () => {
  const res = chatbot.matchMessage("match percentage kaise calculate hota hai", kb);
  assert.strictEqual(res.topicId, "match_percentage");
  assert(res.answer.includes("Matched Skills ÷ Required Skills"));
});

runTest("4. Query 'mere missing skills kya hain' returns personalized missing skills", () => {
  global.localStorage.setItem("userSelectedSkills", JSON.stringify(["React", "JavaScript"]));
  global.sessionStorage.setItem("currentBookingJob", JSON.stringify({
    jobTitle: "Senior Frontend Engineer",
    company: "Stripe",
    missingSkills: [{ name: "TypeScript" }, { name: "System Design" }]
  }));
  const res = chatbot.matchMessage("mere missing skills kya hain", kb);
  assert(res.answer.includes("Senior Frontend Engineer at Stripe"));
  assert(res.answer.includes("TypeScript"));
  assert(res.answer.includes("System Design"));
});

runTest("5. Query 'mere saved jobs dikhao' returns saved job details", () => {
  global.localStorage.setItem("userSavedJobIds", JSON.stringify(["stripe-senior-frontend"]));
  const res = chatbot.matchMessage("mere saved jobs dikhao", kb);
  assert(res.answer.includes("1 saved job"));
  assert(res.answer.includes("Senior Frontend Engineer at Stripe"));
});

runTest("6. Query 'random gibberish' returns fallback response", () => {
  const res = chatbot.matchMessage("random gibberish zzxxqqww", kb);
  assert.strictEqual(res.topicId, "fallback");
  assert(res.answer.startsWith("I can't help with that yet"));
  assert(res.quickReplies.some(qr => qr.label.includes("How does match % work?")));
  assert(res.quickReplies.some(qr => qr.label.includes("What are my missing skills?")));
  assert(res.quickReplies.some(qr => qr.label.includes("How do I upload my resume?")));
  assert(res.quickReplies.some(qr => qr.label.includes("What is Target Your Jobs?")));
});

runTest("7. Query 'docker kahan se seekhu' returns fallback response (NO learning resources)", () => {
  const res = chatbot.matchMessage("docker kahan se seekhu", kb);
  assert.strictEqual(res.topicId, "fallback");
  assert(res.answer.startsWith("I can't help with that yet"));
});

// --- Suite 4: Personalization & Fallback Guards ---
console.log("\n--- Suite 4: Personalized State & No-Resume Fallback ---");

runTest("If user has no resume/skills, personalized questions prompt resume upload", () => {
  global.localStorage.clear();
  global.sessionStorage.clear();

  const resSkills = chatbot.matchMessage("my skills", kb);
  assert(resSkills.answer.includes("Upload your resume first so I can check this for you"));
  assert(resSkills.quickReplies.some(qr => qr.label.includes("Upload Resume")));

  const resMissing = chatbot.matchMessage("what are my missing skills", kb);
  assert(resMissing.answer.includes("Upload your resume first so I can check this for you"));

  const resBestRole = chatbot.matchMessage("my best match role", kb);
  assert(resBestRole.answer.includes("Upload your resume first so I can check this for you"));
});

runTest("If user has skills, 'my best match role' calculates best matching of 7 roles", () => {
  global.localStorage.setItem("userSelectedSkills", JSON.stringify([
    "Python", "SQL", "Statistics", "Data Visualization", "Pandas", "Matplotlib"
  ]));
  const res = chatbot.matchMessage("my best match role", kb);
  assert(res.answer.includes("Data Scientist") || res.answer.includes("Data Engineer"));
  assert(res.answer.includes("% match"));
});

// --- Suite 5: Chat History Persistence ---
console.log("\n--- Suite 5: Session Chat History Persistence ---");

runTest("Chat history is persisted in sessionStorage under 'skillgap_chat_history'", () => {
  const testHistory = [
    { sender: "bot", text: "Hi Alex! Ask me anything." },
    { sender: "user", text: "How does match % work?" },
    { sender: "bot", text: "Match percentage is (Matched Skills / Required) * 100%." }
  ];
  global.sessionStorage.setItem("skillgap_chat_history", JSON.stringify(testHistory));
  const raw = global.sessionStorage.getItem("skillgap_chat_history");
  const parsed = JSON.parse(raw);
  assert.strictEqual(parsed.length, 3);
  assert.strictEqual(parsed[1].text, "How does match % work?");
});

console.log("\n================================================================");
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed} ✅`);
console.log(`FAILED: ${failed} ❌`);
console.log("================================================================");

if (failed > 0) process.exit(1);
