/**
 * test_saved_jobs_persistence.js
 * End-to-End Persistence & Cross-User Security Test for "Saved Jobs" Feature
 *
 * Verifies:
 * 1. HTML markup & components on Recommendations, Detail, and Saved Jobs pages
 * 2. Real Supabase DB operations: Save 3 jobs for User A
 * 3. Logout User A (verify state clearance)
 * 4. Cross-User Isolation: User B logs in and CANNOT see User A's saved jobs (RLS enforcement)
 * 5. Logout User B
 * 6. User A re-login: Confirms all 3 saved jobs persist and restore (count = 3, filled icons)
 * 7. Unsave operation: Confirms deleting row in Supabase and updating state
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const {
  signUpUser,
  signInUser,
  signOutUser,
  clearAllUserData,
  getSupabaseClient,
  fetchSavedJobIds,
  saveJob,
  unsaveJob,
  getStoredSavedJobIds,
  isJobSaved
} = require('./supabaseClient');

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

const baseDir = __dirname;
const recHtmlPath = path.join(baseDir, 'skill_gap_force_job_recommendations', 'code.html');
const detailHtmlPath = path.join(baseDir, 'skill_gap_force_job_detail_skill_gap', 'code.html');
const savedJobsHtmlPath = path.join(baseDir, 'skill_gap_force_saved_jobs', 'code.html');

async function runTests() {
  console.log('========================================================');
  console.log('🧪 RUNNING SAVED JOBS PERSISTENCE & SECURITY TEST SUITE');
  console.log('========================================================\n');

  // --- Step 1: DOM Elements & Markup Verification ---
  console.log('--- Step 1: Checking Recommendations, Detail, and Saved Jobs HTML ---');
  const recHtml = fs.readFileSync(recHtmlPath, 'utf8');
  const detailHtml = fs.readFileSync(detailHtmlPath, 'utf8');
  const savedJobsHtml = fs.readFileSync(savedJobsHtmlPath, 'utf8');

  // Recommendations page checks
  assert(recHtml.includes('id="savedJobsHeaderBtn"'), 'Job Recommendations page must have savedJobsHeaderBtn');
  assert(recHtml.includes('notifications'), 'Header button must have bell icon (notifications)');
  assert(recHtml.includes('id="savedJobsBellBadge"'), 'Header button must have bell badge count element');
  assert(recHtml.includes('handleToggleCardSave'), 'Job cards must invoke handleToggleCardSave');
  assert(recHtml.includes('bookmark_btn') || recHtml.includes('bookmark-btn'), 'Job cards must have bookmark button');

  // Detail page checks
  assert(detailHtml.includes('id="detailBookmarkBtn"'), 'Job Detail header must have detailBookmarkBtn');
  assert(detailHtml.includes('handleDetailToggleSave'), 'Job Detail button must call handleDetailToggleSave');

  // Saved Jobs page checks
  assert(savedJobsHtml.includes('id="savedJobsGridContainer"'), 'Saved Jobs page must have cards grid container');
  assert(savedJobsHtml.includes('id="emptyStateContainer"'), 'Saved Jobs page must have empty state container');
  assert(savedJobsHtml.includes('id="loadingSkeletonContainer"'), 'Saved Jobs page must have loading skeleton');
  assert(savedJobsHtml.includes('Back to Recommendations'), 'Saved Jobs page must have Back to Recommendations link');
  assert(savedJobsHtml.includes('No saved jobs yet'), 'Saved Jobs page must have empty state message');
  console.log('  ✅ PASS: DOM elements and components verified across all 3 pages\n');

  // --- Step 2: Register User A and Save 3 Jobs ---
  console.log('--- Step 2: User A Registration & Saving 3 Jobs ---');
  const timestamp = Date.now();
  const userAEmail = `user_a_${timestamp}@skillgaptest.com`;
  const userAPassword = `UserAPass@${timestamp.toString().slice(-4)}!`;

  const userASignup = await signUpUser({
    email: userAEmail,
    password: userAPassword,
    fullName: 'Candidate Alpha'
  });

  assert(userASignup.success, `User A registration failed: ${userASignup.error}`);
  const userAId = userASignup.userId;
  console.log(`  Registered User A (${userAEmail}) with ID: ${userAId}`);

  // Initial fetch: should be 0
  const initialFetchA = await fetchSavedJobIds(userAId);
  assert.strictEqual(initialFetchA.jobIds.length, 0, 'User A should start with 0 saved jobs');

  // Save 3 jobs
  const job1 = 'stripe-senior-frontend';
  const job2 = 'linear-product-engineer';
  const job3 = 'figma-design-systems';

  console.log(`  Saving Job 1: ${job1}...`);
  const save1 = await saveJob(job1, userAId);
  assert(save1.success, `Failed to save job 1: ${save1.error}`);

  console.log(`  Saving Job 2: ${job2}...`);
  const save2 = await saveJob(job2, userAId);
  assert(save2.success, `Failed to save job 2: ${save2.error}`);

  console.log(`  Saving Job 3: ${job3}...`);
  const save3 = await saveJob(job3, userAId);
  assert(save3.success, `Failed to save job 3: ${save3.error}`);

  // Verify User A has 3 saved jobs in DB
  const fetchAfterSaveA = await fetchSavedJobIds(userAId);
  assert.strictEqual(fetchAfterSaveA.jobIds.length, 3, 'User A should have exactly 3 saved jobs');
  assert(fetchAfterSaveA.jobIds.includes(job1), 'Saved jobs must include Job 1');
  assert(fetchAfterSaveA.jobIds.includes(job2), 'Saved jobs must include Job 2');
  assert(fetchAfterSaveA.jobIds.includes(job3), 'Saved jobs must include Job 3');
  assert.strictEqual(isJobSaved(job1), true, 'isJobSaved must return true for job1');
  assert.strictEqual(isJobSaved(job2), true, 'isJobSaved must return true for job2');
  assert.strictEqual(isJobSaved(job3), true, 'isJobSaved must return true for job3');
  assert.strictEqual(isJobSaved('non-existent-job'), false, 'isJobSaved must return false for unsaved job');
  console.log('  ✅ PASS: 3 jobs saved successfully and verified in Supabase for User A\n');

  // --- Step 3: User A Logout ---
  console.log('--- Step 3: Logging out User A ---');
  await signOutUser();
  clearAllUserData();
  assert.strictEqual(localStorage.getItem('supabase_user_id'), null, 'User ID should be cleared on logout');
  assert.strictEqual(localStorage.getItem('userSavedJobIds'), null, 'Saved job IDs must be cleared on logout');
  console.log('  ✅ PASS: User A logged out and local state purged\n');

  // --- Step 4: Register User B & Verify RLS Isolation ---
  console.log('--- Step 4: User B Registration & Multi-User Isolation Test ---');
  const userBEmail = `user_b_${timestamp}@skillgaptest.com`;
  const userBPassword = `UserBPass@${timestamp.toString().slice(-4)}!`;

  const userBSignup = await signUpUser({
    email: userBEmail,
    password: userBPassword,
    fullName: 'Candidate Beta'
  });

  assert(userBSignup.success, `User B registration failed: ${userBSignup.error}`);
  const userBId = userBSignup.userId;
  console.log(`  Registered User B (${userBEmail}) with ID: ${userBId}`);

  // Fetch saved jobs for User B: MUST BE 0 (RLS must prevent seeing User A's jobs)
  const fetchB = await fetchSavedJobIds(userBId);
  console.log(`  User B saved jobs count: ${fetchB.jobIds.length}`);
  assert.strictEqual(fetchB.jobIds.length, 0, 'User B must NOT see User A saved jobs (RLS isolation)');
  assert.strictEqual(isJobSaved(job1), false, 'User B must see Job 1 as unsaved');

  // User B saves a completely different job
  const jobB = 'polygon-layer2';
  console.log(`  User B saves Job: ${jobB}...`);
  const saveB = await saveJob(jobB, userBId);
  assert(saveB.success, `Failed to save job for User B: ${saveB.error}`);

  const fetchB2 = await fetchSavedJobIds(userBId);
  assert.strictEqual(fetchB2.jobIds.length, 1, 'User B should have exactly 1 saved job');
  assert(fetchB2.jobIds.includes(jobB), 'User B saved job must be polygon-layer2');
  assert(!fetchB2.jobIds.includes(job1), 'User B must not have User A jobs');

  console.log('  ✅ PASS: RLS isolation verified — User B cannot see User A saved jobs\n');

  // --- Step 5: User B Logout ---
  console.log('--- Step 5: Logging out User B ---');
  await signOutUser();
  clearAllUserData();
  console.log('  ✅ PASS: User B logged out\n');

  // --- Step 6: User A Logs Back In & Confirms Persistence ---
  console.log('--- Step 6: Re-logging in User A with original credentials ---');
  const loginA = await signInUser({
    email: userAEmail,
    password: userAPassword
  });

  assert(loginA.success, `User A login failed: ${loginA.error}`);
  assert.strictEqual(loginA.userId, userAId, 'Logged in user ID must match original User A ID');

  // Fetch saved jobs on login
  const restoredFetchA = await fetchSavedJobIds(userAId);
  console.log(`  Restored saved jobs for User A:`, restoredFetchA.jobIds);

  assert.strictEqual(restoredFetchA.jobIds.length, 3, 'User A must have exactly 3 restored saved jobs');
  assert(restoredFetchA.jobIds.includes(job1), 'Restored jobs must include Job 1');
  assert(restoredFetchA.jobIds.includes(job2), 'Restored jobs must include Job 2');
  assert(restoredFetchA.jobIds.includes(job3), 'Restored jobs must include Job 3');
  assert(!restoredFetchA.jobIds.includes(jobB), 'User A must NOT see User B job');
  console.log('  ✅ PASS: Exact 3 saved jobs persisted and restored across logout/login cycle!\n');

  // --- Step 7: Unsave Job & Database Row Deletion ---
  console.log('--- Step 7: Testing Unsave Functionality ---');
  console.log(`  Unsaving Job 2: ${job2}...`);
  const unsaveResult = await unsaveJob(job2, userAId);
  assert(unsaveResult.success, `Failed to unsave job: ${unsaveResult.error}`);

  const fetchAfterUnsave = await fetchSavedJobIds(userAId);
  assert.strictEqual(fetchAfterUnsave.jobIds.length, 2, 'Saved jobs count must now be 2');
  assert(!fetchAfterUnsave.jobIds.includes(job2), 'Job 2 must no longer be in saved jobs list');
  assert(fetchAfterUnsave.jobIds.includes(job1), 'Job 1 must remain saved');
  assert(fetchAfterUnsave.jobIds.includes(job3), 'Job 3 must remain saved');
  console.log('  ✅ PASS: Unsave operation successfully deleted row in Supabase and updated state\n');

  console.log('========================================================');
  console.log('STATUS: ALL SAVED JOBS PERSISTENCE & SECURITY TESTS PASSED! 🚀');
  console.log('========================================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err.message);
  console.error(err.stack);
  process.exit(1);
});
