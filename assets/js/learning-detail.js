window.LearningDetail = (() => {
  let learning = [];
  let topic = null;
  let requestedId = "";

  const selectors = {
    workspaceForm: "[data-topic-workspace-form]",
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

  function formatDate(value) {
    if (!value) {
      return "Not recorded";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not recorded";
    }

    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function updateLastStudy() {
    topic.lastStudy = new Date().toISOString();
    topic.updatedAt = topic.lastStudy;
  }

  function saveTopic() {
    learning = learning.map((item) => (item.id === topic.id ? topic : item));
    window.CareerStorage.saveLearning(learning);
    renderTopic();
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

  function renderMissingTopic() {
    setText("[data-topic-title]", "Topic not found");
    setText("[data-topic-subtitle]", `No topic matched ${requestedId || "the URL"}`);
    setText("[data-topic-heading]", "Topic not found");
    setText("[data-topic-category]", "Return to Learning Manager and open a topic card.");
    setText("[data-topic-status]", "Missing");
  }

  function renderResources() {
    const list = document.querySelector(selectors.resourceList);

    if (!list) {
      return;
    }

    if (!topic.resources.length) {
      list.innerHTML = '<p class="empty-state">No resources added yet.</p>';
      return;
    }

    list.innerHTML = topic.resources
      .map((resource) => {
        const title = window.CareerUtils.escapeHtml(resource.title);
        const url = window.CareerUtils.escapeHtml(resource.url);
        const type = window.CareerUtils.escapeHtml(resource.type || "Other");
        const titleMarkup = resource.url
          ? `<a href="${url}" target="_blank" rel="noreferrer">${title}</a>`
          : title;

        return `
          <article class="workspace-item">
            <div>
              <h4>${titleMarkup}</h4>
              <p>${type}</p>
              ${resource.url ? `<small>${url}</small>` : ""}
            </div>
            <button class="button button-danger button-small" type="button" data-resource-delete="${window.CareerUtils.escapeHtml(resource.id)}">
              Delete
            </button>
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

    if (!topic.practice.length) {
      list.innerHTML = '<p class="empty-state">No practice items added yet.</p>';
      return;
    }

    list.innerHTML = topic.practice
      .map(
        (item) => `
          <article class="workspace-item ${item.completed ? "workspace-item-complete" : ""}">
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

    const progress = Math.min(100, Math.max(0, Number(topic.progress || 0)));
    const progressBar = document.querySelector("[data-topic-progress]");
    const workspaceForm = document.querySelector(selectors.workspaceForm);

    document.title = `${topic.title} | CareerOS`;
    setText("[data-topic-title]", topic.title);
    setText("[data-topic-subtitle]", `${topic.category} learning workspace`);
    setText("[data-topic-heading]", topic.title);
    setText("[data-topic-category]", topic.category);
    setText("[data-topic-status]", topic.status);
    setText("[data-topic-progress-label]", `${progress}%`);
    setText("[data-topic-last-study]", formatDate(topic.lastStudy));
    setText("[data-topic-next-step]", getNextStep());

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (workspaceForm) {
      workspaceForm.elements.currentFocus.value = topic.currentFocus || "";
      workspaceForm.elements.notes.value = topic.notes || "";
    }

    renderResources();
    renderPractice();
  }

  function handleWorkspaceSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    topic.currentFocus = form.elements.currentFocus.value.trim();
    topic.notes = form.elements.notes.value.trim();
    updateLastStudy();
    saveTopic();
  }

  function handleResourceSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    topic.resources = [
      {
        id: window.CareerUtils.createId("resource"),
        title: formData.get("title").trim(),
        url: formData.get("url").trim(),
        type: formData.get("type"),
      },
      ...topic.resources,
    ];
    updateLastStudy();
    form.reset();
    saveTopic();
  }

  function handlePracticeSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    topic.practice = [
      ...topic.practice,
      {
        id: window.CareerUtils.createId("practice"),
        title: formData.get("title").trim(),
        completed: false,
      },
    ];
    updateLastStudy();
    form.reset();
    saveTopic();
  }

  function deleteResource(resourceId) {
    topic.resources = topic.resources.filter((resource) => resource.id !== resourceId);
    updateLastStudy();
    saveTopic();
  }

  function deletePractice(practiceId) {
    topic.practice = topic.practice.filter((item) => item.id !== practiceId);
    updateLastStudy();
    saveTopic();
  }

  function togglePractice(practiceId) {
    topic.practice = topic.practice.map((item) =>
      item.id === practiceId ? { ...item, completed: !item.completed } : item,
    );
    updateLastStudy();
    saveTopic();
  }

  function bindEvents() {
    const workspaceForm = document.querySelector(selectors.workspaceForm);
    const resourceForm = document.querySelector(selectors.resourceForm);
    const practiceForm = document.querySelector(selectors.practiceForm);
    const resourceList = document.querySelector(selectors.resourceList);
    const practiceList = document.querySelector(selectors.practiceList);

    workspaceForm?.addEventListener("submit", handleWorkspaceSubmit);
    resourceForm?.addEventListener("submit", handleResourceSubmit);
    practiceForm?.addEventListener("submit", handlePracticeSubmit);

    resourceList?.addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-resource-delete]");

      if (deleteButton) {
        deleteResource(deleteButton.dataset.resourceDelete);
      }
    });

    practiceList?.addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-practice-delete]");

      if (deleteButton) {
        deletePractice(deleteButton.dataset.practiceDelete);
      }
    });

    practiceList?.addEventListener("change", (event) => {
      const toggle = event.target.closest("[data-practice-toggle]");

      if (toggle) {
        togglePractice(toggle.dataset.practiceToggle);
      }
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
