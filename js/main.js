// ==========================================================
// MOROLAND — script principal
// Pas de framework : juste du JavaScript qui manipule la page.
// Ce fichier lit les valeurs de js/config.js (CONFIG.SERVER_ADDRESS
// et CONFIG.DISCORD_INVITE) : tu n'as jamais besoin de modifier
// ce fichier-ci pour changer l'adresse ou le lien Discord.
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  setupDiscordLinks();
  setupMobileNav();
  setupRevealOnScroll();
  setupAddressCopy();
  setupModpackLink();
  setupServerStatus();
});

/* ----------------------------------------------------------
   1. Liens Discord : on remplit tous les boutons "Rejoindre
   le Discord" avec l'adresse définie dans config.js.
---------------------------------------------------------- */
function setupDiscordLinks() {
  document.querySelectorAll("[data-discord-link]").forEach((link) => {
    link.href = CONFIG.DISCORD_INVITE;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

/* ----------------------------------------------------------
   2. Menu mobile (le bouton "burger" en haut à droite)
---------------------------------------------------------- */
function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });

  // Ferme le menu automatiquement quand on clique sur un lien
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ----------------------------------------------------------
   3. Animation d'apparition au défilement.
   On observe tous les éléments ".reveal" et on ajoute la classe
   ".is-visible" dès qu'ils entrent dans l'écran.
---------------------------------------------------------- */
function setupRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ----------------------------------------------------------
   4. Copier dans le presse-papier (adresse du serveur, lien du
   modpack...). Fonction réutilisée par plusieurs boutons.
---------------------------------------------------------- */
async function copyToClipboard(value, feedbackEl, successMessage) {
  try {
    await navigator.clipboard.writeText(value);
    feedbackEl.textContent = successMessage;
  } catch (error) {
    // La copie automatique demande une page servie en HTTPS (ou en local
    // via un vrai serveur). Si elle échoue, on affiche juste la valeur.
    feedbackEl.textContent = "Copie manuelle : " + value;
  }
  setTimeout(() => (feedbackEl.textContent = ""), 2500);
}

function setupAddressCopy() {
  const button = document.getElementById("status-address-btn");
  const text = document.getElementById("status-address-text");
  const feedback = document.getElementById("status-copied");

  text.textContent = CONFIG.SERVER_ADDRESS;

  button.addEventListener("click", () => {
    copyToClipboard(CONFIG.SERVER_ADDRESS, feedback, "Adresse copiée");
  });
}

/* ----------------------------------------------------------
   4bis. Lien vers la page du modpack (bouton "Voir le modpack"
   + bouton "Copier le lien"), toujours à partir de config.js.
---------------------------------------------------------- */
function setupModpackLink() {
  const link = document.getElementById("modpack-link");
  const copyButton = document.getElementById("modpack-copy-btn");
  const feedback = document.getElementById("modpack-copied");

  link.href = CONFIG.MODPACK_URL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  copyButton.addEventListener("click", () => {
    copyToClipboard(CONFIG.MODPACK_URL, feedback, "Lien copié");
  });
}

/* ----------------------------------------------------------
   5. Statut live du serveur Minecraft.
   On interroge l'API PUBLIQUE mcsrvstat.us, qui se charge elle-même
   de "pinger" le serveur Minecraft et de renvoyer un simple JSON.
   Aucune information privée, aucun identifiant : uniquement des
   données publiques (comme le fait le menu multijoueur du jeu).
---------------------------------------------------------- */
const STATUS_API_URL = `https://api.mcsrvstat.us/3/${CONFIG.SERVER_ADDRESS}`;
const STATUS_REFRESH_INTERVAL_MS = 45000; // on interroge l'API toutes les 45s

// Important : l'API mcsrvstat.us ne "ping" pas le serveur à chaque appel.
// Elle garde le dernier résultat en mémoire pendant ~5 minutes avant de
// revérifier, pour ne pas surcharger les serveurs Minecraft qu'elle surveille.
// Le nombre de joueurs affiché ici ne peut donc pas être plus frais que ça,
// même si on rafraîchit plus souvent. C'est une limite du service gratuit,
// pas un bug : on affiche l'heure de la dernière mise à jour pour que ce
// soit clair pour les visiteurs.

function setupServerStatus() {
  fetchServerStatus();
  setInterval(fetchServerStatus, STATUS_REFRESH_INTERVAL_MS);

  document.getElementById("status-refresh").addEventListener("click", (event) => {
    event.currentTarget.classList.add("is-loading");
    fetchServerStatus().finally(() => {
      event.currentTarget.classList.remove("is-loading");
    });
  });
}

async function fetchServerStatus() {
  const card = document.getElementById("status-card");

  // On limite l'attente à 8 secondes : si l'API ne répond pas,
  // on considère le statut comme indisponible plutôt que de laisser
  // la page bloquée indéfiniment sur "Vérification en cours".
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    // cache: "no-store" empêche le navigateur de réutiliser une ancienne
    // réponse qu'il aurait gardée de son côté ; on veut toujours la donnée
    // la plus fraîche que l'API est capable de fournir.
    const response = await fetch(STATUS_API_URL, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error("Réponse API invalide");

    const data = await response.json();
    clearTimeout(timeout);

    if (data.online) {
      renderStatus(card, {
        state: "online",
        label: "En ligne",
        playersOnline: data.players?.online ?? 0,
        playersMax: data.players?.max ?? "?",
        // L'API renvoie le MOTD avec ses vraies couleurs Minecraft, déjà
        // sous forme de <span style="color:..."> prêts à afficher.
        motdHtml: data.motd?.html?.join("<br>") || "",
        motdText: data.motd?.clean?.join(" ") || "",
      });
    } else {
      renderStatus(card, { state: "offline", label: "Hors ligne" });
    }
  } catch (error) {
    clearTimeout(timeout);
    renderStatus(card, { state: "offline", label: "Statut indisponible" });
  }
}

function renderStatus(card, { state, label, playersOnline, playersMax, motdHtml, motdText }) {
  card.dataset.state = state;
  document.getElementById("status-label").textContent = label;

  const countEl = document.getElementById("status-players-count");
  const motdEl = document.getElementById("status-motd");
  const updatedEl = document.getElementById("status-updated");

  if (state === "online") {
    countEl.textContent = `${playersOnline} / ${playersMax}`;
    if (motdHtml) {
      // Le HTML vient de l'API publique mcsrvstat.us, qui échappe déjà
      // les caractères spéciaux du MOTD original : on peut l'afficher
      // tel quel pour garder les couleurs du jeu.
      motdEl.innerHTML = motdHtml;
    } else {
      motdEl.textContent = motdText;
    }
  } else {
    countEl.textContent = "—";
    motdEl.textContent = "Le serveur ne répond pas pour le moment.";
  }

  const now = new Date();
  const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  updatedEl.textContent = `Dernière vérification à ${time}`;
}
