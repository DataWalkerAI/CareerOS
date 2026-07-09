window.CareerDashboard = (() => {
  const activeStatuses = ["Preparing", "Applied", "Interview", "Offer"];

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

  function updateStats(jobs) {
    const activeJobs = jobs.filter((job) => activeStatuses.includes(job.status));
    const interviews = jobs.filter((job) => job.status === "Interview");
    const offers = jobs.filter((job) => job.status === "Offer");

    const statMap = {
      applications: activeJobs.length,
      interviews: interviews.length,
      offers: offers.length,
    };

    Object.entries(statMap).forEach(([key, value]) => {
      const target = document.querySelector(`[data-stat="${key}"]`);

      if (target) {
        target.textContent = value;
      }
    });
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

  function update(jobs) {
    updateStats(jobs);
    updateCurrentJob(jobs);
  }

  return {
    update,
  };
})();
