(function () {
  "use strict";

  // ---------- Apparition au défilement ----------
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

  // ---------- Ombre sur la nav ----------
  var nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
  }

  // ---------- Aperçu instantané ----------
  var TRADES = {
    plombier:    { label: "Plombier",            search: "plombier", emoji: "🔧", color: "#1d4ed8", name: "Plomberie Dubois",
                   h1: "Votre plombier de confiance à {ville}", sub: "Urgences 24/7, chauffe-eau, débouchage. Service rapide et honnête.",
                   services: [["🚿", "Débouchage"], ["🔥", "Chauffe-eau"], ["🛁", "Salle de bain"]] },
    coiffure:    { label: "Salon de coiffure",   search: "salon de coiffure", emoji: "💇", color: "#be185d", name: "Salon Élégance",
                   h1: "Votre salon de coiffure à {ville}", sub: "Coupe, couleur, coiffure d'événement. Prenez rendez-vous en ligne.",
                   services: [["✂️", "Coupe"], ["🎨", "Couleur"], ["💍", "Mariage"]] },
    paysagiste:  { label: "Paysagiste",          search: "paysagiste", emoji: "🌳", color: "#15803d", name: "Paysagement Vert Nature",
                   h1: "Un terrain impeccable à {ville}", sub: "Tonte, aménagement, déneigement. Devis gratuit sur place.",
                   services: [["🌿", "Pelouse"], ["🌸", "Jardins"], ["❄️", "Déneigement"]] },
    restaurant:  { label: "Restaurant",          search: "restaurant", emoji: "🍽️", color: "#c2410c", name: "Resto Chez Lucie",
                   h1: "Bonne bouffe maison à {ville}", sub: "Menu du jour, pour emporter et traiteur. Venez nous voir!",
                   services: [["🥘", "Menu du jour"], ["🥡", "Pour emporter"], ["🎉", "Traiteur"]] },
    electricien: { label: "Électricien",         search: "électricien", emoji: "⚡", color: "#ca8a04", name: "Électrique Tremblay",
                   h1: "Votre électricien à {ville}", sub: "Résidentiel et commercial. Maître électricien certifié.",
                   services: [["💡", "Éclairage"], ["🔌", "Panneaux"], ["🚗", "Bornes de recharge"]] },
    mecanique:   { label: "Garage / Mécanique",  search: "garage mécanique", emoji: "🚗", color: "#475569", name: "Garage Gagnon",
                   h1: "Votre garage de confiance à {ville}", sub: "Entretien, freins, pneus. Estimation gratuite.",
                   services: [["🛞", "Pneus"], ["🛑", "Freins"], ["🔩", "Entretien"]] },
    nettoyage:   { label: "Entretien ménager",   search: "entretien ménager", emoji: "🧽", color: "#0891b2", name: "Nettoyage Éclat",
                   h1: "Une maison propre à {ville}, sans effort", sub: "Résidentiel et commercial. Produits écologiques.",
                   services: [["🏠", "Résidentiel"], ["🏢", "Commercial"], ["✨", "Grand ménage"]] },
    esthetique:  { label: "Esthétique",          search: "esthéticienne", emoji: "💅", color: "#9333ea", name: "Esthétique Belle-Peau",
                   h1: "Prenez soin de vous à {ville}", sub: "Soins du visage, manucure, épilation. Réservez en ligne.",
                   services: [["🧖", "Soins visage"], ["💅", "Manucure"], ["🌸", "Épilation"]] },
    renovation:  { label: "Rénovation",          search: "rénovation", emoji: "🔨", color: "#b45309", name: "Rénovations Côté",
                   h1: "Vos rénovations à {ville}, bien faites", sub: "Cuisines, salles de bain, sous-sols. Licence RBQ.",
                   services: [["🍳", "Cuisines"], ["🛁", "Salles de bain"], ["🏚️", "Sous-sols"]] },
    autre:       { label: "Autre",               search: "commerce", emoji: "🏪", color: "#1c1f3d", name: "Votre Commerce",
                   h1: "Votre commerce à {ville}", sub: "Vos services, vos heures, vos coordonnées. Tout au même endroit.",
                   services: [["⭐", "Services"], ["🕒", "Heures"], ["📍", "Nous joindre"]] }
  };
  var COLORS = ["#1d4ed8", "#be185d", "#15803d", "#c2410c", "#ca8a04", "#0891b2", "#9333ea", "#1c1f3d"];
  var DEFAULT_CITY = "Saint-Hyacinthe";

  var $ = function (id) { return document.getElementById(id); };
  var bName = $("bName"), bTrade = $("bTrade"), bCity = $("bCity"), bColors = $("bColors");

  if (bName && bTrade && bCity && bColors) {
    var state = { trade: "plombier", color: null };

    // Remplir la liste des métiers
    Object.keys(TRADES).forEach(function (key) {
      var opt = document.createElement("option");
      opt.value = key;
      opt.textContent = TRADES[key].emoji + "  " + TRADES[key].label;
      bTrade.appendChild(opt);
    });

    // Pastilles de couleur
    COLORS.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "swatch";
      b.style.background = c;
      b.setAttribute("aria-label", "Couleur " + c);
      b.dataset.color = c;
      b.addEventListener("click", function () { state.color = c; update(); });
      bColors.appendChild(b);
    });

    // Pré-remplissage par lien (?nom=...&metier=...&ville=...&couleur=...)
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get("nom")) bName.value = params.get("nom").slice(0, 40);
      if (params.get("ville")) bCity.value = params.get("ville").slice(0, 30);
      if (params.get("metier") && TRADES[params.get("metier")]) state.trade = params.get("metier");
      var pc = params.get("couleur");
      if (pc && /^[0-9a-fA-F]{6}$/.test(pc)) state.color = "#" + pc.toLowerCase();
    } catch (e) { /* vieux navigateur : on ignore */ }
    bTrade.value = state.trade;

    function slug(s) {
      return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 28) || "votrecommerce";
    }

    function currentValues() {
      var t = TRADES[state.trade];
      return {
        t: t,
        name: bName.value.trim() || t.name,
        city: bCity.value.trim() || DEFAULT_CITY,
        color: state.color || t.color
      };
    }

    function update() {
      var v = currentValues();
      $("pvUrl").textContent = slug(v.name) + ".ca";
      $("pvLogo").textContent = v.t.emoji + " " + v.name;
      $("pvLogo").style.color = v.color;
      $("pvCall").style.background = v.color;
      $("pvH1").textContent = v.t.h1.replace("{ville}", v.city);
      $("pvSub").textContent = v.t.sub;
      $("pvBtn").style.background = v.color;
      $("pvHero").style.background = v.color + "14";

      var list = $("pvServices");
      list.textContent = "";
      v.t.services.forEach(function (s) {
        var d = document.createElement("div");
        d.className = "pv-service";
        var i = document.createElement("span");
        i.textContent = s[0];
        var l = document.createElement("span");
        l.textContent = s[1];
        d.appendChild(i);
        d.appendChild(l);
        list.appendChild(d);
      });

      bColors.querySelectorAll(".swatch").forEach(function (sw) {
        sw.classList.toggle("on", sw.dataset.color === v.color);
      });

      // Le "après" du glisseur reprend le commerce tapé
      document.querySelectorAll(".js-ba-name").forEach(function (el) { el.textContent = v.t.emoji + " " + v.name; });
      document.querySelectorAll(".js-ba-city").forEach(function (el) { el.textContent = v.t.h1.replace("{ville}", v.city); });
      document.querySelectorAll(".js-ba-color").forEach(function (el) { el.style.background = v.color; });
      document.querySelectorAll(".js-ba-search").forEach(function (el) { el.textContent = "🔍 " + v.t.search + " " + v.city.toLowerCase(); });

      // L'aperçu "pulse" légèrement à chaque changement
      var pv = $("preview");
      pv.classList.remove("bump");
      void pv.offsetWidth;
      pv.classList.add("bump");
    }

    bName.addEventListener("input", update);
    bCity.addEventListener("input", update);
    bTrade.addEventListener("change", function () { state.trade = bTrade.value; state.color = null; update(); });
    update();

    // "Je veux ce site" : pré-remplit le formulaire de contact
    var want = $("bWant");
    if (want) {
      want.addEventListener("click", function () {
        var v = currentValues();
        var biz = document.querySelector('.contact-form [name="business"]');
        var msg = document.querySelector('.contact-form [name="message"]');
        if (biz && !biz.value) biz.value = v.name + " (" + v.t.label + ", " + v.city + ")";
        if (msg && !msg.value) msg.value = "Bonjour! J'aimerais un site comme l'aperçu que j'ai essayé.";
      });
    }

    // Copier un lien pré-rempli (pratique pour envoyer à un client)
    var share = $("bShare");
    if (share) {
      share.addEventListener("click", function () {
        var v = currentValues();
        var p = new URLSearchParams();
        p.set("nom", v.name);
        p.set("metier", state.trade);
        p.set("ville", v.city);
        if (state.color) p.set("couleur", state.color.replace("#", ""));
        var link = window.location.origin + window.location.pathname + "?" + p.toString() + "#essai";
        var done = function () {
          share.textContent = "✓ Lien copié!";
          setTimeout(function () { share.textContent = "🔗 Copier le lien"; }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(done, function () { window.prompt("Copiez ce lien :", link); });
        } else {
          window.prompt("Copiez ce lien :", link);
        }
      });
    }
  }

  // ---------- Glisseur avant / après ----------
  var ba = $("ba"), baRange = $("baRange");
  if (ba && baRange) {
    var setPos = function (v) { ba.style.setProperty("--pos", v + "%"); };
    baRange.addEventListener("input", function () { setPos(baRange.value); });
    setPos(baRange.value);

    // Petit coup de pouce la première fois qu'il apparaît, pour montrer qu'on peut glisser
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var nudged = false;
      new IntersectionObserver(function (entries, obs) {
        if (nudged || !entries[0].isIntersecting) return;
        nudged = true;
        obs.disconnect();
        var frames = [50, 35, 25, 35, 50, 65, 72, 62, 50];
        var k = 0;
        var tick = setInterval(function () {
          baRange.value = frames[k];
          setPos(frames[k]);
          k++;
          if (k >= frames.length) clearInterval(tick);
        }, 90);
      }, { threshold: 0.5 }).observe(ba);
    }
  }

  // ---------- Courriel assemblé en JS (anti-robots) ----------
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
