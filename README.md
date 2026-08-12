# Moroland — site vitrine

Site vitrine du serveur Minecraft **Moroland**. Aucun serveur (backend), aucune base de données,
aucun identifiant : uniquement des fichiers HTML / CSS / JavaScript que n'importe quel hébergement
gratuit peut servir tel quel.

## Pourquoi ce choix technique (HTML/CSS/JS pur, pas de framework)

Pas besoin d'installer Node.js, npm, ni de comprendre un système de « build ». Tu ouvres, tu modifies,
tu publies. Un framework comme Astro serait utile si le site avait des dizaines de pages ou du contenu
généré automatiquement (un blog, par exemple) — ce n'est pas le cas ici, donc il aurait juste ajouté
de la complexité sans bénéfice réel.

## Contenu du dossier

```
moroland-website/
├── index.html          → la page (structure et texte)
├── 404.html               → page d'erreur affichée par Netlify pour les liens cassés
├── css/style.css        → l'apparence (couleurs, mise en page, responsive)
├── js/config.js         → LE fichier à modifier (adresse serveur + lien Discord)
├── js/main.js            → le comportement (statut live, menu mobile, animations)
├── assets/images/logo.svg → logo provisoire (à remplacer par le tien)
├── assets/images/og-image.svg → visuel utilisé pour l'aperçu de lien (Discord/Twitter)
├── robots.txt            → autorise les moteurs de recherche à indexer le site
├── sitemap.xml           → liste des pages du site, pour aider Google à l'indexer
└── README.md
```

## 1. Lancer le site en local

**Option simple** : double-clique sur `index.html`, il s'ouvre dans ton navigateur. Ça suffit pour
voir 95 % du site.

**Option complète (recommandée)** : certaines fonctions du navigateur (copier l'adresse du serveur
en un clic) ne s'activent que si la page est servie par un vrai petit serveur local, pas juste ouverte
en double-clic. Deux façons simples d'en lancer un, à choisir :

- Si tu as **VS Code** : installe l'extension « Live Server », clique droit sur `index.html` →
  *Open with Live Server*.
- Si tu as **Python** installé : ouvre un terminal dans le dossier `moroland-website` et tape :
  ```
  python -m http.server 8000
  ```
  puis ouvre `http://localhost:8000` dans ton navigateur.

## 2. Remplacer les placeholders

Tout se passe dans **`js/config.js`** pour l'essentiel :

```js
const CONFIG = {
  SERVER_ADDRESS: "moroland.one-mc.com",
  DISCORD_INVITE: "https://discord.gg/d7SeB8Ppyc",
  RECRUITMENT_STATUS: "open",
};
```

