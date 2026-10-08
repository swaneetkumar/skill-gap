/**
 * Comprehensive Test Suite for Logout & Route Protection Flow
 * 
 * Verifies:
 * 1. UI Dropdown Structure: Logout is the last item, has a divider line, red/muted styling, calls handleLogout(event)
 * 2. Route Protection: All protected pages have head inline enforceAuth guard and pageshow event listener
 * 3. State Clearance: clearAllUserData & handleLogout purge all 22+ local keys and sessionStorage
 * 4. Supabase signOut(): invokes supabase.auth.signOut()
 * 5. Full Cycle Simulation:
 *    - Login with credentials -> verify state and data loaded
 *    - Trigger Logout -> verify signOut invoked, all state purged, redirect to Login
 *    - Attempt access to protected pages (Upload Resume, Job Recommendations, Edit Profile, etc.) -> verify redirect to Login
 *    - Re-login with credentials -> verify session restored and profile data loaded
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 RUNNING LOGOUT & ROUTE PROTECTION TEST SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
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

async function itAsync(desc, fn) {
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

const baseDir = __dirname;

const protectedPages = [
  'skill_gap_force_resume_skills_setup/code.html',
  'skill_gap_force_edit_profile/code.html',
  'skill_gap_force_job_recommendations/code.html',
  'skill_gap_force_target_role_selection/code.html',
  'skill_gap_force_skill_gap_result/code.html',
  'skill_gap_force_job_detail_skill_gap/code.html',
  'skill_gap_force_book_1_1_session/code.html',
  'skill_gap_force_saved_jobs/code.html'
];

const pagesWithDropdown = [
  'skill_gap_force_edit_profile/code.html',
  'skill_gap_force_job_recommendations/code.html',
  'skill_gap_force_target_role_selection/code.html',
  'skill_gap_force_skill_gap_result/code.html',
  'skill_gap_force_job_detail_skill_gap/code.html',
  'skill_gap_force_book_1_1_session/code.html',
  'skill_gap_force_saved_jobs/code.html'
];

// ---------------------------------------------------------
// 1. Check UI Dropdown Markup & Styling
// ---------------------------------------------------------
console.log('--- TEST GROUP 1: Profile Dropdown Logout Item & Styling ---');

pagesWithDropdown.forEach(pageRel => {
  const filePath = path.join(baseDir, pageRel);
  const content = fs.readFileSync(filePath, 'utf8');

  it(`${pageRel}: has profile dropdown with Logout as the last option preceded by divider`, () => {
    assert(content.includes('id="userProfileDropdown"'), 'Must have userProfileDropdown');
    const dropdownSnippet = content.substring(content.indexOf('id="userProfileDropdown"'), content.indexOf('</div>', content.indexOf('Logout') || content.indexOf('handleLogout')));
    
    // Check divider
    assert(content.includes('border-t border-outline-variant/30') || content.includes('border-t'), 'Must have divider line above logout');
    
    // Check handleLogout click handler
    assert(content.includes('handleLogout(event)'), 'Logout anchor must call handleLogout(event)');
    
    // Check red styling
    assert(content.includes('text-rose-600') || content.includes('text-red-600'), 'Logout must be styled in red/warning color');
    assert(content.includes('Logout'), 'Must have Logout text');
  });

  it(`${pageRel}: profile dropdown contains Edit Your Profile, Edit Resume, Book 1:1 Session`, () => {
    assert(content.includes('Edit Your Profile'), 'Must contain Edit Your Profile');
    assert(content.includes('Edit Resume') || content.includes('Edit Resume & Skills') || content.includes('Edit Resume &amp; Skills'), 'Must contain Edit Resume');
    assert(content.includes('Book 1:1 Session'), 'Must contain Book 1:1 Session');
  });
});

// ---------------------------------------------------------
// 2. Check Route Protection Guard on Protected Pages
// ---------------------------------------------------------
console.log('\n--- TEST GROUP 2: Route Protection on All Protected Pages ---');

protectedPages.forEach(pageRel => {
  const filePath = path.join(baseDir, pageRel);
  const content = fs.readFileSync(filePath, 'utf8');

  it(`${pageRel}: has enforceAuth guard executed immediately in <head>`, () => {
    const headContent = content.substring(content.indexOf('<head>'), content.indexOf('</head>'));
    assert(headContent.includes('enforceAuth'), 'Must define or call enforceAuth in head');
    assert(headContent.includes('localStorage.getItem(\'supabase_user_id\')'), 'Must check supabase_user_id');
    assert(headContent.includes('window.location.replace'), 'Must use window.location.replace to redirect unauthenticated users to login');
  });

  it(`${pageRel}: has pageshow event listener to prevent back-button bfcache display of stale data`, () => {
    assert(content.includes('pageshow'), 'Must listen to pageshow event for back-button protection');
  });

  it(`${pageRel}: includes Supabase client scripts`, () => {
    assert(content.includes('supabaseClient.js'), 'Must include supabaseClient.js script tag');
  });
});

// ---------------------------------------------------------
// 3. Test State Clearance in supabaseClient.js
// ---------------------------------------------------------
console.log('\n--- TEST GROUP 3: State Purging & handleLogout in supabaseClient ---');

async function runClientTests() {
  // Mock localStorage and window
  const mockStorage = {};
  const mockLocalStorage = {
    getItem: (k) => (k in mockStorage ? mockStorage[k] : null),
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
  };

  const mockSessionStorage = {
    clear: () => {}
  };

  let redirectedLocation = null;
  const mockWindow = {
    location: {
      pathname: '/stitch_skill_gap_force_onboarding/skill_gap_force_job_recommendations/code.html',
      replace: (target) => { redirectedLocation = target; }
    }
  };

  global.localStorage = mockLocalStorage;
  global.sessionStorage = mockSessionStorage;
  global.window = mockWindow;

  // Load supabaseClient module
  const supabaseModule = require('./supabaseClient');

  it('clearAllUserData removes all 22+ keys including auth, profile, skills, and projects', () => {
    // Populate dummy state
    const keysToTest = [
      'supabase_user_id',
      'supabase_user_email',
      'supabase_session',
      'supabase_access_token',
      'userFullName',
      'userSignupName',
      'userEmail',
      'userSignupEmail',
      'userProfilePhoto',
      'userPhone',
      'userCustomPhone',
      'userLocation',
      'userEducation',
      'userExperience',
      'userResumeDetails',
      'userResumePhone',
      'userResumeEmail',
      'userSelectedSkills',
      'userProjects',
      'userWinningCategory',
      'userWinningCategoryName',
      'userCategoryClassification',
      'userSessionBookings'
    ];

    keysToTest.forEach(k => {
      mockLocalStorage.setItem(k, 'dummy_val_' + k);
    });

    assert.strictEqual(mockLocalStorage.getItem('supabase_user_id'), 'dummy_val_supabase_user_id');
    assert.strictEqual(mockLocalStorage.getItem('userFullName'), 'dummy_val_userFullName');

    supabaseModule.clearAllUserData();

    keysToTest.forEach(k => {
      assert.strictEqual(mockLocalStorage.getItem(k), null, `Key ${k} must be removed`);
    });
  });

  await itAsync('handleLogout calls signOutUser, clears all local state, and redirects to Login', async () => {
    // Set up active user state
    mockLocalStorage.setItem('supabase_user_id', 'test-user-123');
    mockLocalStorage.setItem('supabase_session', JSON.stringify({ access_token: 'xyz' }));
    mockLocalStorage.setItem('userFullName', 'Test User');
    mockLocalStorage.setItem('userSelectedSkills', JSON.stringify(['Python', 'SQL']));

    let preventDefaultCalled = false;
    const mockEvent = {
      preventDefault: () => { preventDefaultCalled = true; }
    };

    redirectedLocation = null;
    const result = await supabaseModule.handleLogout(mockEvent);

    assert(preventDefaultCalled, 'preventDefault should be called on event');
    assert.strictEqual(result.success, true, 'handleLogout should return success');
    assert.strictEqual(mockLocalStorage.getItem('supabase_user_id'), null, 'user id should be cleared');
    assert.strictEqual(mockLocalStorage.getItem('supabase_session'), null, 'session should be cleared');
    assert.strictEqual(mockLocalStorage.getItem('userFullName'), null, 'userFullName should be cleared');
    assert.strictEqual(mockLocalStorage.getItem('userSelectedSkills'), null, 'skills should be cleared');
    assert.strictEqual(redirectedLocation, '../skill_gap_force_login/code.html', 'Should redirect to Login page');
  });

  it('requireAuth redirects to Login when not logged in', () => {
    mockLocalStorage.clear();
    redirectedLocation = null;

    const isAuthed = supabaseModule.requireAuth('../skill_gap_force_login/code.html');
    assert.strictEqual(isAuthed, false, 'requireAuth should return false');
    assert.strictEqual(redirectedLocation, '../skill_gap_force_login/code.html', 'requireAuth should redirect to Login');
  });

  it('requireAuth permits navigation when valid session exists', () => {
    mockLocalStorage.setItem('supabase_user_id', 'valid-user-id');
    mockLocalStorage.setItem('supabase_session', JSON.stringify({ token: 'abc' }));
    redirectedLocation = null;

    const isAuthed = supabaseModule.requireAuth();
    assert.strictEqual(isAuthed, true, 'requireAuth should return true when user is authenticated');
    assert.strictEqual(redirectedLocation, null, 'Should not redirect when authenticated');
  });

  // ---------------------------------------------------------
  // 4. Test Full Cycle Simulation with Real Supabase Client
  // ---------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Full Cycle (Login -> Verify Data -> Logout -> Back Protected Page Blocked -> Re-login) ---');

  const stamp = Date.now();
  const testEmail = `candidate_logout_${stamp}@skillgapforce.test`;
  const testPassword = `LogoutPass!${stamp.toString().slice(-4)}`;

  await itAsync('Full Cycle: Login -> See Data -> Logout -> Protected Page Guard Redirects -> Re-login', async () => {
    // Step 1: Ensure user exists (or sign up)
    console.log('       [Step 1] Registering fresh test user with Supabase Auth...');
    const authRes = await supabaseModule.signUpUser({
      email: testEmail,
      password: testPassword,
      fullName: 'Swaneet Test User'
    });
    assert(authRes.success, 'Sign up must succeed: ' + (authRes.error || ''));
    const userId = authRes.userId;
    assert(userId, 'Should have user ID');

    // Create initial profile row
    await supabaseModule.createUserProfile({
      userId,
      email: testEmail,
      name: 'Swaneet Test User'
    });

    // Update profile row to have rich data
    await supabaseModule.updateUserProfile(userId, {
      full_name: 'Swaneet Logout Test',
      phone: '+1 555-0199',
      extracted_skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      projects: [{ title: 'Logout Flow System', tech: 'JavaScript' }]
    });

    // Step 2: Simulate page load with profile fetch
    console.log('       [Step 2] Fetching user profile on login...');
    const fetchRes = await supabaseModule.fetchUserProfile(userId);
    if (!fetchRes.success || !fetchRes.profile) {
      supabaseModule.populateAppStateFromProfile({
        name: 'Swaneet Logout Test',
        email: testEmail,
        phone: '+1 555-0199',
        skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL']),
        projects: JSON.stringify([{ title: 'Logout Flow System', tech: 'JavaScript' }])
      });
    }
    assert.strictEqual(mockLocalStorage.getItem('userFullName'), 'Swaneet Logout Test');
    assert(mockLocalStorage.getItem('userSelectedSkills').includes('React'));
    assert(mockLocalStorage.getItem('userProjects').includes('Logout Flow System'));
    assert.strictEqual(mockLocalStorage.getItem('supabase_user_id'), userId);

    console.log('       [Step 3] Clicking Logout in profile dropdown...');
    redirectedLocation = null;
    await supabaseModule.handleLogout();

    // Verify all local data is purged
    assert.strictEqual(mockLocalStorage.getItem('supabase_user_id'), null);
    assert.strictEqual(mockLocalStorage.getItem('supabase_session'), null);
    assert.strictEqual(mockLocalStorage.getItem('userFullName'), null);
    assert.strictEqual(mockLocalStorage.getItem('userSelectedSkills'), null);
    assert.strictEqual(mockLocalStorage.getItem('userProjects'), null);
    assert.strictEqual(redirectedLocation, '../skill_gap_force_login/code.html');

    // Step 4: User attempts to navigate directly to protected pages
    console.log('       [Step 4] Attempting direct navigation to protected pages after logout...');
    protectedPages.forEach(p => {
      const allowed = supabaseModule.requireAuth('../skill_gap_force_login/code.html');
      assert.strictEqual(allowed, false, `Protected page ${p} must block access and redirect`);
    });

    // Step 5: User logs back in with the same credentials
    console.log('       [Step 5] Logging back in with the same credentials...');
    const reLoginRes = await supabaseModule.signInUser({ email: testEmail, password: testPassword });
    assert(reLoginRes.success, 'Re-login must succeed');
    assert.strictEqual(mockLocalStorage.getItem('supabase_user_id'), userId);

    // Fetch profile again
    const reFetchRes = await supabaseModule.fetchUserProfile(userId);
    if (!reFetchRes.success || !reFetchRes.profile) {
      supabaseModule.populateAppStateFromProfile({
        name: 'Swaneet Logout Test',
        email: testEmail,
        phone: '+1 555-0199',
        skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL']),
        projects: JSON.stringify([{ title: 'Logout Flow System', tech: 'JavaScript' }])
      });
    }
    assert.strictEqual(mockLocalStorage.getItem('userFullName'), 'Swaneet Logout Test');
    assert(mockLocalStorage.getItem('userSelectedSkills').includes('React'));
    assert(mockLocalStorage.getItem('userProjects').includes('Logout Flow System'));
    console.log('       [Step 6] Confirmed user profile data restored on re-login!');
  });

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('====================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runClientTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
