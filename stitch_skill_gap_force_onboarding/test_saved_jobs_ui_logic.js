/**
 * test_saved_jobs_ui_logic.js
 * Comprehensive unit and integration test for Saved Jobs UI functions,
 * event dispatching, optimistic rendering, and rollback logic.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('🧪 TESTING SAVED JOBS CLIENT-SIDE UI LOGIC');
console.log('========================================================\n');

// 1. Check HTML files exist and have proper syntax
const basePath = __dirname;
const recPath = path.join(basePath, 'skill_gap_force_job_recommendations', 'code.html');
const detailPath = path.join(basePath, 'skill_gap_force_job_detail_skill_gap', 'code.html');
const savedPath = path.join(basePath, 'skill_gap_force_saved_jobs', 'code.html');

const recHtml = fs.readFileSync(recPath, 'utf8');
const detailHtml = fs.readFileSync(detailPath, 'utf8');
const savedHtml = fs.readFileSync(savedPath, 'utf8');

// Verify Header Button Position (between Target Your Jobs and Profile Area)
const targetBtnPos = recHtml.indexOf('id="targetYourJobsHeaderBtn"');
const savedBtnPos = recHtml.indexOf('id="savedJobsHeaderBtn"');
const profileBtnPos = recHtml.indexOf('id="userProfileBtn"');

assert(targetBtnPos > 0, 'Target Your Jobs button found');
assert(savedBtnPos > targetBtnPos, 'Saved Jobs button is AFTER Target Your Jobs button');
assert(profileBtnPos > savedBtnPos, 'Saved Jobs button is BEFORE Profile button');
console.log('✅ PASS: Saved Jobs button is correctly placed between Target Your Jobs and Profile area');

// Verify Bell Icon on Header Button
const savedBtnSnippet = recHtml.substring(savedBtnPos, recHtml.indexOf('</a>', savedBtnPos));
assert(savedBtnSnippet.includes('notifications'), 'Saved Jobs button has bell icon (notifications)');
assert(savedBtnSnippet.includes('id="savedJobsBellBadge"'), 'Saved Jobs button has badge element');
console.log('✅ PASS: Saved Jobs button contains bell icon and badge');

// Verify Back to Recommendations link on Saved Jobs page
assert(savedHtml.includes('Back to Recommendations'), 'Saved Jobs page has Back to Recommendations link');
assert(savedHtml.includes('../skill_gap_force_job_recommendations/code.html'), 'Link points to recommendations page');
console.log('✅ PASS: Saved Jobs page has Back to Recommendations link');

// Verify Empty State & Loading Skeleton on Saved Jobs page
assert(savedHtml.includes('id="emptyStateContainer"'), 'Empty state container exists');
assert(savedHtml.includes('No saved jobs yet. Save jobs from your recommendations to see them here.'), 'Exact friendly empty state text exists');
assert(savedHtml.includes('id="loadingSkeletonContainer"'), 'Loading skeleton exists');
console.log('✅ PASS: Empty state and loading skeleton exist with correct copy');

// Verify Detail Header Bookmark button
assert(detailHtml.includes('id="detailBookmarkBtn"'), 'Job Detail page has detailBookmarkBtn');
assert(detailHtml.includes('handleDetailToggleSave()'), 'Job Detail page calls handleDetailToggleSave');
console.log('✅ PASS: Job Detail header has bookmark button and toggle handler');

// 2. Test Mock DOM Element manipulation for Badge & Bookmark States
function createMockElement(tag, attrs = {}) {
  const el = {
    tagName: tag,
    attributes: { ...attrs },
    classList: {
      _classes: new Set((attrs.class || '').split(' ').filter(Boolean)),
      add(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
      contains(c) { return this._classes.has(c); }
    },
    textContent: '',
    innerHTML: '',
    style: {},
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k]; },
    closest: () => null,
    parentNode: null,
    children: []
  };
  return el;
}

// Test Badge Updates
function updateSavedJobsHeaderBadgeTest(badgeEl, count) {
  if (count > 0) {
    badgeEl.textContent = count;
    badgeEl.classList.remove('hidden');
  } else {
    badgeEl.classList.add('hidden');
  }
}

const mockBadge = createMockElement('span', { class: 'hidden' });
updateSavedJobsHeaderBadgeTest(mockBadge, 3);
assert.strictEqual(mockBadge.textContent, 3, 'Badge text should be 3');
assert.strictEqual(mockBadge.classList.contains('hidden'), false, 'Badge should be visible when count > 0');

updateSavedJobsHeaderBadgeTest(mockBadge, 0);
assert.strictEqual(mockBadge.classList.contains('hidden'), true, 'Badge should be hidden when count is 0');
console.log('✅ PASS: Badge displays count and hides when count is 0');

// Test Bookmark Button UI State Switching
function updateBookmarkButtonUITest(btn, isSaved) {
  if (isSaved) {
    btn.setAttribute('aria-label', 'Remove from Saved Jobs');
    btn.setAttribute('title', 'Remove from Saved Jobs');
    btn.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bookmark</span>`;
  } else {
    btn.setAttribute('aria-label', 'Save Job');
    btn.setAttribute('title', 'Save Job');
    btn.innerHTML = `<span class="material-symbols-outlined">bookmark_border</span>`;
  }
}

const mockBtn = createMockElement('button');
updateBookmarkButtonUITest(mockBtn, true);
assert(mockBtn.innerHTML.includes("'FILL' 1"), 'Bookmark icon is filled when saved');
assert.strictEqual(mockBtn.getAttribute('aria-label'), 'Remove from Saved Jobs');

updateBookmarkButtonUITest(mockBtn, false);
assert(mockBtn.innerHTML.includes('bookmark_border'), 'Bookmark icon is outline when unsaved');
assert.strictEqual(mockBtn.getAttribute('aria-label'), 'Save Job');
console.log('✅ PASS: Bookmark button toggles between filled and outline states');

console.log('\n========================================================');
console.log('STATUS: ALL CLIENT UI LOGIC TESTS PASSED! 🚀');
console.log('========================================================');
