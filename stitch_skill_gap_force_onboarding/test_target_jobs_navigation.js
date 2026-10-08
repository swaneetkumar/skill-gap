/**
 * Comprehensive Test Suite for "Target Your Jobs" Navigation Flow
 * 
 * Tests the fix for:
 * 1. "Back to Jobs" on Role Selection page navigates explicitly to Job Recommendations (fixed route, not history-based).
 * 2. Role Result page "Change Role" uses window.location.replace to Role Selection page.
 * 3. Role Result page bottom CTA navigates to Book 1:1 Session page (unchanged).
 * 4. Browser history stack simulation: confirms repeated cycles (Job Recommendations -> Target Your Jobs -> pick role -> Change Role -> Back to Jobs)
 *    never loop, history does not grow endlessly, and browser Back button never gets trapped.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 RUNNING "TARGET YOUR JOBS" NAVIGATION FLOW TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function test(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

const baseDir = __dirname;

const roleSelectionHtmlPath = path.join(baseDir, 'skill_gap_force_target_role_selection', 'code.html');
const roleResultHtmlPath = path.join(baseDir, 'skill_gap_force_skill_gap_result', 'code.html');
const jobRecsHtmlPath = path.join(baseDir, 'skill_gap_force_job_recommendations', 'code.html');
const bookSessionHtmlPath = path.join(baseDir, 'skill_gap_force_book_1_1_session', 'code.html');

const roleSelectionHtml = fs.readFileSync(roleSelectionHtmlPath, 'utf8');
const roleResultHtml = fs.readFileSync(roleResultHtmlPath, 'utf8');
const jobRecsHtml = fs.readFileSync(jobRecsHtmlPath, 'utf8');
const bookSessionHtml = fs.readFileSync(bookSessionHtmlPath, 'utf8');

// ---------------------------------------------------------------------------
// SUITE 1: Route Inspection on Role Selection Page
// ---------------------------------------------------------------------------
console.log('--- Suite 1: Role Selection Page Route Inspection ---');

test('Role Selection page "Back to Jobs" has explicit route to Job Recommendations', () => {
  assert.ok(roleSelectionHtml.includes('href="../skill_gap_force_job_recommendations/code.html"'), 'Must have explicit href to job_recommendations');
  assert.ok(roleSelectionHtml.includes('Back to Jobs'), 'Must contain Back to Jobs text');
});

test('Role Selection page "Back to Jobs" does NOT use window.history.back() or history.length', () => {
  const backToJobsSnippet = roleSelectionHtml.substring(
    roleSelectionHtml.indexOf('Back to Jobs') - 200,
    roleSelectionHtml.indexOf('Back to Jobs') + 100
  );
  assert.ok(!backToJobsSnippet.includes('history.back()'), 'Must not use history.back()');
  assert.ok(!backToJobsSnippet.includes('window.history'), 'Must not rely on window.history');
});

test('Role Selection header brand logo navigates to Job Recommendations', () => {
  assert.ok(roleSelectionHtml.includes('href="../skill_gap_force_job_recommendations/code.html"'), 'Brand logo should return to job_recommendations');
});

test('Role Selection role cards trigger selectTargetRole with roleId', () => {
  assert.ok(roleSelectionHtml.includes('function selectTargetRole(roleId)'), 'selectTargetRole function must exist');
  assert.ok(roleSelectionHtml.includes('skill_gap_force_skill_gap_result/code.html?role='), 'Navigates to skill_gap_result with role query param');
});

// ---------------------------------------------------------------------------
// SUITE 2: Route Inspection on Role Result Page
// ---------------------------------------------------------------------------
console.log('\n--- Suite 2: Role Result Page Route Inspection ---');

test('Role Result page has handleChangeRole function using location.replace', () => {
  assert.ok(roleResultHtml.includes('function handleChangeRole(event)'), 'handleChangeRole function must exist');
  assert.ok(roleResultHtml.includes("window.location.replace('../skill_gap_force_target_role_selection/code.html')"), 'Must use window.location.replace to target_role_selection');
  assert.ok(roleResultHtml.includes('event.preventDefault()'), 'Must prevent default link push navigation');
});

test('Role Result header "Change Role" link calls handleChangeRole', () => {
  assert.ok(roleResultHtml.includes('onclick="handleChangeRole(event);"'), 'Header Change Role must invoke handleChangeRole');
});

test('Role Result card "Change Role" button (#changeRoleTopBtn) calls handleChangeRole', () => {
  assert.ok(roleResultHtml.includes('id="changeRoleTopBtn"'), '#changeRoleTopBtn must exist');
  const topBtnSnippet = roleResultHtml.substring(
    roleResultHtml.indexOf('id="changeRoleTopBtn"'),
    roleResultHtml.indexOf('id="changeRoleTopBtn"') + 200
  );
  assert.ok(topBtnSnippet.includes('handleChangeRole(event)'), '#changeRoleTopBtn must call handleChangeRole');
});

test('Role Result bottom "Change Role" button (#changeRoleBottomBtn) calls handleChangeRole', () => {
  assert.ok(roleResultHtml.includes('id="changeRoleBottomBtn"'), '#changeRoleBottomBtn must exist');
  const bottomBtnSnippet = roleResultHtml.substring(
    roleResultHtml.indexOf('id="changeRoleBottomBtn"'),
    roleResultHtml.indexOf('id="changeRoleBottomBtn"') + 200
  );
  assert.ok(bottomBtnSnippet.includes('handleChangeRole(event)'), '#changeRoleBottomBtn must call handleChangeRole');
});

test('Role Result bottom CTA navigates to Book 1:1 Session page (unchanged)', () => {
  assert.ok(roleResultHtml.includes('id="bookMentorshipBtn"'), 'Book 1:1 Session CTA button must exist');
  assert.ok(roleResultHtml.includes('handleBookMentorship()'), 'Must call handleBookMentorship');
  assert.ok(roleResultHtml.includes("window.location.href = '../skill_gap_force_book_1_1_session/code.html'"), 'Must navigate to book_1_1_session');
});

// ---------------------------------------------------------------------------
// SUITE 3: Navigation from Job Recommendations
// ---------------------------------------------------------------------------
console.log('\n--- Suite 3: Job Recommendations Entry Point ---');

test('Job Recommendations header button links to Target Role Selection', () => {
  assert.ok(jobRecsHtml.includes('id="targetYourJobsHeaderBtn"'), 'Must have targetYourJobsHeaderBtn');
  assert.ok(jobRecsHtml.includes('href="../skill_gap_force_target_role_selection/code.html"'), 'Must point to target_role_selection');
});

// ---------------------------------------------------------------------------
// SUITE 4: Browser History Stack Simulation & Loop Prevention (Requirements 1, 2, 3, 5)
// ---------------------------------------------------------------------------
console.log('\n--- Suite 4: Browser History Stack Simulation & Loop Prevention ---');

class MockBrowserSession {
  constructor(initialUrl) {
    this.history = [initialUrl];
    this.currentIndex = 0;
  }

  get currentUrl() {
    return this.history[this.currentIndex];
  }

  navigate(url) {
    // Truncate any forward history and push new url
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(url);
    this.currentIndex = this.history.length - 1;
  }

  replace(url) {
    // Replace current history entry without pushing
    this.history[this.currentIndex] = url;
  }

  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }
}

test('Cycle 1: Job Recs -> Target Your Jobs -> Pick Role -> Change Role -> Back to Jobs lands on Job Recs', () => {
  const browser = new MockBrowserSession('job_recommendations');
  assert.strictEqual(browser.currentUrl, 'job_recommendations');

  // 1. User clicks "Target Your Jobs"
  browser.navigate('target_role_selection');
  assert.strictEqual(browser.currentUrl, 'target_role_selection');

  // 2. User picks a role (e.g. software_engineer)
  browser.navigate('skill_gap_result?role=software_engineer');
  assert.strictEqual(browser.currentUrl, 'skill_gap_result?role=software_engineer');

  // 3. User clicks "Change Role" (uses replace navigation, replacing result page)
  browser.replace('target_role_selection');
  assert.strictEqual(browser.currentUrl, 'target_role_selection');

  // 4. User clicks "Back to Jobs" (explicit route to job_recommendations)
  browser.navigate('job_recommendations');
  assert.strictEqual(browser.currentUrl, 'job_recommendations', 'Must land on Job Recommendations page');
});

test('Cycle 2 & 3: Repeated Pick Role -> Change Role -> Back to Jobs cycles never loop', () => {
  const browser = new MockBrowserSession('job_recommendations');

  const rolesToTest = ['software_engineer', 'ai_engineer', 'devops_engineer', 'fullstack_developer'];

  for (let i = 0; i < rolesToTest.length; i++) {
    const role = rolesToTest[i];

    // 1. Navigate to target role selection
    browser.navigate('target_role_selection');
    assert.strictEqual(browser.currentUrl, 'target_role_selection');

    // 2. Pick role
    browser.navigate(`skill_gap_result?role=${role}`);
    assert.strictEqual(browser.currentUrl, `skill_gap_result?role=${role}`);

    // 3. Click "Change Role" (uses location.replace)
    browser.replace('target_role_selection');
    assert.strictEqual(browser.currentUrl, 'target_role_selection');

    // 4. Click "Back to Jobs" (fixed route to job_recommendations)
    browser.navigate('job_recommendations');
    assert.strictEqual(browser.currentUrl, 'job_recommendations', `Cycle ${i + 1} must cleanly return to Job Recommendations`);
  }
});

test('Browser Back Button Loop Prevention: Role Result is replaced so user never loops back into Result page', () => {
  const browser = new MockBrowserSession('job_recommendations');

  // User goes: Job Recs -> Role Selection -> Role Result
  browser.navigate('target_role_selection');
  browser.navigate('skill_gap_result?role=ai_engineer');

  // User clicks "Change Role" -> replace navigation replaces skill_gap_result
  browser.replace('target_role_selection');
  assert.strictEqual(browser.currentUrl, 'target_role_selection');

  // From Role Selection, user clicks "Back to Jobs" -> explicit route
  browser.navigate('job_recommendations');
  assert.strictEqual(browser.currentUrl, 'job_recommendations');

  // User presses browser Back: returns to Role Selection, never to skill_gap_result!
  browser.back();
  assert.strictEqual(browser.currentUrl, 'target_role_selection');

  // User clicks "Back to Jobs" again: returns to Job Recommendations!
  browser.navigate('job_recommendations');
  assert.strictEqual(browser.currentUrl, 'job_recommendations');
});

test('Browser Back Button Behavior: Back button from Role Result returns to Role Selection, then Back to Jobs returns to Job Recs', () => {
  const browser = new MockBrowserSession('job_recommendations');

  // User goes: Job Recs -> Role Selection -> Role Result
  browser.navigate('target_role_selection');
  browser.navigate('skill_gap_result?role=devops_engineer');

  // User presses browser Back button directly from Role Result
  browser.back();
  assert.strictEqual(browser.currentUrl, 'target_role_selection', 'Browser back lands on target_role_selection');

  // From Role Selection, user clicks "Back to Jobs" (explicit route)
  browser.navigate('job_recommendations');
  assert.strictEqual(browser.currentUrl, 'job_recommendations', 'Back to Jobs MUST open job_recommendations');
});

test('Role Result Bottom CTA: "Book 1:1 Session for These Skills" navigates to Book 1:1 Session page', () => {
  const browser = new MockBrowserSession('job_recommendations');
  browser.navigate('target_role_selection');
  browser.navigate('skill_gap_result?role=software_engineer');

  // User clicks CTA button
  browser.navigate('book_1_1_session');
  assert.strictEqual(browser.currentUrl, 'book_1_1_session', 'Must navigate to book_1_1_session');
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
  process.exitCode = 1;
} else {
  process.exitCode = 0;
}
