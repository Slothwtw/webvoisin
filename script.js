(function () {
  "use strict";

  // Animation d'apparition au défilement
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Ombre sur la nav au défilement
  var nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
  }

  // Démo animée du hero : alterne "sans site" / "avec WebVoisin"
  var demoSteps = document.querySelectorAll(".demo-step");
  var demoReplay = document.getElementById("demoReplay");
  if (demoSteps.length) {
    var demoIndex = 0;
    var demoTimer = null;
    function showDemoStep(i) {
      demoSteps.forEach(function (el, idx) {
        el.classList.toggle("active", idx === i);
      });
    }
    function startDemoLoop() {
      if (demoTimer) clearInterval(demoTimer);
      showDemoStep(demoIndex);
      demoTimer = setInterval(function () {
        demoIndex = (demoIndex + 1) % demoSteps.length;
        showDemoStep(demoIndex);
      }, 3200);
    }
    startDemoLoop();
    if (demoReplay) {
      demoReplay.addEventListener("click", function () {
        demoIndex = 0;
        startDemoLoop();
      });
    }
  }

  // Courriel assemblé en JS : évite qu'un robot le récolte dans le HTML brut
  var user = "webvoisin8";
  var domain = "gmail.com";
  document.querySelectorAll(".js-email").forEach(function (a) {
    var address = user + "@" + domain;
    a.href = "mailto:" + address;
    if (a.textContent.indexOf("@") === -1) {
      a.textContent = "✉️ " + address;
    }
  });
})();
