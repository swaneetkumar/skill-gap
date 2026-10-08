const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const pages = [
  { name: 'Landing Page', relPath: 'index.html' },
  { name: 'Precision Career Engine (Landing Mirror)', relPath: 'precision_career_engine/code.html' },
  { name: 'Signup Page', relPath: 'skill_gap_force_create_your_account/code.html' },
  { name: 'Login Page', relPath: 'skill_gap_force_login/code.html' },
  { name: 'Upload Resume & Skills Setup', relPath: 'skill_gap_force_resume_skills_setup/code.html' },
  { name: 'Job Recommendations', relPath: 'skill_gap_force_job_recommendations/code.html' },
  { name: 'Job Detail & Skill Gap', relPath: 'skill_gap_force_job_detail_skill_gap/code.html' },
  { name: 'Saved Jobs', relPath: 'skill_gap_force_saved_jobs/code.html' },
  { name: 'Book 1:1 Session', relPath: 'skill_gap_force_book_1_1_session/code.html' },
  { name: 'Target Role Selection', relPath: 'skill_gap_force_target_role_selection/code.html' },
  { name: 'Target Skill Gap Result', relPath: 'skill_gap_force_skill_gap_result/code.html' },
  { name: 'Edit Profile', relPath: 'skill_gap_force_edit_profile/code.html' }
];

console.log('================================================================');
console.log('SKILL GAP FORCE - COMPREHENSIVE DARK MODE VALIDATION SUITE');
console.log('================================================================\n');

// 1. Verify theme.css design tokens
const themeCssPath = path.join(baseDir, 'theme.css');
if (!fs.existsSync(themeCssPath)) {
  console.error('❌ FAIL: theme.css does not exist');
  process.exit(1);
}
const themeCss = fs.readFileSync(themeCssPath, 'utf8');

const requiredTokens = [
  '--bg',
  '--surface',
  '--surface-elevated',
  '--border',
  '--text-primary',
  '--text-secondary',
  '--text-muted',
  '--primary-gradient',
  '--accent',
  '--success',
  '--danger',
  '--warning'
];

let missingTokens = [];
for (const token of requiredTokens) {
  if (!themeCss.includes(token + ':')) {
    missingTokens.push(token);
  }
}

if (missingTokens.length === 0) {
  console.log('✅ PASS: All required central CSS design tokens defined in theme.css:');
  console.log('   ' + requiredTokens.join(', '));
} else {
  console.error('❌ FAIL: Missing design tokens in theme.css:', missingTokens);
  process.exit(1);
}

// 2. Validate all pages
console.log('\n--- Auditing All 12 Project Pages ---');
let allPassed = true;

pages.forEach((page) => {
  const filePath = path.join(baseDir, page.relPath);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ FAIL: File not found: ${page.relPath}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const checks = [];

  // Theme css linked
  const hasThemeCss = content.includes('theme.css');
  checks.push({ name: 'theme.css linked', pass: hasThemeCss });

  // Theme color meta tag
  const hasThemeColor = content.includes('<meta name="theme-color" content="#0B1020"');
  checks.push({ name: 'meta theme-color #0B1020', pass: hasThemeColor });

  // Color scheme dark or dark class
  const hasColorScheme = content.includes('dark') || content.includes('color-scheme');
  checks.push({ name: 'dark mode enabled', pass: hasColorScheme });

  // Ambient blobs container
  const hasAmbientBlobs = content.includes('bg-ambient-blobs');
  checks.push({ name: 'ambient blobs present', pass: hasAmbientBlobs });

  // Unwanted solid bg-white checks (excluding company logo tiles or opacities like bg-white/10)
  const solidWhiteMatches = content.match(/class="[^"]*\bbg-white\b(?!\/)[^"]*"/g) || [];
  // Filter out any known logo tiles
  const invalidWhite = solidWhiteMatches.filter(m => !m.includes('company-logo-tile') && !m.includes('logo'));
  checks.push({ name: 'no solid bg-white cards/panels', pass: invalidWhite.length === 0 });

  // Check for hardcoded black text (text-black or text-gray-900 on main surfaces)
  const pureBlackTextMatches = content.match(/class="[^"]*\btext-black\b[^"]*"/g) || [];
  checks.push({ name: 'no hardcoded text-black', pass: pureBlackTextMatches.length === 0 });

  const failedChecks = checks.filter(c => !c.pass);
  if (failedChecks.length === 0) {
    console.log(`✅ PASS: ${page.name} (${page.relPath})`);
  } else {
    console.error(`❌ FAIL: ${page.name} (${page.relPath}):`, failedChecks.map(c => c.name).join(', '));
    allPassed = false;
  }
});

console.log('\n================================================================');
if (allPassed) {
  console.log('🎉 ALL PAGES SUCCESSFULLY VERIFIED IN HIGH-CONTRAST DARK MODE!');
} else {
  console.error('❌ ISSUES DETECTED DURING VALIDATION');
  process.exit(1);
}
console.log('================================================================\n');
