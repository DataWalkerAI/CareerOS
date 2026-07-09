window.InterviewDetail = (() => {
  let questions = [];
  let question = null;
  let requestedId = "";
  let answerVisible = true;

  const selectors = {
    form: "[data-interview-detail-form]",
    answerPanel: "[data-question-answer-panel]",
  };

  function setText(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
      element.textContent = value;
    }
  }

  function setFieldValue(form, name, value) {
    const field = form?.elements?.[name];

    if (field) {
      field.value = value || "";
    }
  }

  function tagsToText(tags) {
    return Array.isArray(tags) ? tags.join(", ") : "";
  }

  function tagsFromText(value) {
    return String(value || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function saveQuestion() {
    if (!question) {
      return;
    }

    questions = questions.map((item) => (item.id === question.id ? question : item));
    window.CareerStorage.saveInterview(questions);
  }

  function renderMissingQuestion() {
    setText("[data-question-title]", "Question not found");
    setText("[data-question-subtitle]", `No interview question matched ${requestedId || "the URL"}`);
    setText("[data-question-heading]", "Question not found");
    setText("[data-question-status]", "Missing");
    setText("[data-question-category]", "Category");
    setText("[data-question-difficulty]", "Difficulty");
    setText("[data-question-reviewed]", "Not recorded");
    setText("[data-question-source]", "No source recorded");

    const panel = document.querySelector(selectors.answerPanel);

    if (panel) {
      panel.innerHTML = '<p class="empty-state">Open Interview Center and choose a question.</p>';
    }
  }

  function renderAnswerPanel() {
    const panel = document.querySelector(selectors.answerPanel);

    if (!panel || !question) {
      return;
    }

    panel.innerHTML = answerVisible
      ? `
          <div class="review-answer">
            <h4>Model answer</h4>
            <p>${window.CareerUtils.escapeHtml(question.answer || "No answer recorded.")}</p>
            <h4>Personal answer</h4>
            <p>${window.CareerUtils.escapeHtml(question.personalAnswer || "No personal answer recorded.")}</p>
            <h4>Notes</h4>
            <p>${window.CareerUtils.escapeHtml(question.notes || "No notes recorded.")}</p>
          </div>
        `
      : '<p class="empty-state">Answer hidden.</p>';
  }

  function renderQuestion() {
    const form = document.querySelector(selectors.form);

    if (!question) {
      renderMissingQuestion();
      return;
    }

    document.title = `${question.question || "Interview Question"} | CareerOS`;
    setText("[data-question-title]", "Interview Question");
    setText("[data-question-subtitle]", `${question.category || "General"} interview preparation`);
    setText("[data-question-heading]", question.question || "Untitled interview question");
    setText("[data-question-status]", question.status || "New");
    setText("[data-question-category]", question.category || "General");
    setText("[data-question-difficulty]", question.difficulty || "Medium");
    setText("[data-question-reviewed]", window.CareerUtils.formatRelativeDate(question.lastReviewed));
    setText("[data-question-source]", question.source || "No source recorded");

    if (form) {
      setFieldValue(form, "question", question.question);
      setFieldValue(form, "category", question.category);
      setFieldValue(form, "difficulty", question.difficulty);
      setFieldValue(form, "answer", question.answer);
      setFieldValue(form, "personalAnswer", question.personalAnswer);
      setFieldValue(form, "notes", question.notes);
      setFieldValue(form, "tags", tagsToText(question.tags));
      setFieldValue(form, "status", question.status);
      setFieldValue(form, "source", question.source);
    }

    renderAnswerPanel();
  }

  function updateStatus(status) {
    if (!question) {
      return;
    }

    const now = new Date().toISOString();

    question.status = status;
    question.lastReviewed = now;
    question.updatedAt = now;
    saveQuestion();
    renderQuestion();
    window.CareerUtils.showToast?.(`Marked ${status}`);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!question) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const now = new Date().toISOString();

    question.question = String(formData.get("question") || "").trim();
    question.category = formData.get("category");
    question.difficulty = formData.get("difficulty");
    question.answer = String(formData.get("answer") || "").trim();
    question.personalAnswer = String(formData.get("personalAnswer") || "").trim();
    question.notes = String(formData.get("notes") || "").trim();
    question.tags = tagsFromText(formData.get("tags"));
    question.status = formData.get("status");
    question.source = String(formData.get("source") || "").trim();
    question.updatedAt = now;

    saveQuestion();
    renderQuestion();
    window.CareerUtils.showToast?.("Interview question saved");
  }

  function bindEvents() {
    const form = document.querySelector(selectors.form);

    form?.addEventListener("submit", handleSubmit);

    document.addEventListener("click", (event) => {
      const toggleAnswer = event.target.closest?.("[data-question-toggle-answer]");
      const masteredButton = event.target.closest?.("[data-question-mastered]");
      const practiceButton = event.target.closest?.("[data-question-practice]");

      if (toggleAnswer) {
        answerVisible = !answerVisible;
        toggleAnswer.textContent = answerVisible ? "Hide answer" : "Show answer";
        renderAnswerPanel();
      }

      if (masteredButton) {
        updateStatus("Mastered");
      }

      if (practiceButton) {
        updateStatus("Need Practice");
      }
    });
  }

  function init() {
    const params = new URLSearchParams(window.location.search);

    requestedId = params.get("id") || "";
    questions = window.CareerStorage.readInterview();
    question = questions.find((item) => item.id === requestedId);

    bindEvents();
    renderQuestion();
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.InterviewDetail.init();
});