- **`SERVER_ADDRESS`** : déjà réglé sur `moroland.one-mc.com`. J'ai vérifié que cette adresse répond
  bien (le serveur redirige automatiquement vers le bon port grâce à un enregistrement DNS SRV, donc
  tu n'as rien à ajouter). Si un jour l'adresse ou le port changent, modifie uniquement cette ligne.
- **`DISCORD_INVITE`** : déjà réglé sur ton lien. Si tu régénères une invitation Discord plus tard
  (les liens peuvent expirer), remplace-la ici, elle se met à jour partout sur le site automatiquement.
- **`RECRUITMENT_STATUS`** : `"open"` ou `"closed"`. Contrôle le badge « Candidatures ouvertes » /
  « Complet pour le moment » affiché sous les boutons Discord (hero et section Communauté). Change
  juste cette valeur selon la situation, le reste du site se met à jour tout seul.

### L'aperçu de lien (Discord / Twitter)

Dans `index.html`, tout en haut (`<head>`), les balises `og:*` et `twitter:*` contrôlent la carte
qui s'affiche quand tu partages l'URL du site. Deux choses à faire une fois le site publié :

1. La balise `<meta property="og:url" content="...">` doit toujours pointer vers l'adresse réelle du
   site (actuellement `https://reliable-dieffenbachia-4ee07e.netlify.app/`). Si tu renommes le site sur
   Netlify ou que tu branches un nom de domaine à toi, pense à la mettre à jour ici — et fais la même
   mise à jour dans le bloc `<script type="application/ld+json">` juste au-dessus (champs `"url"` et
   `"logo"`), qui sert à aider Google à comprendre le site.
2. L'image utilisée est `assets/images/og-image.svg`, un visuel généré automatiquement pour que
   l'aperçu ne soit pas vide. Discord l'affiche correctement, **mais Twitter/X n'affiche pas les
   images au format SVG** dans ses cartes. Si tu veux un aperçu qui fonctionne partout : fais une
   capture d'écran ou une image 1200×630 (par exemple avec le logo et le titre), enregistre-la en
   `assets/images/og-image.jpg`, puis remplace `og-image.svg` par `og-image.jpg` dans les 2 balises
   `content="assets/images/og-image.svg"` du `<head>`.

### Actualités et compteur de membres

- Section **Actualités** (`id="actualites"`, entre Les Actes et la Galerie) : 3 entrées d'exemple
  (marquées « Exemple — à remplacer ») avec une date et une courte description. Ajoute, retire ou
  modifie les `<li class="news-item">` selon les nouvelles réelles du serveur — pense à revenir de
  temps en temps mettre à jour cette section, c'est ce qui donne une raison de revisiter le site.
- **Compteur de membres** : dans la section Communauté, la ligne `<p class="member-count">12 aventuriers
  actuellement sur Moroland</p>` est à mettre à jour à la main selon le nombre réel de joueurs actifs.

### Progression de l'Acte en cours

Dans la section **Les Actes** (`id="actes"`), l'Acte marqué « En cours » a une petite barre de
progression (`class="act-progress"`). Pour changer le pourcentage affiché, modifie les deux endroits
suivants dans `index.html` (cherche `act-progress`) :
```html
<div class="act-progress" role="progressbar" aria-valuenow="60" ...>
  <div class="act-progress-bar" style="width: 60%;"></div>
</div>
<span class="act-progress-label">60 % complété</span>
```
Remplace les trois `60` par le nouveau pourcentage. Quand tu passes à l'Acte suivant, déplace ce bloc
dans le nouvel Acte "En cours".

### Galerie et zoom

Les captures d'écran de la section Galerie s'agrandissent déjà au clic (une « lightbox »). Avec les
emplacements réservés actuels, ça n'affiche que le texte en plus grand — une fois que tu auras remplacé
les `<button class="screenshot-placeholder">` par de vraies images (voir plus haut), le zoom affichera
automatiquement la photo en grand, sans rien à changer dans le code JavaScript.

### Page d'erreur 404

Le fichier `404.html` (à la racine) s'affiche automatiquement sur Netlify si quelqu'un arrive sur une
URL qui n'existe pas. Il reprend le style du site ; rien à faire, sauf si tu veux personnaliser le texte.

### Témoignages

Section **Témoignages** (cherche `id="temoignages"` dans `index.html`) : les 3 citations sont des
exemples à remplacer par de vrais retours de joueurs (avec leur accord si tu publies leur pseudo).
Cherche le texte « Remplace ce texte par une vraie citation » pour les repérer facilement.

### FAQ et charte de la communauté

- Section **FAQ** (`id="faq"`) : les questions/réponses sont des exemples plausibles. Relis-les et
  adapte les réponses à la réalité de ton serveur (durée réelle de l'entretien, règles précises...).
- Bloc **Charte** dans la section Communauté (cherche `class="charter"`) : 4 règles génériques à
  ajuster selon les règles que tu appliques réellement.

### Le logo

Fichier concerné : `assets/images/logo.svg`. J'ai mis un logo provisoire simple (un blason avec un « M »).
Pour mettre le tien :

- Si ton logo est aussi en `.svg`, remplace directement le fichier `assets/images/logo.svg` (même nom).
- Si c'est un `.png` ou `.jpg` : dépose-le dans `assets/images/` (par exemple `logo.png`), puis dans
  `index.html`, remplace les deux lignes `src="assets/images/logo.svg"` par `src="assets/images/logo.png"`
  (utilise Ctrl+F pour les trouver, il y en a une dans l'en-tête et une dans le pied de page).

### Photos, captures d'écran et trailer

Dans `index.html`, section **Galerie** (cherche `id="galerie"`) :

- Le bloc `<div class="trailer-placeholder">` est prévu pour ton trailer. Pour une vidéo YouTube,
  remplace ce bloc entier par :
  ```html
  <iframe width="100%" height="480" style="border-radius:14px"
    src="https://www.youtube.com/embed/TON_ID_VIDEO" title="Trailer Moroland"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>
  ```
- Chaque capture d'écran est un bouton `<button class="screenshot-placeholder reveal js-lightbox">` qui
  contient un `<span>Capture d'écran 1</span>`. Pour mettre une vraie image, remplace uniquement le
  `<span>...</span>` à l'intérieur (garde le `<button>` autour, c'est lui qui permet le zoom au clic) :
  ```html
  <button type="button" class="screenshot-placeholder reveal js-lightbox">
    <img src="assets/images/screenshot-1.jpg" alt="Description de la capture d'écran">
  </button>
  ```
  Dépose tes fichiers dans `assets/images/` et adapte les noms.

## 3. Pourquoi le nombre de joueurs ne bouge pas instantanément

Le site interroge l'API publique `api.mcsrvstat.us` toutes les 45 secondes, mais cette API elle-même
ne "ping" pas ton serveur à chaque appel : elle garde le dernier résultat en mémoire pendant environ
**5 minutes** avant de revérifier, pour éviter de surcharger tous les serveurs Minecraft qu'elle
surveille. C'est une limite du service gratuit, pas un bug du site. Le texte « Dernière vérification
à HH:MM » sous le nombre de joueurs sert justement à rendre ça clair pour tes visiteurs : ils savent
que la donnée peut avoir jusqu'à quelques minutes de retard.

S'il te faut un jour un statut vraiment instantané, la seule solution fiable serait d'interroger ton
serveur directement (ping Minecraft classique) depuis un petit script côté serveur — ce qui demande
un backend, ce que tu voulais justement éviter en Phase 1.

## 4. Sécurité — un risque évité par choix

- **Aucun mot de passe ni token dans le code** : le site ne parle qu'à `api.mcsrvstat.us`, une API
  publique qui se contente de « pinguer » ton serveur comme le fait le menu multijoueur du jeu.
  → évite qu'un identifiant sensible se retrouve visible par n'importe qui dans le code source de la page.
- **Aucune connexion au panneau d'hébergement (Pterodactyl ou autre)** depuis le navigateur.
  → évite qu'une personne malveillante ne trouve un accès à ton serveur en lisant le code du site.
- **HTTPS géré automatiquement par l'hébergeur** (Netlify le fait tout seul, gratuitement).
  → évite que les données échangées entre le visiteur et le site soient interceptées.
- **Pas de formulaire, pas de base de données** : rien à pirater côté site.
  → évite tout risque d'injection ou de fuite de données, puisqu'il n'y a rien à voler.

## 5. Publier gratuitement sur Netlify

**Méthode la plus simple (glisser-déposer, aucun compte GitHub requis) :**

1. Va sur [app.netlify.com](https://app.netlify.com) et crée un compte gratuit (email ou GitHub).
2. Une fois connecté, tu arrives sur ton tableau de bord. Cherche la zone qui dit
   « Drag and drop your site output folder here » (glisse ton dossier ici).
3. Glisse le dossier **`moroland-website`** entier dans cette zone.
4. Netlify publie le site en quelques secondes et te donne une adresse du type
   `https://nom-aleatoire.netlify.app`.
5. Tu peux renommer cette adresse : *Site settings* → *Change site name*.

**Pour publier une mise à jour** après une modification : reviens sur cette même page et glisse à
nouveau le dossier (ou utilise la méthode GitHub ci-dessous, plus pratique sur le long terme).

**Méthode avec GitHub (recommandée si tu comptes modifier le site souvent) :**

1. Crée un compte sur [github.com](https://github.com) si tu n'en as pas.
2. Crée un nouveau dépôt (repository), par exemple `moroland-website`.
3. Mets-y les fichiers de ce dossier (via l'interface web de GitHub, en glissant les fichiers, ou avec
   `git` si tu es à l'aise).
4. Sur Netlify : *Add new site* → *Import an existing project* → connecte ton compte GitHub → choisis
   le dépôt `moroland-website`.
5. Laisse les champs de build vides (pas de commande de build, pas de dossier de sortie particulier :
   c'est un site statique).
6. Netlify republie automatiquement le site à chaque fois que tu modifies un fichier sur GitHub.

## Plus tard (non fait maintenant)

- **Phase 2 — carte live du monde** : une fois BlueMap installé et exposé publiquement par ton
  hébergeur, on ajoutera simplement une section avec une balise
  `<iframe src="https://ton-adresse-bluemap">` dans `index.html`. Aucune réécriture du reste du site.
- **Phase 3 — statistiques / classements** : nécessitera une vraie source de données (par exemple un
  plugin qui exporte des stats en JSON, ou un petit service tiers). On en reparlera le moment venu ;
  ça n'impacte pas l'architecture actuelle, ça s'ajoute en plus.
