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
    autre: { label: "Autre", color: "#0f766e", name: "Votre Commerce", font: "bricolage",
      photo: "https://images.unsplash.com/photo-1778142375628-73010ebde16a?w=900&q=70&auto=format&fit=crop",
      h1: ["Tout votre commerce, ", "en une page."], sub: "Vos services, vos heures, vos coordonnées. Vos clients trouvent tout, tout de suite.", cta: "Nous joindre",
      services: [["Services", "Ce que vous offrez"], ["Heures", "Quand nous joindre"], ["Contact", "En un clic"]] }
  };
  var PHOTOS = [
    [["bar laitier", "creme glacee", "cremerie", "glacier"], "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=900&q=70&auto=format&fit=crop"],
    [["esthetique auto", "detailing", "polissage"], "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=900&q=70&auto=format&fit=crop"],
    [["lave-auto", "lave auto", "lavage auto"], "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=900&q=70&auto=format&fit=crop"],
    [["ecole de conduite", "conduite"], "https://images.unsplash.com/photo-1630406144797-821be1f35d75?w=900&q=70&auto=format&fit=crop"],
    [["cuisine sur mesure", "armoire", "comptoir"], "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=900&q=70&auto=format&fit=crop"],
    [["barbier", "barber"], "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=70&auto=format&fit=crop"],
    [["gouttiere"], "https://images.unsplash.com/photo-1634853982486-c06f0e17940f?w=900&q=70&auto=format&fit=crop"],
    [["toit", "couvreur", "bardeau", "couverture"], "https://images.unsplash.com/photo-1635424824849-1b09bdcc55b1?w=900&q=70&auto=format&fit=crop"],
    [["peint", "platr", "gypse", "tirage de joint"], "https://images.unsplash.com/photo-1733431772808-82d878e59000?w=900&q=70&auto=format&fit=crop"],
    [["menuis", "ebenist", "charpent", "boiserie"], "https://images.unsplash.com/photo-1659930087003-2d64e33181f7?w=900&q=70&auto=format&fit=crop"],
    [["macon", "brique", "beton", "pierre", "fondation"], "https://images.unsplash.com/photo-1701850009190-2859ba2aeea6?w=900&q=70&auto=format&fit=crop"],
    [["demenag"], "https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc?w=900&q=70&auto=format&fit=crop"],
    [["deneig", "neige"], "https://images.unsplash.com/photo-1676903826883-cbbd7703f2f4?w=900&q=70&auto=format&fit=crop"],
    [["vitr", "fenetre", "porte de garage"], "https://images.unsplash.com/photo-1751486403820-7cf45ebec080?w=900&q=70&auto=format&fit=crop"],
    [["serrur"], "https://images.unsplash.com/photo-1773425350177-af4d2249d641?w=900&q=70&auto=format&fit=crop"],
    [["chauffage", "climatis", "thermopompe", "ventilation", "refrigeration", "chauffe"], "https://images.unsplash.com/photo-1676210134190-3f2c0d5cf58d?w=900&q=70&auto=format&fit=crop"],
    [["plomb", "drain"], "https://images.unsplash.com/photo-1676210134188-4c05dd172f89?w=900&q=70&auto=format&fit=crop"],
    [["electri"], "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=70&auto=format&fit=crop"],
    [["excav", "terrassement", "fosse septique", "puits"], "https://images.unsplash.com/photo-1580901369227-308f6f40bdeb?w=900&q=70&auto=format&fit=crop"],
    [["elag", "arbor", "abattage", "arbre", "emond"], "https://images.unsplash.com/photo-1754322449185-31f56117ed87?w=900&q=70&auto=format&fit=crop"],
    [["piscine"], "https://images.unsplash.com/photo-1558617320-e695f0d420de?w=900&q=70&auto=format&fit=crop"],
    [["carross", "debossel"], "https://images.unsplash.com/photo-1727893119356-1702fe921cf9?w=900&q=70&auto=format&fit=crop"],
    [["remorq", "depanneuse"], "https://images.unsplash.com/photo-1730514784243-f0e7f09c9f50?w=900&q=70&auto=format&fit=crop"],
    [["mecani", "garage", "pneu", "auto", "moto", "vtt"], "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=70&auto=format&fit=crop"],
    [["photo"], "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=70&auto=format&fit=crop"],
    [["video", "film"], "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&q=70&auto=format&fit=crop"],
    [["dj", "disco", "sonoris", "animation"], "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&q=70&auto=format&fit=crop"],
    [["traiteur", "buffet"], "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=70&auto=format&fit=crop"],
    [["patiss", "boulang", "gateau", "viennois"], "https://images.unsplash.com/photo-1623334044303-241021148842?w=900&q=70&auto=format&fit=crop"],
    [["cafe", "barista", "torref"], "https://images.unsplash.com/photo-1507915135761-41a0a222c709?w=900&q=70&auto=format&fit=crop"],
    [["pizz"], "https://images.unsplash.com/photo-1622880833523-7cf1c0bd4296?w=900&q=70&auto=format&fit=crop"],
    [["sushi", "japon"], "https://images.unsplash.com/photo-1681270496598-13c5365730c8?w=900&q=70&auto=format&fit=crop"],
    [["frit", "casse-croute", "casse croute", "cantine", "burger", "poutine", "snack", "food truck", "camion de rue"], "https://images.unsplash.com/photo-1585460379355-de1c92466a17?w=900&q=70&auto=format&fit=crop"],
    [["bar", "pub", "cocktail", "bistro"], "https://images.unsplash.com/photo-1647776112336-72f4c30fafc1?w=900&q=70&auto=format&fit=crop"],
    [["resto", "restaurant", "cuisin", "chef"], "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=900&q=70&auto=format&fit=crop"],
    [["bouch", "charcut", "viande"], "https://images.unsplash.com/photo-1625643269470-5d3e7b69fa34?w=900&q=70&auto=format&fit=crop"],
    [["poisson", "fruits de mer"], "https://images.unsplash.com/photo-1507991426709-5bbee2c6a189?w=900&q=70&auto=format&fit=crop"],
    [["fromag"], "https://images.unsplash.com/photo-1631379578550-7038263db699?w=900&q=70&auto=format&fit=crop"],
    [["chocol", "confis", "bonbon"], "https://images.unsplash.com/photo-1596914258628-5e2b762c7db2?w=900&q=70&auto=format&fit=crop"],
    [["epicer", "depanneur", "marche"], "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=900&q=70&auto=format&fit=crop"],
    [["erabl", "cabane a sucre", "sirop"], "https://images.unsplash.com/photo-1441633980922-d18ca151ee64?w=900&q=70&auto=format&fit=crop"],
    [["vign", "vin", "cidr"], "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=900&q=70&auto=format&fit=crop"],
    [["brass", "biere", "microbr"], "https://images.unsplash.com/photo-1763626343502-b0b1f26b43d4?w=900&q=70&auto=format&fit=crop"],
    [["fleur"], "https://images.unsplash.com/photo-1642751652611-bb9a7cad58a3?w=900&q=70&auto=format&fit=crop"],
    [["tatou", "tattoo", "percage", "piercing"], "https://images.unsplash.com/photo-1552627019-947c3789ffb5?w=900&q=70&auto=format&fit=crop"],
    [["ongle", "manucur", "pedicur"], "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=900&q=70&auto=format&fit=crop"],
    [["coiff"], "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=70&auto=format&fit=crop"],
    [["mass", "spa", "reflexo"], "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=900&q=70&auto=format&fit=crop"],
    [["esthet", "beaute", "soins", "maquill", "cils", "sourcil"], "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=70&auto=format&fit=crop"],
    [["physio", "kine", "osteo", "ergo"], "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?w=900&q=70&auto=format&fit=crop"],
    [["chiro"], "https://images.unsplash.com/photo-1706353399656-210cca727a33?w=900&q=70&auto=format&fit=crop"],
    [["dent", "hygien"], "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=900&q=70&auto=format&fit=crop"],
    [["optom", "opticien", "lunette"], "https://images.unsplash.com/photo-1517948430535-1e2469d314fe?w=900&q=70&auto=format&fit=crop"],
    [["veter", "clinique animal"], "https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?w=900&q=70&auto=format&fit=crop"],
    [["toilett", "chien", "promen", "garde d'animaux", "pension"], "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=900&q=70&auto=format&fit=crop"],
    [["animal", "animaux"], "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=70&auto=format&fit=crop"],
    [["pharma", "naturo", "sante", "clinique", "infirm"], "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=900&q=70&auto=format&fit=crop"],
    [["psych", "therap", "sexolog", "travail social", "mediat"], "https://images.unsplash.com/photo-1464029902023-f42eba355bde?w=900&q=70&auto=format&fit=crop"],
    [["garder", "cpe", "educatri", "enfant", "nounou"], "https://images.unsplash.com/photo-1578349035260-9f3d4042f1f7?w=900&q=70&auto=format&fit=crop"],
    [["gym", "entrain", "coach sportif", "fitness", "crossfit", "kinesio"], "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=70&auto=format&fit=crop"],
    [["yoga", "pilates", "medit"], "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&q=70&auto=format&fit=crop"],
    [["dans"], "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=900&q=70&auto=format&fit=crop"],
    [["musi", "guitar", "piano"], "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=900&q=70&auto=format&fit=crop"],
    [["tutor", "aide aux devoirs", "cours", "prof", "formation", "ecole", "coach", "consult", "conferen"], "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=900&q=70&auto=format&fit=crop"],
    [["compta", "impot", "tenue de livres", "fiscal"], "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=900&q=70&auto=format&fit=crop"],
    [["avocat", "notaire", "jurid", "droit", "huissier"], "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=70&auto=format&fit=crop"],
    [["immobil", "courtier", "inspect"], "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=70&auto=format&fit=crop"],
    [["assur", "financ", "conseill", "planif"], "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=70&auto=format&fit=crop"],
    [["web", "develop", "programm", "marketing", "seo", "reseaux sociaux"], "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=70&auto=format&fit=crop"],
    [["informat", "ordinateur", "reseau", "techno"], "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=900&q=70&auto=format&fit=crop"],
    [["graph", "design", "logo"], "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=70&auto=format&fit=crop"],
    [["imprim", "enseigne", "lettrage", "serigraph", "broderie"], "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=900&q=70&auto=format&fit=crop"],
    [["cellul", "telephone", "electronique"], "https://images.unsplash.com/photo-1639776738932-956082f0b704?w=900&q=70&auto=format&fit=crop"],
    [["coutur", "retouche", "tailleur"], "https://images.unsplash.com/photo-1606501126768-b78d4569d3f9?w=900&q=70&auto=format&fit=crop"],
    [["cordonn", "chaussure"], "https://images.unsplash.com/photo-1529953717281-81a40b131119?w=900&q=70&auto=format&fit=crop"],
    [["nettoyeur", "pressing"], "https://images.unsplash.com/photo-1549037173-e3b717902c57?w=900&q=70&auto=format&fit=crop"],
    [["menage", "entretien", "nettoy", "concierg", "lavage de vitres"], "https://images.unsplash.com/photo-1758273238415-01ec03d9ef27?w=900&q=70&auto=format&fit=crop"],
    [["quincaill", "magasin"], "https://images.unsplash.com/photo-1631856954655-966f97d809de?w=900&q=70&auto=format&fit=crop"],
    [["boutique", "vetement", "mode"], "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=70&auto=format&fit=crop"],
    [["librair", "livre", "papeter"], "https://images.unsplash.com/photo-1513185041617-8ab03f83d6c5?w=900&q=70&auto=format&fit=crop"],
    [["ferm", "agric", "producteur", "verger", "kiosque", "maraich"], "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=900&q=70&auto=format&fit=crop"],
    [["soud", "metal", "fer forge", "usinage", "machin"], "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=70&auto=format&fit=crop"],
    [["carrel", "ceramique", "plancher", "revetement"], "https://images.unsplash.com/photo-1656646523907-97b094c7e63a?w=900&q=70&auto=format&fit=crop"],
    [["clotur", "rampe"], "https://images.unsplash.com/photo-1508263073532-98ed924de82d?w=900&q=70&auto=format&fit=crop"],
    [["asphalt", "pavage", "scellant"], "https://images.unsplash.com/photo-1706712637075-f47fb47548f2?w=900&q=70&auto=format&fit=crop"],
    [["camion", "transport", "livraison", "courrier"], "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=70&auto=format&fit=crop"],
    [["velo", "bicycl"], "https://images.unsplash.com/photo-1675798227643-da319f8ee8f7?w=900&q=70&auto=format&fit=crop"],
    [["bateau", "marina", "nautique", "ponton"], "https://images.unsplash.com/photo-1588401273872-959d2076283a?w=900&q=70&auto=format&fit=crop"],
    [["gite", "auberge", "hotel", "chalet", "hebergement", "motel", "camping"], "https://images.unsplash.com/photo-1641924676578-ed2792eb24de?w=900&q=70&auto=format&fit=crop"],
    [["mariage", "wedding"], "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900&q=70&auto=format&fit=crop"],
    [["evenem", "reception", "salle", "organis"], "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=70&auto=format&fit=crop"],
    [["paysag", "gazon", "pelouse", "jardin", "pave", "haie"], "https://images.unsplash.com/photo-1668120089662-42642838cfef?w=900&q=70&auto=format&fit=crop"],
    [["renov", "construct", "entrepreneur", "agrandissement", "sous-sol"], "https://images.unsplash.com/photo-1595844730298-b960ff98fee0?w=900&q=70&auto=format&fit=crop"]
  ];

  var COLORS = ["#1d4ed8", "#be185d", "#15803d", "#c2410c", "#ca8a04", "#0891b2", "#9333ea", "#1c1f3d"];
  var DEFAULT_CITY = "Saint-Hyacinthe";

  var $ = function (id) { return document.getElementById(id); };
  var bName = $("bName"), bTrade = $("bTrade"), bCity = $("bCity"), bColors = $("bColors"), bOther = $("bOther"), bOtherWrap = $("bOtherWrap");

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
      if (params.get("m") && bOther) bOther.value = params.get("m").slice(0, 40);
      if (params.get("metier") && TRADES[params.get("metier")]) state.trade = params.get("metier");
      var pc = params.get("couleur");
      if (pc && /^[0-9a-fA-F]{6}$/.test(pc)) state.color = "#" + pc.toLowerCase();
    } catch (e) { /* vieux navigateur : on ignore */ }
    bTrade.value = state.trade;

    function slug(s) {
      return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 28) || "votrecommerce";
    }

    function norm(s) {
      return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }
    // Trouve une photo qui correspond au métier écrit (mots-clés, sans accents)
    function photoFor(job) {
      var n = " " + norm(job).replace(/[^a-z0-9' -]/g, " ") + " ";
      for (var i = 0; i < PHOTOS.length; i++) {
        var keys = PHOTOS[i][0];
        for (var k = 0; k < keys.length; k++) {
          if (n.indexOf(" " + keys[k]) !== -1) return PHOTOS[i][1];
        }
      }
      return null;
    }
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    function currentValues() {
      var t = TRADES[state.trade];
      var city = bCity.value.trim() || DEFAULT_CITY;
      if (state.trade === "autre") {
        var job = bOther ? bOther.value.trim() : "";
        var tt = {};
        for (var key in t) tt[key] = t[key];
        tt.job = job;
        if (job) {
          tt.label = cap(job);
          tt.h1 = [cap(job), " à " + city + "."];
          tt.photo = photoFor(job) || t.photo;
        }
        t = tt;
      }
      return {
        t: t,
        name: bName.value.trim() || t.name,
        city: city,
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
      $("pvUrl").textContent = "sitto-sites.pages.dev/" + slug(v.name);
      $("pvSite").className = "pv-site f-" + v.t.font;
      $("pvSite").style.setProperty("--c", v.color);
      $("pvLogo").textContent = v.name;
      $("pvMono").textContent = initials(v.name);
      $("pvEyebrow").textContent = (state.trade === "autre" ? "Service local" : v.t.label) + " · " + v.city;
      var needJob = state.trade === "autre" && !v.t.job;
      $("preview").classList.toggle("need-job", needJob);
      if (bOtherWrap) bOtherWrap.hidden = state.trade !== "autre";
      if (bOther) { bOther.required = state.trade === "autre"; }

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
    bTrade.addEventListener("change", function () { state.trade = bTrade.value; state.color = null; update(); if (state.trade === "autre" && bOther && !bOther.value) bOther.focus(); });
    if (bOther) bOther.addEventListener("input", update);
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
        if (state.trade === "autre" && bOther && bOther.value.trim()) p.set("m", bOther.value.trim());
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
