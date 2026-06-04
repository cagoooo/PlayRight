/* =========================================================
   Playwright × Webwright — 互動腳本
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. 捲動進場動畫 (IntersectionObserver) ---------- */
  var reveals = document.querySelectorAll(".reveal, .next__bar");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // 不支援時直接顯示
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- 2. 導覽列捲動變色 ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) { nav.classList.add("is-stuck"); }
    else { nav.classList.remove("is-stuck"); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. 程式碼複製按鈕 ---------- */
  var copyBtns = document.querySelectorAll(".code-demo__copy");
  copyBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy"));
      if (!target) return;
      var text = target.textContent;
      var done = function () {
        var original = btn.textContent;
        btn.textContent = "已複製 ✓";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("copied");
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- 4. 導覽列點擊平滑捲動（補強 + 收合誤差） ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var y = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
})();
