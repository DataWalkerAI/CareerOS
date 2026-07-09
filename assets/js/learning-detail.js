window.LearningDetail = (() => {
  let learning = [];
  let topic = null;
  let requestedId = "";
  let autosaveTimer = null;
  let autosaveStatusTimer = null;

  const selectors = {
    workspaceForm: "[data-topic-workspace-form]",
    autosaveStatus: "[data-autosave-status]",
    resourceForm: "[data-resource-form]",
    practiceForm: "[data-practice-form]",
    resourceList: "[data-resource-list]",
    practiceList: "[data-practice-list]",
  };

  function normalizeId(value) {
    return window.CareerUtils.createSlug(String(value || "").replace(/^learning-/, ""), "topic");
  }

  function findTopic(topics, id) {
    const normalizedId = normalizeId(id);

    return topics.find((item) => {
      return (
        item.id === id ||
        normalizeId(item.id) === normalizedId ||
        window.CareerUtils.createSlug(item.title, "topic") === normalizedId
      );
    });
  }

  function updateLastStudy() {
    topic.lastStudy = new Date().toISOString();
    topic.updatedAt = topic.lastStudy;
  }

  function saveTopic({ rerender = true, showSaving = false } = {}) {
    if (showSaving) {
      setAutosaveStatus("Saving...", true);
    }

    learning = learning.map((item) => (item.id === topic.id ? topic : item));
    window.CareerStorage.saveLearning(learning);

    if (rerender) {
      renderTopic();
    } else {
      renderSummary();
    }
  }

  function showToast(message, type = "success") {
    window.CareerUtils.showToast?.(message, type);
  }

  function getNextStep() {
    const nextPractice = topic.practice.find((item) => !item.completed);

    return nextPractice?.title || topic.currentFocus || topic.nextStep || "No next step recorded.";
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
      element.textContent = value;
    }
  }

  function setAutosaveStatus(message, isVisible = false) {
    const status = document.querySelector(selectors.autosaveStatus);

    if (!status) {
      return;
    }

    status.textContent = message;
    status.classList.toggle("autosave-status-visible", isVisible);

    if (message) {
      status.classList.remove("autosave-status-soft");
    }
  }

  function showSavedIndicator() {
    window.clearTimeout(autosaveStatusTimer);
    setAutosaveStatus("Saved \u2713", true);

    autosaveStatusTimer = window.setTimeout(() => {
      const status = document.querySelector(selectors.autosaveStatus);

      status?.classList.add("autosave-status-soft");

      window.setTimeout(() => {
        setAutosaveStatus("", false);
        status?.classList.remove("autosave-status-soft");
      }, 220);
    }, 2000);
  }

  function getResourceDisplayUrl(url) {
    const value = String(url || "").trim();

    if (!value) {
      return "No URL";
    }

    try {
      if (/^https?:\/\//i.test(value)) {
        return new URL(value).hostname.replace(/^www\./, "");
      }
    } catch (error) {
      return value;
    }

    return value.replace(/^\.?\//, "");
  }

  function animateThenRemove(target, callback) {
    if (!target) {
      callback();
      return;
    }

    target.classList.add("workspace-card-removing");
    window.setTimeout(callback, 180);
  }

  function renderMissingTopic() {
    setText("[data-topic-title]", "Topic not found");
    setText("[data-topic-subtitle]", `No topic matched ${requestedId || "the URL"}`);
    setText("[data-topic-heading]", "Topic not found");
    setText("[data-topic-category]", "Return to Learning Manager and open a topic card.");
    setText("[data-topic-status]", "Missing");
  }

  function renderSummary() {
    const progress = Math.min(100, Math.max(0, Number(topic.progress || 0)));
    const progressBar = document.querySelector("[data-topic-progress]");

    setText("[data-topic-progress-label]", `${progress}%`);
    setText("[data-topic-last-study]", window.CareerUtils.formatRelativeDate(topic.lastStudy));
    setText("[data-topic-next-step]", getNextStep());

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  function renderPracticeProgress() {
    const total = topic.practice.length;
    const completed = topic.practice.filter((item) => item.completed).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const progressBar = document.querySelector("[data-practice-progress]");

    setText("[data-practice-progress-label]", `${completed} / ${total} completed`);

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
  }

  function renderResources() {
    const list = document.querySelector(selectors.resourceList);

    if (!list) {
      return;
    }

    if (!topic.resources.length) {
      list.innerHTML = '<p class="empty-state">No resources yet.</p>';
      return;
    }

    list.innerHTML = topic.resources
      .map((resource) => {
        const title = window.CareerUtils.escapeHtml(resource.title);
        const url = window.CareerUtils.escapeHtml(resource.url);
        const displayUrl = window.CareerUtils.escapeHtml(getResourceDisplayUrl(resource.url));
        const type = window.CareerUtils.escapeHtml(resource.type || "Other");
        const id = window.CareerUtils.escapeHtml(resource.id);

        return `
          <article class="resource-card" data-resource-card="${id}">
            <div class="resource-card-header">
              <span class="resource-type">${type}</span>
              <button class="button button-danger button-small" type="button" data-resource-delete="${id}">
                Delete
              </button>
            </div>
            <h4>${title}</h4>
            <p class="resource-url">${displayUrl}</p>
            <div class="resource-card-actions">
              ${
                resource.url
                  ? `<a class="button button-secondary button-small" href="${url}" target="_blank" rel="noreferrer">Open</a>`
                  : ""
              }
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderPractice() {
    const list = document.querySelector(selectors.practiceList);

    if (!list) {
      return;
    }

    renderPracticeProgress();

    if (!topic.practice.length) {
      list.innerHTML = '<p class="empty-state">No practice items yet.</p>';
      return;
    }

    list.innerHTML = topic.practice
      .map(
        (item) => `
          <article class="workspace-item ${item.completed ? "workspace-item-complete" : ""}" data-practice-card="${window.CareerUtils.escapeHtml(item.id)}">
            <label class="workspace-check">
              <input
                type="checkbox"
                ${item.completed ? "checked" : ""}
                data-practice-toggle="${window.CareerUtils.escapeHtml(item.id)}"
              />
              <span>${window.CareerUtils.escapeHtml(item.title)}</span>
            </label>
            <button class="button button-danger button-small" type="button" data-practice-delete="${window.CareerUtils.escapeHtml(item.id)}">
              Delete
            </button>
          </article>
        `,
      )
      .join("");
  }

  function renderTopic() {
    if (!topic) {
      renderMissingTopic();
      return;
    }

    const workspaceForm = document.querySelector(selectors.workspaceForm);

    document.title = `${topic.title} | CareerOS`;
    setText("[data-topic-title]", topic.title);
    setText("[data-topic-subtitle]", `${topic.category} learning workspace`);
    setText("[data-topic-heading]", topic.title);
    setText("[data-topic-category]", topic.category);
    setText("[data-topic-status]", topic.status);
    renderSummary();

    if (workspaceForm) {
      workspaceForm.elements.currentFocus.value = topic.currentFocus || "";
      workspaceForm.elements.notes.value = topic.notes || "";
    }

    renderResources();
    renderPractice();
  }

  function syncWorkspaceFromForm(form) {
    topic.currentFocus = form.elements.currentFocus.value.trim();
    topic.notes = form.elements.notes.value.trim();
  }

  function saveWorkspace(form, { toastMessage = "" } = {}) {
    syncWorkspaceFromForm(form);
    updateLastStudy();
    saveTopic({ rerender: false, showSaving: true });
    showSavedIndicator();

    if (toastMessage) {
      showToast(toastMessage);
    }
  }

  function scheduleWorkspaceSave(event) {
    const form = event.currentTarget;

    window.clearTimeout(autosaveTimer);
    setAutosaveStatus("Saving...", true);

    autosaveTimer = window.setTimeout(() => {
      saveWorkspace(form);
    }, 500);
  }

  function saveWorkspaceImmediately(form, toastMessage = "Workspace saved") {
    window.clearTimeout(autosaveTimer);
    saveWorkspace(form, { toastMessage });
  }

  function handleWorkspaceSubmit(event) {
    event.preventDefault();
    saveWorkspaceImmediately(event.currentTarget);
  }

  function handleResourceSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title").trim();

    if (!title) {
      return;
    }

    topic.resources = [
      {
        id: window.CareerUtils.createId("resource"),
        title,
        url: formData.get("url").trim(),
        type: formData.get("type") || "Other",
      },
      ...topic.resources,
    ];
    updateLastStudy();
    form.reset();
    saveTopic({ showSaving: true });
    showSavedIndicator();
    showToast("Resource added");
  }

  function handlePracticeSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title").trim();

    if (!title) {
      return;
    }

    topic.practice = [
      ...topic.practice,
      {
        id: window.CareerUtils.createId("practice"),
        title,
        completed: false,
      },
    ];
    updateLastStudy();
    form.reset();
    saveTopic({ showSaving: true });
    showSavedIndicator();
    showToast("Practice item added");
  }

  function deleteResource(resourceId) {
    topic.resources = topic.resources.filter((resource) => resource.id !== resourceId);
    updateLastStudy();
    saveTopic({ showSaving: true });
    showSavedIndicator();
    showToast("Resource deleted");
  }

  function deletePractice(practiceId) {
    topic.practice = topic.practice.filter((item) => item.id !== practiceId);
    updateLastStudy();
    saveTopic({ showSaving: true });
    showSavedIndicator();
    showToast("Practice item deleted");
  }

  function togglePractice(practiceId) {
    const practiceItem = topic.practice.find((item) => item.id === practiceId);

    topic.practice = topic.practice.map((item) =>
      item.id === practiceId ? { ...item, completed: !item.completed } : item,
    );
    updateLastStudy();
    saveTopic({ showSaving: true });
    showSavedIndicator();

    if (practiceItem && !practiceItem.completed) {
      showToast("Practice item completed");
    }
  }

  function bindEvents() {
    const workspaceForm = document.querySelector(selectors.workspaceForm);
    const resourceForm = document.querySelector(selectors.resourceForm);
    const practiceForm = document.querySelector(selectors.practiceForm);
    const resourceList = document.querySelector(selectors.resourceList);
    const practiceList = document.querySelector(selectors.practiceList);

    workspaceForm?.addEventListener("submit", handleWorkspaceSubmit);
    workspaceForm?.addEventListener("input", scheduleWorkspaceSave);
    resourceForm?.addEventListener("submit", handleResourceSubmit);
    practiceForm?.addEventListener("submit", handlePracticeSubmit);

    resourceList?.addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-resource-delete]");

      if (deleteButton) {
        const card = deleteButton.closest("[data-resource-card]");
        animateThenRemove(card, () => deleteResource(deleteButton.dataset.resourceDelete));
      }
    });

    practiceList?.addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-practice-delete]");

      if (deleteButton) {
        const card = deleteButton.closest("[data-practice-card]");
        animateThenRemove(card, () => deletePractice(deleteButton.dataset.practiceDelete));
      }
    });

    practiceList?.addEventListener("change", (event) => {
      const toggle = event.target.closest("[data-practice-toggle]");

      if (toggle) {
        togglePractice(toggle.dataset.practiceToggle);
      }
    });

    document.addEventListener("keydown", (event) => {
      const isSaveShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s";

      if (!isSaveShortcut || !workspaceForm) {
        return;
      }

      event.preventDefault();
      saveWorkspaceImmediately(workspaceForm, "Saved \u2713");
    });
  }

  function init() {
    const params = new URLSearchParams(window.location.search);
    requestedId = params.get("id") || "";
    learning = window.CareerStorage.readLearning();
    topic = findTopic(learning, requestedId);

    bindEvents();
    renderTopic();
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.LearningDetail.init();
});
