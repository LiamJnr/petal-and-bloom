/**
 * Toast Notification Alert Module
 */

export function showToast({ title, message, icon = "🌸", type = "success", duration = 4500 }) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" type="button" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger entrance transition
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  const dismiss = () => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    }, { once: true });
  };

  // Close button
  toast.querySelector(".toast-close")?.addEventListener("click", dismiss);

  // Auto dismiss timer
  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
}
