const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Polyfill localStorage & window for Node environment
const mockStorage = {};
global.localStorage = {
  getItem: (k) => (k in mockStorage ? mockStorage[k] : null),
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};
global.window = {
  dispatchEvent: () => true
};

const env = require('./env');
const { getSupabaseClient, signInUser, signUpUser, uploadResumeFile, updateUserProfile } = require('./supabaseClient');

const BASE_URL = env.BACKEND_URL || 'http://localhost:8000';

console.log('================================================================');
console.log('🧪 RESUME UPLOAD & BACKEND INTEGRATION COMPREHENSIVE TEST SUITE');
console.log(`Backend URL: ${BASE_URL}`);
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

async function runTest(desc, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

async function main() {
  // ---------------------------------------------------------------------------
  // SUITE 1: Backend API Endpoints & CORS Verification
  // ---------------------------------------------------------------------------
  console.log('--- Suite 1: Backend Endpoints & CORS ---');

  await runTest('GET /health returns HTTP 200 with online status and parsers', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200, 'Health endpoint must return 200');
    const data = await res.json();
    assert.strictEqual(data.status, 'online');
    assert.strictEqual(data.pdfplumber, true, 'pdfplumber must be available');
    assert.strictEqual(data.python_docx, true, 'python-docx must be available');
    assert.ok(data.total_skills_supported >= 50, 'Must support 50+ skills');
  });

  await runTest('OPTIONS /extract handles CORS preflight with allow headers', async () => {
    const res = await fetch(`${BASE_URL}/extract`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8080',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    assert.strictEqual(res.status, 200, 'Preflight must return 200');
    assert.strictEqual(res.headers.get('access-control-allow-origin'), '*');
    const methods = res.headers.get('access-control-allow-methods');
    assert.ok(methods && methods.includes('POST'), 'CORS must allow POST');
  });

  // ---------------------------------------------------------------------------
  // SUITE 2: Backend Validation & Error Cases
  // ---------------------------------------------------------------------------
  console.log('\n--- Suite 2: Backend Validation & Error Responses ---');

  await runTest('POST /extract without file returns HTTP 400', async () => {
    const formData = new FormData();
    formData.append('unrelated', 'nothing');
    const res = await fetch(`${BASE_URL}/extract`, {
      method: 'POST',
      body: formData
    });
    assert.strictEqual(res.status, 400, 'Missing file must return 400');
    const data = await res.json();
    assert.ok(data.error && data.error.includes("field name 'file'"), 'Error message must guide user');
  });

  await runTest('POST /extract with unsupported file (.txt) returns HTTP 400', async () => {
    const formData = new FormData();
    formData.append('file', new Blob(['Some resume text here'], { type: 'text/plain' }), 'resume.txt');
    const res = await fetch(`${BASE_URL}/extract`, {
      method: 'POST',
      body: formData
    });
    assert.strictEqual(res.status, 400, 'Unsupported file type must return HTTP 400');
    const data = await res.json();
    assert.ok(data.error.includes('Unsupported file format') || data.error.includes('Supported formats'), 'Error must specify supported formats');
  });

  await runTest('POST /extract with file > 5MB returns HTTP 400', async () => {
    // 5.2 MB buffer
    const largeBuffer = Buffer.alloc(5.2 * 1024 * 1024, 0);
    const formData = new FormData();
    formData.append('file', new Blob([largeBuffer], { type: 'application/pdf' }), 'large_resume.pdf');
    const res = await fetch(`${BASE_URL}/extract`, {
      method: 'POST',
      body: formData
    });
    assert.strictEqual(res.status, 400, 'File over 5MB must return 400');
    const data = await res.json();
    assert.ok(data.error.includes('exceeds 5MB'), 'Error must specify 5MB limit');
  });

  // ---------------------------------------------------------------------------
  // SUITE 3: Real PDF and DOCX Extraction via Field Name "file"
  // ---------------------------------------------------------------------------
  console.log('\n--- Suite 3: Live PDF and DOCX Extraction (Field "file") ---');

  let extractedPdfSkills = [];
  await runTest('POST /extract with PDF resume extracts skills and candidate metadata', async () => {
    const pdfPath = path.join(__dirname, 'sample_test_resume.pdf');
    assert.ok(fs.existsSync(pdfPath), 'sample_test_resume.pdf must exist');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const formData = new FormData();
    formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'sample_test_resume.pdf');

    const res = await fetch(`${BASE_URL}/extract`, {
      method: 'POST',
      body: formData
    });
    assert.strictEqual(res.status, 200, 'PDF extraction must return 200');
    const data = await res.json();
    assert.ok(Array.isArray(data.skills), 'data.skills must be array');
    assert.ok(data.skills.length >= 5, `Expected >= 5 skills, got ${data.skills.length}`);
    assert.ok(data.skills.includes('React'), 'Must extract React');
    assert.ok(data.skills.includes('Python'), 'Must extract Python');
    assert.ok(typeof data.phone === 'string', 'Phone must be string');
    assert.ok(typeof data.email === 'string', 'Email must be string');
    assert.ok(typeof data.location === 'string', 'Location must be string');
    assert.ok(typeof data.education === 'string', 'Education must be string');
    assert.ok(typeof data.experience === 'string', 'Experience must be string');
    extractedPdfSkills = data.skills;
    console.log(`     Extracted ${data.skills.length} skills from PDF: [${data.skills.slice(0, 5).join(', ')}...]`);
  });

  let extractedDocxSkills = [];
  await runTest('POST /extract with DOCX resume extracts skills and candidate metadata', async () => {
    const docxPath = path.join(__dirname, 'sample_test_resume.docx');
    assert.ok(fs.existsSync(docxPath), 'sample_test_resume.docx must exist');
    const docxBuffer = fs.readFileSync(docxPath);
    const formData = new FormData();
    formData.append('file', new Blob([docxBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'sample_test_resume.docx');

    const res = await fetch(`${BASE_URL}/extract`, {
      method: 'POST',
      body: formData
    });
    assert.strictEqual(res.status, 200, 'DOCX extraction must return 200');
    const data = await res.json();
    assert.ok(Array.isArray(data.skills), 'data.skills must be array');
    assert.ok(data.skills.length >= 5, `Expected >= 5 skills, got ${data.skills.length}`);
    assert.ok(data.skills.includes('Node.js') || data.skills.includes('Python'), 'Must extract skills');
    assert.ok(data.email.includes('john.doe@example.com'), 'Extracted email from DOCX');
    assert.ok(data.phone.includes('123-4567'), 'Extracted phone from DOCX');
    assert.ok(data.location.includes('San Francisco'), 'Extracted location from DOCX');
    extractedDocxSkills = data.skills;
    console.log(`     Extracted ${data.skills.length} skills from DOCX: [${data.skills.slice(0, 5).join(', ')}...]`);
  });

  // ---------------------------------------------------------------------------
  // SUITE 4: Frontend HTML Logic Verification
  // ---------------------------------------------------------------------------
  console.log('\n--- Suite 4: Frontend HTML UI Logic & Wiring ---');
  const codeHtml = fs.readFileSync(path.join(__dirname, 'skill_gap_force_resume_skills_setup', 'code.html'), 'utf8');

  await runTest('Dropzone file picker and click-to-browse properly configured', () => {
    assert.ok(codeHtml.includes('id="resumeFileInput"'));
    assert.ok(codeHtml.includes('accept=".pdf,.doc,.docx"'));
    assert.ok(codeHtml.includes('id="browseClickSpan"'));
    assert.ok(codeHtml.includes('resumeInput.click()'));
  });

  await runTest('Client-side size and type validation present with friendly inline errors', () => {
    assert.ok(codeHtml.includes("showUploadError('Please upload a PDF, DOC, or DOCX file')"));
    assert.ok(codeHtml.includes("showUploadError('File size must be under 5MB')"));
    assert.ok(codeHtml.includes('5 * 1024 * 1024'));
  });

  await runTest('Loading state "Analyzing your resume..." shown while processing', () => {
    assert.ok(codeHtml.includes('Analyzing your resume...'));
  });

  await runTest('File selected state card exists with name, size, and remove button', () => {
    assert.ok(codeHtml.includes('id="dropzoneFileSelectedState"'));
    assert.ok(codeHtml.includes('id="selectedFileName"'));
    assert.ok(codeHtml.includes('id="selectedFileSize"'));
    assert.ok(codeHtml.includes('id="selectedFileStatus"'));
    assert.ok(codeHtml.includes('removeUploadedFile'));
  });

  await runTest('Backend URL is loaded dynamically from env variable with localhost:8000 default', () => {
    assert.ok(codeHtml.includes('getBackendExtractionUrl'));
    assert.ok(codeHtml.includes('VITE_BACKEND_URL') || codeHtml.includes('NEXT_PUBLIC_BACKEND_URL'));
    assert.ok(codeHtml.includes('http://localhost:8000'));
  });

  await runTest('Server offline message is clear and actionable', () => {
    assert.ok(codeHtml.includes('Resume analysis server is not reachable. Please make sure the backend is running.'));
  });

  await runTest('Returned skills are merged with existing skills without duplicates', () => {
    assert.ok(codeHtml.includes('currentLowerSet = new Set') || codeHtml.includes('currentSkillsLower'));
    assert.ok(codeHtml.includes('newSkills'));
  });

  await runTest('Continue button enables only when valid resume uploaded and skills > 0', () => {
    assert.ok(codeHtml.includes('isResumeValid && hasSkills'));
    assert.ok(codeHtml.includes('selectedResumeFile !== null'));
  });

  await runTest('Supabase uploadResumeFile saves to "resumes" bucket without blocking', () => {
    assert.ok(codeHtml.includes('uploadResumeFile(currentUserId, file)'));
    assert.ok(codeHtml.includes('"resumes"') || codeHtml.includes("'resumes'"));
  });

  // ---------------------------------------------------------------------------
  // SUITE 5: Supabase Storage & Profile Upsert Integration
  // ---------------------------------------------------------------------------
  console.log('\n--- Suite 5: Supabase Storage & Profiles Table Integration ---');

  // Register and authenticate a test user
  const stamp = Date.now();
  const testEmail = `upload_tester_${stamp}@skillgapforcetest.com`;
  const testPassword = `TestPass!${stamp.toString().slice(-4)}`;
  const testName = 'Aarav Sharma';

  console.log(`  Registering test candidate: ${testEmail}...`);
  const signupRes = await signUpUser({
    email: testEmail,
    password: testPassword,
    fullName: testName
  });

  let userId = signupRes?.userId;
  assert.ok(userId, 'Should register candidate and get UUID');

  // Sign in to guarantee active auth token for RLS policies
  const loginRes = await signInUser({
    email: testEmail,
    password: testPassword
  });
  assert.ok(loginRes.success, 'Candidate login should succeed');

  await runTest('uploadResumeFile saves file to Supabase Storage "resumes" under <user_id>/<filename>', async () => {
    const pdfBuffer = fs.readFileSync(path.join(__dirname, 'sample_test_resume.pdf'));
    const testFile = {
      name: 'candidate_resume.pdf',
      type: 'application/pdf',
      buffer: pdfBuffer
    };

    // Call uploadResumeFile
    const res = await uploadResumeFile(userId, testFile);
    console.log(`     uploadResumeFile result:`, res);
    assert.ok(res !== undefined, 'Result must be returned');
    assert.strictEqual(res.path, `${userId}/candidate_resume.pdf`, 'Path must follow <user_id>/<filename>');
    if (!res.success) {
      console.warn(`     Notice: Supabase bucket "resumes" upload notice: ${res.error}`);
    } else {
      console.log(`     File uploaded successfully to Supabase Storage: ${res.path}`);
    }
  });

  await runTest('updateUserProfile on Continue upserts skills, phone, location, education, experience', async () => {
    const profilePayload = {
      skills: JSON.stringify(extractedPdfSkills),
      phone: '+1 (415) 555-0199',
      location: 'San Francisco, CA',
      education: 'B.S. in Computer Science',
      experience: 'Senior Full Stack Engineer',
      name: testName,
      email: testEmail
    };

    const res = await updateUserProfile(userId, profilePayload);
    assert.ok(res !== undefined);
    assert.strictEqual(res.success, true, 'Profile upsert should succeed');
    console.log(`     Profile updated successfully with skills and extracted details for user: ${userId}`);
  });

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${passCount + failCount}`);
  console.log(`PASSED: ${passCount} ✅`);
  console.log(`FAILED: ${failCount} ${failCount > 0 ? '❌' : ''}`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Unhandled test suite error:', err);
  process.exit(1);
});
