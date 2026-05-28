// ============================================================
// Caleb Dixon — portfolio interactions
// Minimal, no-dependency JS: sticky header state, mobile nav,
// KPI count-up on scroll, animated bar reveal.
// ============================================================
(function () {
  "use strict";

  // Year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header shadow on scroll
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // KPI count-up
  var kpis = document.querySelectorAll(".kpi-num[data-target]");
  if (kpis.length && "IntersectionObserver" in window) {
    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var duration = 1400;
      var start = performance.now();
      var format = target >= 1000
        ? function (v) { return Math.round(v).toLocaleString("en-US"); }
        : function (v) { return Math.round(v).toString(); };
      function step(now) {
        var t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = format(target * eased);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = format(target);
      }
      requestAnimationFrame(step);
    };
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    kpis.forEach(function (el) { io.observe(el); });
  }

  // Animate bar widths on entering view (CSS-driven; JS only toggles class)
  var barLists = document.querySelectorAll(".bar-list");
  if (barLists.length && "IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io2.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    barLists.forEach(function (l) { io2.observe(l); });
  } else {
    barLists.forEach(function (l) { l.classList.add("is-revealed"); });
  }
})();
