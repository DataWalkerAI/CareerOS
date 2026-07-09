window.CareerUtils = (() => {
  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function createId(prefix = "item") {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function createSlug(value, fallback = "item") {
    return (
      String(value || fallback)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || fallback
    );
  }

  function formatRelativeDate(value) {
    if (!value) {
      return "Not recorded";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not recorded";
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysAgo = Math.floor((todayStart - dateStart) / 86400000);

    if (daysAgo <= 0) {
      return "Today";
    }

    if (daysAgo === 1) {
      return "Yesterday";
    }

    if (daysAgo < 14) {
      return `${daysAgo} days ago`;
    }

    const weeksAgo = Math.floor(daysAgo / 7);

    if (weeksAgo < 8) {
      return `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`;
    }

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function getToastContainer() {
    let container = document.querySelector("[data-toast-container]");

    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      container.dataset.toastContainer = "";
      document.body.appendChild(container);
    }

    return container;
  }

  function showToast(message, type = "success") {
    if (!message || !document.body) {
      return;
    }

    const toast = document.createElement("div");
    const animationFrame = window.requestAnimationFrame || ((callback) => callback());

    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = message;

    getToastContainer().appendChild(toast);
    animationFrame(() => toast.classList.add("toast-visible"));

    window.setTimeout(() => {
      toast.classList.remove("toast-visible");
      window.setTimeout(() => toast.remove(), 220);
    }, 2200);
  }

  return {
    createId,
    createSlug,
    escapeHtml,
    formatRelativeDate,
    showToast,
  };
})();
