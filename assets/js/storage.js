window.CareerStorage = (() => {
  const jobsKey = "careeros.jobs";
  const tasksKey = "careeros.tasks";
  const learningKey = "careeros.learning";
  const interviewKey = "careeros.interview";
  const seedTimestamp = "2026-07-09T00:00:00.000Z";

  const seedJobs = [
    {
      id: "job-asko-it-koordinator",
      company: "ASKO Oslofjord",
      position: "IT-koordinator",
      status: "Preparing",
      deadline: "",
      location: "Vestby, Norway",
      nextAction: "Finish CV and motivation letter",
      url: "Jobs/asko-it-koordinator/job.html",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
  ];

  const seedTasks = [
    {
      id: "task-update-cv",
      title: "Update CV",
      notes: "Tailor profile for IT coordinator roles",
      priority: "High",
      dueDate: "",
      completed: false,
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "task-motivation-letter",
      title: "Write motivation letter",
      notes: "Connect ASKO needs with support experience",
      priority: "High",
      dueDate: "",
      completed: false,
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "task-study-dns",
      title: "Study DNS",
      notes: "Review records, resolution flow and troubleshooting",
      priority: "Medium",
      dueDate: "",
      completed: false,
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
  ];

  const seedLearning = [
    {
      id: "windows-11",
      title: "Windows 11",
      category: "Windows",
      status: "In progress",
      progress: 20,
      notes:
        "Practice daily support workflows, settings, updates, user profiles, and troubleshooting basics.",
      currentFocus: "Windows 11 support workflows and troubleshooting patterns.",
      lastStudy: seedTimestamp,
      resources: [
        {
          id: "resource-windows-folder",
          title: "Windows 11 learning folder",
          url: "Learning/IT-Infrastructure/Windows 11/",
          type: "Other",
        },
        {
          id: "resource-windows-docs",
          title: "Microsoft Learn Windows client docs",
          url: "https://learn.microsoft.com/windows/client-management/",
          type: "Microsoft Learn",
        },
      ],
      practice: [
        {
          id: "practice-windows-scenarios",
          title: "Document five common Windows 11 support scenarios",
          completed: false,
        },
      ],
      nextStep: "Document five common Windows 11 support scenarios.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "networking",
      title: "Networking",
      category: "Networking",
      status: "In progress",
      progress: 15,
      notes:
        "Build confidence with DNS, DHCP, TCP/IP, routing, ports, and practical troubleshooting.",
      currentFocus: "DNS resolution flow, DHCP basics, and port troubleshooting.",
      lastStudy: seedTimestamp,
      resources: [
        {
          id: "resource-networking-folder",
          title: "Networking learning folder",
          url: "Learning/IT-Infrastructure/Networking/",
          type: "Other",
        },
        {
          id: "resource-networking-lab",
          title: "Packet Tracer or local lab notes",
          url: "",
          type: "Course",
        },
      ],
      practice: [
        {
          id: "practice-networking-dns",
          title: "Create a DNS troubleshooting checklist",
          completed: false,
        },
      ],
      nextStep: "Create a DNS troubleshooting checklist.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "microsoft-365",
      title: "Microsoft 365",
      category: "Microsoft 365",
      status: "In progress",
      progress: 10,
      notes:
        "Learn tenant basics, users, groups, licensing, Exchange, Teams, and admin workflows.",
      currentFocus: "Admin center basics, user lifecycle, and license assignment.",
      lastStudy: seedTimestamp,
      resources: [
        {
          id: "resource-m365-folder",
          title: "Microsoft 365 learning folder",
          url: "Learning/IT-Infrastructure/Microsoft 365/",
          type: "Other",
        },
        {
          id: "resource-m365-docs",
          title: "Microsoft Learn Microsoft 365 admin docs",
          url: "https://learn.microsoft.com/microsoft-365/admin/",
          type: "Microsoft Learn",
        },
      ],
      practice: [
        {
          id: "practice-m365-admin-map",
          title: "Map common Microsoft 365 admin tasks",
          completed: false,
        },
      ],
      nextStep: "Map common Microsoft 365 admin tasks.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "sharepoint",
      title: "SharePoint",
      category: "Microsoft 365",
      status: "Not started",
      progress: 0,
      notes:
        "Understand sites, document libraries, permissions, sharing, and information structure.",
      currentFocus: "Sites, libraries, permissions, and sharing models.",
      lastStudy: "",
      resources: [
        {
          id: "resource-sharepoint-docs",
          title: "Microsoft Learn SharePoint docs",
          url: "https://learn.microsoft.com/sharepoint/",
          type: "Microsoft Learn",
        },
      ],
      practice: [
        {
          id: "practice-sharepoint-permissions",
          title: "Create a SharePoint permissions note",
          completed: false,
        },
      ],
      nextStep: "Create a SharePoint permissions note.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "entra-id",
      title: "Entra ID",
      category: "Identity",
      status: "Not started",
      progress: 0,
      notes:
        "Study identity basics, users, groups, authentication, roles, and conditional access concepts.",
      currentFocus: "Users, groups, roles, authentication, and MFA concepts.",
      lastStudy: "",
      resources: [
        {
          id: "resource-entra-folder",
          title: "Entra ID learning folder",
          url: "Learning/IT-Infrastructure/Entra ID/",
          type: "Other",
        },
        {
          id: "resource-entra-docs",
          title: "Microsoft Learn Entra ID docs",
          url: "https://learn.microsoft.com/entra/",
          type: "Microsoft Learn",
        },
      ],
      practice: [
        {
          id: "practice-entra-summary",
          title: "Summarize users, groups, roles, and MFA",
          completed: false,
        },
      ],
      nextStep: "Summarize users, groups, roles, and MFA.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "active-directory",
      title: "Active Directory",
      category: "Identity",
      status: "In progress",
      progress: 18,
      notes:
        "Focus on users, groups, OUs, GPOs, DNS dependency, and common helpdesk tasks.",
      currentFocus: "Users, groups, OUs, GPOs, and DNS dependency.",
      lastStudy: seedTimestamp,
      resources: [
        {
          id: "resource-ad-folder",
          title: "Active Directory learning folder",
          url: "Learning/IT-Infrastructure/Active Directory/",
          type: "Other",
        },
        {
          id: "resource-ad-docs",
          title: "Windows Server Active Directory docs",
          url: "https://learn.microsoft.com/windows-server/identity/ad-ds/",
          type: "Official Docs",
        },
      ],
      practice: [
        {
          id: "practice-ad-glossary",
          title: "Build a small AD terminology glossary",
          completed: false,
        },
      ],
      nextStep: "Build a small AD terminology glossary.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "intune",
      title: "Intune",
      category: "Microsoft 365",
      status: "Not started",
      progress: 0,
      notes:
        "Learn device enrollment, compliance, configuration profiles, and app deployment basics.",
      currentFocus: "Enrollment, compliance, configuration profiles, and app deployment.",
      lastStudy: "",
      resources: [
        {
          id: "resource-intune-folder",
          title: "Intune learning folder",
          url: "Learning/IT-Infrastructure/Intune/",
          type: "Other",
        },
        {
          id: "resource-intune-docs",
          title: "Microsoft Learn Intune docs",
          url: "https://learn.microsoft.com/mem/intune/",
          type: "Microsoft Learn",
        },
      ],
      practice: [
        {
          id: "practice-intune-profiles",
          title: "Compare Intune compliance and configuration profiles",
          completed: false,
        },
      ],
      nextStep: "Compare Intune compliance and configuration profiles.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "html",
      title: "HTML",
      category: "Web",
      status: "In progress",
      progress: 35,
      notes: "Practice semantic structure, forms, accessible labels, and document organization.",
      currentFocus: "Semantic layout, forms, labels, and accessible structure.",
      lastStudy: seedTimestamp,
      resources: [
        {
          id: "resource-html-folder",
          title: "HTML learning folder",
          url: "Learning/Fullstack/HTML/",
          type: "Other",
        },
        {
          id: "resource-html-mdn",
          title: "MDN HTML guide",
          url: "https://developer.mozilla.org/docs/Web/HTML",
          type: "Official Docs",
        },
      ],
      practice: [
        {
          id: "practice-html-section",
          title: "Refactor one dashboard section semantically",
          completed: false,
        },
      ],
      nextStep: "Refactor one dashboard section semantically.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "css",
      title: "CSS",
      category: "Web",
      status: "In progress",
      progress: 30,
      notes: "Practice layout, responsive grids, custom properties, and component styling.",
      currentFocus: "Responsive grids, custom properties, and reusable components.",
      lastStudy: seedTimestamp,
      resources: [
        {
          id: "resource-css-folder",
          title: "CSS learning folder",
          url: "Learning/Fullstack/CSS/",
          type: "Other",
        },
        {
          id: "resource-css-mdn",
          title: "MDN CSS guide",
          url: "https://developer.mozilla.org/docs/Web/CSS",
          type: "Official Docs",
        },
      ],
      practice: [
        {
          id: "practice-css-architecture",
          title: "Document the CareerOS CSS module structure",
          completed: false,
        },
      ],
      nextStep: "Document the CareerOS CSS module structure.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "javascript",
      title: "JavaScript",
      category: "Web",
      status: "In progress",
      progress: 12,
      notes: "Practice DOM events, LocalStorage, modular patterns, and safe rendering.",
      currentFocus: "DOM events, LocalStorage, module patterns, and rendering state.",
      lastStudy: seedTimestamp,
      resources: [
        {
          id: "resource-js-folder",
          title: "JavaScript learning folder",
          url: "Learning/Fullstack/JavaScript/",
          type: "Other",
        },
        {
          id: "resource-js-mdn",
          title: "MDN JavaScript guide",
          url: "https://developer.mozilla.org/docs/Web/JavaScript",
          type: "Official Docs",
        },
      ],
      practice: [
        {
          id: "practice-js-event-flow",
          title: "Write notes on the JobsManager event flow",
          completed: false,
        },
      ],
      nextStep: "Write notes on the JobsManager event flow.",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
  ];

  const seedInterview = [
    {
      id: "interview-tell-me-about-yourself",
      question: "Tell me about yourself.",
      category: "Behavioral",
      difficulty: "Easy",
      answer:
        "Give a concise career summary, connect your experience to the role, and end with why this opportunity fits your next step.",
      personalAnswer:
        "I am building toward IT coordinator roles with a focus on support, structured troubleshooting, Microsoft 365, Windows, and user-focused service.",
      notes: "Keep it under two minutes and connect to the job description.",
      tags: ["intro", "behavioral"],
      status: "Need Practice",
      source: "Common interview question",
      lastReviewed: "",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "interview-dns-troubleshooting",
      question: "How would you troubleshoot a DNS issue?",
      category: "Technical",
      difficulty: "Medium",
      answer:
        "Confirm scope, test name resolution, compare IP connectivity, inspect DNS settings, clear cache, query known resolvers, and check records or service status.",
      personalAnswer:
        "I would first confirm whether the issue affects one device, one user, or a wider network, then test ping by IP versus hostname and inspect DNS configuration.",
      notes: "Use a clear step-by-step support workflow.",
      tags: ["networking", "dns", "troubleshooting"],
      status: "Need Practice",
      source: "Networking topic",
      lastReviewed: "",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
    {
      id: "interview-prioritize-tickets",
      question: "How do you prioritize multiple support tickets?",
      category: "Support",
      difficulty: "Medium",
      answer:
        "Prioritize by business impact, urgency, affected users, SLA, dependencies, and safety. Communicate expectations and update stakeholders.",
      personalAnswer:
        "I would separate urgent incidents from routine requests, handle blockers first, and keep users updated with realistic next steps.",
      notes: "Mention calm communication and documentation.",
      tags: ["support", "prioritization"],
      status: "New",
      source: "Helpdesk workflow",
      lastReviewed: "",
      createdAt: seedTimestamp,
      updatedAt: seedTimestamp,
    },
  ];

  function createSlug(value) {
    return window.CareerUtils.createSlug(value, "topic");
  }

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeLegacyResources(resources) {
    if (Array.isArray(resources)) {
      return resources.map((resource) => ({
        id: resource.id || window.CareerUtils.createId("resource"),
        title: resource.title || resource.url || "Untitled resource",
        url: resource.url || "",
        type: resource.type || "Other",
      }));
    }

    return String(resources || "")
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({
        id: window.CareerUtils.createId("resource"),
        title: item,
        url: /^https?:\/\//i.test(item) || item.includes("/") ? item : "",
        type: "Other",
      }));
  }

  function normalizePractice(practice, seedTopic) {
    if (Array.isArray(practice)) {
      return practice.map((item) => ({
        id: item.id || window.CareerUtils.createId("practice"),
        title: item.title || "Untitled practice item",
        completed: Boolean(item.completed),
      }));
    }

    if (Array.isArray(seedTopic?.practice)) {
      return cloneData(seedTopic.practice);
    }

    return [];
  }

  function enrichLearningTopics(topics) {
    return topics.map((topic) => {
      const normalizedId = createSlug(String(topic.id || "").replace(/^learning-/, ""));
      const normalizedTitle = createSlug(topic.title);
      const seedTopic = seedLearning.find((item) => {
        return item.id === topic.id || item.id === normalizedId || item.id === normalizedTitle;
      });
      const resources = normalizeLegacyResources(topic.resources || seedTopic?.resources || []);
      const practice = normalizePractice(topic.practice, seedTopic);

      return {
        ...topic,
        id: normalizedId || normalizedTitle || topic.id,
        notes: topic.notes || seedTopic?.notes || "",
        currentFocus: topic.currentFocus || seedTopic?.currentFocus || topic.nextStep || seedTopic?.nextStep || "",
        lastStudy: topic.lastStudy || seedTopic?.lastStudy || "",
        resources,
        practice,
        nextStep:
          topic.nextStep ||
          seedTopic?.nextStep ||
          practice.find((item) => !item.completed)?.title ||
          "",
      };
    });
  }

  function normalizeTags(tags) {
    if (Array.isArray(tags)) {
      return tags.map((tag) => String(tag).trim()).filter(Boolean);
    }

    return String(tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function normalizeInterviewQuestions(questions) {
    return questions.map((question) => {
      const now = question.createdAt || seedTimestamp;

      return {
        id: question.id || window.CareerUtils.createId("interview"),
        question: question.question || "Untitled interview question",
        category: question.category || "General",
        difficulty: question.difficulty || "Medium",
        answer: question.answer || "",
        personalAnswer: question.personalAnswer || "",
        notes: question.notes || "",
        tags: normalizeTags(question.tags),
        status: question.status || "New",
        source: question.source || "",
        lastReviewed: question.lastReviewed || "",
        createdAt: question.createdAt || now,
        updatedAt: question.updatedAt || now,
      };
    });
  }

  function readJobs() {
    try {
      const storedJobs = JSON.parse(localStorage.getItem(jobsKey));

      if (Array.isArray(storedJobs)) {
        return storedJobs;
      }
    } catch (error) {
      console.warn("CareerOS could not read jobs from LocalStorage.", error);
    }

    const jobs = cloneData(seedJobs);
    saveJobs(jobs);
    return jobs;
  }

  function saveJobs(jobs) {
    try {
      localStorage.setItem(jobsKey, JSON.stringify(jobs));
    } catch (error) {
      console.warn("CareerOS could not save jobs to LocalStorage.", error);
    }
  }

  function readTasks() {
    try {
      const storedTasks = JSON.parse(localStorage.getItem(tasksKey));

      if (Array.isArray(storedTasks)) {
        return storedTasks;
      }
    } catch (error) {
      console.warn("CareerOS could not read tasks from LocalStorage.", error);
    }

    const tasks = cloneData(seedTasks);
    saveTasks(tasks);
    return tasks;
  }

  function saveTasks(tasks) {
    try {
      localStorage.setItem(tasksKey, JSON.stringify(tasks));
    } catch (error) {
      console.warn("CareerOS could not save tasks to LocalStorage.", error);
    }
  }

  function readLearning() {
    try {
      const storedLearning = JSON.parse(localStorage.getItem(learningKey));

      if (Array.isArray(storedLearning)) {
        const enrichedLearning = enrichLearningTopics(storedLearning);
        saveLearning(enrichedLearning);
        return enrichedLearning;
      }
    } catch (error) {
      console.warn("CareerOS could not read learning from LocalStorage.", error);
    }

    const learning = cloneData(seedLearning);
    saveLearning(learning);
    return learning;
  }

  function saveLearning(learning) {
    try {
      localStorage.setItem(learningKey, JSON.stringify(enrichLearningTopics(learning)));
    } catch (error) {
      console.warn("CareerOS could not save learning topics to LocalStorage.", error);
    }
  }

  function readInterview() {
    try {
      const storedInterview = JSON.parse(localStorage.getItem(interviewKey));

      if (Array.isArray(storedInterview)) {
        const normalizedInterview = normalizeInterviewQuestions(storedInterview);
        saveInterview(normalizedInterview);
        return normalizedInterview;
      }
    } catch (error) {
      console.warn("CareerOS could not read interview questions from LocalStorage.", error);
    }

    const interview = cloneData(seedInterview);
    saveInterview(interview);
    return interview;
  }

  function saveInterview(interview) {
    try {
      localStorage.setItem(interviewKey, JSON.stringify(normalizeInterviewQuestions(interview)));
    } catch (error) {
      console.warn("CareerOS could not save interview questions to LocalStorage.", error);
    }
  }

  return {
    readJobs,
    readTasks,
    readLearning,
    readInterview,
    saveJobs,
    saveTasks,
    saveLearning,
    saveInterview,
  };
})();
