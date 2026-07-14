(function () {
  "use strict";

  async function fetchSettings() {
    try {
      const storeId =
        typeof salla !== "undefined" && salla.config
          ? salla.config.get("store.id")
          : null;

      if (!storeId) {
        console.warn("Salla WhatsApp Widget: store id not found.");
        return null;
      }

      const response = await fetch(
        `https://salla-app-assets.vercel.app/api/settings?store=${storeId}`,
      );

      if (!response.ok) {
        console.warn(
          "Salla WhatsApp Widget: settings request failed.",
          response.status,
        );
        return null;
      }

      const data = await response.json();
      const sanitizedNumber = String(data.number || "").replace(/\D/g, "");

      if (!sanitizedNumber) {
        console.warn(
          "Salla WhatsApp Widget: no WhatsApp number configured for this store.",
        );
        return null;
      }

      return Object.freeze({
        number: sanitizedNumber,
        message: String(data.message || "").trim(),
      });
    } catch (error) {
      console.error("Salla WhatsApp Widget: failed to fetch settings.", error);
      return null;
    }
  }

  function createWhatsAppLink(settings) {
    const encodedMessage = encodeURIComponent(settings.message);
    return `https://wa.me/${settings.number}?text=${encodedMessage}`;
  }

  function buildWidget(waLink) {
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
                        <svg class="wa-widget__btn-icon" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 256 256" aria-hidden="true"><path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"/></svg>                        
                    </a>
                </div>
            </div>
            <button class="wa-widget__trigger" id="wa-trigger-btn" aria-expanded="false" aria-controls="wa-popup" aria-label="فتح محادثة واتساب" title="تواصل معنا عبر واتساب">
                <svg class="wa-widget__trigger-icon" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 256 256" aria-hidden="true"><path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"/></svg>
                <p class="wa-widget__trigger-text">ابدأ المحادثة</p>
            </button>
        </div>
        `;

    document.body.insertAdjacentHTML("beforeend", waWidgetHTML);
    return true;
  }

  function bindEvents() {
    const triggerBtn = document.getElementById("wa-trigger-btn");
    const closeBtn = document.getElementById("wa-close-btn");
    const popupWindow = document.getElementById("wa-popup");
    if (!triggerBtn || !closeBtn || !popupWindow) return;

    triggerBtn.addEventListener("click", () => {
      const isActive = popupWindow.classList.toggle("wa-widget__popup--active");
      triggerBtn.setAttribute("aria-expanded", isActive);
      popupWindow.setAttribute("aria-hidden", !isActive);
    });

    closeBtn.addEventListener("click", () => {
      popupWindow.classList.remove("wa-widget__popup--active");
      triggerBtn.setAttribute("aria-expanded", "false");
      popupWindow.setAttribute("aria-hidden", "true");
    });
  }

  async function init() {
    try {
      const settings = await fetchSettings();
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
