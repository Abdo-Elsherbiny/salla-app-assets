// طباعة رسالة في الكونسول للتأكد الفوري
console.log("✅ تطبيق سلة الخاص بك متصل ويعمل بنجاح!");

// إنشاء العنصر فوراً بدون انتظار DOMContentLoaded
const badge = document.createElement("div");

// إضافة كلاس الـ CSS الخاص بتصميم الـ Glassmorphism
badge.className = "salla-test-badge";

// إضافة النص
badge.innerText = "🚀 إضافة التطبيق تعمل بنجاح!";

// إدراج العنصر داخل الصفحة
document.body.appendChild(badge);

// الانتظار حتى يتم تحميل الصفحة وإعدادات سلة بالكامل
document.addEventListener("DOMContentLoaded", function () {
  let waNumber = "";
  let rawMessage = "";

  // 1. سحب البيانات من سلة
  // (سلة ستجلب القيمة الافتراضية التي حددتها في لوحة التحكم تلقائياً إذا كان الحقل فارغاً)
  if (typeof salla !== "undefined" && salla.config) {
    waNumber = salla.config.get("app.whatsapp_number") || "";
    rawMessage = salla.config.get("app.whatsapp_message") || "";

    // طباعة البيانات في الكونسول للتأكد من وصولها
    console.log("بيانات سلة المستلمة:", {
      number: waNumber,
      message: rawMessage,
    });
  }

  // 2. تنظيف النصوص من المسافات الزائدة وتحضير الرابط
  waNumber = String(waNumber).trim();
  rawMessage = String(rawMessage).trim();

  const encodedMessage = encodeURIComponent(rawMessage);
  const waLink = `https://wa.me/${waNumber}?text=${encodedMessage}`;

  // 3. جلب الوقت الحالي بصيغة (HH:MM)
  const currentTime = new Date().toLocaleTimeString("ar-EG", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  // 4. بناء هيكل الويدجت (HTML)
  const waWidgetHTML = `
    <div class="wa-widget">
        <!-- نافذة الدردشة المنبثقة -->
        <div class="wa-widget__popup" id="wa-popup">
            <div class="wa-widget__header">
                <div class="wa-widget__avatar-box">
                    <svg class="wa-widget__avatar" viewBox="0 0 24 24" fill="#cfcfcf" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20.2C9.5 20.2 7.29 18.92 6 16.98C6.03 14.99 10 13.9 12 13.9C13.99 13.9 17.97 14.99 18 16.98C16.71 18.92 14.5 20.2 12 20.2Z"/></svg>
                    <div class="wa-widget__status"></div>
                </div>
                <div class="wa-widget__info">
                    <div class="wa-widget__name">خدمة العملاء</div>
                    <div class="wa-widget__reply">عادة ما يرد على الفور</div>
                </div>
                <button class="wa-widget__close" id="wa-close-btn">&times;</button>
            </div>

            <div class="wa-widget__body">
                <div class="wa-widget__chat-bubble">
                    <div class="wa-widget__chat-name">خدمة العملاء</div>
                    <div class="wa-widget__chat-text">مرحباً! 😃 كيف يمكنني مساعدتك اليوم؟</div>
                    <div class="wa-widget__chat-time">${currentTime}</div>
                </div>
            </div>

            <div class="wa-widget__footer">
                <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="wa-widget__btn">
                    <svg class="wa-widget__btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.2c-32.6 0-64.6-8.8-92.7-25.3l-6.6-3.9-68.8 18 18.4-67.1-4.3-6.9c-18.6-29.6-28.4-64-28.4-98.2 0-104.5 85-189.5 189.6-189.5 52.1 0 101.1 20.3 138 57.2 36.9 36.9 57.2 85.9 57.2 138.1 0 104.5-85 189.5-189.5 189.5zm103.1-141.2c-5.7-2.8-33.5-16.5-38.7-18.4-5.2-1.9-9-2.8-12.8 2.8-3.8 5.7-14.7 18.4-18 22.2-3.3 3.8-6.6 4.3-12.3 1.4-5.7-2.8-23.9-8.8-45.5-28.1-16.8-15.1-28.1-32.9-30.9-38.6-2.8-5.7-.3-8.8 2.6-11.6 2.6-2.6 5.7-6.6 8.5-9.9 2.8-3.3 3.8-5.7 5.7-9.5 1.9-3.8.9-7.1-.5-9.9-1.4-2.8-12.8-30.9-17.5-42.3-4.6-11.2-9.2-9.7-12.8-9.9-3.3-.2-7.1-.2-10.9-.2-3.8 0-9.9 1.4-15.1 7.1-5.2 5.7-20.3 19.9-20.3 48.4 0 28.5 20.8 56.1 23.6 59.8 2.8 3.8 40.8 62.3 98.9 87.4 13.8 5.9 24.6 9.5 33 12.1 13.9 4.4 26.5 3.8 36.5 2.3 11.3-1.7 33.5-13.7 38.2-27 4.7-13.3 4.7-24.6 3.3-27-1.4-2.4-5.2-3.8-10.9-6.6z"/></svg>
                </a>
            </div>
        </div>

        <!-- زر الواتساب العائم -->
        <button class="wa-widget__trigger" id="wa-trigger-btn">
            <svg class="wa-widget__trigger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.2c-32.6 0-64.6-8.8-92.7-25.3l-6.6-3.9-68.8 18 18.4-67.1-4.3-6.9c-18.6-29.6-28.4-64-28.4-98.2 0-104.5 85-189.5 189.6-189.5 52.1 0 101.1 20.3 138 57.2 36.9 36.9 57.2 85.9 57.2 138.1 0 104.5-85 189.5-189.5 189.5zm103.1-141.2c-5.7-2.8-33.5-16.5-38.7-18.4-5.2-1.9-9-2.8-12.8 2.8-3.8 5.7-14.7 18.4-18 22.2-3.3 3.8-6.6 4.3-12.3 1.4-5.7-2.8-23.9-8.8-45.5-28.1-16.8-15.1-28.1-32.9-30.9-38.6-2.8-5.7-.3-8.8 2.6-11.6 2.6-2.6 5.7-6.6 8.5-9.9 2.8-3.3 3.8-5.7 5.7-9.5 1.9-3.8.9-7.1-.5-9.9-1.4-2.8-12.8-30.9-17.5-42.3-4.6-11.2-9.2-9.7-12.8-9.9-3.3-.2-7.1-.2-10.9-.2-3.8 0-9.9 1.4-15.1 7.1-5.2 5.7-20.3 19.9-20.3 48.4 0 28.5 20.8 56.1 23.6 59.8 2.8 3.8 40.8 62.3 98.9 87.4 13.8 5.9 24.6 9.5 33 12.1 13.9 4.4 26.5 3.8 36.5 2.3 11.3-1.7 33.5-13.7 38.2-27 4.7-13.3 4.7-24.6 3.3-27-1.4-2.4-5.2-3.8-10.9-6.6z"/></svg>
        </button>
    </div>
    `;

  document.body.insertAdjacentHTML("beforeend", waWidgetHTML);

  // 5. تفعيل أزرار الفتح والإغلاق
  const triggerBtn = document.getElementById("wa-trigger-btn");
  const closeBtn = document.getElementById("wa-close-btn");
  const popupWindow = document.getElementById("wa-popup");

  if (triggerBtn && closeBtn && popupWindow) {
    triggerBtn.addEventListener("click", () => {
      popupWindow.classList.toggle("wa-widget__popup--active");
    });

    closeBtn.addEventListener("click", () => {
      popupWindow.classList.remove("wa-widget__popup--active");
    });
  }
});
