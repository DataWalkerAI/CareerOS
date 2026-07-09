window.PortfolioManager = (() => {
  let projects = [];
  let searchTerm = "";
  let typeFilter = "All";
  let statusFilter = "All";

  const selectors = {
    form: "[data-portfolio-form]",
    submit: "[data-portfolio-submit]",
    reset: "[data-portfolio-reset]",
    search: "[data-portfolio-search]",
    typeFilter: "[data-portfolio-type-filter]",
    statusFilter: "[data-portfolio-status-filter]",
    list: "[data-portfolio-list]",
  };

  function stackToText(techStack) {
    return Array.isArray(techStack) ? techStack.join(", ") : "";
  }

  function stackFromText(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function getFormElement(form, name) {
    return form?.elements?.[name] || null;
  }

  function getFilteredProjects() {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const searchable = [
        project.title,
        project.type,
        project.status,
        project.description,
        stackToText(project.techStack),
        project.githubUrl,
        project.liveUrl,
        project.notes,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);
      const matchesType = typeFilter === "All" || project.type === typeFilter;
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  function updateDashboard() {
    window.CareerDashboard?.update({ portfolio: projects });
  }

  function persistAndRender() {
    window.CareerStorage.savePortfolio(projects);
    renderProjects();
    updateDashboard();
  }

  function resetForm() {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);

    if (!form) {
      return;
    }

    form.reset();

    const portfolioId = getFormElement(form, "portfolioId");

    if (portfolioId) {
      portfolioId.value = "";
    }

    if (submitButton) {
      submitButton.textContent = "Add project";
    }
  }

  function getFormProject(form) {
    const formData = new FormData(form);
    const now = new Date().toISOString();

    return {
      id: formData.get("portfolioId") || window.CareerUtils.createId("portfolio"),
      title: String(formData.get("title") || "").trim(),
      type: formData.get("type"),
      status: formData.get("status"),
      description: String(formData.get("description") || "").trim(),
      techStack: stackFromText(formData.get("techStack")),
      githubUrl: String(formData.get("githubUrl") || "").trim(),
      liveUrl: String(formData.get("liveUrl") || "").trim(),
      notes: String(formData.get("notes") || "").trim(),
      createdAt: now,
      updatedAt: now,
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const project = getFormProject(form);
    const existingProject = projects.find((item) => item.id === project.id);

    if (!project.title) {
      window.CareerUtils.showToast?.("Project title is required", "error");
      return;
    }

    if (existingProject) {
      project.createdAt = existingProject.createdAt;
      projects = projects.map((item) => (item.id === project.id ? project : item));
      window.CareerUtils.showToast?.("Portfolio project saved");
    } else {
      projects = [project, ...projects];
      window.CareerUtils.showToast?.("Portfolio project added");
    }

    resetForm();
    persistAndRender();
  }

  function editProject(projectId) {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);
    const project = projects.find((item) => item.id === projectId);

    if (!form || !project) {
      return;
    }

    const fields = {
      portfolioId: project.id,
      title: project.title,
      type: project.type,
      status: project.status,
      description: project.description,
      techStack: stackToText(project.techStack),
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      notes: project.notes,
    };

    Object.entries(fields).forEach(([name, value]) => {
      const field = getFormElement(form, name);

      if (field) {
        field.value = value || "";
      }
    });

    if (submitButton) {
      submitButton.textContent = "Save project";
    }

    form.scrollIntoView?.({ behavior: "smooth", block: "center" });
  }

  function deleteProject(projectId) {
    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      return;
    }

    const confirmed = window.confirm(`Delete portfolio project "${project.title}"?`);

    if (!confirmed) {
      return;
    }

    projects = projects.filter((item) => item.id !== projectId);
    persistAndRender();
    window.CareerUtils.showToast?.("Portfolio project deleted");
  }

  function renderStack(techStack) {
    if (!Array.isArray(techStack) || !techStack.length) {
      return "";
    }

    return `
      <div class="portfolio-stack">
        ${techStack.map((item) => `<span>${window.CareerUtils.escapeHtml(item)}</span>`).join("")}
      </div>
    `;
  }

  function renderProjectLinks(project) {
    const links = [];

    if (project.githubUrl) {
      links.push(
        `<a class="button button-secondary button-small" href="${window.CareerUtils.escapeHtml(project.githubUrl)}" target="_blank" rel="noreferrer">GitHub</a>`,
      );
    }

    if (project.liveUrl) {
      links.push(
        `<a class="button button-secondary button-small" href="${window.CareerUtils.escapeHtml(project.liveUrl)}" target="_blank" rel="noreferrer">Live</a>`,
      );
    }

    return links.join("");
  }

  function renderProjects() {
    const list = document.querySelector(selectors.list);
    const filteredProjects = getFilteredProjects();

    if (!list) {
      return;
    }

    if (!filteredProjects.length) {
      list.innerHTML =
        '<p class="empty-state">No portfolio projects match the current search or filters.</p>';
      return;
    }

    list.innerHTML = filteredProjects
      .map(
        (project) => `
          <article class="portfolio-card">
            <div>
              <div class="portfolio-card-header">
                <h3>${window.CareerUtils.escapeHtml(project.title)}</h3>
                <span class="learning-status">${window.CareerUtils.escapeHtml(project.status)}</span>
              </div>
              <div class="portfolio-meta">
                <span>${window.CareerUtils.escapeHtml(project.type)}</span>
                <span>Updated: ${window.CareerUtils.formatRelativeDate(project.updatedAt)}</span>
              </div>
              <p>${window.CareerUtils.escapeHtml(project.description || "No description recorded.")}</p>
              ${renderStack(project.techStack)}
            </div>
            <div class="portfolio-card-actions">
              ${renderProjectLinks(project)}
              <button class="button button-secondary button-small" type="button" data-portfolio-edit="${window.CareerUtils.escapeHtml(project.id)}">Edit</button>
              <button class="button button-danger button-small" type="button" data-portfolio-delete="${window.CareerUtils.escapeHtml(project.id)}">Delete</button>
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
    const typeSelect = document.querySelector(selectors.typeFilter);
    const statusSelect = document.querySelector(selectors.statusFilter);
    const list = document.querySelector(selectors.list);

    form?.addEventListener("submit", handleSubmit);
    resetButton?.addEventListener("click", resetForm);

    searchInput?.addEventListener("input", (event) => {
      searchTerm = event.target.value;
      renderProjects();
    });

    typeSelect?.addEventListener("change", (event) => {
      typeFilter = event.target.value;
      renderProjects();
    });

    statusSelect?.addEventListener("change", (event) => {
      statusFilter = event.target.value;
      renderProjects();
    });

    list?.addEventListener("click", (event) => {
      const editButton = event.target.closest?.("[data-portfolio-edit]");
      const deleteButton = event.target.closest?.("[data-portfolio-delete]");

      if (editButton) {
        editProject(editButton.dataset.portfolioEdit);
      }

      if (deleteButton) {
        deleteProject(deleteButton.dataset.portfolioDelete);
      }
    });
  }

  function init() {
    projects = window.CareerStorage.readPortfolio();
    bindEvents();
    renderProjects();
    updateDashboard();
  }

  return {
    init,
  };
})();
