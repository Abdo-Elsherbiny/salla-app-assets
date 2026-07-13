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
