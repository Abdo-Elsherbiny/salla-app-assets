(function () {
  "use strict";

  /**
   * Reads, sanitizes, and freezes the settings injected by Salla snippet.
   * @returns {Object|null} Frozen settings object or null if invalid.
   */
  function getSettings() {
    if (!window.waSettings || !window.waSettings.number) {
      console.warn(
        "Salla WhatsApp Widget: Missing settings or WhatsApp number. Execution stopped.",
      );
      return null;
    }

    // Sanitize: Remove spaces, plus signs, and all non-numeric characters
    const rawNumber = String(window.waSettings.number);
    const sanitizedNumber = rawNumber.replace(/\D/g, "");

    if (!sanitizedNumber) {
      console.warn(
        "Salla WhatsApp Widget: Invalid WhatsApp number format. Execution stopped.",
      );
      return null;
    }

    const rawMessage = window.waSettings.message
      ? String(window.waSettings.message).trim()
      : "";

    // Freeze settings to prevent accidental runtime modifications
    return Object.freeze({
      number: sanitizedNumber,
      message: rawMessage,
    });
  }

  /**
   * Generates the WhatsApp wa.me URL with encoded text.
   * @param {Object} settings Frozen settings object
   * @returns {string} WhatsApp URL
   */
  function createWhatsAppLink(settings) {
    const encodedMessage = encodeURIComponent(settings.message);
    return `https://wa.me/${settings.number}?text=${encodedMessage}`;
  }

  /**
   * Builds the widget HTML and injects it into the DOM.
   * @param {string} waLink The generated WhatsApp URL
   * @returns {boolean} True if injected successfully, false if duplicate.
   */
  function buildWidget(waLink) {
    // Prevent duplicate widgets
    if (document.querySelector(".wa-widget")) {
      console.warn(
        "Salla WhatsApp Widget: Widget already exists. Stopping duplicate injection.",
      );
      return false;
    }

    const currentTime = new Date().toLocaleTimeString("ar-EG", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    // HTML Structure (Preserved exactly as requested, enhanced with ARIA labels)
    const waWidgetHTML = `
        <div class="wa-widget">
            <div class="wa-widget__popup" id="wa-popup" aria-hidden="true" role="dialog" aria-label="نافذة محادثة واتساب">
                <div class="wa-widget__header">
                    <div class="wa-widget__avatar-box">
                        <svg class="wa-widget__avatar" viewBox="0 0 24 24" fill="#cfcfcf" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20.2C9.5 20.2 7.29 18.92 6 16.98C6.03 14.99 10 13.9 12 13.9C13.99 13.9 17.97 14.99 18 16.98C16.71 18.92 14.5 20.2 12 20.2Z"/></svg>
                        <div class="wa-widget__status"></div>
                    </div>
                    <div class="wa-widget__info">
                        <div class="wa-widget__name">خدمة العملاء</div>
                        <div class="wa-widget__reply">عادة ما يرد على الفور</div>
                    </div>
                    <button class="wa-widget__close" id="wa-close-btn" aria-label="إغلاق المحادثة" title="إغلاق">&times;</button>
                </div>
                <div class="wa-widget__body">
                    <div class="wa-widget__chat-bubble">
                        <div class="wa-widget__chat-name">خدمة العملاء</div>
                        <div class="wa-widget__chat-text">مرحباً! 😃 كيف يمكنني مساعدتك اليوم؟</div>
                        <div class="wa-widget__chat-time">${currentTime}</div>
                    </div>
                </div>
                <div class="wa-widget__footer">
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="wa-widget__btn" aria-label="بدء المحادثة عبر واتساب" title="بدء المحادثة عبر واتساب">
                        <svg class="wa-widget__btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.2c-32.6 0-64.6-8.8-92.7-25.3l-6.6-3.9-68.8 18 18.4-67.1-4.3-6.9c-18.6-29.6-28.4-64-28.4-98.2 0-104.5 85-189.5 189.6-189.5 52.1 0 101.1 20.3 138 57.2 36.9 36.9 57.2 85.9 57.2 138.1 0 104.5-85 189.5-189.5 189.5zm103.1-141.2c-5.7-2.8-33.5-16.5-38.7-18.4-5.2-1.9-9-2.8-12.8 2.8-3.8 5.7-14.7 18.4-18 22.2-3.3 3.8-6.6 4.3-12.3 1.4-5.7-2.8-23.9-8.8-45.5-28.1-16.8-15.1-28.1-32.9-30.9-38.6-2.8-5.7-.3-8.8 2.6-11.6 2.6-2.6 5.7-6.6 8.5-9.9 2.8-3.3 3.8-5.7 5.7-9.5 1.9-3.8.9-7.1-.5-9.9-1.4-2.8-12.8-30.9-17.5-42.3-4.6-11.2-9.2-9.7-12.8-9.9-3.3-.2-7.1-.2-10.9-.2-3.8 0-9.9 1.4-15.1 7.1-5.2 5.7-20.3 19.9-20.3 48.4 0 28.5 20.8 56.1 23.6 59.8 2.8 3.8 40.8 62.3 98.9 87.4 13.8 5.9 24.6 9.5 33 12.1 13.9 4.4 26.5 3.8 36.5 2.3 11.3-1.7 33.5-13.7 38.2-27 4.7-13.3 4.7-24.6 3.3-27-1.4-2.4-5.2-3.8-10.9-6.6z"/></svg>
                    </a>
                </div>
            </div>
            <button class="wa-widget__trigger" id="wa-trigger-btn" aria-expanded="false" aria-controls="wa-popup" aria-label="فتح محادثة واتساب" title="تواصل معنا عبر واتساب">
                <svg class="wa-widget__trigger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.2c-32.6 0-64.6-8.8-92.7-25.3l-6.6-3.9-68.8 18 18.4-67.1-4.3-6.9c-18.6-29.6-28.4-64-28.4-98.2 0-104.5 85-189.5 189.6-189.5 52.1 0 101.1 20.3 138 57.2 36.9 36.9 57.2 85.9 57.2 138.1 0 104.5-85 189.5-189.5 189.5zm103.1-141.2c-5.7-2.8-33.5-16.5-38.7-18.4-5.2-1.9-9-2.8-12.8 2.8-3.8 5.7-14.7 18.4-18 22.2-3.3 3.8-6.6 4.3-12.3 1.4-5.7-2.8-23.9-8.8-45.5-28.1-16.8-15.1-28.1-32.9-30.9-38.6-2.8-5.7-.3-8.8 2.6-11.6 2.6-2.6 5.7-6.6 8.5-9.9 2.8-3.3 3.8-5.7 5.7-9.5 1.9-3.8.9-7.1-.5-9.9-1.4-2.8-12.8-30.9-17.5-42.3-4.6-11.2-9.2-9.7-12.8-9.9-3.3-.2-7.1-.2-10.9-.2-3.8 0-9.9 1.4-15.1 7.1-5.2 5.7-20.3 19.9-20.3 48.4 0 28.5 20.8 56.1 23.6 59.8 2.8 3.8 40.8 62.3 98.9 87.4 13.8 5.9 24.6 9.5 33 12.1 13.9 4.4 26.5 3.8 36.5 2.3 11.3-1.7 33.5-13.7 38.2-27 4.7-13.3 4.7-24.6 3.3-27-1.4-2.4-5.2-3.8-10.9-6.6z"/></svg>
            </button>
        </div>
        `;

    document.body.insertAdjacentHTML("beforeend", waWidgetHTML);
    return true;
  }

  /**
   * Binds click events for opening and closing the widget.
   * Includes safe error handling if elements are missing.
   */
  function bindEvents() {
    const triggerBtn = document.getElementById("wa-trigger-btn");
    const closeBtn = document.getElementById("wa-close-btn");
    const popupWindow = document.getElementById("wa-popup");

    if (!triggerBtn || !closeBtn || !popupWindow) {
      console.warn(
        "Salla WhatsApp Widget: DOM elements not found. Event binding aborted.",
      );
      return;
    }

    triggerBtn.addEventListener("click", () => {
      const isActive = popupWindow.classList.toggle("wa-widget__popup--active");
      // Update accessibility states
      triggerBtn.setAttribute("aria-expanded", isActive);
      popupWindow.setAttribute("aria-hidden", !isActive);
    });

    closeBtn.addEventListener("click", () => {
      popupWindow.classList.remove("wa-widget__popup--active");
      // Update accessibility states
      triggerBtn.setAttribute("aria-expanded", "false");
      popupWindow.setAttribute("aria-hidden", "true");
    });
  }

  /**
   * Orchestrates the initialization process safely.
   */
  function init() {
    try {
      const settings = getSettings();
      if (!settings) return;

      const waLink = createWhatsAppLink(settings);

      const isBuilt = buildWidget(waLink);
      if (!isBuilt) return;

      bindEvents();

      console.log("✅ Salla WhatsApp Widget: Initialized successfully.");
    } catch (error) {
      console.error(
        "Salla WhatsApp Widget: Critical error during initialization.",
        error,
      );
    }
  }

  // Execute safely when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
