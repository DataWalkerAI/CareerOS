window.LearningManager = (() => {
  let learning = [];
  let searchTerm = "";
  let categoryFilter = "All";
  let statusFilter = "All";

  const selectors = {
    form: "[data-learning-form]",
    submit: "[data-learning-submit]",
    reset: "[data-learning-reset]",
    search: "[data-learning-search]",
    categoryFilter: "[data-learning-category-filter]",
    statusFilter: "[data-learning-status-filter]",
    list: "[data-learning-list]",
  };

  function createTopicId(title) {
    const slug = window.CareerUtils.createSlug(title, "topic");
    const idExists = learning.some((topic) => topic.id === slug);

    return idExists ? window.CareerUtils.createId(slug) : slug;
  }

  function getTopicUrl(topic) {
    return `Learning/topic.html?id=${encodeURIComponent(topic.id)}`;
  }

  function resourcesToText(resources) {
    if (Array.isArray(resources)) {
      return resources
        .map((resource) => resource.url || resource.title || "")
        .filter(Boolean)
        .join("\n");
    }

    return resources || "";
  }

  function resourcesFromText(value) {
    return String(value || "")
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

  function normalizeProgress(value, status) {
    if (status === "Completed") {
      return 100;
    }

    const progress = Number(value);

    if (Number.isNaN(progress)) {
      return 0;
    }

    return Math.min(100, Math.max(0, Math.round(progress)));
  }

  function getFilteredLearning() {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return learning.filter((topic) => {
      const matchesSearch =
        !normalizedSearch || topic.title.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        categoryFilter === "All" || topic.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || topic.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  function persistAndRender() {
    window.CareerStorage.saveLearning(learning);
    renderLearning();
    window.CareerDashboard.update({ learning });
  }

  function resetForm() {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);

    form.reset();
    form.elements.learningId.value = "";
    form.elements.progress.value = "0";
    submitButton.textContent = "Add topic";
  }

  function getFormTopic(form) {
    const formData = new FormData(form);
    const now = new Date().toISOString();
    const status = formData.get("status");

    return {
      id: formData.get("learningId") || createTopicId(formData.get("title")),
      title: formData.get("title").trim(),
      category: formData.get("category"),
      status,
      progress: normalizeProgress(formData.get("progress"), status),
      notes: formData.get("notes").trim(),
      resources: resourcesFromText(formData.get("resources")),
      nextStep: formData.get("nextStep").trim(),
      createdAt: now,
      updatedAt: now,
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const topic = getFormTopic(form);
    const existingTopic = learning.find((item) => item.id === topic.id);

    if (existingTopic) {
      topic.createdAt = existingTopic.createdAt;
      topic.currentFocus = existingTopic.currentFocus || topic.nextStep;
      topic.lastStudy = existingTopic.lastStudy || "";
      topic.practice = existingTopic.practice || [];
      learning = learning.map((item) => (item.id === topic.id ? topic : item));
    } else {
      learning = [topic, ...learning];
    }

    resetForm();
    persistAndRender();
  }

  function editTopic(topicId) {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);
    const topic = learning.find((item) => item.id === topicId);

    if (!topic) {
      return;
    }

    form.elements.learningId.value = topic.id;
    form.elements.title.value = topic.title;
    form.elements.category.value = topic.category;
    form.elements.status.value = topic.status;
    form.elements.progress.value = topic.progress;
    form.elements.notes.value = topic.notes || "";
    form.elements.resources.value = resourcesToText(topic.resources);
    form.elements.nextStep.value = topic.nextStep || "";
    submitButton.textContent = "Save topic";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function deleteTopic(topicId) {
    const topic = learning.find((item) => item.id === topicId);

    if (!topic) {
      return;
    }

    const confirmed = window.confirm(`Delete topic "${topic.title}"?`);

    if (!confirmed) {
      return;
    }

    learning = learning.filter((item) => item.id !== topicId);
    persistAndRender();
  }

  function renderLearning() {
    const list = document.querySelector(selectors.list);
    const filteredLearning = getFilteredLearning();

    if (!filteredLearning.length) {
      list.innerHTML =
        '<p class="empty-state">No learning topics match the current search or filters.</p>';
      return;
    }

    list.innerHTML = filteredLearning
      .map(
        (topic) => `
          <article class="learning-card" aria-labelledby="title-${window.CareerUtils.escapeHtml(topic.id)}">
            <div>
              <div class="learning-card-header">
                <h3 id="title-${window.CareerUtils.escapeHtml(topic.id)}">${window.CareerUtils.escapeHtml(topic.title)}</h3>
                <span class="learning-status">${window.CareerUtils.escapeHtml(topic.status)}</span>
              </div>
              <div class="progress-title">
                <span>${window.CareerUtils.escapeHtml(topic.category)}</span>
                <span>${window.CareerUtils.escapeHtml(topic.progress)}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: ${window.CareerUtils.escapeHtml(topic.progress)}%"></div>
              </div>
            </div>
            <div class="learning-card-actions">
              <a class="button button-small" href="${window.CareerUtils.escapeHtml(getTopicUrl(topic))}">
                Open
              </a>
              <button class="button button-secondary button-small" type="button" data-learning-edit="${window.CareerUtils.escapeHtml(topic.id)}">
                Edit
              </button>
              <button class="button button-danger button-small" type="button" data-learning-delete="${window.CareerUtils.escapeHtml(topic.id)}">
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
    const categorySelect = document.querySelector(selectors.categoryFilter);
    const statusSelect = document.querySelector(selectors.statusFilter);
    const list = document.querySelector(selectors.list);

    form.addEventListener("submit", handleSubmit);
    resetButton.addEventListener("click", resetForm);

    searchInput.addEventListener("input", (event) => {
      searchTerm = event.target.value;
      renderLearning();
    });

    categorySelect.addEventListener("change", (event) => {
      categoryFilter = event.target.value;
      renderLearning();
    });

    statusSelect.addEventListener("change", (event) => {
      statusFilter = event.target.value;
      renderLearning();
    });

    list.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-learning-edit]");
      const deleteButton = event.target.closest("[data-learning-delete]");

      if (editButton) {
        editTopic(editButton.dataset.learningEdit);
      }

      if (deleteButton) {
        deleteTopic(deleteButton.dataset.learningDelete);
      }
    });
  }

  function init() {
    const form = document.querySelector(selectors.form);

    if (!form) {
      return;
    }

    learning = window.CareerStorage.readLearning();
    bindEvents();
    renderLearning();
    window.CareerDashboard.update({ learning });
  }

  return {
    init,
  };
})();
