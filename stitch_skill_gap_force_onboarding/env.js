/**
 * env.js
 * Centralized Environment Configuration
 * 
 * Securely loads credentials from environment variables (.env in Node.js,
 * or window.__ENV__ in browser environments) so sensitive configuration
 * is never hardcoded directly in component or UI files.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    // Node.js / CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    root.__ENV__ = root.__ENV__ || factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  let supabaseUrl = '';
  let supabaseKey = '';
  let supabaseProjectRef = '';
  let backendUrl = '';

  // 1. Node.js environment: load from process.env via dotenv
  if (typeof process !== 'undefined' && process.env) {
    try {
      const dotenv = require('dotenv');
      const path = require('path');
      dotenv.config({ path: path.resolve(__dirname, '.env') });
    } catch (e) {
      // dotenv might not be needed if variables are already set in process.env
    }

    supabaseUrl = process.env.SUPABASE_URL || '';
    supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    supabaseProjectRef = process.env.SUPABASE_PROJECT_REF || '';
    backendUrl = process.env.VITE_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || '';
  }

  // 2. Browser environment: check window.__ENV__ or global configuration
  if (typeof window !== 'undefined' && window.__ENV__) {
    supabaseUrl = supabaseUrl || window.__ENV__.SUPABASE_URL || '';
    supabaseKey = supabaseKey || window.__ENV__.SUPABASE_PUBLISHABLE_KEY || window.__ENV__.SUPABASE_ANON_KEY || '';
    supabaseProjectRef = supabaseProjectRef || window.__ENV__.SUPABASE_PROJECT_REF || '';
    backendUrl = backendUrl || window.__ENV__.VITE_BACKEND_URL || window.__ENV__.NEXT_PUBLIC_BACKEND_URL || window.__ENV__.BACKEND_URL || '';
  }

  // Fallback defaults from environment config if not present
  if (!supabaseProjectRef) {
    supabaseProjectRef = 'jnioqxxmonkuugyjkvfe';
  }
  if (!supabaseUrl) {
    supabaseUrl = `https://${supabaseProjectRef}.supabase.co`;
  }
  if (!supabaseKey) {
    supabaseKey = 'sb_publishable_XPcevggoyhhOvUrx-jF6GA_Zh_3CXFo';
  }
  if (!backendUrl) {
    backendUrl = 'https://skill-gap-backend-oxm0.onrender.com';
  }

  // Normalize project URL: if someone passed just the project ref, prepend protocol and domain
  if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    if (!supabaseUrl.includes('.')) {
      supabaseUrl = `https://${supabaseUrl}.supabase.co`;
    } else {
      supabaseUrl = `https://${supabaseUrl}`;
    }
  }

  const ENV = Object.freeze({
    SUPABASE_PROJECT_REF: supabaseProjectRef,
    SUPABASE_URL: supabaseUrl,
    SUPABASE_PUBLISHABLE_KEY: supabaseKey,
    SUPABASE_ANON_KEY: supabaseKey,
    BACKEND_URL: backendUrl,
    VITE_BACKEND_URL: backendUrl,
    NEXT_PUBLIC_BACKEND_URL: backendUrl
  });

  return ENV;
});
