window.JobsManager = (() => {
  let jobs = [];
  let searchTerm = "";
  let statusFilter = "All";

  const selectors = {
    form: "[data-job-form]",
    submit: "[data-job-submit]",
    reset: "[data-job-reset]",
    search: "[data-job-search]",
    filter: "[data-job-filter]",
    list: "[data-jobs-list]",
  };

  function formatValue(value) {
    return value ? window.CareerUtils.escapeHtml(value) : "Not recorded";
  }

  function getFilteredJobs() {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        job.company.toLowerCase().includes(normalizedSearch) ||
        job.position.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }

  function persistAndRender() {
    window.CareerStorage.saveJobs(jobs);
    renderJobs();
    window.CareerDashboard.update(jobs);
  }

  function resetForm() {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);

    form.reset();
    form.elements.jobId.value = "";
    submitButton.textContent = "Add job";
  }

  function getFormJob(form) {
    const formData = new FormData(form);
    const now = new Date().toISOString();

    return {
      id: formData.get("jobId") || window.CareerUtils.createId("job"),
      company: formData.get("company").trim(),
      position: formData.get("position").trim(),
      status: formData.get("status"),
      deadline: formData.get("deadline"),
      location: formData.get("location").trim(),
      nextAction: formData.get("nextAction").trim(),
      url: "",
      createdAt: now,
      updatedAt: now,
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const job = getFormJob(form);
    const existingJob = jobs.find((item) => item.id === job.id);

    if (existingJob) {
      job.createdAt = existingJob.createdAt;
      job.url = existingJob.url;
      jobs = jobs.map((item) => (item.id === job.id ? job : item));
    } else {
      jobs = [job, ...jobs];
    }

    resetForm();
    persistAndRender();
  }

  function editJob(jobId) {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);
    const job = jobs.find((item) => item.id === jobId);

    if (!job) {
      return;
    }

    form.elements.jobId.value = job.id;
    form.elements.company.value = job.company;
    form.elements.position.value = job.position;
    form.elements.status.value = job.status;
    form.elements.deadline.value = job.deadline;
    form.elements.location.value = job.location;
    form.elements.nextAction.value = job.nextAction;
    submitButton.textContent = "Save job";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function deleteJob(jobId) {
    const job = jobs.find((item) => item.id === jobId);

    if (!job) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${job.company} - ${job.position}?`,
    );

    if (!confirmed) {
      return;
    }

    jobs = jobs.filter((item) => item.id !== jobId);
    persistAndRender();
  }

  function renderJobs() {
    const list = document.querySelector(selectors.list);
    const filteredJobs = getFilteredJobs();

    if (!filteredJobs.length) {
      list.innerHTML =
        '<p class="empty-state">No jobs match the current search or filter.</p>';
      return;
    }

    list.innerHTML = filteredJobs
      .map(
        (job) => `
          <article class="job-list-card">
            <div>
              <h3>${window.CareerUtils.escapeHtml(job.company)}</h3>
              <p>${window.CareerUtils.escapeHtml(job.position)}</p>
              <div class="job-list-meta">
                <span>Status: ${window.CareerUtils.escapeHtml(job.status)}</span>
                <span>Deadline: ${formatValue(job.deadline)}</span>
                <span>Location: ${formatValue(job.location)}</span>
                <span>Next: ${formatValue(job.nextAction)}</span>
              </div>
            </div>
            <div class="job-list-actions">
              <button class="button button-secondary button-small" type="button" data-job-edit="${window.CareerUtils.escapeHtml(job.id)}">
                Edit
              </button>
              <button class="button button-danger button-small" type="button" data-job-delete="${window.CareerUtils.escapeHtml(job.id)}">
                Delete
              </button>
            </div>
          </article>
        `,
      )
      .join("");
  }

  function bindEvents() {
    const form = document.querySelector(selectors.form);
    const resetButton = document.querySelector(selectors.reset);
    const searchInput = document.querySelector(selectors.search);
    const filterSelect = document.querySelector(selectors.filter);
    const list = document.querySelector(selectors.list);

    form.addEventListener("submit", handleSubmit);
    resetButton.addEventListener("click", resetForm);

    searchInput.addEventListener("input", (event) => {
      searchTerm = event.target.value;
      renderJobs();
    });

    filterSelect.addEventListener("change", (event) => {
      statusFilter = event.target.value;
      renderJobs();
    });

    list.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-job-edit]");
      const deleteButton = event.target.closest("[data-job-delete]");

      if (editButton) {
        editJob(editButton.dataset.jobEdit);
      }

      if (deleteButton) {
        deleteJob(deleteButton.dataset.jobDelete);
      }
    });
  }

  function init() {
    const form = document.querySelector(selectors.form);

    if (!form) {
      return;
    }

    jobs = window.CareerStorage.readJobs();
    bindEvents();
    renderJobs();
    window.CareerDashboard.update(jobs);
  }

  return {
    init,
  };
})();
