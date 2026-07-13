// 1. طباعة رسالة في الكونسول للتأكد الفوري
console.log("✅ تطبيق سلة الخاص بك متصل ويعمل بنجاح!");

// 2. حقن العنصر المرئي داخل المتجر
document.addEventListener("DOMContentLoaded", function () {
  // إنشاء العنصر
  const badge = document.createElement("div");

  // إضافة الكلاس الخاص بالـ CSS
  badge.className = "salla-test-badge";

  // إضافة النص
  badge.innerText = "🚀 إضافة التطبيق تعمل بنجاح!";

  // إدراج العنصر داخل الصفحة
  document.body.appendChild(badge);
});
