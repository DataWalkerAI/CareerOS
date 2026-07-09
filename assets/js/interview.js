window.InterviewManager = (() => {
  let questions = [];
  let searchTerm = "";
  let categoryFilter = "All";
  let statusFilter = "All";
  let sortMode = "updated-desc";
  let activeReviewId = "";
  let answerVisible = false;

  const selectors = {
    form: "[data-interview-form]",
    submit: "[data-interview-submit]",
    reset: "[data-interview-reset]",
    search: "[data-interview-search]",
    categoryFilter: "[data-interview-category-filter]",
    statusFilter: "[data-interview-status-filter]",
    sort: "[data-interview-sort]",
    list: "[data-interview-list]",
    reviewCard: "[data-review-card]",
  };

  function tagsToText(tags) {
    return Array.isArray(tags) ? tags.join(", ") : "";
  }

  function tagsFromText(value) {
    return String(value || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function getQuestionUrl(question) {
    return `Interview/question.html?id=${encodeURIComponent(question.id)}`;
  }

  function getFilteredQuestions() {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return questions
      .filter((item) => {
        const searchable = [
          item.question,
          item.category,
          item.difficulty,
          item.answer,
          item.personalAnswer,
          item.notes,
          item.source,
          tagsToText(item.tags),
        ]
          .join(" ")
          .toLowerCase();
        const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
        const matchesStatus = statusFilter === "All" || item.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortMode === "question-asc") {
          return a.question.localeCompare(b.question);
        }

        if (sortMode === "difficulty-asc") {
          const order = { Easy: 1, Medium: 2, Hard: 3 };
          return (order[a.difficulty] || 99) - (order[b.difficulty] || 99);
        }

        if (sortMode === "reviewed-asc") {
          return String(a.lastReviewed || "").localeCompare(String(b.lastReviewed || ""));
        }

        return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
      });
  }

  function persistAndRender() {
    window.CareerStorage.saveInterview(questions);
    renderQuestions();
    renderReview();
    window.CareerDashboard.update({ interview: questions });
  }

  function resetForm() {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);

    form.reset();
    form.elements.interviewId.value = "";
    submitButton.textContent = "Add question";
  }

  function getFormQuestion(form) {
    const formData = new FormData(form);
    const now = new Date().toISOString();

    return {
      id: formData.get("interviewId") || window.CareerUtils.createId("interview"),
      question: formData.get("question").trim(),
      category: formData.get("category"),
      difficulty: formData.get("difficulty"),
      answer: formData.get("answer").trim(),
      personalAnswer: formData.get("personalAnswer").trim(),
      notes: formData.get("notes").trim(),
      tags: tagsFromText(formData.get("tags")),
      status: formData.get("status"),
      source: formData.get("source").trim(),
      lastReviewed: "",
      createdAt: now,
      updatedAt: now,
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const question = getFormQuestion(form);
    const existingQuestion = questions.find((item) => item.id === question.id);

    if (!question.question) {
      return;
    }

    if (existingQuestion) {
      question.createdAt = existingQuestion.createdAt;
      question.lastReviewed = existingQuestion.lastReviewed;
      questions = questions.map((item) => (item.id === question.id ? question : item));
      window.CareerUtils.showToast?.("Interview question saved");
    } else {
      questions = [question, ...questions];
      window.CareerUtils.showToast?.("Interview question added");
    }

    resetForm();
    persistAndRender();
  }

  function editQuestion(questionId) {
    const form = document.querySelector(selectors.form);
    const submitButton = document.querySelector(selectors.submit);
    const question = questions.find((item) => item.id === questionId);

    if (!question) {
      return;
    }

    form.elements.interviewId.value = question.id;
    form.elements.question.value = question.question;
    form.elements.category.value = question.category;
    form.elements.difficulty.value = question.difficulty;
    form.elements.answer.value = question.answer;
    form.elements.personalAnswer.value = question.personalAnswer;
    form.elements.notes.value = question.notes;
    form.elements.tags.value = tagsToText(question.tags);
    form.elements.status.value = question.status;
    form.elements.source.value = question.source;
    submitButton.textContent = "Save question";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function deleteQuestion(questionId) {
    const question = questions.find((item) => item.id === questionId);

    if (!question) {
      return;
    }

    const confirmed = window.confirm(`Delete interview question "${question.question}"?`);

    if (!confirmed) {
      return;
    }

    questions = questions.filter((item) => item.id !== questionId);

    if (activeReviewId === questionId) {
      activeReviewId = "";
    }

    persistAndRender();
    window.CareerUtils.showToast?.("Interview question deleted");
  }

  function updateQuestionStatus(questionId, status) {
    const now = new Date().toISOString();

    questions = questions.map((item) =>
      item.id === questionId
        ? { ...item, status, lastReviewed: now, updatedAt: now }
        : item,
    );
    persistAndRender();
    window.CareerUtils.showToast?.(`Marked ${status}`);
  }

  function pickRandomQuestion() {
    const reviewPool =
      getFilteredQuestions().filter((item) => item.status !== "Mastered") || questions;
    const pool = reviewPool.length ? reviewPool : questions;

    if (!pool.length) {
      activeReviewId = "";
      answerVisible = false;
      renderReview();
      return;
    }

    activeReviewId = pool[Math.floor(Math.random() * pool.length)].id;
    answerVisible = false;
    renderReview();
  }

  function renderTags(tags) {
    if (!tags.length) {
      return "";
    }

    return `
      <div class="interview-tags">
        ${tags.map((tag) => `<span>${window.CareerUtils.escapeHtml(tag)}</span>`).join("")}
      </div>
    `;
  }

  function renderQuestions() {
    const list = document.querySelector(selectors.list);
    const filteredQuestions = getFilteredQuestions();

    if (!list) {
      return;
    }

    if (!filteredQuestions.length) {
      list.innerHTML =
        '<p class="empty-state">No interview questions match the current search or filters.</p>';
      return;
    }

    list.innerHTML = filteredQuestions
      .map(
        (item) => `
          <article class="interview-card">
            <div>
              <div class="interview-card-header">
                <h3>${window.CareerUtils.escapeHtml(item.question)}</h3>
                <span class="learning-status">${window.CareerUtils.escapeHtml(item.status)}</span>
              </div>
              <div class="interview-meta">
                <span>${window.CareerUtils.escapeHtml(item.category)}</span>
                <span>${window.CareerUtils.escapeHtml(item.difficulty)}</span>
                <span>Reviewed: ${window.CareerUtils.formatRelativeDate(item.lastReviewed)}</span>
              </div>
              ${renderTags(item.tags)}
            </div>
            <div class="interview-card-actions">
              <a class="button button-small" href="${window.CareerUtils.escapeHtml(getQuestionUrl(item))}">Open</a>
              <button class="button button-secondary button-small" type="button" data-interview-edit="${window.CareerUtils.escapeHtml(item.id)}">Edit</button>
              <button class="button button-danger button-small" type="button" data-interview-delete="${window.CareerUtils.escapeHtml(item.id)}">Delete</button>
            </div>
          </article>
        `,
      )
      .join("");
  }

  function renderReview() {
    const reviewCard = document.querySelector(selectors.reviewCard);
    const question = questions.find((item) => item.id === activeReviewId);

    if (!reviewCard) {
      return;
    }

    if (!question) {
      reviewCard.innerHTML = `
        <p class="empty-state">No review question selected.</p>
        <button class="button" type="button" data-review-random>Random question</button>
      `;
      return;
    }

    reviewCard.innerHTML = `
      <div class="review-question">
        <div class="interview-card-header">
          <h3>${window.CareerUtils.escapeHtml(question.question)}</h3>
          <span class="learning-status">${window.CareerUtils.escapeHtml(question.status)}</span>
        </div>
        <div class="interview-meta">
          <span>${window.CareerUtils.escapeHtml(question.category)}</span>
          <span>${window.CareerUtils.escapeHtml(question.difficulty)}</span>
          <span>${window.CareerUtils.escapeHtml(question.source || "No source")}</span>
        </div>
        ${
          answerVisible
            ? `<div class="review-answer">
                <h4>Model answer</h4>
                <p>${window.CareerUtils.escapeHtml(question.answer || "No answer recorded.")}</p>
                <h4>Personal answer</h4>
                <p>${window.CareerUtils.escapeHtml(question.personalAnswer || "No personal answer recorded.")}</p>
              </div>`
            : ""
        }
        <div class="form-actions">
          <button class="button button-secondary" type="button" data-review-random>Random question</button>
          <button class="button" type="button" data-review-answer>${answerVisible ? "Hide answer" : "Show answer"}</button>
          <button class="button button-secondary" type="button" data-review-mastered="${window.CareerUtils.escapeHtml(question.id)}">Mark as Mastered</button>
          <button class="button button-danger" type="button" data-review-practice="${window.CareerUtils.escapeHtml(question.id)}">Mark Need Practice</button>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    const form = document.querySelector(selectors.form);
    const resetButton = document.querySelector(selectors.reset);
    const searchInput = document.querySelector(selectors.search);
    const categorySelect = document.querySelector(selectors.categoryFilter);
    const statusSelect = document.querySelector(selectors.statusFilter);
    const sortSelect = document.querySelector(selectors.sort);
    const list = document.querySelector(selectors.list);
    const reviewCard = document.querySelector(selectors.reviewCard);

    form.addEventListener("submit", handleSubmit);
    resetButton.addEventListener("click", resetForm);

    searchInput.addEventListener("input", (event) => {
      searchTerm = event.target.value;
      renderQuestions();
    });

    categorySelect.addEventListener("change", (event) => {
      categoryFilter = event.target.value;
      renderQuestions();
    });

    statusSelect.addEventListener("change", (event) => {
      statusFilter = event.target.value;
      renderQuestions();
    });

    sortSelect.addEventListener("change", (event) => {
      sortMode = event.target.value;
      renderQuestions();
    });

    list.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-interview-edit]");
      const deleteButton = event.target.closest("[data-interview-delete]");

      if (editButton) {
        editQuestion(editButton.dataset.interviewEdit);
      }

      if (deleteButton) {
        deleteQuestion(deleteButton.dataset.interviewDelete);
      }
    });

    reviewCard.addEventListener("click", (event) => {
      const randomButton = event.target.closest("[data-review-random]");
      const answerButton = event.target.closest("[data-review-answer]");
      const masteredButton = event.target.closest("[data-review-mastered]");
      const practiceButton = event.target.closest("[data-review-practice]");

      if (randomButton) {
        pickRandomQuestion();
      }

      if (answerButton) {
        answerVisible = !answerVisible;
        renderReview();
      }

      if (masteredButton) {
        updateQuestionStatus(masteredButton.dataset.reviewMastered, "Mastered");
      }

      if (practiceButton) {
        updateQuestionStatus(practiceButton.dataset.reviewPractice, "Need Practice");
      }
    });
  }

  function init() {
    const form = document.querySelector(selectors.form);
    const params = new URLSearchParams(window.location.search);

    if (!form) {
      return;
    }

    questions = window.CareerStorage.readInterview();
    searchTerm = params.get("topic") || "";
    activeReviewId = questions.find((item) => item.status !== "Mastered")?.id || questions[0]?.id || "";
    bindEvents();
    const searchInput = document.querySelector(selectors.search);

    if (searchInput && searchTerm) {
      searchInput.value = searchTerm;
    }

    renderQuestions();
    renderReview();
    window.CareerDashboard.update({ interview: questions });
  }

  return {
    init,
  };
})();
