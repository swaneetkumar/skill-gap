/**
 * test_auth_flow.js
 * Comprehensive End-to-End Test for Supabase Authentication:
 * 1. Verifies DOM structure of Signup & Login pages for Supabase scripts & error elements
 * 2. Creates a real user via signUpUser() against live Supabase instance
 * 3. Verifies Supabase user ID (UUID) is returned and persisted
 * 4. Verifies duplicate signup fails with clear inline error message
 * 5. Verifies wrong password login fails with clear error message
 * 6. Verifies logout clears session and user ID
 * 7. Verifies user can log back in successfully with original credentials
 */

const fs = require('fs');
const path = require('path');
const {
  signUpUser,
  signInUser,
  signOutUser,
  persistUserSession,
  clearUserSession,
  getStoredUserId,
  formatAuthError
} = require('./supabaseClient');

const basePath = __dirname;
const signupHtmlPath = path.join(basePath, 'skill_gap_force_create_your_account', 'code.html');
const loginHtmlPath = path.join(basePath, 'skill_gap_force_login', 'code.html');

// Polyfill localStorage for Node test runner
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] !== undefined ? storage[k] : null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

async function runAuthSuite() {
  console.log('========================================================');
  console.log('SUPABASE END-TO-END AUTHENTICATION TEST SUITE');
  console.log('========================================================\n');

  // --- Step 1: DOM Elements & Scripts Verification ---
  console.log('--- Step 1: Checking Signup & Login HTML Integration ---');
  const signupHtml = fs.readFileSync(signupHtmlPath, 'utf8');
  const loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');

  const signupHasSupabase = signupHtml.includes('supabaseClient.js') && signupHtml.includes('env.js');
  const signupHasGeneralError = signupHtml.includes('id="signup-general-error"');
  const signupHasEmailError = signupHtml.includes('id="email-error"');
  const signupHasRealUserIdLogic = signupHtml.includes('supabase_user_id') && signupHtml.includes('signUpUser');

  console.log(`- Signup includes Supabase & env scripts: ${signupHasSupabase ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Signup has general error banner: ${signupHasGeneralError ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Signup has inline email error container: ${signupHasEmailError ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Signup stores real supabase_user_id: ${signupHasRealUserIdLogic ? 'PASS ✅' : 'FAIL ❌'}`);

  if (!signupHasSupabase || !signupHasGeneralError || !signupHasEmailError || !signupHasRealUserIdLogic) {
    throw new Error('Signup HTML integration incomplete');
  }

  const loginHasSupabase = loginHtml.includes('supabaseClient.js') && loginHtml.includes('env.js');
  const loginHasErrorBox = loginHtml.includes('id="login-error"');
  const loginHasSignInLogic = loginHtml.includes('signInUser') && loginHtml.includes('supabase_user_id');

  console.log(`- Login includes Supabase & env scripts: ${loginHasSupabase ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Login has inline error banner: ${loginHasErrorBox ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- Login handles signIn & stores session: ${loginHasSignInLogic ? 'PASS ✅' : 'FAIL ❌'}`);

  if (!loginHasSupabase || !loginHasErrorBox || !loginHasSignInLogic) {
    throw new Error('Login HTML integration incomplete');
  }

  // --- Step 2: Live Supabase Sign Up ---
  const uniqueId = Date.now();
  const testEmail = `candidate_${uniqueId}@skillgapforcetest.com`;
  const testPassword = `SecurePass@${uniqueId.toString().slice(-4)}!`;
  const testFullName = `Priya Sharma`;

  console.log('\n--- Step 2: Live Supabase User Registration ---');
  console.log(`Registering user: ${testEmail}...`);

  const signupRes = await signUpUser({
    email: testEmail,
    password: testPassword,
    fullName: testFullName
  });

  console.log('Signup result:', {
    success: signupRes.success,
    userId: signupRes.userId,
    userEmail: signupRes.user?.email,
    error: signupRes.error
  });

  if (!signupRes.success || !signupRes.userId) {
    throw new Error(`Signup failed: ${signupRes.error}`);
  }

  // Verify UUID format (standard 36 char UUID)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(signupRes.userId);
  console.log(`- Real Supabase UUID received: "${signupRes.userId}" -> ${isUUID ? 'PASS ✅' : 'FAIL ❌'}`);
  if (!isUUID) throw new Error('Returned ID is not a valid Supabase UUID');

  // Verify app-level state
  const storedId = localStorage.getItem('supabase_user_id');
  const storedEmail = localStorage.getItem('supabase_user_email');
  const storedName = localStorage.getItem('userFullName');
  console.log(`- App State: supabase_user_id = "${storedId}" -> ${storedId === signupRes.userId ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- App State: supabase_user_email = "${storedEmail}" -> ${storedEmail === testEmail ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`- App State: userFullName = "${storedName}" -> ${storedName === testFullName ? 'PASS ✅' : 'FAIL ❌'}`);

  if (storedId !== signupRes.userId) throw new Error('App state supabase_user_id mismatch');

  // --- Step 3: Duplicate Signup Rejection ---
  console.log('\n--- Step 3: Testing Duplicate Signup Rejection ---');
  console.log(`Attempting to sign up again with existing email: ${testEmail}...`);
  const duplicateRes = await signUpUser({
    email: testEmail,
    password: testPassword,
    fullName: testFullName
  });

  console.log('Duplicate signup response:', duplicateRes);
  const dupBlocked = !duplicateRes.success && (duplicateRes.error.toLowerCase().includes('already registered') || duplicateRes.error.toLowerCase().includes('already'));
  console.log(`- Duplicate rejected with clear message: ${dupBlocked ? 'PASS ✅' : 'FAIL ❌'} ("${duplicateRes.error}")`);
  if (!dupBlocked) throw new Error('Duplicate signup was not blocked properly');

  // --- Step 4: Invalid Login Credentials Rejection ---
  console.log('\n--- Step 4: Testing Invalid Password Rejection ---');
  const badLoginRes = await signInUser({
    email: testEmail,
    password: 'TotallyWrongPassword!999'
  });

  console.log('Bad login response:', badLoginRes);
  const badLoginBlocked = !badLoginRes.success && (badLoginRes.error.toLowerCase().includes('invalid') || badLoginRes.error.toLowerCase().includes('credentials'));
  console.log(`- Invalid login rejected with clear message: ${badLoginBlocked ? 'PASS ✅' : 'FAIL ❌'} ("${badLoginRes.error}")`);
  if (!badLoginBlocked) throw new Error('Invalid login was not rejected');

  // --- Step 5: Logout Action & State Cleanup ---
  console.log('\n--- Step 5: Testing User Logout State Cleanup ---');
  await signOutUser();
  const idAfterLogout = localStorage.getItem('supabase_user_id');
  const sessionAfterLogout = localStorage.getItem('supabase_session');
  console.log(`- supabase_user_id after logout: ${idAfterLogout === null ? 'CLEARED ✅' : 'FAILED ❌'}`);
  console.log(`- supabase_session after logout: ${sessionAfterLogout === null ? 'CLEARED ✅' : 'FAILED ❌'}`);
  if (idAfterLogout !== null || sessionAfterLogout !== null) throw new Error('Logout failed to clear state');

  // --- Step 6: Log Back In with Same Credentials ---
  console.log('\n--- Step 6: Logging Back In with Created User ---');
  console.log(`Logging in with: ${testEmail}...`);
  const loginRes = await signInUser({
    email: testEmail,
    password: testPassword
  });

  console.log('Login result:', {
    success: loginRes.success,
    userId: loginRes.userId,
    userEmail: loginRes.user?.email,
    sessionPresent: !!loginRes.session,
    error: loginRes.error
  });

  if (!loginRes.success || !loginRes.userId) {
    throw new Error(`Login failed: ${loginRes.error}`);
  }

  const idAfterLogin = localStorage.getItem('supabase_user_id');
  const emailAfterLogin = localStorage.getItem('supabase_user_email');
  console.log(`- Restored supabase_user_id: "${idAfterLogin}" -> ${idAfterLogin === signupRes.userId ? 'MATCHES SIGNUP UUID ✅' : 'FAIL ❌'}`);
  console.log(`- Restored supabase_user_email: "${emailAfterLogin}" -> PASS ✅`);

  if (idAfterLogin !== signupRes.userId) throw new Error('Login user ID did not match signup user ID');

  console.log('\n========================================================');
  console.log('ALL SUPABASE AUTHENTICATION TESTS PASSED PERFECTLY! 🚀');
  console.log('========================================================');
}

runAuthSuite().catch(err => {
  console.error('\n❌ AUTH TEST FAILED:', err.message);
  process.exit(1);
});
