/**
 * supabaseClient.js
 * Centralized Supabase Client Configuration & Authentication Service
 * 
 * Sets up and exports the Supabase client instance using credentials
 * securely supplied via environment variables (.env / env.js).
 * Provides core authentication utilities for Signup, Login, and Session management.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    // Node.js / CommonJS
    const env = require('./env');
    let createClient;
    try {
      createClient = require('@supabase/supabase-js').createClient;
    } catch (e) {
      console.warn('@supabase/supabase-js not found in Node environment');
    }
    module.exports = factory(env, createClient);
  } else {
    // Browser environment
    const env = root.__ENV__ || (typeof getEnv === 'function' ? getEnv() : {});
    const getCreateClient = () => (root.supabase && typeof root.supabase.createClient === 'function') ? root.supabase.createClient : null;
    const clientModule = factory(env, getCreateClient());
    
    root.supabaseClient = clientModule.supabase;
    root.verifySupabaseConnection = clientModule.verifySupabaseConnection;
    root.signUpUser = clientModule.signUpUser;
    root.signInUser = clientModule.signInUser;
    root.signOutUser = clientModule.signOutUser;
    root.getStoredUserId = clientModule.getStoredUserId;
    root.getCurrentSession = clientModule.getCurrentSession;
    root.persistUserSession = clientModule.persistUserSession;
    root.clearUserSession = clientModule.clearUserSession;
    root.clearAllUserData = clientModule.clearAllUserData;
    root.handleLogout = clientModule.handleLogout;
    root.requireAuth = clientModule.requireAuth;
    root.getSupabaseClient = clientModule.getSupabaseClient;
    root.createUserProfile = clientModule.createUserProfile;
    root.fetchUserProfile = clientModule.fetchUserProfile;
    root.updateUserProfile = clientModule.updateUserProfile;
    root.uploadProfilePhoto = clientModule.uploadProfilePhoto;
    root.uploadResumeFile = clientModule.uploadResumeFile;
    root.populateAppStateFromProfile = clientModule.populateAppStateFromProfile;
    root.hasUserCompletedOnboarding = clientModule.hasUserCompletedOnboarding;
    root.classifyUserSkills = clientModule.classifyUserSkills;
    root.fetchSavedJobIds = clientModule.fetchSavedJobIds;
    root.getStoredSavedJobIds = clientModule.getStoredSavedJobIds;
    root.isJobSaved = clientModule.isJobSaved;
    root.saveJob = clientModule.saveJob;
    root.unsaveJob = clientModule.unsaveJob;
    root.toggleSaveJob = clientModule.toggleSaveJob;
    root.showAppToast = clientModule.showAppToast;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function (env, createClientFn) {
  const SUPABASE_URL = (env && env.SUPABASE_URL) || 'https://jnioqxxmonkuugyjkvfe.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = (env && (env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY)) || 'sb_publishable_XPcevggoyhhOvUrx-jF6GA_Zh_3CXFo';
  const SUPABASE_PROJECT_REF = (env && env.SUPABASE_PROJECT_REF) || 'jnioqxxmonkuugyjkvfe';

  let client = null;

  function initClient(fn) {
    const creator = fn || createClientFn || (typeof globalThis !== 'undefined' && globalThis.supabase ? globalThis.supabase.createClient : null);
    if (typeof creator === 'function') {
      return creator(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return null;
  }

  client = initClient();

  function getSupabaseClient() {
    if (!client) {
      client = initClient();
    }
    return client;
  }

  /**
   * Translates Supabase error responses into clear, human-friendly error messages
   */
  function formatAuthError(err) {
    if (!err) return 'An unexpected error occurred. Please try again.';
    const raw = typeof err === 'string' ? err : (err.message || String(err));
    const lower = raw.toLowerCase();

    if (lower.includes('already registered') || lower.includes('already taken') || lower.includes('duplicate')) {
      return 'This email is already registered. Please log in instead or use a different email.';
    }
    if (lower.includes('invalid login credentials') || lower.includes('invalid credentials') || lower.includes('wrong password') || lower.includes('user not found')) {
      return 'Invalid email or password. Please verify your credentials and try again.';
    }
    if (lower.includes('password') && (lower.includes('short') || lower.includes('characters') || lower.includes('weak'))) {
      return 'Password must be at least 8 characters and contain at least one special character.';
    }
    if (lower.includes('rate limit') || lower.includes('too many requests')) {
      return 'Too many attempts. Please wait a few moments before trying again.';
    }
    if (lower.includes('network') || lower.includes('failed to fetch')) {
      return 'Network connection error. Please check your internet connection.';
    }

    return raw;
  }

  /**
   * Persists active Supabase session & user identifier into localStorage app-level state
   */
  function persistUserSession(user, session, customFullName) {
    if (typeof localStorage === 'undefined') return;

    if (user) {
      localStorage.setItem('supabase_user_id', user.id);
      localStorage.setItem('supabase_user_email', user.email || '');

      const fullName = customFullName || user.user_metadata?.full_name || '';
      if (fullName) {
        localStorage.setItem('userFullName', fullName);
        localStorage.setItem('userSignupName', fullName);
      }
      if (user.email) {
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userSignupEmail', user.email);
      }
      const photo = user.user_metadata?.avatar_url || user.user_metadata?.profile_photo_url;
      if (photo) {
        localStorage.setItem('userProfilePhoto', photo);
      }
    }

    if (session) {
      try {
        localStorage.setItem('supabase_session', JSON.stringify(session));
        if (session.access_token) {
          localStorage.setItem('supabase_access_token', session.access_token);
        }
      } catch (e) {
        console.warn('Could not serialize Supabase session:', e);
      }
    }
  }

  /**
   * Clears active Supabase session and all locally held user state on logout
   */
  function clearUserSession() {
    clearAllUserData();
  }

  /**
   * Comprehensive cleanup of all locally held user and application state
   * (profile data, skills, resume details, photo, projects, categories, bookings)
   */
  function clearAllUserData() {
    if (typeof localStorage === 'undefined') return;
    const keysToRemove = [
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
      'userSessionBookings',
      'userSavedJobIds',
      'userSavedJobs'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    if (typeof sessionStorage !== 'undefined') {
      try { sessionStorage.clear(); } catch (e) {}
    }
  }

  /**
   * Handles user logout:
   * 1. Calls Supabase signOut() to end the session on Supabase
   * 2. Clears all locally held app state (profile data, skills, resume, photo, projects)
   * 3. Redirects user back to Login page
   */
  async function handleLogout(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Supabase auth signOut notice:', e);
    }
    clearAllUserData();

    if (typeof window !== 'undefined' && window.location) {
      const current = window.location.pathname;
      let target = '../skill_gap_force_login/code.html';
      if (current.includes('skill_gap_force_login')) {
        target = './code.html';
      }
      window.location.replace(target);
    }
    return { success: true };
  }

  /**
   * Protected page guard: redirects unauthenticated users to Login page
   */
  function requireAuth(redirectPath = '../skill_gap_force_login/code.html') {
    if (typeof localStorage === 'undefined') return true;
    const userId = localStorage.getItem('supabase_user_id');
    const sessionStr = localStorage.getItem('supabase_session');

    if (!userId || !sessionStr) {
      clearAllUserData();
      if (typeof window !== 'undefined' && window.location) {
        window.location.replace(redirectPath);
      }
      return false;
    }
    return true;
  }

  /**
   * Returns currently stored Supabase user ID from app state
   */
  function getStoredUserId() {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('supabase_user_id') || null;
  }

  /**
   * Returns active Supabase session from client or storage
   */
  async function getCurrentSession() {
    const sc = getSupabaseClient();
    if (sc && sc.auth) {
      try {
        const { data, error } = await sc.auth.getSession();
        if (data?.session) return data.session;
      } catch (e) {}
    }
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('supabase_session');
      if (raw) {
        try { return JSON.parse(raw); } catch (e) {}
      }
    }
    return null;
  }

  /**
   * Registers a new user with Supabase Auth using email and password
   * 
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @param {string} [params.fullName]
   * @returns {Promise<{success: boolean, user?: Object, session?: Object, userId?: string, error?: string}>}
   */
  async function signUpUser({ email, password, fullName }) {
    const sc = getSupabaseClient();
    if (!sc) {
      return { success: false, error: 'Supabase client is not initialized.' };
    }

    try {
      const trimmedEmail = (email || '').trim();
      const trimmedName = (fullName || '').trim();

      const { data, error } = await sc.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            full_name: trimmedName
          }
        }
      });

      if (error) {
        return { success: false, error: formatAuthError(error) };
      }

      // Check for silent duplicate: Supabase returns empty identities array when user already exists
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          success: false,
          error: 'This email is already registered. Please log in instead or use another email.'
        };
      }

      if (!data?.user) {
        return { success: false, error: 'Signup failed. Please try again.' };
      }

      // Store in app-level state
      persistUserSession(data.user, data.session, trimmedName);

      return {
        success: true,
        user: data.user,
        session: data.session,
        userId: data.user.id
      };
    } catch (err) {
      return { success: false, error: formatAuthError(err) };
    }
  }

  /**
   * Logs in an existing user with Supabase Auth using email and password
   * 
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{success: boolean, user?: Object, session?: Object, userId?: string, error?: string}>}
   */
  async function signInUser({ email, password }) {
    const sc = getSupabaseClient();
    if (!sc) {
      return { success: false, error: 'Supabase client is not initialized.' };
    }

    try {
      const trimmedEmail = (email || '').trim();

      const { data, error } = await sc.auth.signInWithPassword({
        email: trimmedEmail,
        password: password
      });

      if (error) {
        return { success: false, error: formatAuthError(error) };
      }

      if (!data?.user) {
        return { success: false, error: 'Invalid email or password. Please try again.' };
      }

      // Store in app-level state
      persistUserSession(data.user, data.session);

      return {
        success: true,
        user: data.user,
        session: data.session,
        userId: data.user.id
      };
    } catch (err) {
      return { success: false, error: formatAuthError(err) };
    }
  }

  /**
   * Signs out the current user and clears session state
   */
  async function signOutUser() {
    const sc = getSupabaseClient();
    try {
      if (sc && sc.auth) {
        await sc.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase signOut warning:', e);
    }
    clearUserSession();
    return { success: true };
  }

  /**
   * Diagnostic function to verify connection to Supabase instance.
   */
  async function verifySupabaseConnection() {
    const sc = getSupabaseClient();
    try {
      if (!sc) {
        return {
          success: false,
          error: 'Supabase client instance is not initialized.',
          url: SUPABASE_URL,
          projectRef: SUPABASE_PROJECT_REF
        };
      }

      const { error: sessionError } = await sc.auth.getSession();
      if (sessionError) {
        return {
          success: false,
          error: `Auth session check failed: ${sessionError.message}`,
          url: SUPABASE_URL,
          projectRef: SUPABASE_PROJECT_REF
        };
      }

      const pingUrl = `${SUPABASE_URL}/auth/v1/settings`;
      const fetchFn = typeof fetch !== 'undefined' ? fetch : (await import('node-fetch').then(m => m.default).catch(() => null));
      
      if (fetchFn) {
        const response = await fetchFn(pingUrl, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
          }
        });

        if (!response.ok) {
          const errText = await response.text();
          return {
            success: false,
            error: `Endpoint returned HTTP status ${response.status}: ${errText}`,
            url: SUPABASE_URL,
            projectRef: SUPABASE_PROJECT_REF
          };
        }

        const settings = await response.json().catch(() => ({}));
        return {
          success: true,
          message: 'Connection to Supabase successfully established!',
          url: SUPABASE_URL,
          projectRef: SUPABASE_PROJECT_REF,
          authSettings: {
            emailAuthEnabled: settings?.external?.email ?? true,
            disableSignup: settings?.disable_signup ?? false
          }
        };
      }

      return {
        success: true,
        message: 'Connection to Supabase established (session check passed).',
        url: SUPABASE_URL,
        projectRef: SUPABASE_PROJECT_REF
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || String(err),
        url: SUPABASE_URL,
        projectRef: SUPABASE_PROJECT_REF
      };
    }
  }

  // Keyword taxonomies for automatic category matching during state hydration
  const WEB_DEV_KEYWORDS = [
    "HTML", "CSS", "JavaScript", "Git", "GitHub", "React", "Node.js", "Express",
    "Database", "REST API", "Authentication", "TypeScript", "Next.js", "Docker",
    "Cloud", "System Design"
  ];

  const AI_ML_KEYWORDS = [
    "Python", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Statistics", "Probability",
    "Linear Algebra", "SQL", "Data Preprocessing", "EDA", "Machine Learning",
    "Scikit-learn", "Supervised Learning", "Unsupervised Learning", "Feature Engineering",
    "Model Evaluation", "Deep Learning", "PyTorch", "TensorFlow", "CNN", "RNN", "LSTM",
    "Transformers", "NLP", "GenAI", "LLM", "Hugging Face", "LangChain", "RAG",
    "Fine-tuning", "MLOps", "Docker", "AWS", "GCP", "Azure"
  ];

  const WEB3_KEYWORDS = [
    "Blockchain", "Cryptography", "Bitcoin", "Ethereum", "Wallets", "EVM", "Solidity",
    "Smart Contracts", "Remix", "Hardhat", "Foundry", "Web3.js", "Ethers.js", "dApps",
    "ERC-20", "ERC-721", "ERC-1155", "DeFi", "DEX", "DAOs", "Oracles", "Layer 2",
    "Gas Optimization", "Smart Contract Security", "Testing", "Auditing", "IPFS",
    "The Graph", "RPC", "MEV", "Tokenomics", "Cross-chain", "Web3 Backend", "Docker",
    "Cloud"
  ];

  function normalizeSkillToken(s) {
    return (s || '').toLowerCase().replace(/\./g, '').replace(/[-_]/g, ' ').trim();
  }

  function skillMatchesTaxonomy(skill, keyword) {
    const s = normalizeSkillToken(skill);
    const k = normalizeSkillToken(keyword);
    if (s === k) return true;
    if (s + 's' === k || k + 's' === s) return true;
    return false;
  }

  function classifyUserSkills(skillsList) {
    if (!Array.isArray(skillsList) || skillsList.length === 0) return null;
    const web_dev_matches = skillsList.filter(s => WEB_DEV_KEYWORDS.some(kw => skillMatchesTaxonomy(s, kw)));
    const ai_ml_matches = skillsList.filter(s => AI_ML_KEYWORDS.some(kw => skillMatchesTaxonomy(s, kw)));
    const web3_matches = skillsList.filter(s => WEB3_KEYWORDS.some(kw => skillMatchesTaxonomy(s, kw)));

    const counts = {
      web_dev: web_dev_matches.length,
      ai_ml: ai_ml_matches.length,
      web3: web3_matches.length
    };

    const lengths = {
      web_dev: WEB_DEV_KEYWORDS.length,
      ai_ml: AI_ML_KEYWORDS.length,
      web3: WEB3_KEYWORDS.length
    };

    const maxCount = Math.max(counts.web_dev, counts.ai_ml, counts.web3);
    let winningCategory = null;
    let winningName = null;

    if (maxCount > 0) {
      const candidates = Object.keys(counts).filter(k => counts[k] === maxCount);
      if (candidates.length === 1) {
        winningCategory = candidates[0];
      } else {
        winningCategory = candidates.reduce((prev, curr) => {
          const prevPct = counts[prev] / lengths[prev];
          const currPct = counts[curr] / lengths[curr];
          return currPct > prevPct ? curr : prev;
        });
      }

      const nameMap = {
        web_dev: "Web Development",
        ai_ml: "AI & Machine Learning",
        web3: "Web3 & Blockchain"
      };
      winningName = nameMap[winningCategory] || winningCategory;
    }

    return {
      winning_category: winningCategory,
      winning_category_name: winningName,
      web_dev_match_count: counts.web_dev,
      ai_ml_match_count: counts.ai_ml,
      web3_match_count: counts.web3
    };
  }

  /**
   * Checks whether a fetched profile row indicates completed onboarding
   * (specifically whether the "skills" column has non-empty data)
   * Properly parses JSON strings, arrays, objects, and empty variants ("[]", "{}", "", null).
   * 
   * @param {Object} [profile] - Row from Supabase public.profiles table
   * @returns {boolean}
   */
  function hasUserCompletedOnboarding(profile) {
    let raw = profile ? profile.skills : null;
    if (!raw && typeof localStorage !== 'undefined') {
      raw = localStorage.getItem('userSelectedSkills');
    }
    if (!raw) return false;

    if (Array.isArray(raw)) {
      return raw.filter(s => s && String(s).trim().length > 0).length > 0;
    }

    if (typeof raw === 'object' && raw !== null) {
      return Object.keys(raw).length > 0;
    }

    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed || trimmed === '[]' || trimmed === '{}' || trimmed === '""' || trimmed === "''" || trimmed === 'null' || trimmed === 'undefined') {
        return false;
      }
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(s => s && String(s).trim().length > 0).length > 0;
        }
        if (typeof parsed === 'object' && parsed !== null) {
          return Object.keys(parsed).length > 0;
        }
      } catch (e) {
        const cleaned = trimmed.replace(/[\[\]"]/g, '').trim();
        return cleaned.length > 0;
      }
    }
    return false;
  }

  /**
   * Hydrates local app state (localStorage) from a fetched Supabase profile row
   */
  function populateAppStateFromProfile(profile) {
    if (!profile || typeof localStorage === 'undefined') return;

    if (profile.name) {
      localStorage.setItem('userFullName', profile.name);
      localStorage.setItem('userSignupName', profile.name);
    }
    if (profile.email) {
      localStorage.setItem('userEmail', profile.email);
      localStorage.setItem('userSignupEmail', profile.email);
    }
    if (profile.profile_photo_url) {
      localStorage.setItem('userProfilePhoto', profile.profile_photo_url);
    }
    if (profile.phone) {
      localStorage.setItem('userPhone', profile.phone);
      localStorage.setItem('userCustomPhone', profile.phone);
    } else {
      localStorage.removeItem('userCustomPhone');
      localStorage.removeItem('userPhone');
    }
    if (profile.location) {
      localStorage.setItem('userLocation', profile.location);
    }
    if (profile.education) {
      localStorage.setItem('userEducation', profile.education);
    }
    if (profile.experience) {
      localStorage.setItem('userExperience', profile.experience);
    }

    // Skills & category classification
    if (profile.skills) {
      let skillsArr = profile.skills;
      if (typeof skillsArr === 'string') {
        try {
          skillsArr = JSON.parse(skillsArr);
        } catch (e) {
          skillsArr = [profile.skills];
        }
      }
      if (Array.isArray(skillsArr)) {
        localStorage.setItem('userSelectedSkills', JSON.stringify(skillsArr));
        if (skillsArr.length > 0) {
          const classification = classifyUserSkills(skillsArr);
          if (classification && classification.winning_category) {
            localStorage.setItem('userWinningCategory', classification.winning_category);
            localStorage.setItem('userWinningCategoryName', classification.winning_category_name || '');
            localStorage.setItem('userCategoryClassification', JSON.stringify(classification));
          }
        }
      }
    }

    // Projects
    if (profile.projects) {
      let projArr = profile.projects;
      if (typeof projArr === 'string') {
        try {
          projArr = JSON.parse(projArr);
        } catch (e) {
          projArr = [];
        }
      }
      if (Array.isArray(projArr)) {
        localStorage.setItem('userProjects', JSON.stringify(projArr));
      }
    }

    // Resume details mirror
    const resumeDetails = {
      phone: profile.phone || '',
      email: profile.email || '',
      location: profile.location || '',
      education: profile.education || '',
      experience: profile.experience || ''
    };
    localStorage.setItem('userResumeDetails', JSON.stringify(resumeDetails));
  }

  /**
   * Creates or ensures a row in public.profiles table for the authenticated user
   */
  async function createUserProfile({ userId, email, name }) {
    const sc = getSupabaseClient();
    const cleanId = userId || getStoredUserId();
    if (!cleanId) {
      console.error('[Supabase createUserProfile Error]: User ID is required.');
      return { success: false, error: 'User ID is required to create profile.' };
    }

    const payload = {
      user_id: cleanId,
      email: (email || '').trim(),
      name: (name || '').trim(),
      created_at: new Date().toISOString()
    };

    // Keep app-level local state in sync
    if (typeof localStorage !== 'undefined') {
      if (payload.name) {
        localStorage.setItem('userFullName', payload.name);
        localStorage.setItem('userSignupName', payload.name);
      }
      if (payload.email) {
        localStorage.setItem('userEmail', payload.email);
        localStorage.setItem('userSignupEmail', payload.email);
      }
    }

    if (!sc) {
      return { success: true, profile: payload, localOnly: true };
    }

    try {
      // 1. Check if profile already exists for this user_id
      const { data: existing, error: checkErr } = await sc
        .from('profiles')
        .select('*')
        .eq('user_id', cleanId)
        .maybeSingle();

      if (checkErr) {
        console.error('[Supabase createUserProfile check error]:', checkErr.message, checkErr);
      }

      if (!checkErr && existing) {
        const updates = {};
        if (payload.name && !existing.name) updates.name = payload.name;
        if (payload.email && !existing.email) updates.email = payload.email;

        if (Object.keys(updates).length > 0) {
          const { data: updated, error: updErr } = await sc
            .from('profiles')
            .update(updates)
            .eq('user_id', cleanId)
            .select()
            .maybeSingle();
          if (updErr) {
            console.error('[Supabase createUserProfile update error]:', updErr.message, updErr);
          }
          if (updated) {
            populateAppStateFromProfile(updated);
            return { success: true, profile: updated };
          }
        }
        populateAppStateFromProfile(existing);
        return { success: true, profile: existing };
      }

      // 2. Try atomic upsert by user_id
      const { data: upserted, error: upsertErr } = await sc
        .from('profiles')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .maybeSingle();

      if (!upsertErr && upserted) {
        populateAppStateFromProfile(upserted);
        return { success: true, profile: upserted };
      }

      // 3. Fallback insert new profile row
      const { data: inserted, error: insErr } = await sc
        .from('profiles')
        .insert(payload)
        .select()
        .maybeSingle();

      if (insErr) {
        console.error('[Supabase createUserProfile insert error]:', insErr.message, insErr);
        return {
          success: false,
          error: insErr.message,
          profile: payload
        };
      }

      if (inserted) {
        populateAppStateFromProfile(inserted);
        return { success: true, profile: inserted };
      }

      return { success: true, profile: payload };
    } catch (err) {
      console.error('[Supabase createUserProfile exception]:', err.message || String(err), err);
      return { success: false, error: err.message || String(err), profile: payload };
    }
  }

  /**
   * Fetches user profile data from public.profiles table by user_id
   * Fully waits for Supabase fetch before returning.
   */
  async function fetchUserProfile(userId) {
    const sc = getSupabaseClient();
    const cleanId = userId || getStoredUserId();
    if (!cleanId) {
      console.error('[Supabase fetchUserProfile Error]: No user ID provided or found in session.');
      return { success: false, error: 'No user ID provided or found in session.' };
    }

    if (!sc) {
      return { success: false, error: 'Supabase client is not initialized.' };
    }

    try {
      const { data, error } = await sc
        .from('profiles')
        .select('*')
        .eq('user_id', cleanId)
        .maybeSingle();

      if (error) {
        console.error('[Supabase fetchUserProfile Error]:', error.message, error);
        return { success: false, error: error.message };
      }

      // Check auth user metadata for fallback hydration if row is empty or missing
      let authUser = null;
      try {
        if (sc.auth && typeof sc.auth.getUser === 'function') {
          const { data: authData } = await sc.auth.getUser();
          authUser = authData?.user || null;
        }
      } catch (authErr) {
        console.warn('[Supabase getUser notice]:', authErr);
      }

      let profileResult = data ? { ...data } : null;

      if (authUser && authUser.user_metadata) {
        const meta = authUser.user_metadata;
        const metaPhoto = meta.avatar_url || meta.profile_photo_url || meta.picture || '';
        if (!profileResult) {
          profileResult = {
            user_id: cleanId,
            email: authUser.email || '',
            name: meta.full_name || meta.name || '',
            skills: meta.skills || null,
            phone: meta.phone || '',
            location: meta.location || '',
            education: meta.education || '',
            experience: meta.experience || '',
            projects: meta.projects || null,
            profile_photo_url: metaPhoto
          };
        } else {
          if (!hasUserCompletedOnboarding(profileResult) && meta.skills) {
            profileResult.skills = meta.skills;
          }
          if (!profileResult.profile_photo_url && metaPhoto) {
            profileResult.profile_photo_url = metaPhoto;
          }
          if (!profileResult.projects && meta.projects) {
            profileResult.projects = meta.projects;
          }
        }
      }

      if (!profileResult) {
        return { success: false, error: 'Profile not found.' };
      }

      // Populate local app state
      populateAppStateFromProfile(profileResult);

      return {
        success: true,
        profile: profileResult
      };
    } catch (err) {
      console.error('[Supabase fetchUserProfile Exception]:', err.message || String(err), err);
      return { success: false, error: err.message || String(err) };
    }
  }

  /**
   * Updates user profile in public.profiles table and synchronizes local state
   * Performs an atomic upsert by user_id, falling back to update/insert.
   * Logs all Supabase errors clearly to the console.
   */
  async function updateUserProfile(userId, updates = {}) {
    const sc = getSupabaseClient();
    const cleanId = userId || getStoredUserId();
    if (!cleanId) {
      console.error('[Supabase updateUserProfile Error]: No user ID provided.');
      return { success: false, error: 'No user ID provided.' };
    }

    const payload = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.education !== undefined) payload.education = updates.education;
    if (updates.experience !== undefined) payload.experience = updates.experience;
    if (updates.profile_photo_url !== undefined) payload.profile_photo_url = updates.profile_photo_url;

    // JSON string conversions for skills & projects
    if (updates.skills !== undefined) {
      payload.skills = typeof updates.skills === 'string' 
        ? updates.skills 
        : JSON.stringify(updates.skills || []);
    }
    if (updates.projects !== undefined) {
      payload.projects = typeof updates.projects === 'string' 
        ? updates.projects 
        : JSON.stringify(updates.projects || []);
    }

    // Immediately mirror to local state
    if (typeof localStorage !== 'undefined') {
      if (payload.name) {
        localStorage.setItem('userFullName', payload.name);
        localStorage.setItem('userSignupName', payload.name);
      }
      if (payload.email) {
        localStorage.setItem('userEmail', payload.email);
        localStorage.setItem('userSignupEmail', payload.email);
      }
      if (payload.profile_photo_url) {
        localStorage.setItem('userProfilePhoto', payload.profile_photo_url);
      }
      if (payload.phone !== undefined) {
        if (payload.phone) {
          localStorage.setItem('userPhone', payload.phone);
          localStorage.setItem('userCustomPhone', payload.phone);
        } else {
          localStorage.removeItem('userPhone');
          localStorage.removeItem('userCustomPhone');
        }
      }
      if (payload.location !== undefined) localStorage.setItem('userLocation', payload.location);
      if (payload.education !== undefined) localStorage.setItem('userEducation', payload.education);
      if (payload.experience !== undefined) localStorage.setItem('userExperience', payload.experience);
      if (payload.skills !== undefined) localStorage.setItem('userSelectedSkills', payload.skills);
      if (payload.projects !== undefined) localStorage.setItem('userProjects', payload.projects);
    }

    if (!sc) {
      return { success: true, profile: payload, localOnly: true };
    }

    // Sync to auth user metadata as well
    let metaSynced = false;
    try {
      if (sc.auth && typeof sc.auth.updateUser === 'function') {
        const metaUpdates = {};
        if (payload.skills !== undefined) metaUpdates.skills = payload.skills;
        if (payload.name !== undefined) metaUpdates.full_name = payload.name;
        if (payload.phone !== undefined) metaUpdates.phone = payload.phone;
        if (payload.location !== undefined) metaUpdates.location = payload.location;
        if (payload.education !== undefined) metaUpdates.education = payload.education;
        if (payload.experience !== undefined) metaUpdates.experience = payload.experience;
        if (payload.projects !== undefined) metaUpdates.projects = payload.projects;
        if (payload.profile_photo_url !== undefined) {
          metaUpdates.profile_photo_url = payload.profile_photo_url;
          metaUpdates.avatar_url = payload.profile_photo_url;
        }
        if (Object.keys(metaUpdates).length > 0) {
          const { error: metaErr } = await sc.auth.updateUser({ data: metaUpdates });
          if (!metaErr) {
            metaSynced = true;
          } else {
            console.warn('[Supabase auth.updateUser metadata sync notice]:', metaErr.message);
          }
        }
      }
    } catch (metaErr) {
      console.warn('[Supabase metadata update exception]:', metaErr);
    }

    try {
      // 1. Try atomic upsert by user_id
      const upsertPayload = {
        user_id: cleanId,
        ...payload
      };

      const { data: upsertData, error: upsertErr } = await sc
        .from('profiles')
        .upsert(upsertPayload, { onConflict: 'user_id' })
        .select()
        .maybeSingle();

      if (!upsertErr && upsertData) {
        populateAppStateFromProfile(upsertData);
        return { success: true, profile: upsertData };
      }

      if (upsertErr) {
        console.error('[Supabase Profile Upsert Error]:', upsertErr.message, upsertErr);
      }

      // 2. Fallback check: check if row exists for user_id to determine update vs insert
      const { data: existing, error: checkErr } = await sc
        .from('profiles')
        .select('id')
        .eq('user_id', cleanId)
        .maybeSingle();

      if (checkErr) {
        console.error('[Supabase Profile Check Error]:', checkErr.message, checkErr);
      }

      let resultData = null;
      let resultErr = null;

      if (existing) {
        const { data, error } = await sc
          .from('profiles')
          .update(payload)
          .eq('user_id', cleanId)
          .select()
          .maybeSingle();
        resultData = data;
        resultErr = error;
      } else {
        const insertPayload = {
          user_id: cleanId,
          created_at: new Date().toISOString(),
          ...payload
        };
        const { data, error } = await sc
          .from('profiles')
          .insert(insertPayload)
          .select()
          .maybeSingle();
        resultData = data;
        resultErr = error;
      }

      if (resultErr) {
        console.error('[Supabase Profile Save Error]:', resultErr.message, resultErr);
        if (metaSynced) {
          console.log('[Supabase Sync Notice]: Data persisted via Supabase Auth metadata backup.');
          const fallbackProfile = { user_id: cleanId, ...payload };
          populateAppStateFromProfile(fallbackProfile);
          return { success: true, profile: fallbackProfile, warning: resultErr.message, metadataBackup: true };
        }
        return { success: false, error: resultErr.message, profile: payload };
      }

      if (resultData) {
        populateAppStateFromProfile(resultData);
        return { success: true, profile: resultData };
      }

      return { success: true, profile: payload };
    } catch (err) {
      console.error('[Supabase Profile Save Exception]:', err.message || String(err), err);
      return { success: false, error: err.message || String(err), profile: payload };
    }
  }

  /**
   * Helper to convert Base64 Data URL to Blob/Buffer
   */
  function parseDataUrl(dataUrl) {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = parts[1];

    if (typeof Buffer !== 'undefined') {
      return {
        data: Buffer.from(base64Data, 'base64'),
        mimeType
      };
    }

    if (typeof atob === 'function') {
      const byteChars = atob(base64Data);
      const byteNums = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNums[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNums);
      return {
        data: new Blob([byteArray], { type: mimeType }),
        mimeType
      };
    }

    return { data: base64Data, mimeType };
  }

  /**
   * Uploads profile photo to Supabase Storage bucket ('profile-photos')
   * and saves the resulting public URL into the profiles table
   */
  async function uploadProfilePhoto(userId, fileOrDataUrl) {
    const sc = getSupabaseClient();
    const cleanId = userId || getStoredUserId();
    if (!cleanId) return { success: false, error: 'User ID is required to upload photo.' };
    if (!fileOrDataUrl) return { success: false, error: 'No image file or data provided.' };

    let uploadBody = fileOrDataUrl;
    let mimeType = 'image/jpeg';
    let fileExt = 'jpg';

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const parsed = parseDataUrl(fileOrDataUrl);
      uploadBody = parsed.data;
      mimeType = parsed.mimeType;
      fileExt = mimeType.split('/')[1] || 'jpg';
    } else if (typeof File !== 'undefined' && fileOrDataUrl instanceof File) {
      mimeType = fileOrDataUrl.type || 'image/jpeg';
      fileExt = fileOrDataUrl.name ? fileOrDataUrl.name.split('.').pop().toLowerCase() : 'jpg';
    }

    // Always mirror to local storage so UI updates immediately
    if (typeof localStorage !== 'undefined' && typeof fileOrDataUrl === 'string') {
      localStorage.setItem('userProfilePhoto', fileOrDataUrl);
    }

    if (!sc) {
      return { success: true, photoUrl: fileOrDataUrl, localOnly: true };
    }

    // Direct synchronization to Supabase Auth metadata guarantees photo persistence across sessions
    try {
      if (sc.auth && typeof sc.auth.updateUser === 'function' && typeof fileOrDataUrl === 'string') {
        await sc.auth.updateUser({
          data: {
            avatar_url: fileOrDataUrl,
            profile_photo_url: fileOrDataUrl
          }
        });
      }
    } catch (authMetaErr) {
      console.warn('[uploadProfilePhoto] Direct auth metadata sync notice:', authMetaErr);
    }

    try {
      const fileName = `${cleanId}/avatar_${Date.now()}.${fileExt}`;
      const { data, error } = await sc.storage
        .from('profile-photos')
        .upload(fileName, uploadBody, {
          contentType: mimeType,
          upsert: true
        });

      if (error) {
        console.warn('Storage upload warning:', error.message);
        // Fallback: If bucket does not exist or upload blocked, save dataUrl directly to profiles
        if (typeof fileOrDataUrl === 'string') {
          await updateUserProfile(cleanId, { profile_photo_url: fileOrDataUrl });
        }
        return {
          success: true,
          photoUrl: fileOrDataUrl,
          warning: error.message,
          fallback: true
        };
      }

      // Retrieve public URL from bucket
      const { data: urlData } = sc.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      const publicUrl = urlData?.publicUrl || '';
      if (publicUrl) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('userProfilePhoto', publicUrl);
        }
        await updateUserProfile(cleanId, { profile_photo_url: publicUrl });
        return {
          success: true,
          photoUrl: publicUrl
        };
      }

      return { success: true, photoUrl: fileOrDataUrl };
    } catch (err) {
      console.warn('uploadProfilePhoto exception:', err);
      if (typeof fileOrDataUrl === 'string') {
        await updateUserProfile(cleanId, { profile_photo_url: fileOrDataUrl });
      }
      return {
        success: true,
        photoUrl: fileOrDataUrl,
        warning: err.message || String(err),
        fallback: true
      };
    }
  }

  /**
   * Uploads resume file to Supabase Storage bucket "resumes" under "<user_id>/<filename>"
   * Safe and non-blocking: catches all errors, logs them, and returns { success, error, path }.
   */
  async function uploadResumeFile(userId, file) {
    const sc = getSupabaseClient();
    const cleanId = userId || getStoredUserId();
    if (!cleanId) {
      console.warn('[Supabase uploadResumeFile]: No user ID provided or found in session.');
      return { success: false, error: 'No user ID available for resume storage upload.' };
    }

    if (!file) {
      console.warn('[Supabase uploadResumeFile]: No file provided.');
      return { success: false, error: 'No file provided.' };
    }

    if (!sc) {
      console.warn('[Supabase uploadResumeFile]: Supabase client not initialized.');
      return { success: false, error: 'Supabase client not initialized.', localOnly: true };
    }

    try {
      const safeFilename = (file.name || 'resume.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${cleanId}/${safeFilename}`;
      const mimeType = file.type || 'application/octet-stream';

      const { data, error } = await sc.storage
        .from('resumes')
        .upload(storagePath, file, {
          contentType: mimeType,
          upsert: true
        });

      if (error) {
        console.error('[Supabase Storage Error]: Failed to upload resume file to "resumes" bucket:', error.message, error);
        return {
          success: false,
          error: error.message,
          path: storagePath
        };
      }

      console.log(`[Supabase Storage Success]: Resume uploaded to resumes/${storagePath}`);
      return {
        success: true,
        path: storagePath,
        data
      };
    } catch (err) {
      console.error('[Supabase Storage Exception]:', err.message || String(err), err);
      return {
        success: false,
        error: err.message || String(err)
      };
    }
  }

  /**
   * Retrieves array of saved job IDs from local app state
   */
  function getStoredSavedJobIds() {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem('userSavedJobIds');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Checks whether a specific job ID is currently saved
   */
  function isJobSaved(jobId) {
    if (!jobId) return false;
    const ids = getStoredSavedJobIds();
    return ids.includes(String(jobId));
  }

  /**
   * Fetches saved jobs from Supabase "saved_jobs" table for the active user
   * and synchronizes with local app state
   */
  async function fetchSavedJobIds(userId) {
    const sc = getSupabaseClient();
    const cleanId = userId || getStoredUserId();
    if (!cleanId) {
      return { success: false, jobIds: [], error: 'User is not logged in.' };
    }

    if (!sc) {
      const localIds = getStoredSavedJobIds();
      return { success: true, jobIds: localIds, localOnly: true };
    }

    try {
      const { data, error } = await sc
        .from('saved_jobs')
        .select('job_id, created_at')
        .eq('user_id', cleanId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('fetchSavedJobIds notice:', error.message);
        return { success: false, jobIds: getStoredSavedJobIds(), error: error.message };
      }

      const jobIds = Array.isArray(data) ? data.map(r => String(r.job_id)) : [];
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('userSavedJobIds', JSON.stringify(jobIds));
      }

      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        try {
          window.dispatchEvent(new CustomEvent('savedJobsUpdated', {
            detail: { jobIds, count: jobIds.length }
          }));
        } catch (evErr) {}
      }

      return {
        success: true,
        jobIds,
        data: data || []
      };
    } catch (err) {
      console.warn('fetchSavedJobIds exception:', err);
      return { success: false, jobIds: getStoredSavedJobIds(), error: err.message || String(err) };
    }
  }

  /**
   * Saves a job for the authenticated user into Supabase "saved_jobs" table
   * Optimistically updates local app state with automatic rollback on error
   */
  async function saveJob(jobId, userId) {
    if (!jobId) return { success: false, error: 'Job ID is required.' };
    const sc = getSupabaseClient();
    const cleanId = userId || getStoredUserId();
    if (!cleanId) return { success: false, error: 'User is not authenticated.' };

    const cleanJobId = String(jobId);
    const prevIds = getStoredSavedJobIds();

    // Optimistic local state update
    if (!prevIds.includes(cleanJobId)) {
      const newIds = [cleanJobId, ...prevIds];
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('userSavedJobIds', JSON.stringify(newIds));
      }
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        try {
          window.dispatchEvent(new CustomEvent('savedJobsUpdated', {
            detail: { jobIds: newIds, count: newIds.length, changedId: cleanJobId, action: 'save' }
          }));
        } catch (e) {}
      }
    }

    if (!sc) {
      return { success: true, saved: true, localOnly: true };
    }

    try {
      const { data, error } = await sc
        .from('saved_jobs')
        .insert({
          user_id: cleanId,
          job_id: cleanJobId
        })
        .select()
        .maybeSingle();

      if (error) {
        // Roll back optimistic state
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('userSavedJobIds', JSON.stringify(prevIds));
        }
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          try {
            window.dispatchEvent(new CustomEvent('savedJobsUpdated', {
              detail: { jobIds: prevIds, count: prevIds.length, changedId: cleanJobId, action: 'rollback' }
            }));
          } catch (e) {}
        }
        return { success: false, error: error.message };
      }

      return { success: true, saved: true, data };
    } catch (err) {
      // Roll back optimistic state
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('userSavedJobIds', JSON.stringify(prevIds));
      }
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        try {
          window.dispatchEvent(new CustomEvent('savedJobsUpdated', {
            detail: { jobIds: prevIds, count: prevIds.length, changedId: cleanJobId, action: 'rollback' }
          }));
        } catch (e) {}
      }
      return { success: false, error: err.message || String(err) };
    }
  }

  /**
   * Unsaves a job for the authenticated user from Supabase "saved_jobs" table
   * Optimistically updates local app state with automatic rollback on error
   */
  async function unsaveJob(jobId, userId) {
    if (!jobId) return { success: false, error: 'Job ID is required.' };
    const sc = getSupabaseClient();
    const cleanId = userId || getStoredUserId();
    if (!cleanId) return { success: false, error: 'User is not authenticated.' };

    const cleanJobId = String(jobId);
    const prevIds = getStoredSavedJobIds();

    // Optimistic local state update
    const newIds = prevIds.filter(id => id !== cleanJobId);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userSavedJobIds', JSON.stringify(newIds));
    }
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(new CustomEvent('savedJobsUpdated', {
          detail: { jobIds: newIds, count: newIds.length, changedId: cleanJobId, action: 'unsave' }
        }));
      } catch (e) {}
    }

    if (!sc) {
      return { success: true, saved: false, localOnly: true };
    }

    try {
      const { error } = await sc
        .from('saved_jobs')
        .delete()
        .eq('user_id', cleanId)
        .eq('job_id', cleanJobId);

      if (error) {
        // Roll back optimistic state
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('userSavedJobIds', JSON.stringify(prevIds));
        }
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          try {
            window.dispatchEvent(new CustomEvent('savedJobsUpdated', {
              detail: { jobIds: prevIds, count: prevIds.length, changedId: cleanJobId, action: 'rollback' }
            }));
          } catch (e) {}
        }
        return { success: false, error: error.message };
      }

      return { success: true, saved: false };
    } catch (err) {
      // Roll back optimistic state
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('userSavedJobIds', JSON.stringify(prevIds));
      }
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        try {
          window.dispatchEvent(new CustomEvent('savedJobsUpdated', {
            detail: { jobIds: prevIds, count: prevIds.length, changedId: cleanJobId, action: 'rollback' }
          }));
        } catch (e) {}
      }
      return { success: false, error: err.message || String(err) };
    }
  }

  /**
   * Toggles saving state for a job (save if not saved, unsave if saved)
   */
  async function toggleSaveJob(jobId, userId) {
    if (isJobSaved(jobId)) {
      return await unsaveJob(jobId, userId);
    } else {
      return await saveJob(jobId, userId);
    }
  }

  /**
   * Displays a lightweight toast notification in the UI
   */
  function showAppToast(message, type = 'error') {
    if (typeof document === 'undefined') return;
    let toastContainer = document.getElementById('appToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'appToastContainer';
      toastContainer.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const isError = type === 'error';
    toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-3 opacity-0 ${
      isError 
        ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-900/10' 
        : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-900/10'
    }`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[18px] ${isError ? 'text-rose-600' : 'text-emerald-600'} flex-shrink-0">
        ${isError ? 'error' : 'check_circle'}
      </span>
      <span class="flex-1">${message}</span>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }

  return {
    supabase: client,
    supabaseClient: client,
    getSupabaseClient,
    signUpUser,
    signInUser,
    signOutUser,
    persistUserSession,
    clearUserSession,
    clearAllUserData,
    handleLogout,
    requireAuth,
    getStoredUserId,
    getCurrentSession,
    formatAuthError,
    verifySupabaseConnection,
    createUserProfile,
    fetchUserProfile,
    updateUserProfile,
    uploadProfilePhoto,
    uploadResumeFile,
    populateAppStateFromProfile,
    hasUserCompletedOnboarding,
    classifyUserSkills,
    fetchSavedJobIds,
    getStoredSavedJobIds,
    isJobSaved,
    saveJob,
    unsaveJob,
    toggleSaveJob,
    showAppToast,
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_PROJECT_REF
  };
});

