window.CareerDashboard = (() => {
  const activeStatuses = ["Preparing", "Applied", "Interview", "Offer"];

  let dashboardState = {
    jobs: [],
    tasks: [],
    learning: [],
  };

  function formatValue(value) {
    return value || "Not recorded yet";
  }

  function getCurrentJob(jobs) {
    return (
      jobs.find((job) => activeStatuses.includes(job.status)) ||
      jobs[0] ||
      null
    );
  }

  function normalizeState(nextState) {
    if (Array.isArray(nextState)) {
      dashboardState.jobs = nextState;
      return;
    }

    if (!nextState) {
      return;
    }

    if (Array.isArray(nextState.jobs)) {
      dashboardState.jobs = nextState.jobs;
    }

    if (Array.isArray(nextState.tasks)) {
      dashboardState.tasks = nextState.tasks;
    }

    if (Array.isArray(nextState.learning)) {
      dashboardState.learning = nextState.learning;
    }
  }

  function setStat(key, value) {
    const target = document.querySelector(`[data-stat="${key}"]`);

    if (target) {
      target.textContent = value;
    }
  }

  function setStatLabel(key, value) {
    const target = document.querySelector(`[data-stat-label="${key}"]`);

    if (target) {
      target.textContent = value;
    }
  }

  function updateStats(jobs, tasks, learning) {
    const activeJobs = jobs.filter((job) => activeStatuses.includes(job.status));
    const interviews = jobs.filter((job) => job.status === "Interview");
    const offers = jobs.filter((job) => job.status === "Offer");
    const openTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.length - openTasks.length;
    const completedLearning = learning.filter(
      (topic) => topic.status === "Completed",
    );
    const averageLearning = learning.length
      ? Math.round(
          learning.reduce((sum, topic) => sum + Number(topic.progress || 0), 0) /
            learning.length,
        )
      : 0;

    setStat("applications", activeJobs.length);
    setStat("interviews", interviews.length);
    setStat("offers", offers.length);
    setStat("tasks", openTasks.length);
    setStat("learning", `${averageLearning}%`);
    setStatLabel("tasks", `${completedTasks} completed`);
    setStatLabel("learning", `${completedLearning.length} completed`);
  }

  function updateCurrentJob(jobs) {
    const currentJob = getCurrentJob(jobs);
    const currentJobLink = document.querySelector("[data-current-job-link]");

    const fields = {
      company: document.querySelector("[data-current-job-company]"),
      position: document.querySelector("[data-current-job-position]"),
      status: document.querySelector("[data-current-job-status]"),
      deadline: document.querySelector("[data-current-job-deadline]"),
      location: document.querySelector("[data-current-job-location]"),
      action: document.querySelector("[data-current-job-action]"),
    };

    if (!currentJob) {
      fields.company.textContent = "No job selected";
      fields.position.textContent = "Add your first application";
      fields.status.textContent = "Empty";
      fields.deadline.textContent = "Not recorded yet";
      fields.location.textContent = "Not recorded yet";
      fields.action.textContent = "Use the form below";

      if (currentJobLink) {
        currentJobLink.classList.add("hidden");
      }

      return;
    }

    fields.company.textContent = currentJob.company;
    fields.position.textContent = currentJob.position;
    fields.status.textContent = currentJob.status;
    fields.deadline.textContent = formatValue(currentJob.deadline);
    fields.location.textContent = formatValue(currentJob.location);
    fields.action.textContent = formatValue(currentJob.nextAction);

    if (currentJobLink) {
      currentJobLink.href = currentJob.url || "#jobs";
      currentJobLink.classList.toggle("hidden", !currentJob.url);
    }
  }

  function update(nextState) {
    normalizeState(nextState);
    updateStats(
      dashboardState.jobs,
      dashboardState.tasks,
      dashboardState.learning,
    );
    updateCurrentJob(dashboardState.jobs);
  }

  return {
    update,
  };
})();
