// ============================================================================
// Skill Gap Force -- Rule-based Chatbot Engine (NO AI/LLM, NO External API)
// Provides keyword matching, Hinglish normalization, personal profile insights,
// quick-reply buttons, typing animations, and session history persistence.
// ============================================================================

(function (global) {
  // Topic ID to human-friendly button label mapping
  const TOPIC_LABELS = {
    "greeting_hi": "Say Hello",
    "greeting_who_are_you": "Who are you?",
    "match_percentage": "How does match % work?",
    "my_missing_skills": "What are my missing skills?",
    "resume_upload": "How do I upload my resume?",
    "target_jobs": "What is Target Your Jobs?",
    "my_skills": "What are my skills?",
    "my_best_match_role": "What is my best match role?",
    "my_saved_jobs": "Show my saved jobs",
    "saved_jobs": "How to save jobs?",
    "jobs_why_seeing": "Why see these jobs?",
    "jobs_sort": "How to sort jobs?",
    "jobs_load_more": "What does Load More do?",
    "resume_formats": "Supported file formats?",
    "resume_extraction": "How are skills extracted?",
    "skills_add_remove": "Add/remove skills manually",
    "resume_reupload": "How to change resume?",
    "target_jobs_7_roles": "What are the 7 roles?",
    "target_jobs_change_role": "How to change role?",
    "target_jobs_pie_chart": "What does pie chart mean?",
    "sessions_mock_interview": "What is mock interview?",
    "sessions_mentorship": "What is 1:1 mentorship?",
    "sessions_how_to_book": "How to book a session?",
    "account_edit_profile": "How to edit profile?",
    "account_photo": "How to change photo?",
    "account_projects": "How to add projects?",
    "account_logout": "How to log out?",
    "account_password_rules": "Password rules?",
    "account_data_safe": "Is my data safe?",
    "platform_what_is": "What is Skill Gap Force?",
    "platform_how_it_works": "How does it work?",
    "platform_skill_gap_meaning": "What does skill gap mean?",
    "meaning_your_missing_skills": "Your vs Missing skills",
    "job_apply": "How does Apply work?",
    "upload_resume_cta": "Go to Upload Resume"
  };

  /**
   * Normalizes input text: lowercase, remove special characters, collapse whitespaces.
   */
  function normalizeText(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/[^\w\s\u0900-\u097F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Checks if query asks for learning resources/roadmaps (Docker kahan se seekhu, where to learn, etc.)
   */
  function isLearningResourceQuery(norm) {
    const learningPatterns = [
      /\b(kahan|kaha)\s+se\s+(seekhu|seekhe|padhu|padhe|milega|padhna|seekhna)\b/,
      /\b(where\s+(to|can\s+i|do\s+i)\s+learn)\b/,
      /\b(how\s+(to|can\s+i|do\s+i)\s+learn)\b/,
      /\b(seekhu|seekhe|seekhna|padhu|padhe|padhna)\b/,
      /\b(course|courses|tutorial|tutorials|roadmap|roadmaps|study\s+material|youtube\s+channel)\b/
    ];
    return learningPatterns.some((pattern) => pattern.test(norm));
  }

  /**
   * Retrieves current user's skills from application state / localStorage
   */
  function getUserSkills() {
    try {
      const stored = localStorage.getItem("userSelectedSkills");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const resumeDetails = localStorage.getItem("userResumeDetails");
      if (resumeDetails) {
        const parsed = JSON.parse(resumeDetails);
        if (parsed && Array.isArray(parsed.skills) && parsed.skills.length > 0) {
          return parsed.skills;
        }
      }
      const extractedProfile = localStorage.getItem("candidate_extracted_profile");
      if (extractedProfile) {
        const parsed = JSON.parse(extractedProfile);
        if (parsed && Array.isArray(parsed.skills) && parsed.skills.length > 0) {
          return parsed.skills;
        }
      }
    } catch (e) {
      console.warn("[Chatbot] Error reading user skills:", e);
    }
    return [];
  }

  /**
   * Retrieves saved job IDs from localStorage
   */
  function getSavedJobIds() {
    try {
      const stored = localStorage.getItem("userSavedJobIds");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("[Chatbot] Error reading saved job IDs:", e);
    }
    return [];
  }

  /**
   * Retrieves current booking job or recently viewed job missing skills
   */
  function getMissingSkillsContext() {
    // 1. Current booking job in sessionStorage
    try {
      const bookingRaw = sessionStorage.getItem("currentBookingJob");
      if (bookingRaw) {
        const booking = JSON.parse(bookingRaw);
        if (booking && booking.missingSkills && booking.missingSkills.length > 0) {
          const names = booking.missingSkills.map((s) => (typeof s === "string" ? s : s.name));
          return {
            title: `${booking.jobTitle || "your selected job"} at ${booking.company || "company"}`,
            missingSkills: names
          };
        }
      }
    } catch (e) {}

    // 2. Target role in localStorage
    try {
      const roleId = localStorage.getItem("selectedTargetRoleId");
      const userSkills = getUserSkills();
      if (roleId && global.TARGET_ROLES_DATA && global.TARGET_ROLES_DATA[roleId]) {
        const role = global.TARGET_ROLES_DATA[roleId];
        if (typeof global.calculateTargetRoleSkillGap === "function") {
          const gap = global.calculateTargetRoleSkillGap(roleId, userSkills);
          if (gap && gap.missingSkills && gap.missingSkills.length > 0) {
            return {
              title: role.title || "Target Role",
              missingSkills: gap.missingSkills
            };
          }
        }
      }
    } catch (e) {}

    return null;
  }

  /**
   * Calculates user's best match role among the 7 target tech roles
   */
  function getBestMatchRole(userSkills) {
    if (!global.TARGET_ROLES_DATA || !userSkills || userSkills.length === 0) return null;

    let bestRole = null;
    let highestMatch = -1;
    let bestGapData = null;

    Object.keys(global.TARGET_ROLES_DATA).forEach((roleId) => {
      if (typeof global.calculateTargetRoleSkillGap === "function") {
        const gap = global.calculateTargetRoleSkillGap(roleId, userSkills);
        if (gap && gap.matchPercentage > highestMatch) {
          highestMatch = gap.matchPercentage;
          bestRole = global.TARGET_ROLES_DATA[roleId];
          bestGapData = gap;
        }
      }
    });

    if (bestRole && bestGapData) {
      return {
        role: bestRole,
        matchPercentage: highestMatch,
        matchedSkills: bestGapData.matchedSkills,
        totalRequired: bestGapData.totalRequired
      };
    }
    return null;
  }

  /**
   * Main Keyword-based scoring and intent matching algorithm.
   */
  function matchMessage(userMessage, knowledgeBase) {
    const raw = (userMessage || "").trim();
    const norm = normalizeText(raw);

    if (!norm) {
      return getFallbackResponse();
    }

    // Check for learning resource query ("docker kahan se seekhu", etc.) -> Fallback per requirement 9
    if (isLearningResourceQuery(norm)) {
      return getFallbackResponse();
    }

    const userSkills = getUserSkills();
    const hasSkills = userSkills && userSkills.length > 0;

    // Detect Personalized Intent 1: "my skills" / "mere skills"
    const isSkillsIntent = /\b(my\s+skills?|mere\s+skills?|meri\s+skills?|mera\s+skill|what\s+are\s+my\s+skills|skills\s+dikhao|show\s+my\s+skills)\b/.test(
      norm
    );
    if (isSkillsIntent) {
      if (!hasSkills) {
        return {
          answer: "Upload your resume first so I can check this for you.",
          followUps: ["resume_upload", "match_percentage", "target_jobs"],
          quickReplies: [
            { label: "Upload Resume", action: "navigate", url: "../skill_gap_force_resume_skills_setup/code.html" },
            { label: "How does match % work?", query: "How does match % work?" },
            { label: "What is Target Your Jobs?", query: "What is Target Your Jobs?" }
          ]
        };
      }
      const skillCount = userSkills.length;
      const preview = userSkills.slice(0, 12).join(", ");
      const extra = skillCount > 12 ? ` and ${skillCount - 12} more` : "";
      return {
        answer: `You currently have ${skillCount} verified skills on your profile: ${preview}${extra}. These skills are actively used to benchmark and calculate your job match percentages.`,
        followUps: ["my_missing_skills", "my_best_match_role", "match_percentage"],
        quickReplies: [
          { label: "What are my missing skills?", query: "What are my missing skills?" },
          { label: "What is my best match role?", query: "What is my best match role?" },
          { label: "How does match % work?", query: "How does match % work?" }
        ]
      };
    }

    // Detect Personalized Intent 2: "my missing skills" / "mere missing skills"
    const isMissingSkillsIntent = /\b(my\s+missing\s+skills?|mere\s+missing\s+skills?|meri\s+missing\s+skills?|missing\s+skills\s+kya\s+hain|what\s+are\s+my\s+missing\s+skills|missing\s+skills\s+dikhao)\b/.test(
      norm
    );
    if (isMissingSkillsIntent) {
      if (!hasSkills) {
        return {
          answer: "Upload your resume first so I can check this for you.",
          followUps: ["resume_upload", "target_jobs"],
          quickReplies: [
            { label: "Upload Resume", action: "navigate", url: "../skill_gap_force_resume_skills_setup/code.html" },
            { label: "What is Target Your Jobs?", query: "What is Target Your Jobs?" }
          ]
        };
      }
      const missingContext = getMissingSkillsContext();
      if (!missingContext || missingContext.missingSkills.length === 0) {
        return {
          answer: "Open a job or pick a role in Target Your Jobs and I'll show your gap.",
          followUps: ["target_jobs", "jobs_why_seeing"],
          quickReplies: [
            { label: "Target Your Jobs", action: "navigate", url: "../skill_gap_force_target_role_selection/code.html" },
            { label: "Job Recommendations", action: "navigate", url: "../skill_gap_force_job_recommendations/code.html" },
            { label: "What is my best match role?", query: "What is my best match role?" }
          ]
        };
      }
      const missingList = missingContext.missingSkills.slice(0, 10).join(", ");
      return {
        answer: `For ${missingContext.title}, your identified missing skills are: ${missingList}. Bridging these key skills will help you close the gap and maximize your match percentage.`,
        followUps: ["match_percentage", "target_jobs", "my_saved_jobs"],
        quickReplies: [
          { label: "Target Your Jobs", action: "navigate", url: "../skill_gap_force_target_role_selection/code.html" },
          { label: "How does match % work?", query: "How does match % work?" },
          { label: "Show my saved jobs", query: "Show my saved jobs" }
        ]
      };
    }

    // Detect Personalized Intent 3: "my best match role" / "mera best role"
    const isBestMatchRoleIntent = /\b(my\s+best\s+match\s+role|mera\s+best\s+role|mera\s+best\s+match\s+role|best\s+match\s+role|which\s+role\s+matches\s+me|best\s+role\s+for\s+me)\b/.test(
      norm
    );
    if (isBestMatchRoleIntent) {
      if (!hasSkills) {
        return {
          answer: "Upload your resume first so I can check this for you.",
          followUps: ["resume_upload", "target_jobs"],
          quickReplies: [
            { label: "Upload Resume", action: "navigate", url: "../skill_gap_force_resume_skills_setup/code.html" },
            { label: "What is Target Your Jobs?", query: "What is Target Your Jobs?" }
          ]
        };
      }
      const matchResult = getBestMatchRole(userSkills);
      if (matchResult && matchResult.role) {
        return {
          answer: `Based on your verified skills, your best match is ${matchResult.role.title} with a ${matchResult.matchPercentage}% match! You have ${matchResult.matchedSkills.length} of the ${matchResult.totalRequired} core skills required for this career track.`,
          followUps: ["my_missing_skills", "target_jobs", "my_saved_jobs"],
          quickReplies: [
            { label: "What are my missing skills?", query: "What are my missing skills?" },
            { label: "What is Target Your Jobs?", query: "What is Target Your Jobs?" },
            { label: "Show my saved jobs", query: "Show my saved jobs" }
          ]
        };
      }
    }

    // Detect Personalized Intent 4: "my saved jobs" / "mere saved jobs"
    const isSavedJobsIntent = /\b(my\s+saved\s+jobs?|mere\s+saved\s+jobs?|mere\s+saved\s+jobs\s+dikhao|saved\s+jobs\s+dikhao|show\s+my\s+saved\s+jobs|what\s+are\s+my\s+saved\s+jobs)\b/.test(
      norm
    );
    if (isSavedJobsIntent) {
      const savedIds = getSavedJobIds();
      if (!savedIds || savedIds.length === 0) {
        return {
          answer: "You haven't saved any jobs yet. Browse recommended jobs and click the bookmark icon to save jobs you like!",
          followUps: ["jobs_why_seeing", "match_percentage"],
          quickReplies: [
            { label: "Job Recommendations", action: "navigate", url: "../skill_gap_force_job_recommendations/code.html" },
            { label: "How does match % work?", query: "How does match % work?" },
            { label: "What is Target Your Jobs?", query: "What is Target Your Jobs?" }
          ]
        };
      }
      const dataset = global.APP_JOBS_DATASET || [];
      const jobList = savedIds
        .map((id) => {
          const j = dataset.find((item) => item.id === id);
          return j ? `${j.title} at ${j.company}` : id;
        })
        .slice(0, 5)
        .join(", ");
      const extraCount = savedIds.length > 5 ? ` and ${savedIds.length - 5} more` : "";
      return {
        answer: `You have ${savedIds.length} saved job${savedIds.length > 1 ? "s" : ""}: ${jobList}${extraCount}. You can view and manage all of them anytime from the Saved Jobs page.`,
        followUps: ["my_best_match_role", "match_percentage"],
        quickReplies: [
          { label: "View Saved Jobs", action: "navigate", url: "../skill_gap_force_saved_jobs/code.html" },
          { label: "What is my best match role?", query: "What is my best match role?" },
          { label: "How does match % work?", query: "How does match % work?" }
        ]
      };
    }

    // Score topics in the Knowledge Base
    const kb = Array.isArray(knowledgeBase) ? knowledgeBase : global.CHATBOT_KNOWLEDGE_BASE || [];
    let bestTopic = null;
    let highestScore = 0;
    let longestKeywordLength = 0;

    kb.forEach((topic) => {
      let score = 0;
      let longestKwMatch = 0;

      (topic.keywords || []).forEach((kw) => {
        const normKw = normalizeText(kw);
        if (!normKw) return;

        // Check if normalized keyword appears in message
        if (norm.includes(normKw)) {
          const wordCount = normKw.split(" ").length;
          // Multi-word keywords score higher per requirement 8
          const weight = wordCount > 1 ? wordCount * 3 : 1;
          score += weight;
          if (normKw.length > longestKwMatch) {
            longestKwMatch = normKw.length;
          }
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestTopic = topic;
        longestKeywordLength = longestKwMatch;
      } else if (score === highestScore && score > 0) {
        // Tie-breaker: prefer topic with longest matched keyword per requirement 8
        if (longestKwMatch > longestKeywordLength) {
          bestTopic = topic;
          longestKeywordLength = longestKwMatch;
        }
      }
    });

    if (bestTopic && highestScore > 0) {
      // Build 2-3 relevant quick-reply buttons based on followUps
      const followUpReplies = (bestTopic.followUps || []).slice(0, 3).map((fId) => ({
        label: TOPIC_LABELS[fId] || formatTopicLabel(fId),
        query: TOPIC_LABELS[fId] || formatTopicLabel(fId)
      }));

      return {
        topicId: bestTopic.id,
        answer: bestTopic.answer,
        followUps: bestTopic.followUps,
        quickReplies: followUpReplies
      };
    }

    // If nothing matches (or random gibberish), return friendly fallback per requirement 9
    return getFallbackResponse();
  }

  /**
   * Generates friendly fallback response with 4 standard quick-reply buttons
   */
  function getFallbackResponse() {
    return {
      topicId: "fallback",
      answer: "I can't help with that yet. You can ask me about resume upload, match %, skill gaps, Target Your Jobs, saved jobs, or your profile.",
      followUps: ["match_percentage", "my_missing_skills", "resume_upload", "target_jobs"],
      quickReplies: [
        { label: "How does match % work?", query: "How does match % work?" },
        { label: "What are my missing skills?", query: "What are my missing skills?" },
        { label: "How do I upload my resume?", query: "How do I upload my resume?" },
        { label: "What is Target Your Jobs?", query: "What is Target Your Jobs?" }
      ]
    };
  }

  function formatTopicLabel(id) {
    return id
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // ============================================================================
  // UI Controller & DOM Wiring
  // ============================================================================
  const STORAGE_KEY_HISTORY = "skillgap_chat_history";

  function getStoredChatHistory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_HISTORY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return null;
  }

  function saveChatHistory(messages) {
    try {
      sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(messages));
    } catch (e) {}
  }

  function initChatbotUI() {
    const launcher = document.getElementById("chatbotLauncher");
    const chatbotBtn = document.getElementById("chatbotBtn");
    if (!launcher && !chatbotBtn) return;

    // Check if chat window container already injected
    let panel = document.getElementById("chatbotPanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "chatbotPanel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "Skill Gap Assistant");
      panel.className =
        "fixed z-50 bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[410px] h-[85vh] sm:h-[590px] max-h-[85vh] bg-[#131A2E]/95 backdrop-blur-xl border border-white/15 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out transform translate-y-12 opacity-0 pointer-events-none";

      panel.innerHTML = `
        <!-- CHAT HEADER -->
        <div class="px-4 py-3.5 bg-surface-container-high/90 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md relative">
              <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-headline-sm text-sm font-bold text-white tracking-tight">Skill Gap Assistant</h3>
                <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Advisor</span>
              </div>
              <p class="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Rule-Based Instant Help
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button id="chatClearHistoryBtn" title="Reset chat" type="button" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <span class="material-symbols-outlined text-[18px]">refresh</span>
            </button>
            <button id="chatCloseBtn" aria-label="Close assistant" type="button" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <!-- MESSAGES CONTAINER -->
        <div id="chatMessagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm custom-scrollbar overscroll-contain">
          <!-- Populated dynamically via JS -->
        </div>

        <!-- TYPING ANIMATION INDICATOR (Hidden by default) -->
        <div id="chatTypingIndicator" class="px-4 pb-2 hidden">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-container-high border border-white/10 text-slate-400 text-xs">
            <span class="material-symbols-outlined text-[14px] text-teal-400 animate-spin">sync</span>
            <span>Skill Gap Assistant is typing</span>
            <span class="flex gap-1 ml-1">
              <span class="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </span>
          </div>
        </div>

        <!-- CHAT INPUT FOOTER -->
        <div class="p-3 bg-surface-container-high/80 border-t border-white/10 flex-shrink-0">
          <form id="chatInputForm" class="flex items-center gap-2" onsubmit="return false;">
            <div class="relative flex-1">
              <input 
                id="chatInput" 
                type="text" 
                placeholder="Ask about skills, resume, match %, jobs..."
                autocomplete="off"
                class="w-full pl-3.5 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
              />
            </div>
            <button 
              id="chatSendBtn" 
              type="submit" 
              aria-label="Send message"
              class="w-10 h-10 rounded-xl btn-vibrant-primary text-white flex items-center justify-center shadow-lg hover:shadow-teal-500/25 active:scale-95 transition-all flex-shrink-0"
            >
              <span class="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      `;

      document.body.appendChild(panel);
    }

    const messagesContainer = document.getElementById("chatMessagesContainer");
    const typingIndicator = document.getElementById("chatTypingIndicator");
    const chatInput = document.getElementById("chatInput");
    const chatCloseBtn = document.getElementById("chatCloseBtn");
    const chatClearBtn = document.getElementById("chatClearHistoryBtn");
    const chatForm = document.getElementById("chatInputForm");

    // Local in-memory messages array
    let chatHistory = getStoredChatHistory();

    function getUserGreetingName() {
      const name = localStorage.getItem("userFullName");
      if (name && name.trim()) return name.trim().split(" ")[0];
      return "there";
    }

    function createOpeningMessage() {
      const userName = getUserGreetingName();
      return {
        sender: "bot",
        text: `Hi ${userName}! I'm your Skill Gap assistant. Ask me anything about the platform or your profile.`,
        quickReplies: [
          { label: "How does match % work?", query: "How does match % work?" },
          { label: "What are my missing skills?", query: "What are my missing skills?" },
          { label: "How do I upload my resume?", query: "How do I upload my resume?" },
          { label: "What is Target Your Jobs?", query: "What is Target Your Jobs?" }
        ]
      };
    }

    function renderMessages() {
      if (!messagesContainer) return;
      messagesContainer.innerHTML = "";

      if (!chatHistory || chatHistory.length === 0) {
        chatHistory = [createOpeningMessage()];
        saveChatHistory(chatHistory);
      }

      chatHistory.forEach((msg, idx) => {
        appendMessageDOM(msg, false);
      });

      scrollMessagesToBottom();
    }

    function appendMessageDOM(msg, shouldScroll = true) {
      if (!messagesContainer) return;

      const messageWrap = document.createElement("div");
      messageWrap.className = msg.sender === "user" ? "flex justify-end" : "flex items-start gap-2.5";

      if (msg.sender === "user") {
        messageWrap.innerHTML = `
          <div class="max-w-[85%] bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md break-words">
            ${escapeHtml(msg.text)}
          </div>
        `;
      } else {
        messageWrap.innerHTML = `
          <div class="w-7 h-7 rounded-lg bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-300 flex-shrink-0 mt-0.5">
            <span class="material-symbols-outlined text-[16px]">smart_toy</span>
          </div>
          <div class="max-w-[85%] space-y-2">
            <div class="bg-surface-container-high text-slate-100 border border-white/10 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm break-words">
              ${escapeHtml(msg.text)}
            </div>
            ${renderQuickRepliesHTML(msg.quickReplies)}
          </div>
        `;
      }

      messagesContainer.appendChild(messageWrap);
      if (shouldScroll) scrollMessagesToBottom();
    }

    function renderQuickRepliesHTML(quickReplies) {
      if (!Array.isArray(quickReplies) || quickReplies.length === 0) return "";
      const buttons = quickReplies
        .map(
          (qr, i) => `
        <button 
          type="button"
          data-qr-index="${i}"
          data-qr-query="${escapeHtml(qr.query || qr.label)}"
          data-qr-action="${escapeHtml(qr.action || "query")}"
          data-qr-url="${escapeHtml(qr.url || "")}"
          class="chat-quick-reply-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-teal-500/10 hover:bg-teal-500/25 active:bg-teal-500/35 text-teal-300 border border-teal-500/30 hover:border-teal-400 transition-all duration-150 active:scale-95 text-left cursor-pointer"
        >
          <span>${escapeHtml(qr.label)}</span>
          <span class="material-symbols-outlined text-[13px] opacity-75">arrow_forward</span>
        </button>
      `
        )
        .join("");

      return `<div class="flex flex-wrap gap-1.5 pt-1">${buttons}</div>`;
    }

    function scrollMessagesToBottom() {
      if (!messagesContainer) return;
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 30);
    }

    function escapeHtml(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function openChatWindow() {
      panel.classList.remove("translate-y-12", "opacity-0", "pointer-events-none");
      panel.classList.add("translate-y-0", "opacity-100", "pointer-events-auto");
      if (launcher) launcher.classList.add("sm:scale-95");
      renderMessages();
      if (chatInput) {
        setTimeout(() => chatInput.focus(), 150);
      }
    }

    function closeChatWindow() {
      panel.classList.add("translate-y-12", "opacity-0", "pointer-events-none");
      panel.classList.remove("translate-y-0", "opacity-100", "pointer-events-auto");
      if (launcher) launcher.classList.remove("sm:scale-95");
    }

    function handleSendMessage(text) {
      const trimmed = (text || "").trim();
      if (!trimmed) return;

      // Add user message
      const userMsg = { sender: "user", text: trimmed };
      chatHistory.push(userMsg);
      appendMessageDOM(userMsg);
      saveChatHistory(chatHistory);

      if (chatInput) chatInput.value = "";

      // Show typing indicator
      if (typingIndicator) {
        typingIndicator.classList.remove("hidden");
        scrollMessagesToBottom();
      }

      // 600ms typing delay per requirement 2
      setTimeout(() => {
        if (typingIndicator) typingIndicator.classList.add("hidden");

        const kb = global.CHATBOT_KNOWLEDGE_BASE || [];
        const result = matchMessage(trimmed, kb);

        const botMsg = {
          sender: "bot",
          text: result.answer,
          quickReplies: result.quickReplies
        };

        chatHistory.push(botMsg);
        appendMessageDOM(botMsg);
        saveChatHistory(chatHistory);
      }, 600);
    }

    // Attach delegated click listener for quick-reply buttons
    if (messagesContainer) {
      messagesContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".chat-quick-reply-btn");
        if (!btn) return;
        const action = btn.getAttribute("data-qr-action");
        const url = btn.getAttribute("data-qr-url");
        const query = btn.getAttribute("data-qr-query");

        if (action === "navigate" && url) {
          window.location.href = url;
          return;
        }

        if (query) {
          handleSendMessage(query);
        }
      });
    }

    // Wiring close and clear buttons
    if (chatCloseBtn) chatCloseBtn.addEventListener("click", closeChatWindow);
    if (chatClearBtn) {
      chatClearBtn.addEventListener("click", () => {
        chatHistory = [createOpeningMessage()];
        saveChatHistory(chatHistory);
        renderMessages();
      });
    }

    // Wiring form submit & enter key
    if (chatForm) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (chatInput) handleSendMessage(chatInput.value);
      });
    }

    // Replace ONLY the chatbot icon's Coming Soon popup with chat window per Requirement 1
    if (launcher) {
      // Clone launcher or replace listener to remove coming soon popup
      const newLauncher = launcher.cloneNode(true);
      launcher.parentNode.replaceChild(newLauncher, launcher);
      newLauncher.addEventListener("click", (e) => {
        e.stopPropagation();
        openChatWindow();
      });
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel && panel.classList.contains("opacity-100")) {
        closeChatWindow();
      }
    });

    // Initial check: if already had session history, render messages silently
    if (chatHistory && chatHistory.length > 0) {
      renderMessages();
    }
  }

  // Export functions to global scope
  global.SkillGapChatbot = {
    normalizeText,
    isLearningResourceQuery,
    getUserSkills,
    getSavedJobIds,
    getMissingSkillsContext,
    getBestMatchRole,
    matchMessage,
    getFallbackResponse,
    initChatbotUI
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      normalizeText,
      isLearningResourceQuery,
      getUserSkills,
      getSavedJobIds,
      getMissingSkillsContext,
      getBestMatchRole,
      matchMessage,
      getFallbackResponse
    };
  }
})(typeof window !== "undefined" ? window : global);
