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
    questions = questions.map((item) => (item.id === question.id ? question : item));
    window.CareerStorage.saveInterview(questions);
  }

  function renderMissingQuestion() {
    setText("[data-question-title]", "Question not found");
    setText("[data-question-subtitle]", `No interview question matched ${requestedId || "the URL"}`);
    setText("[data-question-heading]", "Question not found");
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

    document.title = `${question.question} | CareerOS`;
    setText("[data-question-title]", "Interview Question");
    setText("[data-question-subtitle]", `${question.category} interview preparation`);
    setText("[data-question-heading]", question.question);
    setText("[data-question-status]", question.status);
    setText("[data-question-category]", question.category);
    setText("[data-question-difficulty]", question.difficulty);
    setText("[data-question-reviewed]", window.CareerUtils.formatRelativeDate(question.lastReviewed));
    setText("[data-question-source]", question.source || "No source recorded");

    if (form) {
      form.elements.question.value = question.question;
      form.elements.category.value = question.category;
      form.elements.difficulty.value = question.difficulty;
      form.elements.answer.value = question.answer;
      form.elements.personalAnswer.value = question.personalAnswer;
      form.elements.notes.value = question.notes;
      form.elements.tags.value = tagsToText(question.tags);
      form.elements.status.value = question.status;
      form.elements.source.value = question.source;
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

    question.question = formData.get("question").trim();
    question.category = formData.get("category");
    question.difficulty = formData.get("difficulty");
    question.answer = formData.get("answer").trim();
    question.personalAnswer = formData.get("personalAnswer").trim();
    question.notes = formData.get("notes").trim();
    question.tags = tagsFromText(formData.get("tags"));
    question.status = formData.get("status");
    question.source = formData.get("source").trim();
    question.updatedAt = now;

    saveQuestion();
    renderQuestion();
    window.CareerUtils.showToast?.("Interview question saved");
  }

  function bindEvents() {
    const form = document.querySelector(selectors.form);

    form?.addEventListener("submit", handleSubmit);

    document.addEventListener("click", (event) => {
      const toggleAnswer = event.target.closest("[data-question-toggle-answer]");
      const masteredButton = event.target.closest("[data-question-mastered]");
      const practiceButton = event.target.closest("[data-question-practice]");

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
