/**
 * test_supabase_connection.js
 * Verification script to test Supabase client connection & configuration
 */

const env = require('./env');
const { supabase, verifySupabaseConnection, SUPABASE_URL, SUPABASE_PROJECT_REF } = require('./supabaseClient');

async function runTests() {
  console.log('========================================================');
  console.log('SUPABASE CONNECTION & CONFIGURATION TEST SUITE');
  console.log('========================================================\n');

  // Test 1: Environment Variables Check
  console.log('--- Test 1: Environment Variables Loading ---');
  console.log(`- Project Ref : ${env.SUPABASE_PROJECT_REF}`);
  console.log(`- Project URL : ${env.SUPABASE_URL}`);
  console.log(`- Key Length  : ${env.SUPABASE_PUBLISHABLE_KEY ? env.SUPABASE_PUBLISHABLE_KEY.length + ' chars' : 'MISSING'}`);
  console.log(`- Key Prefix  : ${env.SUPABASE_PUBLISHABLE_KEY.substring(0, 15)}...`);

  if (!env.SUPABASE_URL.includes('jnioqxxmonkuugyjkvfe')) {
    throw new Error('Project URL does not match target jnioqxxmonkuugyjkvfe');
  }
  if (!env.SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_')) {
    throw new Error('Publishable key does not have expected sb_publishable_ prefix');
  }
  console.log('Environment configuration check: PASS ✅\n');

  // Test 2: Client Initialization Check
  console.log('--- Test 2: Supabase Client Instance Initialization ---');
  if (!supabase) {
    throw new Error('Supabase client was not initialized');
  }
  if (!supabase.auth || typeof supabase.auth.getSession !== 'function') {
    throw new Error('Supabase client is missing auth module');
  }
  if (!supabase.from || typeof supabase.from !== 'function') {
    throw new Error('Supabase client is missing database querying module (from)');
  }
  console.log('Client instance check: PASS ✅\n');

  // Test 3: Live Connection & Handshake Check
  console.log('--- Test 3: Live Connection Handshake ---');
  console.log(`Pinging Supabase instance at ${SUPABASE_URL}...`);
  const result = await verifySupabaseConnection();
  console.log('Connection Verification Result:', JSON.stringify(result, null, 2));

  if (!result.success) {
    throw new Error(`Connection verification failed: ${result.error}`);
  }
  console.log('Live connection handshake: PASS ✅\n');

  console.log('========================================================');
  console.log('STATUS: SUPABASE CONNECTION FULLY VERIFIED & OPERATIONAL! 🚀');
  console.log('========================================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err.message);
  process.exit(1);
});
