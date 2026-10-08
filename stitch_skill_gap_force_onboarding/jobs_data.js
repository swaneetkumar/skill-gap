// jobs_data.js - Unified 27 Job Dataset with Unique IDs and Required Skills
(function (global) {
  const APP_JOBS_DATASET = [
    // ═══════════════════ WEB DEVELOPMENT JOBS (9) ═══════════════════
    {
      id: "stripe-senior-frontend",
      category: "web_dev",
      company: "Stripe",
      bg: "bg-[#635BFF] text-white",
      icon: null,
      letter: "S",
      title: "Senior Frontend Engineer",
      location: "San Francisco, CA (Hybrid)",
      salary: "$165k - $195k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "2 days ago",
      applicantsCount: "42 candidates",
      experienceLevel: "Senior (5+ yrs)",
      teamSize: "12 Engineers",
      overview: "Stripe is looking for a Senior Frontend Engineer to build high-performance, user-centric web platforms powering millions of global transactions daily. You will collaborate closely with product design, core infrastructure, and backend teams to deliver scalable UI components.",
      requirements: [
        "5+ years of production experience with modern JavaScript, TypeScript, and React",
        "Deep understanding of web performance, browser APIs, and state management architectures",
        "Proficiency with modern CSS design systems, HTML5 semantic layout, and accessibility",
        "Experience consuming REST APIs and GraphQL microservices",
        "Strong Git version control and collaborative GitHub code review practices"
      ],
      required_skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Git", "REST API", "System Design"]
    },
    {
      id: "linear-product-engineer",
      category: "web_dev",
      company: "Linear",
      bg: "bg-[#5E6AD2] text-white",
      icon: "conversion_path",
      letter: null,
      title: "Full Stack Product Engineer",
      location: "Remote (US / EU)",
      salary: "$150k - $180k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "1 day ago",
      applicantsCount: "28 candidates",
      experienceLevel: "Mid-Senior (4+ yrs)",
      teamSize: "8 Engineers",
      overview: "Linear is seeking a Full Stack Product Engineer to craft blazing-fast issue tracking software. You will design, build, and optimize offline-first sync engines and intuitive keyboard-first interfaces.",
      requirements: [
        "4+ years building high-frequency full stack web applications with TypeScript and React",
        "Strong knowledge of Node.js backend services and WebSocket / real-time synchronization",
        "Experience implementing secure Authentication (OAuth, SSO, JWT tokens)",
        "Architecting relational database queries and high-throughput REST APIs",
        "Passionate about craft, micro-animations, and instant UI responsiveness"
      ],
      required_skills: ["TypeScript", "React", "Node.js", "Authentication", "Database", "REST API", "Git"]
    },
    {
      id: "figma-design-systems",
      category: "web_dev",
      company: "Figma",
      bg: "bg-gradient-to-tr from-[#F24E1E] to-[#A259FF] text-white",
      icon: "design_services",
      letter: null,
      title: "Design Systems & UI Engineer",
      location: "New York, NY (Hybrid)",
      salary: "$170k - $210k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "3 days ago",
      applicantsCount: "54 candidates",
      experienceLevel: "Senior (5+ yrs)",
      teamSize: "15 Engineers",
      overview: "Figma is hiring a Design Systems Engineer to build cross-platform component libraries used by millions of designers and developers worldwide. You will bridge design specifications with production-grade React code.",
      requirements: [
        "5+ years developing enterprise design systems in React, HTML, CSS, and TypeScript",
        "In-depth expertise in design tokens, accessibility standards (WCAG AAA), and CSS architecture",
        "Writing thorough automated unit testing suites and documenting UI component libraries",
        "Mastery of Git and GitHub pull request workflows for large open-source components"
      ],
      required_skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git", "GitHub"]
    },
    {
      id: "vercel-cloud-platform",
      category: "web_dev",
      company: "Vercel",
      bg: "bg-black text-white",
      icon: "change_history",
      letter: null,
      title: "Web Platform & Next.js Engineer",
      location: "Remote (Global)",
      salary: "$160k - $190k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "4 days ago",
      applicantsCount: "39 candidates",
      experienceLevel: "Mid-Senior (3+ yrs)",
      teamSize: "10 Engineers",
      overview: "Vercel is looking for a Web Platform Engineer to construct ultra-low latency edge deployment networks and developer preview environments. You will optimize frontend serverless runtimes and infrastructure interfaces.",
      requirements: [
        "4+ years with Node.js, Next.js, and TypeScript serverless microservices",
        "Hands-on experience deploying containerized services with Docker and Cloud providers",
        "Understanding of Edge network routing, global CDN caching, and HTTP/3 protocols",
        "Building developer-first CLI and web consoles with React and Next.js"
      ],
      required_skills: ["Next.js", "React", "TypeScript", "Node.js", "Cloud", "Docker", "Git"]
    },
    {
      id: "datadog-frontend-engineer",
      category: "web_dev",
      company: "Datadog",
      bg: "bg-[#632CA6] text-white",
      icon: "monitoring",
      letter: null,
      title: "Frontend Software Engineer",
      location: "Boston, MA",
      salary: "$140k - $165k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "5 days ago",
      applicantsCount: "61 candidates",
      experienceLevel: "Mid Level (3+ yrs)",
      teamSize: "14 Engineers",
      overview: "Datadog is seeking a Frontend Engineer to construct real-time telemetry dashboards and data visualization tools for monitoring global cloud infrastructure.",
      requirements: [
        "3+ years with React, JavaScript, TypeScript, and high-frequency data streams",
        "Interfacing with backend time-series Database engines and REST API endpoints",
        "Containerized local development workflows using Docker and Git",
        "Strong automated testing habits and browser performance profiling"
      ],
      required_skills: ["JavaScript", "TypeScript", "React", "REST API", "Database", "Git", "Docker"]
    },
    {
      id: "notion-web-platform",
      category: "web_dev",
      company: "Notion",
      bg: "bg-surface-container border border-outline-variant/40 text-on-surface",
      icon: null,
      letter: "N",
      title: "Web Platform Specialist",
      location: "San Francisco, CA",
      salary: "$155k - $185k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "2 days ago",
      applicantsCount: "35 candidates",
      experienceLevel: "Senior (4+ yrs)",
      teamSize: "11 Engineers",
      overview: "Notion is looking for a Web Platform Specialist to design collaborative document editing surfaces and block-tree rendering engines.",
      requirements: [
        "4+ years with React, TypeScript, and Node.js backend systems",
        "Experience designing high-performance REST APIs and real-time state synchronization",
        "Working with relational and document Database stores",
        "Implementing secure enterprise Authentication protocols and role-based permissions"
      ],
      required_skills: ["TypeScript", "React", "Node.js", "Database", "REST API", "Authentication"]
    },
    {
      id: "supabase-fullstack",
      category: "web_dev",
      company: "Supabase",
      bg: "bg-[#3ECF8E] text-slate-900",
      icon: "storage",
      letter: null,
      title: "Full Stack TypeScript Engineer",
      location: "Remote (Global)",
      salary: "$150k - $185k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "4 days ago",
      applicantsCount: "40 candidates",
      experienceLevel: "Mid-Senior (4+ yrs)",
      teamSize: "12 Engineers",
      overview: "Supabase is seeking a Full Stack TypeScript Engineer to work on open-source database management consoles, realtime subscription gateways, and developer APIs.",
      requirements: [
        "4+ years with TypeScript, Node.js, and relational Database systems",
        "Strong background building secure Authentication flows and OAuth integrations",
        "Containerizing services with Docker and deploying to Cloud infrastructure",
        "Designing public-facing REST API endpoints and TypeScript SDK clients"
      ],
      required_skills: ["Database", "TypeScript", "Node.js", "REST API", "Docker", "Authentication", "Git"]
    },
    {
      id: "github-ui-engineer",
      category: "web_dev",
      company: "GitHub",
      bg: "bg-[#24292e] text-white",
      icon: "code",
      letter: null,
      title: "Developer Tools & UI Engineer",
      location: "Remote (US)",
      salary: "$160k - $190k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "2 days ago",
      applicantsCount: "33 candidates",
      experienceLevel: "Mid-Senior (4+ yrs)",
      teamSize: "10 Engineers",
      overview: "GitHub is seeking a UI Engineer to craft code review, pull request, and repository navigation experiences across GitHub.com.",
      requirements: [
        "4+ years with modern JavaScript, TypeScript, HTML, and CSS",
        "Deep, expert-level familiarity with Git and GitHub developer workflows",
        "Interfacing with complex REST API surfaces and microservices",
        "Strong architectural instinct for web System Design and browser accessibility"
      ],
      required_skills: ["Git", "GitHub", "TypeScript", "JavaScript", "REST API", "HTML", "CSS"]
    },
    {
      id: "airbnb-web-lead",
      category: "web_dev",
      company: "Airbnb",
      bg: "bg-[#FF5A5F] text-white",
      icon: "home_work",
      letter: null,
      title: "Design Systems & Web Lead",
      location: "Seattle, WA (Hybrid)",
      salary: "$170k - $205k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "3 days ago",
      applicantsCount: "73 candidates",
      experienceLevel: "Lead (6+ yrs)",
      teamSize: "22 Engineers",
      overview: "Airbnb is looking for a Design Systems Lead to oversee the expansion of the Lunar Web UI framework across web, tablet, and mobile platforms.",
      requirements: [
        "6+ years leading frontend engineering with React, TypeScript, HTML, and CSS",
        "Proven track record designing scalable System Design architectures for web apps",
        "Enforcing high-standard Git code reviews and design token automation pipelines",
        "Ensuring seamless internationalization and keyboard-navigable UI components"
      ],
      required_skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "System Design", "Git"]
    },

    // ═══════════════════ AI & MACHINE LEARNING JOBS (9) ═══════════════════
    {
      id: "openai-infra-engineer",
      category: "ai_ml",
      company: "OpenAI",
      bg: "bg-black text-white",
      icon: "auto_awesome",
      letter: null,
      title: "AI Infrastructure & Platform Engineer",
      location: "San Francisco, CA (Hybrid)",
      salary: "$195k - $240k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "1 day ago",
      applicantsCount: "89 candidates",
      experienceLevel: "Staff (6+ yrs)",
      teamSize: "20 Engineers",
      overview: "Join OpenAI's core platform team to build scalable infrastructure for developer APIs and ChatGPT web experiences. You will design distributed clusters and high-throughput inference endpoints.",
      requirements: [
        "5+ years developing distributed AI backends with Python, PyTorch, and Deep Learning models",
        "Hands-on experience deploying and serving LLMs at massive scale",
        "Container orchestration using Docker, Kubernetes, and Cloud infrastructure",
        "Robust System Design capabilities for fault-tolerant AI workloads"
      ],
      required_skills: ["Python", "PyTorch", "Deep Learning", "LLM", "Docker", "Cloud", "MLOps", "System Design"]
    },
    {
      id: "anthropic-ai-apps",
      category: "ai_ml",
      company: "Anthropic",
      bg: "bg-[#CC785C] text-white",
      icon: "neurology",
      letter: null,
      title: "Full Stack AI Applications Engineer",
      location: "Remote (US)",
      salary: "$185k - $225k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "2 days ago",
      applicantsCount: "47 candidates",
      experienceLevel: "Senior (5+ yrs)",
      teamSize: "16 Engineers",
      overview: "Anthropic is looking for a Full Stack Applications Engineer to build Claude's web interfaces and API developer portal with high trust, security, and delightful UX.",
      requirements: [
        "4+ years with Python, LLM orchestration, and modern web application development",
        "Building real-time AI conversation workflows using LangChain and RAG architectures",
        "Experience with model Fine-tuning, prompt evaluation, and safety guardrails",
        "Deploying services with Docker and secure REST/streaming APIs"
      ],
      required_skills: ["Python", "LLM", "LangChain", "RAG", "Fine-tuning", "Docker", "GenAI"]
    },
    {
      id: "databricks-ml-platform",
      category: "ai_ml",
      company: "Databricks",
      bg: "bg-[#FF3621] text-white",
      icon: "dataset",
      letter: null,
      title: "Machine Learning & Data Platform Engineer",
      location: "San Francisco, CA",
      salary: "$175k - $215k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "2 days ago",
      applicantsCount: "52 candidates",
      experienceLevel: "Senior (5+ yrs)",
      teamSize: "18 Engineers",
      overview: "Databricks is hiring an ML Platform Engineer to build distributed model training pipelines, automated feature stores, and interactive ML workbenches.",
      requirements: [
        "5+ years of practical Machine Learning engineering in Python",
        "Expertise in tabular data processing with SQL, Pandas, NumPy, and EDA",
        "Training baseline and production predictive models with Scikit-learn",
        "Containerized pipeline automation with Docker"
      ],
      required_skills: ["Python", "Machine Learning", "Scikit-learn", "SQL", "Pandas", "EDA", "Docker"]
    },
    {
      id: "huggingface-llm",
      category: "ai_ml",
      company: "Hugging Face",
      bg: "bg-[#FFD21E] text-slate-900",
      icon: "sentiment_satisfied",
      letter: null,
      title: "Open Source LLM & Transformers Specialist",
      location: "Remote",
      salary: "$170k - $210k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "3 days ago",
      applicantsCount: "63 candidates",
      experienceLevel: "Senior (4+ yrs)",
      teamSize: "12 Engineers",
      overview: "Hugging Face is seeking an Open Source LLM Specialist to contribute to the Transformers library, optimize open weights models, and build community evaluation suites.",
      requirements: [
        "4+ years working deeply with Transformers and Hugging Face ecosystem",
        "Model development and distributed training in PyTorch and Python",
        "Expertise in Natural Language Processing (NLP) and parameter-efficient Fine-tuning (LoRA/QLoRA)",
        "Deep Learning fundamentals including attention mechanisms and tokenizers"
      ],
      required_skills: ["Transformers", "Hugging Face", "PyTorch", "Python", "NLP", "Fine-tuning", "Deep Learning"]
    },
    {
      id: "cohere-rag-engineer",
      category: "ai_ml",
      company: "Cohere",
      bg: "bg-[#39594C] text-white",
      icon: "psychology",
      letter: null,
      title: "Generative AI & RAG Solutions Engineer",
      location: "Toronto, ON / Remote",
      salary: "$180k - $220k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "3 days ago",
      applicantsCount: "38 candidates",
      experienceLevel: "Mid-Senior (4+ yrs)",
      teamSize: "14 Engineers",
      overview: "Cohere is hiring a RAG Solutions Engineer to implement enterprise retrieval-augmented generation systems, semantic search rankers, and multi-step reasoning agents.",
      requirements: [
        "4+ years deploying GenAI and RAG pipelines for enterprise search",
        "Strong Python backend foundations with NLP vector embeddings",
        "Evaluating model accuracy and hallucination rates with rigorous Model Evaluation metrics",
        "Deploying lightweight containerized microservices in Docker"
      ],
      required_skills: ["GenAI", "RAG", "Python", "NLP", "LLM", "Model Evaluation", "Docker"]
    },
    {
      id: "scale-ai-cv",
      category: "ai_ml",
      company: "Scale AI",
      bg: "bg-[#111827] text-white",
      icon: "visibility",
      letter: null,
      title: "Computer Vision & Deep Learning Engineer",
      location: "San Francisco, CA",
      salary: "$165k - $200k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "4 days ago",
      applicantsCount: "44 candidates",
      experienceLevel: "Mid-Senior (4+ yrs)",
      teamSize: "11 Engineers",
      overview: "Scale AI is hiring a Deep Learning Engineer to build automated image annotation, object detection, and visual segmentation models for autonomous vehicles and robotics.",
      requirements: [
        "4+ years applying Deep Learning to visual datasets with TensorFlow or PyTorch",
        "Architecting Convolutional Neural Networks (CNN) and vision transformers",
        "Data Preprocessing and matrix calculations using Python and NumPy",
        "Continuous model benchmarking and error analysis"
      ],
      required_skills: ["Deep Learning", "TensorFlow", "CNN", "Python", "PyTorch", "Data Preprocessing", "NumPy"]
    },
    {
      id: "deepmind-applied-ml",
      category: "ai_ml",
      company: "Google DeepMind",
      bg: "bg-[#4285F4] text-white",
      icon: "hub",
      letter: null,
      title: "Applied Machine Learning Research Engineer",
      location: "Mountain View, CA",
      salary: "$200k - $250k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "1 day ago",
      applicantsCount: "95 candidates",
      experienceLevel: "Staff (6+ yrs)",
      teamSize: "25 Engineers",
      overview: "Join Google DeepMind to translate cutting-edge scientific foundation models into production systems used by billions of users worldwide.",
      requirements: [
        "6+ years writing high-performance machine learning code in Python, TensorFlow, and PyTorch",
        "Strong theoretical foundation in Linear Algebra, Probability, and Statistics",
        "Deep Learning model architecture design and rigorous Model Evaluation",
        "Scaling training runs across large TPU and GPU clusters"
      ],
      required_skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "Model Evaluation", "Linear Algebra", "Probability"]
    },
    {
      id: "snowflake-mlops",
      category: "ai_ml",
      company: "Snowflake",
      bg: "bg-[#29B5E8] text-white",
      icon: "ac_unit",
      letter: null,
      title: "Cloud Data Science & MLOps Lead",
      location: "San Mateo, CA",
      salary: "$175k - $215k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "5 days ago",
      applicantsCount: "48 candidates",
      experienceLevel: "Lead (6+ yrs)",
      teamSize: "15 Engineers",
      overview: "Snowflake is looking for an MLOps Lead to build end-to-end model deployment lifecycles, Snowpark ML integrations, and automated model monitoring.",
      requirements: [
        "6+ years with Python, SQL, and distributed data analysis with Pandas",
        "Establishing enterprise MLOps CI/CD pipelines, container registries with Docker, and AWS cloud deploys",
        "Engineering robust Feature Engineering pipelines and dataset validation",
        "Monitoring drift and production model telemetry"
      ],
      required_skills: ["SQL", "Pandas", "MLOps", "Python", "Docker", "AWS", "Feature Engineering"]
    },
    {
      id: "langchain-agent-dev",
      category: "ai_ml",
      company: "LangChain Labs",
      bg: "bg-[#1C3C3C] text-white",
      icon: "link",
      letter: null,
      title: "GenAI & Autonomous Agent Developer",
      location: "Remote (Global)",
      salary: "$160k - $195k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "2 days ago",
      applicantsCount: "36 candidates",
      experienceLevel: "Mid-Senior (3+ yrs)",
      teamSize: "9 Engineers",
      overview: "LangChain Labs is seeking an Agent Developer to build autonomous multi-agent graph workflows, tool-use evaluation harnesses, and production LangGraph deployments.",
      requirements: [
        "3+ years developing generative software with Python and LangChain",
        "Architecting stateful LLM agents with multi-turn tool calling and RAG memory",
        "Understanding of GenAI prompting, Supervised Learning feedback loops, and Docker",
        "Building open-source tools with active community contributions"
      ],
      required_skills: ["LangChain", "Python", "GenAI", "LLM", "RAG", "Supervised Learning", "Docker"]
    },

    // ═══════════════════ WEB3 & BLOCKCHAIN JOBS (9) ═══════════════════
    {
      id: "ethereum-evm-engineer",
      category: "web3",
      company: "Ethereum Foundation",
      bg: "bg-[#3C3C3D] text-white",
      icon: "diamond",
      letter: null,
      title: "Core Protocol & EVM Engineer",
      location: "Remote (Global)",
      salary: "$180k - $220k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "1 day ago",
      applicantsCount: "50 candidates",
      experienceLevel: "Senior (5+ yrs)",
      teamSize: "14 Engineers",
      overview: "The Ethereum Foundation is looking for a Core Protocol Engineer to work on Ethereum execution clients, EVM opcode improvements, and Layer 2 interoperability.",
      requirements: [
        "5+ years working on Blockchain protocols and EVM execution mechanics",
        "Writing production-grade Solidity smart contracts and byte-code testing",
        "Strong foundation in applied Cryptography, hashing algorithms, and zero-knowledge proofs",
        "Collaborating with Layer 2 rollup teams and client developers"
      ],
      required_skills: ["Solidity", "EVM", "Cryptography", "Blockchain", "Smart Contracts", "Layer 2", "Testing"]
    },
    {
      id: "uniswap-defi-engineer",
      category: "web3",
      company: "Uniswap Labs",
      bg: "bg-[#FF007A] text-white",
      icon: "swap_horiz",
      letter: null,
      title: "Smart Contract & DeFi Protocol Engineer",
      location: "New York, NY",
      salary: "$175k - $215k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "2 days ago",
      applicantsCount: "45 candidates",
      experienceLevel: "Senior (4+ yrs)",
      teamSize: "11 Engineers",
      overview: "Uniswap Labs is hiring a Smart Contract Engineer to architect next-generation automated market maker (AMM) pools, hooks, and decentralized liquidity protocols.",
      requirements: [
        "4+ years deploying production Solidity Smart Contracts to mainnet",
        "In-depth understanding of DeFi primitives, automated market makers, and DEX mechanics",
        "Development workflows using Hardhat, Foundry, and Ethers.js",
        "Extreme focus on Gas Optimization and reentrancy attack prevention"
      ],
      required_skills: ["Solidity", "Smart Contracts", "DeFi", "DEX", "Hardhat", "Ethers.js", "Gas Optimization"]
    },
    {
      id: "coinbase-crypto-sec",
      category: "web3",
      company: "Coinbase",
      bg: "bg-[#0052FF] text-white",
      icon: "lock",
      letter: null,
      title: "Blockchain Security & Cryptography Engineer",
      location: "Remote (US)",
      salary: "$185k - $230k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "3 days ago",
      applicantsCount: "39 candidates",
      experienceLevel: "Senior (5+ yrs)",
      teamSize: "16 Engineers",
      overview: "Coinbase is seeking a Blockchain Security Engineer to audit incoming smart contracts, secure institutional custody wallets, and safeguard crypto assets.",
      requirements: [
        "5+ years in smart contract Auditing and Smart Contract Security analysis",
        "Deep knowledge of Blockchain networks, consensus models, and multi-sig Wallets",
        "Expertise in Cryptography (elliptic curves, MPC, threshold signatures)",
        "Experience securing high-availability Cloud infrastructure"
      ],
      required_skills: ["Blockchain", "Smart Contract Security", "Auditing", "Cryptography", "Wallets", "Cloud"]
    },
    {
      id: "opensea-web3-backend",
      category: "web3",
      company: "OpenSea",
      bg: "bg-[#2081E2] text-white",
      icon: "sailing",
      letter: null,
      title: "Smart Contract & Web3 Backend Developer",
      location: "New York, NY",
      salary: "$160k - $195k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "3 days ago",
      applicantsCount: "41 candidates",
      experienceLevel: "Mid-Senior (4+ yrs)",
      teamSize: "13 Engineers",
      overview: "OpenSea is looking for a Web3 Backend Developer to build high-scale NFT marketplace trading contracts, metadata indexing pipelines, and decentralized storage systems.",
      requirements: [
        "4+ years building Web3 Backend services and Solidity smart contracts",
        "In-depth knowledge of ERC-721 and ERC-1155 token standards",
        "Interfacing with client libraries using Web3.js or Ethers.js",
        "Decentralized media storage on IPFS and Dockerized backend microservices"
      ],
      required_skills: ["ERC-721", "Solidity", "Web3 Backend", "Smart Contracts", "Web3.js", "IPFS", "Docker"]
    },
    {
      id: "chainlink-oracles",
      category: "web3",
      company: "Chainlink Labs",
      bg: "bg-[#375BD2] text-white",
      icon: "share",
      letter: null,
      title: "Decentralized Oracles & Cross-Chain Architect",
      location: "Remote",
      salary: "$170k - $210k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "4 days ago",
      applicantsCount: "37 candidates",
      experienceLevel: "Senior (5+ yrs)",
      teamSize: "18 Engineers",
      overview: "Chainlink Labs is hiring a Cross-Chain Architect to design CCIP (Cross-Chain Interoperability Protocol) adapters and decentralized data feeds.",
      requirements: [
        "5+ years with decentralized Oracles, cross-chain messaging, and Blockchain networks",
        "Writing secure, gas-efficient Solidity Smart Contracts",
        "High-throughput RPC communication and multi-chain node monitoring",
        "Deep understanding of consensus timing and finality across heterogenous chains"
      ],
      required_skills: ["Oracles", "Cross-chain", "Solidity", "Smart Contracts", "Blockchain", "RPC"]
    },
    {
      id: "polygon-layer2",
      category: "web3",
      company: "Polygon Labs",
      bg: "bg-[#8247E5] text-white",
      icon: "layers",
      letter: null,
      title: "Layer 2 Scaling & ZK Rollup Engineer",
      location: "Remote",
      salary: "$165k - $205k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "2 days ago",
      applicantsCount: "32 candidates",
      experienceLevel: "Mid-Senior (4+ yrs)",
      teamSize: "12 Engineers",
      overview: "Polygon Labs is looking for a Layer 2 Scaling Engineer to develop ZK rollup proofs, state bridge contracts, and developer tooling on Polygon PoS and Polygon zkEVM.",
      requirements: [
        "4+ years with Layer 2 rollup architectures and EVM execution chains",
        "Testing and deploying contracts using Hardhat and Foundry toolchains",
        "Solidity optimization with focus on Gas Optimization",
        "Interfacing with Ethereum mainnet settlement contracts"
      ],
      required_skills: ["Layer 2", "EVM", "Hardhat", "Foundry", "Solidity", "Gas Optimization", "Ethereum"]
    },
    {
      id: "consensys-metamask",
      category: "web3",
      company: "ConsenSys",
      bg: "bg-[#121212] text-white",
      icon: "wallet",
      letter: null,
      title: "MetaMask & Web3 Systems Specialist",
      location: "Remote",
      salary: "$155k - $190k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "4 days ago",
      applicantsCount: "58 candidates",
      experienceLevel: "Mid-Senior (4+ yrs)",
      teamSize: "16 Engineers",
      overview: "ConsenSys is seeking a Web3 Systems Specialist to expand MetaMask wallet APIs, Snaps plugins, and dApp provider interfaces.",
      requirements: [
        "4+ years building crypto Wallets, Web3.js / Ethers.js integrations, and dApps",
        "Understanding of EVM transaction serialization, gas estimation, and EIP standards",
        "Ethereum network RPC provider routing and client session management",
        "Comprehensive Testing suites for cross-chain wallet connections"
      ],
      required_skills: ["Wallets", "Web3.js", "dApps", "Ethers.js", "Ethereum", "EVM", "Testing"]
    },
    {
      id: "aave-solidity-arch",
      category: "web3",
      company: "Aave",
      bg: "bg-[#2EBAC6] text-white",
      icon: "account_balance",
      letter: null,
      title: "DeFi Protocol & Solidity Architect",
      location: "London, UK / Remote",
      salary: "$180k - $225k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "5 days ago",
      applicantsCount: "46 candidates",
      experienceLevel: "Lead (5+ yrs)",
      teamSize: "10 Engineers",
      overview: "Aave is hiring a DeFi Protocol Architect to design lending pools, flash loan modules, and interest rate algorithm contracts on multiple chains.",
      requirements: [
        "5+ years crafting mission-critical Solidity Smart Contracts with $100M+ TVL",
        "Deep knowledge of Tokenomics, ERC-20 token mechanics, and DeFi lending dynamics",
        "Testing workflows with Hardhat and formal verification",
        "Uncompromising Smart Contract Security review methodology"
      ],
      required_skills: ["Solidity", "Tokenomics", "DeFi", "Smart Contracts", "Hardhat", "Smart Contract Security"]
    },
    {
      id: "alchemy-rpc-dev",
      category: "web3",
      company: "Alchemy",
      bg: "bg-[#0055FF] text-white",
      icon: "lan",
      letter: null,
      title: "Web3 Developer Infrastructure & RPC Engineer",
      location: "San Francisco, CA",
      salary: "$160k - $190k / yr",
      type: "Full-time",
      verified: true,
      postedDate: "3 days ago",
      applicantsCount: "34 candidates",
      experienceLevel: "Mid-Senior (4+ yrs)",
      teamSize: "15 Engineers",
      overview: "Alchemy is looking for an RPC Engineer to build ultra-reliable node infrastructure, subgraphs, and enhanced Web3 APIs for top decentralized apps.",
      requirements: [
        "4+ years building high-availability RPC proxies and Web3 Backend services",
        "Knowledge of EVM node internals (Geth, Nethermind, Besu)",
        "Indexing blockchain data using The Graph and subgraphs",
        "Containerized cloud microservices with Docker and Cloud infrastructure"
      ],
      required_skills: ["RPC", "EVM", "The Graph", "Web3 Backend", "Blockchain", "Docker", "Cloud"]
    }
  ];

  // Helper functions
  function normalizeSkillKey(skill) {
    if (!skill) return '';
    return skill.toLowerCase().trim().replace(/[\s\.\-_/]/g, '').replace(/js$/, '');
  }

  function findJobById(jobId) {
    if (!jobId) return null;
    const cleanId = String(jobId).trim().toLowerCase();
    return APP_JOBS_DATASET.find(j => j.id.toLowerCase() === cleanId) || null;
  }

  function calculateSkillMatch(job, userSkillsList) {
    const userSkills = Array.isArray(userSkillsList) ? userSkillsList : [];
    const hasResume = userSkills.length > 0;
    const reqSkills = Array.isArray(job?.required_skills) ? job.required_skills : [];

    if (reqSkills.length === 0) {
      return {
        hasResume,
        hasRequirements: false,
        matchPercentage: 0,
        matchedSkills: [],
        missingSkills: [],
        totalRequired: 0,
        matchedCount: 0
      };
    }

    if (!hasResume) {
      return {
        hasResume: false,
        hasRequirements: true,
        matchPercentage: 0,
        matchedSkills: [],
        missingSkills: reqSkills.map((name, idx) => ({
          name,
          priority: idx < 2 ? 'High Priority Gap' : 'Medium Priority Gap',
          description: `Required core capability for this position at ${job.company}.`
        })),
        totalRequired: reqSkills.length,
        matchedCount: 0
      };
    }

    // Map of normalized user skills for case-insensitive matching
    const userSkillNormMap = new Map();
    userSkills.forEach(s => {
      if (typeof s === 'string') {
        userSkillNormMap.set(normalizeSkillKey(s), s.trim());
        userSkillNormMap.set(s.toLowerCase().trim(), s.trim());
      }
    });

    const matchedSkills = [];
    const missingSkills = [];

    reqSkills.forEach((req) => {
      const normReq = normalizeSkillKey(req);
      const lowerReq = req.toLowerCase().trim();

      let isMatch = false;
      let matchedLabel = req;

      if (userSkillNormMap.has(lowerReq)) {
        isMatch = true;
        matchedLabel = userSkillNormMap.get(lowerReq);
      } else if (userSkillNormMap.has(normReq)) {
        isMatch = true;
        matchedLabel = userSkillNormMap.get(normReq);
      } else {
        // Fallback check for substring variants (e.g. "React.js" <-> "React")
        for (const [key, orig] of userSkillNormMap.entries()) {
          if (key && (key.includes(normReq) || normReq.includes(key))) {
            isMatch = true;
            matchedLabel = orig;
            break;
          }
        }
      }

      if (isMatch) {
        matchedSkills.push({
          name: req,
          userSkill: matchedLabel,
          level: "Verified in Resume",
          exp: "Direct Match"
        });
      } else {
        const isHigh = missingSkills.length < 2;
        missingSkills.push({
          name: req,
          priority: isHigh ? "High Priority Gap" : "Medium Priority Gap",
          description: `Key skill required by ${job.company} for this position.`
        });
      }
    });

    const matchPercentage = Math.round((matchedSkills.length / reqSkills.length) * 100);

    return {
      hasResume: true,
      hasRequirements: true,
      matchPercentage,
      matchedSkills,
      missingSkills,
      totalRequired: reqSkills.length,
      matchedCount: matchedSkills.length
    };
  }

  // Export to window/global
  global.APP_JOBS_DATASET = APP_JOBS_DATASET;
  global.findJobById = findJobById;
  global.calculateSkillMatch = calculateSkillMatch;
  global.normalizeSkillKey = normalizeSkillKey;

})(typeof window !== 'undefined' ? window : this);
