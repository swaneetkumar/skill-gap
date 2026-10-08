// ============================================================================
// Skill Gap Force -- Target Roles & Required Skills Dataset
// Predefined skills for 7 primary tech roles used in "Target Your Jobs"
// ============================================================================

const TARGET_ROLES_DATA = {
  software_engineer: {
    id: "software_engineer",
    title: "Software Engineer (SDE)",
    shortTitle: "Software Engineer",
    icon: "code",
    badge: "Core Engineering",
    description: "Design, build, and optimize scalable software systems, algorithms, and microservice APIs.",
    requiredSkills: [
      "Data Structures",
      "Algorithms",
      "OOP",
      "Git",
      "System Design",
      "Databases",
      "REST API",
      "Testing",
      "Problem Solving"
    ]
  },
  ai_engineer: {
    id: "ai_engineer",
    title: "AI Engineer",
    shortTitle: "AI Engineer",
    icon: "smart_toy",
    badge: "Generative AI & LLMs",
    description: "Deploy large language models, AI agent frameworks, fine-tuning, and neural pipelines.",
    requiredSkills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "PyTorch",
      "TensorFlow",
      "NLP",
      "LLM",
      "Hugging Face",
      "LangChain",
      "MLOps"
    ]
  },
  ml_engineer: {
    id: "ml_engineer",
    title: "Machine Learning Engineer",
    shortTitle: "ML Engineer",
    icon: "psychology",
    badge: "Model Training & Ops",
    description: "Build robust machine learning pipelines, predictive architectures, and production model serving.",
    requiredSkills: [
      "Python",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Supervised Learning",
      "Unsupervised Learning",
      "Feature Engineering",
      "Model Evaluation",
      "MLOps",
      "Cloud"
    ]
  },
  data_scientist: {
    id: "data_scientist",
    title: "Data Scientist",
    shortTitle: "Data Scientist",
    icon: "analytics",
    badge: "Analytics & Research",
    description: "Analyze complex datasets, run statistical hypothesis tests, and derive predictive insights.",
    requiredSkills: [
      "Python",
      "SQL",
      "Statistics",
      "Probability",
      "EDA",
      "Data Visualization",
      "Machine Learning",
      "A/B Testing",
      "Pandas",
      "Matplotlib"
    ]
  },
  data_engineer: {
    id: "data_engineer",
    title: "Data Engineer",
    shortTitle: "Data Engineer",
    icon: "database",
    badge: "Pipelines & Big Data",
    description: "Construct scalable data pipelines, automated ETL workflows, and big data warehousing systems.",
    requiredSkills: [
      "SQL",
      "Python",
      "ETL",
      "Data Warehousing",
      "Apache Spark",
      "Airflow",
      "Cloud",
      "Database Design",
      "Big Data"
    ]
  },
  fullstack_developer: {
    id: "fullstack_developer",
    title: "Full-Stack Developer",
    shortTitle: "Full-Stack Dev",
    icon: "layers",
    badge: "Frontend & Backend",
    description: "Develop seamless responsive client interfaces, server APIs, and integrated database architectures.",
    requiredSkills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "Database",
      "REST API",
      "Git",
      "Authentication",
      "TypeScript"
    ]
  },
  devops_engineer: {
    id: "devops_engineer",
    title: "DevOps Engineer",
    shortTitle: "DevOps Engineer",
    icon: "deployed_code",
    badge: "Cloud & Reliability",
    description: "Automate continuous deployment, container orchestrations, cloud infrastructure, and observability.",
    requiredSkills: [
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Cloud",
      "Linux",
      "Terraform",
      "Jenkins",
      "Monitoring",
      "Networking",
      "Git"
    ]
  }
};

/**
 * Normalizes skill string for accurate comparisons
 */
function normalizeSkillName(name) {
  if (!name) return "";
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[\/\\\-_.\s+()]/g, "");
}

/**
 * Checks if a required skill is matched by the candidate's skills list
 */
function isSkillMatched(requiredSkill, userSkills) {
  if (!userSkills || !Array.isArray(userSkills) || userSkills.length === 0) {
    return false;
  }

  const reqNorm = normalizeSkillName(requiredSkill);

  // Direct and common variant matching
  return userSkills.some((userSkill) => {
    const userNorm = normalizeSkillName(userSkill);
    if (!userNorm) return false;

    // Exact normalized match
    if (userNorm === reqNorm) return true;

    // Substring contains for multi-word or compound skills
    if (userNorm.includes(reqNorm) || reqNorm.includes(userNorm)) {
      return true;
    }

    // Common skill synonyms/aliases
    const aliases = {
      "datastructures": ["dsa", "datastructure"],
      "algorithms": ["dsa", "algorithm"],
      "oop": ["objectoriented", "objectorientedprogramming"],
      "git": ["github", "gitlab", "versioncontrol"],
      "restapi": ["rest", "restful", "restapis"],
      "database": ["databases", "sql", "postgresql", "mongodb", "mysql"],
      "databases": ["database", "sql", "postgresql", "mongodb", "mysql"],
      "databasedesign": ["databaseschema", "schemadesign"],
      "cloud": ["aws", "gcp", "azure", "cloudcomputing"],
      "cicd": ["continuousintegration", "devops", "jenkins", "githubactions"],
      "machinelearning": ["ml"],
      "deeplearning": ["neuralnetworks"],
      "nlp": ["naturallanguageprocessing"],
      "llm": ["largelanguagemodel", "largelanguagemodels", "genai", "generativeai"],
      "eda": ["exploratorydataanalysis"],
      "datavisualization": ["visualization", "dataviz"],
      "javascript": ["js", "es6"],
      "html": ["html5"],
      "css": ["css3", "styling"],
      "testing": ["unittesting", "testdrivendevelopment", "qa"],
      "problemsolving": ["problemsolver"]
    };

    if (aliases[reqNorm] && aliases[reqNorm].some((a) => userNorm.includes(a) || a.includes(userNorm))) {
      return true;
    }

    return false;
  });
}

/**
 * Calculates match percentage, matched skills, and missing skills for a role
 */
function calculateTargetRoleSkillGap(roleId, userSkills) {
  const role = TARGET_ROLES_DATA[roleId];
  if (!role) return null;

  const userSkillList = Array.isArray(userSkills) ? userSkills : [];
  const required = role.requiredSkills;

  const matchedSkills = [];
  const missingSkills = [];

  required.forEach((reqSkill) => {
    if (isSkillMatched(reqSkill, userSkillList)) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const totalRequired = required.length;
  const matchPercentage = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 0;
  const missingPercentage = 100 - matchPercentage;

  return {
    role,
    totalRequired,
    matchedSkills,
    missingSkills,
    matchPercentage,
    missingPercentage,
    hasSkillsAvailable: userSkillList.length > 0
  };
}

// Attach to window for browser usage and export for Node test environments
if (typeof window !== "undefined") {
  window.TARGET_ROLES_DATA = TARGET_ROLES_DATA;
  window.calculateTargetRoleSkillGap = calculateTargetRoleSkillGap;
  window.isSkillMatched = isSkillMatched;
  window.normalizeSkillName = normalizeSkillName;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TARGET_ROLES_DATA,
    calculateTargetRoleSkillGap,
    isSkillMatched,
    normalizeSkillName
  };
}
