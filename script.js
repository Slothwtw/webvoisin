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
    plombier: { label: "Plombier", color: "#1d4ed8", name: "Plomberie Dubois", font: "bricolage",
      photo: "https://images.unsplash.com/photo-1676210134188-4c05dd172f89?w=900&q=70&auto=format&fit=crop",
      h1: ["Une fuite? ", "On arrive."], sub: "Débouchage, chauffe-eau, salles de bain. Service rapide et honnête, 7 jours sur 7.", cta: "Demander une soumission",
      services: [["Débouchage", "Intervention rapide"], ["Chauffe-eau", "Toutes marques"], ["Salle de bain", "Rénovation"]] },
    coiffure: { label: "Salon de coiffure", color: "#be185d", name: "Salon Élégance", font: "serif",
      photo: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=70&auto=format&fit=crop",
      h1: ["Vos cheveux, ", "en mieux."], sub: "Coupe, couleur, coiffure d'événement. Prenez rendez-vous en ligne.", cta: "Prendre rendez-vous",
      services: [["Coupe", "Femmes et hommes"], ["Couleur", "Mèches, balayage"], ["Événement", "Mariages"]] },
    paysagiste: { label: "Paysagiste", color: "#15803d", name: "Paysagement Vert Nature", font: "fraunces",
      photo: "https://images.unsplash.com/photo-1668120089662-42642838cfef?w=900&q=70&auto=format&fit=crop",
      h1: ["Un terrain dont ", "vous serez fier."], sub: "Tonte, aménagement, pavé-uni et déneigement. Soumission gratuite sur place.", cta: "Soumission gratuite",
      services: [["Pelouse", "Tonte, aération"], ["Aménagement", "Pavé-uni, haies"], ["Déneigement", "Résidentiel"]] },
    restaurant: { label: "Restaurant", color: "#c2410c", name: "Resto Chez Lucie", font: "fraunces",
      photo: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=900&q=70&auto=format&fit=crop",
      h1: ["Fait maison, ", "servi chaud."], sub: "Menu du jour, commandes pour emporter et service de traiteur.", cta: "Voir le menu",
      services: [["Menu du jour", "Fait maison"], ["Pour emporter", "Commandez d'avance"], ["Traiteur", "Groupes et fêtes"]] },
    electricien: { label: "Électricien", color: "#ca8a04", name: "Électrique Tremblay", font: "condensed",
      photo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=70&auto=format&fit=crop",
      h1: ["Le courant passe. ", "Partout."], sub: "Résidentiel et commercial. Maître électricien, travail garanti.", cta: "Demander une soumission",
      services: [["Éclairage", "Intérieur, extérieur"], ["Panneaux", "Mise aux normes"], ["Bornes", "Recharge auto"]] },
    mecanique: { label: "Garage / Mécanique", color: "#dc2626", name: "Garage Gagnon", font: "condensed",
      photo: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=70&auto=format&fit=crop",
      h1: ["Votre auto, ", "entre bonnes mains."], sub: "Entretien, freins, pneus, diagnostic. Estimation gratuite avant les travaux.", cta: "Prendre rendez-vous",
      services: [["Pneus", "Pose, entreposage"], ["Freins", "Inspection"], ["Entretien", "Toutes marques"]] },
    nettoyage: { label: "Entretien ménager", color: "#0891b2", name: "Nettoyage Éclat", font: "bricolage",
      photo: "https://images.unsplash.com/photo-1758273238415-01ec03d9ef27?w=900&q=70&auto=format&fit=crop",
      h1: ["Rentrez chez vous. ", "C'est propre."], sub: "Résidentiel et commercial, produits écologiques, équipe fiable.", cta: "Demander une soumission",
      services: [["Résidentiel", "Hebdo ou mensuel"], ["Commercial", "Bureaux, commerces"], ["Grand ménage", "Printemps, automne"]] },
    esthetique: { label: "Esthétique", color: "#9333ea", name: "Esthétique Belle-Peau", font: "serif",
      photo: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=70&auto=format&fit=crop",
      h1: ["Prenez du temps ", "pour vous."], sub: "Soins du visage, manucure, épilation. Réservez en ligne en quelques clics.", cta: "Réserver un soin",
      services: [["Soins visage", "Sur mesure"], ["Manucure", "Gel, vernis"], ["Épilation", "Cire douce"]] },
    renovation: { label: "Rénovation", color: "#b45309", name: "Rénovations Côté", font: "fraunces",
      photo: "https://images.unsplash.com/photo-1595844730298-b960ff98fee0?w=900&q=70&auto=format&fit=crop",
      h1: ["Rénover, ", "sans mauvaise surprise."], sub: "Cuisines, salles de bain, sous-sols. Licence RBQ, prix clair dès le départ.", cta: "Demander une soumission",
      services: [["Cuisines", "Clé en main"], ["Salles de bain", "Douche, céramique"], ["Sous-sols", "Finition complète"]] },
    autre: { label: "Autre", color: "#1c1f3d", name: "Votre Commerce", font: "bricolage",
      photo: "https://images.unsplash.com/photo-1778142375628-73010ebde16a?w=900&q=70&auto=format&fit=crop",
      h1: ["Tout votre commerce, ", "en une page."], sub: "Vos services, vos heures, vos coordonnées. Vos clients trouvent tout, tout de suite.", cta: "Nous joindre",
      services: [["Services", "Ce que vous offrez"], ["Heures", "Quand nous joindre"], ["Contact", "En un clic"]] }
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
      opt.textContent = TRADES[key].label;
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

    function initials(n) {
      var w = n.replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter(Boolean);
      return ((w[0] || "V")[0] + (w[1] ? w[1][0] : "")).toUpperCase();
    }

    var lastPhoto = "";
    function update() {
      var v = currentValues();
      $("pvUrl").textContent = "webvoisin-sites.pages.dev/" + slug(v.name);
      $("pvSite").className = "pv-site f-" + v.t.font;
      $("pvSite").style.setProperty("--c", v.color);
      $("pvLogo").textContent = v.name;
      $("pvMono").textContent = initials(v.name);
      $("pvEyebrow").textContent = v.t.label + " · " + v.city;

      var h1 = $("pvH1");
      h1.textContent = "";
      h1.appendChild(document.createTextNode(v.t.h1[0]));
      var em = document.createElement("em");
      em.textContent = v.t.h1[1];
      h1.appendChild(em);
      $("pvSub").textContent = v.t.sub;
      $("pvBtn").textContent = v.t.cta;

      if (v.t.photo !== lastPhoto) {
        lastPhoto = v.t.photo;
        var ph = $("pvPhoto");
        ph.classList.remove("on");
        var img = new Image();
        img.onload = function () { if (lastPhoto === v.t.photo) { ph.style.backgroundImage = 'url("' + v.t.photo + '")'; ph.classList.add("on"); } };
        img.src = v.t.photo;
      }

      var list = $("pvServices");
      list.textContent = "";
      v.t.services.forEach(function (s, i) {
        var d = document.createElement("div");
        d.className = "pv-service";
        var n = document.createElement("small");
        n.textContent = "0" + (i + 1);
        var t = document.createElement("b");
        t.textContent = s[0];
        var l = document.createElement("span");
        l.textContent = s[1];
        d.appendChild(n); d.appendChild(t); d.appendChild(l);
        list.appendChild(d);
      });

      bColors.querySelectorAll(".swatch").forEach(function (sw) {
        sw.classList.toggle("on", sw.dataset.color === v.color);
      });

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
          share.textContent = "Lien copié";
          setTimeout(function () { share.textContent = "Copier le lien"; }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(done, function () { window.prompt("Copiez ce lien :", link); });
        } else {
          window.prompt("Copiez ce lien :", link);
        }
      });
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
