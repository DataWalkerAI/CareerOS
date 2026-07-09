window.TasksManager = (() => {
  let tasks = [];
  let searchTerm = "";
  let taskFilter = "All";

  const selectors = {
    form: "[data-task-form]",
    submit: "[data-task-submit]",
    reset: "[data-task-reset]",
    search: "[data-task-search]",
    filter: "[data-task-filter]",
    list: "[data-tasks-list]",
  };

  function createId() {
    return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatNotes(value) {
    return value ? escapeHtml(value) : "No notes";
  }

  function formatDueDate(value) {
    return value ? escapeHtml(value) : "No due date";
  }

  function getFilteredTasks() {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.notes.toLowerCase().includes(normalizedSearch);
      const matchesFilter =
        taskFilter === "All" ||
        (taskFilter === "Open" && !task.completed) ||
        (taskFilter === "Completed" && task.completed) ||
        task.priority === taskFilter;

      return matchesSearch && matchesFilter;
    });
  }

  function persistAndRender() {
    window.CareerStorage.saveTasks(tasks);
    renderTasks();
    window.CareerDashboard.update({ tasks });
  }

  function resetForm() {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);

    form.reset();
    form.elements.taskId.value = "";
    submitButton.textContent = "Add task";
  }

  function getFormTask(form) {
    const formData = new FormData(form);
    const now = new Date().toISOString();

    return {
      id: formData.get("taskId") || createId(),
      title: formData.get("title").trim(),
      notes: formData.get("notes").trim(),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate"),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const task = getFormTask(form);
    const existingTask = tasks.find((item) => item.id === task.id);

    if (existingTask) {
      task.createdAt = existingTask.createdAt;
      task.completed = existingTask.completed;
      tasks = tasks.map((item) => (item.id === task.id ? task : item));
    } else {
      tasks = [task, ...tasks];
    }

    resetForm();
    persistAndRender();
  }

  function editTask(taskId) {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);
    const task = tasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    form.elements.taskId.value = task.id;
    form.elements.title.value = task.title;
    form.elements.notes.value = task.notes;
    form.elements.priority.value = task.priority;
    form.elements.dueDate.value = task.dueDate;
    submitButton.textContent = "Save task";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function deleteTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    const confirmed = window.confirm(`Delete task "${task.title}"?`);

    if (!confirmed) {
      return;
    }

    tasks = tasks.filter((item) => item.id !== taskId);
    persistAndRender();
  }

  function toggleTask(taskId) {
    const now = new Date().toISOString();

    tasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed, updatedAt: now }
        : task,
    );
    persistAndRender();
  }

  function renderTasks() {
    const list = document.querySelector(selectors.list);
    const filteredTasks = getFilteredTasks();

    if (!filteredTasks.length) {
      list.innerHTML =
        '<p class="empty-state">No tasks match the current search or filter.</p>';
      return;
    }

    list.innerHTML = filteredTasks
      .map(
        (task) => `
          <article class="task-card ${task.completed ? "task-card-complete" : ""}" aria-labelledby="title-${escapeHtml(task.id)}">
            <div class="task-card-main">
              <input
                id="complete-${escapeHtml(task.id)}"
                type="checkbox"
                aria-label="Mark ${escapeHtml(task.title)} as ${task.completed ? "open" : "completed"}"
                ${task.completed ? "checked" : ""}
                data-task-toggle="${escapeHtml(task.id)}"
              />
              <div>
                <h3 id="title-${escapeHtml(task.id)}">${escapeHtml(task.title)}</h3>
                <p>${formatNotes(task.notes)}</p>
                <div class="task-meta">
                  <span>${task.completed ? "Completed" : "Open"}</span>
                  <span>Priority: ${escapeHtml(task.priority)}</span>
                  <span>Due: ${formatDueDate(task.dueDate)}</span>
                </div>
              </div>
            </div>
            <div class="task-card-actions">
              <button class="button button-secondary button-small" type="button" data-task-edit="${escapeHtml(task.id)}">
                Edit
              </button>
              <button class="button button-danger button-small" type="button" data-task-delete="${escapeHtml(task.id)}">
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
      renderTasks();
    });

    filterSelect.addEventListener("change", (event) => {
      taskFilter = event.target.value;
      renderTasks();
    });

    list.addEventListener("change", (event) => {
      const toggle = event.target.closest("[data-task-toggle]");

      if (toggle) {
        toggleTask(toggle.dataset.taskToggle);
      }
    });

    list.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-task-edit]");
      const deleteButton = event.target.closest("[data-task-delete]");

      if (editButton) {
        editTask(editButton.dataset.taskEdit);
      }

      if (deleteButton) {
        deleteTask(deleteButton.dataset.taskDelete);
      }
    });
  }

  function init() {
    const form = document.querySelector(selectors.form);

    if (!form) {
      return;
    }

    tasks = window.CareerStorage.readTasks();
    bindEvents();
    renderTasks();
    window.CareerDashboard.update({ tasks });
  }

  return {
    init,
  };
})();
