// ============================================================================
// Test Suite: Signup Photo Live Capture Persistence across Logout & Login
// Verifies that a photo captured during signup survives logout and re-login
// ============================================================================

const assert = require("assert");
const fs = require("fs");
const path = require("path");

// Mock localStorage and browser globals
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

// Inject env vars
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
global.supabase = { createClient: () => supabase };

// Load supabaseClient module
const scModule = require("./supabaseClient.js");

console.log("================================================================");
console.log("🧪 TESTING SIGNUP LIVE CAPTURE PHOTO PERSISTENCE ACROSS LOGOUT/LOGIN");
console.log("================================================================");

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

(async () => {
  const timestamp = Date.now();
  const testEmail = `photo_e2e_tester_${timestamp}@skillgaptest.com`;
  const testPassword = "Password123!";
  const testFullName = `Capture Tester ${timestamp}`;
  // Simulated camera base64 data URL
  const testPhotoDataUrl = "data:image/jpeg;base64," + Buffer.from("simulated_live_captured_photo_data_" + timestamp).toString("base64");

  let createdUserId = null;

  await runTest("Step 1: Sign up new user with email and password", async () => {
    const signupRes = await scModule.signUpUser({ email: testEmail, password: testPassword, fullName: testFullName });
    assert(signupRes.success, `Signup failed: ${signupRes.error}`);
    assert(signupRes.userId, "Must return userId");
    createdUserId = signupRes.userId;
    console.log(`     User created with ID: ${createdUserId}`);
  });

  await runTest("Step 2: Simulate live photo capture during signup & call uploadProfilePhoto", async () => {
    // Mirror signup confirmPhoto() logic
    localStorage.setItem("userProfilePhoto", testPhotoDataUrl);
    assert.strictEqual(localStorage.getItem("userProfilePhoto"), testPhotoDataUrl);

    const uploadRes = await scModule.uploadProfilePhoto(createdUserId, testPhotoDataUrl);
    assert(uploadRes.success, `uploadProfilePhoto failed: ${uploadRes.error}`);
    console.log(`     Profile photo upload success. Local/Cloud synced.`);
  });

  await runTest("Step 3: Verify photo is saved in Supabase Auth user_metadata", async () => {
    const sc = scModule.getSupabaseClient();
    const { data: authData, error: authErr } = await sc.auth.getUser();
    assert(!authErr, `getUser error: ${authErr?.message}`);
    const meta = authData?.user?.user_metadata;
    assert(meta, "User metadata must exist");
    assert(meta.avatar_url || meta.profile_photo_url, "avatar_url or profile_photo_url must be saved in user_metadata");
    console.log(`     Supabase metadata contains photo: length = ${(meta.avatar_url || meta.profile_photo_url).length}`);
  });

  await runTest("Step 4: Simulate user logout (clear session and all localStorage)", async () => {
    await scModule.signOutUser();
    // Verify everything is wiped locally
    assert.strictEqual(localStorage.getItem("supabase_user_id"), null);
    assert.strictEqual(localStorage.getItem("userProfilePhoto"), null);
    console.log(`     Logged out. localStorage.userProfilePhoto is now: ${localStorage.getItem("userProfilePhoto")}`);
  });

  await runTest("Step 5: Log back in with original credentials and verify photo is restored", async () => {
    const loginRes = await scModule.signInUser({ email: testEmail, password: testPassword });
    assert(loginRes.success, `Login failed: ${loginRes.error}`);
    
    // fetchUserProfile call
    const profileRes = await scModule.fetchUserProfile(loginRes.userId);
    console.log('     profileRes:', profileRes);
    
    // Check restored photo in localStorage
    const restoredPhoto = localStorage.getItem("userProfilePhoto");
    console.log('     restoredPhoto from localStorage:', restoredPhoto ? restoredPhoto.slice(0, 50) + '...' : null);
    assert(restoredPhoto, "userProfilePhoto MUST be restored in localStorage after login!");
    assert.strictEqual(restoredPhoto, testPhotoDataUrl, "Restored photo must exactly match original captured photo data!");
    console.log(`     Photo successfully restored! Length: ${restoredPhoto.length}`);
  });

  await runTest("Step 6: Verify all relevant page templates check and render userProfilePhoto", () => {
    const pages = [
      "skill_gap_force_job_recommendations/code.html",
      "skill_gap_force_job_detail_skill_gap/code.html",
      "skill_gap_force_saved_jobs/code.html",
      "skill_gap_force_book_1_1_session/code.html",
      "skill_gap_force_target_role_selection/code.html",
      "skill_gap_force_skill_gap_result/code.html",
      "skill_gap_force_edit_profile/code.html"
    ];

    pages.forEach(p => {
      const filePath = path.join(__dirname, p);
      const content = fs.readFileSync(filePath, "utf8");
      assert(
        content.includes("userProfilePhoto"),
        `Page ${p} must reference userProfilePhoto to display user avatar`
      );
    });
  });

  console.log("\n================================================================");
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed} ✅`);
  console.log(`FAILED: ${failed} ❌`);
  console.log("================================================================");

  if (failed > 0) process.exit(1);
})();
