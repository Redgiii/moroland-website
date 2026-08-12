// ============================================================
// CONFIGURATION DU SITE — c'est le SEUL fichier à modifier
// pour changer l'adresse du serveur ou le lien Discord.
// Le reste du site lit ces valeurs automatiquement.
// ============================================================

const CONFIG = {
  // Adresse du serveur Minecraft, celle que les joueurs tapent
  // dans le menu "Multijoueur". Si ton serveur utilise un port
  // différent de 25565 (le port par défaut), écris-le comme ceci :
  // "moroland.one-mc.com:25565"
  SERVER_ADDRESS: "moroland.one-mc.com",

  // Lien d'invitation Discord (le même lien est utilisé partout
  // sur le site : bouton du menu, bannière, pied de page...)
  DISCORD_INVITE: "https://discord.gg/d7SeB8Ppyc",

  // Lien vers la page du modpack (CurseForge ou Modrinth) qui liste
  // tous les mods installés. Remplace par l'URL réelle de ta page.
  MODPACK_URL: "https://www.curseforge.com/minecraft/modpacks/TON-MODPACK",

  // Statut des candidatures, affiché en badge à côté du bouton Discord.
  // Change juste cette valeur entre "open" et "closed" selon la situation :
  // "open"   -> badge vert "Candidatures ouvertes"
  // "closed" -> badge gris "Complet pour le moment"
  RECRUITMENT_STATUS: "open",
};
