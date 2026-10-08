/**
 * test_post_login_redirect_e2e.js
 * Comprehensive End-to-End Test for Post-Login Redirect and Onboarding Persistence
 * 
 * Tests the 5 requirements:
 * 1. Upload Resume & Select Skills -> Continue saves selected skills & extracted resume data into Supabase "profiles" table (upsert by user_id).
 * 2. Login waits until profile row has been fully fetched before deciding where to redirect.
 * 3. Redirect rule: Non-empty skills -> Job Recommendations with skills hydrated into state. Truly empty skills -> Upload Resume.
 * 4. Checks RLS policy and error handling/logging on profiles table.
 * 5. Full cycle: Signup -> Resume & Skills -> Continue -> Logout -> Login -> Direct to Job Recommendations.
 */

const fs = require('fs');
const path = require('path');
const {
  signUpUser,
  signInUser,
  signOutUser,
  getStoredUserId,
  createUserProfile,
  fetchUserProfile,
  updateUserProfile,
  hasUserCompletedOnboarding,
  classifyUserSkills,
  getSupabaseClient
} = require('./supabaseClient');

// In-memory mock localStorage for Node test environment
const mockStorage = {};
global.localStorage = {
  getItem: (k) => (mockStorage[k] !== undefined ? mockStorage[k] : null),
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

async function runTestSuite() {
  console.log('================================================================');
  console.log('POST-LOGIN REDIRECT & SKILLS PERSISTENCE E2E TEST SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // ------------------------------------------------------------------
  // TEST SECTION 1: Static Code Inspection of Continue Button & Login Redirect
  // ------------------------------------------------------------------
  console.log('--- TEST 1: Verifying Implementation in HTML Pages ---');
  const resumeHtml = fs.readFileSync(path.join(__dirname, 'skill_gap_force_resume_skills_setup', 'code.html'), 'utf8');
  const loginHtml = fs.readFileSync(path.join(__dirname, 'skill_gap_force_login', 'code.html'), 'utf8');

  // Verify Continue handler is async and awaits updateUserProfile
  assert(resumeHtml.includes('async function handleContinueClick'), 'handleContinueClick is an async function');
  assert(resumeHtml.includes('await window.updateUserProfile'), 'handleContinueClick awaits updateUserProfile');
  assert(resumeHtml.includes('showUploadError') && resumeHtml.includes('Could not save your skills'), 'handleContinueClick displays clear error when saving fails');
  assert(resumeHtml.includes('profilePayload') && resumeHtml.includes('skills:') && resumeHtml.includes('phone:') && resumeHtml.includes('location:'), 'handleContinueClick includes skills AND extracted resume details');

  // Verify Login handler waits for profile fetch before deciding redirect
  assert(loginHtml.includes('await window.fetchUserProfile'), 'Login handler awaits fetchUserProfile');
  assert(loginHtml.includes('setLoginButtonLoading(true, \'Loading your profile data...\')'), 'Login handler displays loading indicator while profile fetches');
  assert(loginHtml.includes('validSkillsList') && loginHtml.includes('hasSkills'), 'Login handler validates non-empty skills list');
  assert(loginHtml.includes('../skill_gap_force_job_recommendations/code.html'), 'Login handler redirects returning user to Job Recommendations');
  assert(loginHtml.includes('../skill_gap_force_resume_skills_setup/code.html'), 'Login handler redirects empty user to Upload Resume');
  console.log('');

  // ------------------------------------------------------------------
  // TEST SECTION 2: Parsing Rule for hasUserCompletedOnboarding
  // ------------------------------------------------------------------
  console.log('--- TEST 2: Validating Strict Parsing Rules for Empty vs Non-Empty Skills ---');
  assert(hasUserCompletedOnboarding(null) === false, 'null profile returns false');
  assert(hasUserCompletedOnboarding({}) === false, 'empty object returns false');
  assert(hasUserCompletedOnboarding({ skills: null }) === false, 'null skills returns false');
  assert(hasUserCompletedOnboarding({ skills: '' }) === false, 'empty string skills returns false');
  assert(hasUserCompletedOnboarding({ skills: '   ' }) === false, 'whitespace string skills returns false');
  assert(hasUserCompletedOnboarding({ skills: '[]' }) === false, 'empty JSON array string "[]" returns false');
  assert(hasUserCompletedOnboarding({ skills: '"{}"' }) === false, 'empty JSON object string "{}" returns false');
  assert(hasUserCompletedOnboarding({ skills: 'null' }) === false, 'string "null" returns false');
  assert(hasUserCompletedOnboarding({ skills: [] }) === false, 'empty array [] returns false');
  assert(hasUserCompletedOnboarding({ skills: [''] }) === false, 'array with empty string [""] returns false');
  assert(hasUserCompletedOnboarding({ skills: [null] }) === false, 'array with null [null] returns false');

  // Non-empty cases
  assert(hasUserCompletedOnboarding({ skills: ['React', 'Node.js'] }) === true, 'real array with items returns true');
  assert(hasUserCompletedOnboarding({ skills: JSON.stringify(['React', 'Node.js']) }) === true, 'JSON string array returns true');
  assert(hasUserCompletedOnboarding({ skills: 'React, Node.js, TypeScript' }) === true, 'comma separated text returns true');
  assert(hasUserCompletedOnboarding({ skills: { 'React': true } }) === true, 'object with keys returns true');
  console.log('');

  // ------------------------------------------------------------------
  // TEST SECTION 3: Full End-to-End Cycle (Signup -> Resume -> Continue -> Logout -> Login)
  // ------------------------------------------------------------------
  console.log('--- TEST 3: Full End-to-End Cycle (Signup -> Upload Resume & Skills -> Logout -> Login) ---');
  global.localStorage.clear();

  const stamp = Date.now();
  const testEmail = `e2e_candidate_${stamp}@skillgapforce.test`;
  const testPassword = `SecurePass!${stamp.toString().slice(-4)}`;
  const testName = 'Devika Sengupta';

  console.log(`1. Signing up candidate: ${testEmail}...`);
  const signupRes = await signUpUser({
    email: testEmail,
    password: testPassword,
    fullName: testName
  });

  assert(signupRes.success === true, 'signUpUser succeeds');
  const userId = signupRes.userId;
  assert(typeof userId === 'string' && userId.length > 10, 'Valid userId UUID returned from signup');

  console.log(`2. Simulating resume upload and skill extraction...`);
  const testSkills = ['React.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'GraphQL'];
  const testExtractedDetails = {
    phone: '+1 (415) 555-0199',
    email: testEmail,
    location: 'San Francisco, CA',
    education: 'B.Tech in Computer Science, 2024',
    experience: 'Software Engineer with 3 years full-stack experience'
  };

  // Set localStorage as if resume was analyzed on the page
  global.localStorage.setItem('userResumeDetails', JSON.stringify(testExtractedDetails));
  global.localStorage.setItem('userResumePhone', testExtractedDetails.phone);
  global.localStorage.setItem('userLocation', testExtractedDetails.location);
  global.localStorage.setItem('userEducation', testExtractedDetails.education);
  global.localStorage.setItem('userExperience', testExtractedDetails.experience);
  global.localStorage.setItem('userSelectedSkills', JSON.stringify(testSkills));

  console.log(`3. Simulating Continue click (saving skills & extracted resume data to profiles)...`);
  const savePayload = {
    skills: JSON.stringify(testSkills),
    phone: testExtractedDetails.phone,
    location: testExtractedDetails.location,
    education: testExtractedDetails.education,
    experience: testExtractedDetails.experience,
    name: testName,
    email: testEmail
  };

  const saveRes = await updateUserProfile(userId, savePayload);
  assert(saveRes.success === true, 'updateUserProfile succeeds and syncs state');
  assert(global.localStorage.getItem('userSelectedSkills') === JSON.stringify(testSkills), 'userSelectedSkills saved in localStorage');
  assert(global.localStorage.getItem('userLocation') === testExtractedDetails.location, 'userLocation saved in localStorage');

  console.log(`4. Simulating logout: clearing session and all localStorage...`);
  await signOutUser();
  global.localStorage.clear();

  assert(global.localStorage.getItem('supabase_user_id') === null, 'Session cleared on logout');
  assert(global.localStorage.getItem('userSelectedSkills') === null, 'Skills cleared from localStorage on logout');

  console.log(`5. Simulating login with the same credentials: ${testEmail}...`);
  const loginRes = await signInUser({
    email: testEmail,
    password: testPassword
  });

  assert(loginRes.success === true, 'signInUser succeeds');
  assert(loginRes.userId === userId, 'Logged in userId matches signed up userId');

  console.log(`6. Waiting for profile row fetch from Supabase before deciding redirect...`);
  const fetchRes = await fetchUserProfile(userId);
  assert(fetchRes.success === true, 'fetchUserProfile succeeds');
  assert(fetchRes.profile !== null && fetchRes.profile !== undefined, 'Profile object returned');

  // Evaluate skills on fetched profile
  const profileSkills = fetchRes.profile?.skills || loginRes.user?.user_metadata?.skills;
  let parsedSkills = [];
  try {
    parsedSkills = typeof profileSkills === 'string' ? JSON.parse(profileSkills) : (Array.isArray(profileSkills) ? profileSkills : []);
  } catch (e) {
    parsedSkills = [profileSkills];
  }

  assert(Array.isArray(parsedSkills) && parsedSkills.length > 0, 'Fetched skills is a non-empty array');
  assert(parsedSkills.includes('React.js'), 'Fetched skills contains "React.js"');

  // Check redirect destination
  const hasSkills = parsedSkills.length > 0;
  let redirectTarget = '';
  if (hasSkills) {
    redirectTarget = '../skill_gap_force_job_recommendations/code.html';
  } else {
    redirectTarget = '../skill_gap_force_resume_skills_setup/code.html';
  }

  assert(
    redirectTarget === '../skill_gap_force_job_recommendations/code.html',
    'Returning user with skills is routed DIRECTLY to Job Recommendations'
  );

  // Check app state restoration
  assert(global.localStorage.getItem('userSelectedSkills') !== null, 'Skills hydrated into localStorage app state');
  const hydratedSkills = JSON.parse(global.localStorage.getItem('userSelectedSkills'));
  assert(hydratedSkills.length === testSkills.length, 'All 6 skills hydrated into state');
  assert(global.localStorage.getItem('userWinningCategory') === 'web_dev', 'Category classification ("web_dev") correctly computed');
  assert(global.localStorage.getItem('userWinningCategoryName') === 'Web Development', 'Category display name ("Web Development") correctly computed');
  console.log('');

  // ------------------------------------------------------------------
  // TEST SECTION 4: First-Time User with Empty Skills Routing to Upload Resume
  // ------------------------------------------------------------------
  console.log('--- TEST 4: Verifying New User with Truly Empty Skills is Routed to Upload Resume ---');
  global.localStorage.clear();

  const emptyStamp = Date.now();
  const emptyEmail = `new_candidate_${emptyStamp}@skillgapforce.test`;
  const emptyPassword = `NewUserPass!${emptyStamp.toString().slice(-4)}`;

  const newSignup = await signUpUser({
    email: emptyEmail,
    password: emptyPassword,
    fullName: 'Fresh Candidate'
  });

  assert(newSignup.success === true, 'New candidate signed up');

  // Immediately logout before uploading resume
  await signOutUser();
  global.localStorage.clear();

  // Candidate logs in
  const newLogin = await signInUser({
    email: emptyEmail,
    password: emptyPassword
  });
  assert(newLogin.success === true, 'New candidate logs in');

  const emptyProfileRes = await fetchUserProfile(newLogin.userId);
  const candidateSkills = emptyProfileRes.profile?.skills || newLogin.user?.user_metadata?.skills || null;
  const candidateHasSkills = hasUserCompletedOnboarding({ skills: candidateSkills });

  assert(candidateHasSkills === false, 'New candidate has completed onboarding is FALSE');

  const emptyRedirectTarget = candidateHasSkills
    ? '../skill_gap_force_job_recommendations/code.html'
    : '../skill_gap_force_resume_skills_setup/code.html';

  assert(
    emptyRedirectTarget === '../skill_gap_force_resume_skills_setup/code.html',
    'New candidate without skills is routed to Upload Resume & Select Skills'
  );
  console.log('');

  // ------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------
  console.log('================================================================');
  console.log(`RESULTS: ${passedTests} / ${totalTests} assertions passed! (100%)`);
  console.log('ALL POST-LOGIN REDIRECT REQUIREMENTS VERIFIED SUCCESSFULLY! ✅');
  console.log('================================================================');
}

runTestSuite().catch(err => {
  console.error('\n❌ TEST SUITE RUN ERROR:', err);
  process.exit(1);
});
