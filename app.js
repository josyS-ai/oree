/* Orée — lot 1 : le socle
   Navigation, thèmes, connexion, verrouillage par code, domaines et catégories,
   synchronisation Supabase avec fonctionnement hors-ligne, français / anglais. */
'use strict';

(() => {
  /* ==========================================================
     Configuration
     ========================================================== */
  const CONFIG = {
    SUPABASE_URL: 'https://foboghwbppqbyvfcjkoj.supabase.co',
    SUPABASE_KEY: 'sb_publishable_qh12xNgNAnoVTLhaUL8g6A_absINt8r', // clé publique : sans danger dans le code
    ALLOW_SIGNUP: false, // usage personnel : les comptes se créent dans Supabase
    VERSION: '1.1 (lot 1)'
  };

  const TABLES = ['domains', 'categories'];
  const PALETTE = ['#7c5cbf', '#2f7fd1', '#2e9c8a', '#4aa04a', '#c99a1c', '#d9772b',
    '#d4577a', '#c0392b', '#6b7480', '#8d6e63', '#00838f', '#5c6bc0'];
  const TEXT_SIZES = [90, 100, 112, 125];
  const LOT_OF = { challenge: 2, plan: 5, journals: 4, library: 6 };

  /* ==========================================================
     Textes (français / anglais)
     ========================================================== */
  const I18N = {
    fr: {
      'app.tagline': 'Ton année se lève.',
      'tab.today': "Aujourd'hui", 'tab.challenge': 'Défi', 'tab.plan': 'Planifier',
      'tab.journals': 'Journaux', 'tab.library': 'Bibliothèque', 'tab.settings': 'Réglages',

      'auth.email': 'Adresse e-mail', 'auth.password': 'Mot de passe',
      'auth.signin': 'Se connecter', 'auth.signup': 'Créer mon compte',
      'auth.forgot': 'Mot de passe oublié ?', 'auth.back': 'Retour à la connexion',
      'auth.sendReset': 'Envoyer le lien',
      'auth.resetSent': "Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé.",
      'auth.newPassword': 'Nouveau mot de passe', 'auth.savePassword': 'Enregistrer le mot de passe',
      'auth.confirmSent': 'Compte créé. Vérifie ta boîte mail pour confirmer ton adresse.',
      'auth.needEmail': 'Saisis ton adresse e-mail et ton mot de passe.',
      'auth.needEmailOnly': 'Saisis ton adresse e-mail.',
      'auth.offline': "Pas de connexion internet : la connexion n'est pas possible pour l'instant.",
      'auth.shortPw': 'Le mot de passe doit contenir au moins 8 caractères.',
      'auth.invalid': 'Adresse e-mail ou mot de passe incorrect.',
      'auth.network': 'Impossible de joindre le serveur. Vérifie ta connexion internet et réessaie.',
      'auth.forgotInfo': 'Saisis ton adresse e-mail : tu recevras un lien pour choisir un nouveau mot de passe.',

      'lock.title': 'Saisis ton code', 'lock.wrong': 'Code incorrect.',
      'lock.wait': 'Trop d’essais. Réessaie dans {n} s.',
      'lock.forgot': 'Code oublié ? Déconnecter cet appareil',
      'lock.forgotConfirm': 'Cet appareil va être déconnecté de ton compte et ses données locales effacées. Tes données restent synchronisées et reviendront à la prochaine connexion.',
      'lock.disconnect': 'Déconnecter',

      'welcome.title': 'Bienvenue dans Orée',
      'welcome.text': 'Choisis ton point de départ. Tu pourras tout modifier ensuite.',
      'welcome.kitMine': 'Mon kit de départ',
      'welcome.kitMineDesc': "7 domaines de vie et des catégories d'activités, prêts à personnaliser.",
      'welcome.kitEmpty': 'Partir de zéro',
      'welcome.kitEmptyDesc': 'Aucun domaine ni catégorie : tu crées les tiens.',
      'welcome.done': 'Ton espace est prêt.',

      'today.morning': 'Bonjour', 'today.afternoon': 'Bon après-midi', 'today.evening': 'Bonsoir',
      'today.domains': 'Tes domaines de vie',
      'today.noDomains': 'Aucun domaine pour le moment. Ajoute-les dans les réglages.',
      'today.manageDomains': 'Gérer les domaines',
      'soon.today': 'Ta journée complète (créneaux, protocole, tâches) arrive avec le rythme du jour.',
      'soon.challenge': 'Le programme de bilan et de vision, étape par étape, avec ton calendrier.',
      'soon.plan': "Année, trimestres, mois, semaines : tes objectifs découpés jusqu'aux tâches.",
      'soon.journals': 'Prière, rencontres et semences, chacun dans son espace.',
      'soon.library': 'Promesses et versets, citations, Vision Board et vidéos de motivation.',
      'soon.lot': 'Prévu au lot {n}',

      'set.account': 'Compte', 'set.appearance': 'Apparence', 'set.language': 'Langue',
      'set.lock': 'Verrouillage', 'set.domains': 'Domaines de vie', 'set.categories': 'Catégories',
      'set.sync': 'Synchronisation', 'set.backup': 'Sauvegarde', 'set.about': 'À propos',
      'set.theme': 'Thème', 'set.textSize': 'Taille du texte',
      'theme.day': 'Jour', 'theme.night': 'Nuit', 'theme.sepia': 'Sépia', 'theme.auto': 'Automatique',
      'size.90': 'Petit', 'size.100': 'Normal', 'size.112': 'Grand', 'size.125': 'Très grand',
      'lang.fr': 'Français', 'lang.en': 'English',
      'nav.title': 'Navigation sur ordinateur', 'nav.visible': 'Visible', 'nav.rail': 'Icônes seulement', 'nav.hidden': 'Masquée',
      'nav.hint': 'Réglage propre à cet appareil. La touche F10 affiche ou masque la navigation.',
      'nav.hide': 'Masquer la navigation', 'nav.show': 'Afficher la navigation', 'nav.pin': 'Afficher en permanence',
      'win.title': 'Fenêtre',
      'win.fsHint': "Le plein écran masque aussi les onglets et la barre d'adresse du navigateur. Échap ou F11 pour en sortir.",
      'win.fullscreen': 'Plein écran', 'win.exitFullscreen': 'Quitter le plein écran',
      'win.installHint': "Installée comme application, Orée s'ouvre dans sa propre fenêtre, sans onglets ni barre d'adresse. Dans Chrome : menu ⋮, « Enregistrer et partager », puis « Installer Orée ».",
      'win.install': "Installer Orée comme application", 'win.installed': 'Orée est déjà ouverte comme une application.',

      'account.signedInAs': 'Connecté avec {email}.',
      'account.offlineMode': 'Mode hors-ligne : tes données locales sont disponibles, la connexion reviendra avec internet.',
      'account.signout': 'Se déconnecter',
      'account.signoutConfirm': 'Cet appareil sera déconnecté et ses données locales effacées. Elles restent sur ton compte.',
      'account.signoutUnsynced': 'Attention : des modifications ne sont pas encore synchronisées et seront perdues.',

      'lockset.info': "Le code protège l'accès à l'app sur cet appareil. Il ne chiffre pas tes données : le chiffrement par section viendra dans un lot dédié.",
      'lockset.enable': 'Activer le code', 'lockset.change': 'Changer le code',
      'lockset.disable': 'Désactiver le code', 'lockset.delay': 'Verrouiller après',
      'delay.0': 'Immédiatement', 'delay.1': '1 minute', 'delay.5': '5 minutes', 'delay.15': '15 minutes',
      'lockset.new': 'Nouveau code (4 à 8 chiffres)', 'lockset.confirm': 'Confirme le code',
      'lockset.current': 'Code actuel', 'lockset.rule': 'Le code doit contenir entre 4 et 8 chiffres.',
      'lockset.mismatch': 'Les deux codes ne correspondent pas.',
      'lockset.on': 'Code activé.', 'lockset.off': 'Code désactivé.', 'lockset.changed': 'Code modifié.',
      'lockset.wrongCurrent': 'Code actuel incorrect.',

      'mgr.add': 'Ajouter', 'mgr.newName': 'Nom', 'mgr.rename': 'Renommer', 'mgr.color': 'Couleur',
      'mgr.archive': 'Archiver', 'mgr.restore': 'Restaurer', 'mgr.delete': 'Supprimer',
      'mgr.up': 'Monter', 'mgr.down': 'Descendre',
      'mgr.showArchived': 'Afficher les archivés', 'mgr.hideArchived': 'Masquer les archivés',
      'mgr.empty': 'Rien ici pour le moment. Ajoute ton premier élément.',
      'mgr.deleteConfirm': 'Supprimer « {name} » ?',
      'mgr.domainsInfo': "Les domaines servent d'étiquettes pour tes objectifs, promesses et journaux.",
      'mgr.categoriesInfo': 'Les catégories regroupent tes créneaux et tes tâches en vrac, avec leur couleur.',
      'mgr.archivedTag': 'archivé',

      'common.save': 'Enregistrer', 'common.cancel': 'Annuler', 'common.ok': 'OK', 'common.confirm': 'Confirmer',

      'sync.offline': 'Hors-ligne', 'sync.syncing': 'Synchronisation…', 'sync.error': 'Synchronisation en échec',
      'sync.pending': '{n} en attente', 'sync.ok': 'Synchronisé à {time}', 'sync.never': 'Pas encore synchronisé',
      'sync.now': 'Synchroniser maintenant', 'sync.last': 'Dernière synchronisation',
      'sync.pendingLabel': 'Modifications en attente',
      'sync.info': "Tes données sont enregistrées sur cet appareil, puis envoyées à ton compte dès qu'une connexion est disponible.",
      'sync.detail': "Détail de l'erreur", 'sync.notAvailable': 'Synchronisation indisponible en mode hors-ligne.',

      'bk.info': 'Télécharge une copie de tes données ou restaure une sauvegarde.',
      'bk.export': 'Télécharger la sauvegarde', 'bk.import': 'Restaurer une sauvegarde',
      'bk.importConfirm': 'Restaurer cette sauvegarde ? Les éléments portant le même identifiant seront remplacés.',
      'bk.done': 'Sauvegarde restaurée.', 'bk.error': 'Fichier de sauvegarde invalide.',
      'bk.exported': 'Sauvegarde téléchargée.',

      'about.version': 'Version',
      'about.text': 'Orée est ton espace de bilan, de vision et de rythme. Tes données sont stockées sur cet appareil et synchronisées avec ton compte.',

      'err.generic': 'Une erreur est survenue : {msg}',

      'dom.1': 'Spirituel', 'dom.2': 'Ministère', 'dom.3': 'Professionnel & études',
      'dom.4': 'Social & famille', 'dom.5': 'Personnel (santé & développement)',
      'dom.6': 'Finances', 'dom.7': 'Influence',
      'cat.1': 'Temps avec Dieu', 'cat.2': 'Étude', 'cat.3': 'Préparation', 'cat.4': 'Saisie & édition',
      'cat.5': 'Ménage', 'cat.6': 'Soins & sport', 'cat.7': 'Repos & détente',
      'cat.8': 'Finances & business', 'cat.9': 'Ministère & partage', 'cat.10': 'Sommeil'
    },
    en: {
      'app.tagline': 'Your year is rising.',
      'tab.today': 'Today', 'tab.challenge': 'Challenge', 'tab.plan': 'Plan',
      'tab.journals': 'Journals', 'tab.library': 'Library', 'tab.settings': 'Settings',

      'auth.email': 'Email address', 'auth.password': 'Password',
      'auth.signin': 'Sign in', 'auth.signup': 'Create my account',
      'auth.forgot': 'Forgot your password?', 'auth.back': 'Back to sign in',
      'auth.sendReset': 'Send the link',
      'auth.resetSent': 'If an account exists for this address, a reset link has just been sent.',
      'auth.newPassword': 'New password', 'auth.savePassword': 'Save password',
      'auth.confirmSent': 'Account created. Check your inbox to confirm your address.',
      'auth.needEmail': 'Enter your email address and password.',
      'auth.needEmailOnly': 'Enter your email address.',
      'auth.offline': 'No internet connection: signing in is not possible right now.',
      'auth.shortPw': 'The password must be at least 8 characters long.',
      'auth.invalid': 'Incorrect email address or password.',
      'auth.network': 'Unable to reach the server. Check your internet connection and try again.',
      'auth.forgotInfo': 'Enter your email address: you will receive a link to choose a new password.',

      'lock.title': 'Enter your code', 'lock.wrong': 'Incorrect code.',
      'lock.wait': 'Too many attempts. Try again in {n} s.',
      'lock.forgot': 'Forgot your code? Disconnect this device',
      'lock.forgotConfirm': 'This device will be disconnected from your account and its local data erased. Your data stays synced and will come back at your next sign-in.',
      'lock.disconnect': 'Disconnect',

      'welcome.title': 'Welcome to Orée',
      'welcome.text': 'Choose your starting point. You can change everything afterwards.',
      'welcome.kitMine': 'My starter kit',
      'welcome.kitMineDesc': '7 life areas and activity categories, ready to customize.',
      'welcome.kitEmpty': 'Start from scratch',
      'welcome.kitEmptyDesc': 'No areas or categories: you create your own.',
      'welcome.done': 'Your space is ready.',

      'today.morning': 'Good morning', 'today.afternoon': 'Good afternoon', 'today.evening': 'Good evening',
      'today.domains': 'Your life areas',
      'today.noDomains': 'No areas yet. Add them in the settings.',
      'today.manageDomains': 'Manage areas',
      'soon.today': 'Your full day (time slots, protocol, tasks) arrives with the daily rhythm.',
      'soon.challenge': 'The review and vision program, step by step, scheduled on your calendar.',
      'soon.plan': 'Year, quarters, months, weeks: your goals broken down into tasks.',
      'soon.journals': 'Prayer, meetings and seeds, each in its own space.',
      'soon.library': 'Promises and verses, quotes, Vision Board and motivation videos.',
      'soon.lot': 'Planned for batch {n}',

      'set.account': 'Account', 'set.appearance': 'Appearance', 'set.language': 'Language',
      'set.lock': 'Lock', 'set.domains': 'Life areas', 'set.categories': 'Categories',
      'set.sync': 'Sync', 'set.backup': 'Backup', 'set.about': 'About',
      'set.theme': 'Theme', 'set.textSize': 'Text size',
      'theme.day': 'Day', 'theme.night': 'Night', 'theme.sepia': 'Sepia', 'theme.auto': 'Automatic',
      'size.90': 'Small', 'size.100': 'Normal', 'size.112': 'Large', 'size.125': 'Extra large',
      'lang.fr': 'Français', 'lang.en': 'English',
      'nav.title': 'Navigation on computer', 'nav.visible': 'Visible', 'nav.rail': 'Icons only', 'nav.hidden': 'Hidden',
      'nav.hint': 'This setting is specific to this device. The F10 key shows or hides the navigation.',
      'nav.hide': 'Hide navigation', 'nav.show': 'Show navigation', 'nav.pin': 'Always show',
      'win.title': 'Window',
      'win.fsHint': 'Full screen also hides the browser tabs and address bar. Press Esc or F11 to leave it.',
      'win.fullscreen': 'Full screen', 'win.exitFullscreen': 'Exit full screen',
      'win.installHint': 'Installed as an app, Orée opens in its own window, without tabs or address bar. In Chrome: ⋮ menu, "Save and share", then "Install Orée".',
      'win.install': 'Install Orée as an app', 'win.installed': 'Orée is already open as an app.',

      'account.signedInAs': 'Signed in as {email}.',
      'account.offlineMode': 'Offline mode: your local data is available, sign-in will return with the internet.',
      'account.signout': 'Sign out',
      'account.signoutConfirm': 'This device will be signed out and its local data erased. It stays in your account.',
      'account.signoutUnsynced': 'Warning: some changes are not synced yet and will be lost.',

      'lockset.info': 'The code protects access to the app on this device. It does not encrypt your data: per-section encryption will come in a dedicated batch.',
      'lockset.enable': 'Turn on the code', 'lockset.change': 'Change the code',
      'lockset.disable': 'Turn off the code', 'lockset.delay': 'Lock after',
      'delay.0': 'Immediately', 'delay.1': '1 minute', 'delay.5': '5 minutes', 'delay.15': '15 minutes',
      'lockset.new': 'New code (4 to 8 digits)', 'lockset.confirm': 'Confirm the code',
      'lockset.current': 'Current code', 'lockset.rule': 'The code must contain 4 to 8 digits.',
      'lockset.mismatch': 'The two codes do not match.',
      'lockset.on': 'Code turned on.', 'lockset.off': 'Code turned off.', 'lockset.changed': 'Code changed.',
      'lockset.wrongCurrent': 'Current code is incorrect.',

      'mgr.add': 'Add', 'mgr.newName': 'Name', 'mgr.rename': 'Rename', 'mgr.color': 'Color',
      'mgr.archive': 'Archive', 'mgr.restore': 'Restore', 'mgr.delete': 'Delete',
      'mgr.up': 'Move up', 'mgr.down': 'Move down',
      'mgr.showArchived': 'Show archived', 'mgr.hideArchived': 'Hide archived',
      'mgr.empty': 'Nothing here yet. Add your first item.',
      'mgr.deleteConfirm': 'Delete “{name}”?',
      'mgr.domainsInfo': 'Life areas are labels for your goals, promises and journals.',
      'mgr.categoriesInfo': 'Categories group your time slots and loose tasks, with their color.',
      'mgr.archivedTag': 'archived',

      'common.save': 'Save', 'common.cancel': 'Cancel', 'common.ok': 'OK', 'common.confirm': 'Confirm',

      'sync.offline': 'Offline', 'sync.syncing': 'Syncing…', 'sync.error': 'Sync failed',
      'sync.pending': '{n} pending', 'sync.ok': 'Synced at {time}', 'sync.never': 'Not synced yet',
      'sync.now': 'Sync now', 'sync.last': 'Last sync', 'sync.pendingLabel': 'Pending changes',
      'sync.info': 'Your data is saved on this device, then sent to your account as soon as a connection is available.',
      'sync.detail': 'Error details', 'sync.notAvailable': 'Sync is unavailable in offline mode.',

      'bk.info': 'Download a copy of your data or restore a backup.',
      'bk.export': 'Download the backup', 'bk.import': 'Restore a backup',
      'bk.importConfirm': 'Restore this backup? Items with the same identifier will be replaced.',
      'bk.done': 'Backup restored.', 'bk.error': 'Invalid backup file.',
      'bk.exported': 'Backup downloaded.',

      'about.version': 'Version',
      'about.text': 'Orée is your space for review, vision and rhythm. Your data is stored on this device and synced with your account.',

      'err.generic': 'Something went wrong: {msg}',

      'dom.1': 'Spiritual', 'dom.2': 'Ministry', 'dom.3': 'Career & studies',
      'dom.4': 'Social & family', 'dom.5': 'Personal (health & growth)',
      'dom.6': 'Finances', 'dom.7': 'Influence',
      'cat.1': 'Time with God', 'cat.2': 'Study', 'cat.3': 'Preparation', 'cat.4': 'Writing & editing',
      'cat.5': 'Housework', 'cat.6': 'Care & exercise', 'cat.7': 'Rest & leisure',
      'cat.8': 'Finances & business', 'cat.9': 'Ministry & sharing', 'cat.10': 'Sleep'
    }
  };

  /* ==========================================================
     Petits outils
     ========================================================== */
  const NS = 'http://www.w3.org/2000/svg';

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'on') for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
        else if (k === 'style') Object.assign(el.style, v);
        else if (k === 'for') el.htmlFor = v;
        else if (k in el && !k.includes('-')) el[k] = v;
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    const add = (kid) => {
      if (kid === null || kid === undefined || kid === false) return;
      if (Array.isArray(kid)) kid.forEach(add);
      else if (kid instanceof Node) el.append(kid);
      else el.append(document.createTextNode(String(kid)));
    };
    kids.forEach(add);
    return el;
  }

  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M8 7h8M8 11h6"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    sliders: '<path d="M4 6h9M19 6h1M4 12h3M13 12h7M4 18h11M21 18h-1"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11h14V8M10 12h4"/>',
    restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    install: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'
  };

  function icon(name, cls) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.8');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'ico' + (cls ? ' ' + cls : ''));
    s.innerHTML = ICONS[name] || '';
    return s;
  }

  function logo() {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 32 32');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<path class="logo-sun" d="M7 21a9 9 0 0 1 18 0z"/><path d="M3 21h26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>';
    return s;
  }

  function horizon() {
    const now = new Date();
    const hrs = now.getHours() + now.getMinutes() / 60;
    const day = hrs >= 6 && hrs <= 18;
    const f = Math.min(1, Math.max(0, (hrs - 6) / 12));
    const x = (40 + f * 520).toFixed(1);
    const y = (day ? 44 - 120 * f * (1 - f) : 60).toFixed(1);
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 600 64');
    s.setAttribute('class', 'horizon');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML =
      '<defs><clipPath id="above"><rect x="0" y="0" width="600" height="44"/></clipPath></defs>' +
      '<path class="h-arc" d="M40 44 Q300 -16 560 44" fill="none" stroke-dasharray="2 7" stroke-linecap="round"/>' +
      '<circle class="h-sun" cx="' + x + '" cy="' + y + '" r="11" clip-path="url(#above)"/>' +
      '<line class="h-line" x1="0" y1="44" x2="600" y2="44" stroke-linecap="round"/>';
    return s;
  }

  const byPos = (a, b) => (a.position - b.position) || String(a.created_at).localeCompare(String(b.created_at));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const b64e = (u8) => btoa(String.fromCharCode(...u8));
  const b64d = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const strip = (r) => { const { _dirty, _rev, ...x } = r; return x; };
  const guessLang = () => ((navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en');

  /* ==========================================================
     Stockage local (IndexedDB)
     ========================================================== */
  const IDB = (() => {
    let dbp = null;
    const open = () => dbp || (dbp = new Promise((resolve, reject) => {
      const r = indexedDB.open('oree', 1);
      r.onupgradeneeded = () => {
        const db = r.result;
        TABLES.forEach((s) => db.createObjectStore(s, { keyPath: 'id' }));
        db.createObjectStore('kv');
      };
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    }));
    const run = async (store, mode, fn) => {
      const db = await open();
      return new Promise((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        t.oncomplete = () => resolve(req ? req.result : undefined);
        t.onerror = t.onabort = () => reject(t.error);
      });
    };
    return {
      get: (s, k) => run(s, 'readonly', (o) => o.get(k)),
      all: (s) => run(s, 'readonly', (o) => o.getAll()),
      put: (s, v, k) => run(s, 'readwrite', (o) => (k === undefined ? o.put(v) : o.put(v, k))),
      del: (s, k) => run(s, 'readwrite', (o) => o.delete(k)),
      clear: (s) => run(s, 'readwrite', (o) => o.clear())
    };
  })();
  const kvGet = (k) => IDB.get('kv', k);
  const kvSet = (k, v) => IDB.put('kv', v, k);

  /* ==========================================================
     État
     ========================================================== */
  const PREF_KEY = 'oree.prefs';
  function readPrefs() {
    try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch (e) { return {}; }
  }
  const prefs0 = readPrefs();

  const S = {
    user: null,
    offline: false,
    recovery: false,
    signingOut: false,
    route: 'today',
    settings: {
      theme: prefs0.theme || 'auto',
      language: prefs0.language || guessLang(),
      data: { textSize: prefs0.textSize || 100 },
      _dirty: false,
      _rev: 0
    },
    lock: { enabled: false, delay: 5 },
    locked: false,
    lockUntil: 0,
    fails: 0,
    domains: [],
    categories: [],
    pending: 0,
    sync: { state: 'idle', last: null, error: '' },
    syncing: false,
    onboarding: false,
    auth: { mode: 'signin', email: '', err: '', ok: '', busy: false },
    ui: { showArch: { domains: false, categories: false } },
    nav: { mode: 'visible', last: 'visible' },
    navOpen: false,
    installEvt: null
  };
  let sb = null;

  function t(key, vars) {
    const lang = S.settings.language;
    let s = (I18N[lang] && I18N[lang][key]) || I18N.fr[key] || key;
    if (vars) for (const k of Object.keys(vars)) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }

  const fmtTime = (d) => new Date(d).toLocaleTimeString(S.settings.language, { hour: '2-digit', minute: '2-digit' });

  /* ==========================================================
     Navigation sur ordinateur, plein écran, installation
     ========================================================== */
  const modalStack = [];
  const NAV_KEY = 'oree.nav';
  const NAV_MODES = ['visible', 'rail', 'hidden'];

  function readNav() {
    try {
      const v = JSON.parse(localStorage.getItem(NAV_KEY));
      if (v && NAV_MODES.includes(v.mode)) return { mode: v.mode, last: ['visible', 'rail'].includes(v.last) ? v.last : 'visible' };
    } catch (e) { /* valeur illisible : on repart du réglage par défaut */ }
    return { mode: 'visible', last: 'visible' };
  }
  S.nav = readNav();

  function setNav(mode) {
    if (mode !== 'hidden') S.nav.last = mode;
    S.nav.mode = mode;
    S.navOpen = false;
    try { localStorage.setItem(NAV_KEY, JSON.stringify(S.nav)); } catch (e) { /* sans conséquence */ }
    render();
  }

  function toggleNav() {
    setNav(S.nav.mode === 'hidden' ? (S.nav.last || 'visible') : 'hidden');
  }

  const isWide = () => window.matchMedia('(min-width: 861px)').matches;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  async function installApp() {
    const e = S.installEvt;
    if (!e) return;
    e.prompt();
    try { await e.userChoice; } catch (err) { /* choix ignoré */ }
    S.installEvt = null;
    if (S.route === 'settings/appearance') render();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'F10' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
      if (S.user && !S.locked && !S.recovery && isWide() && !modalStack.length) { e.preventDefault(); toggleNav(); }
    } else if (e.key === 'Escape' && S.navOpen && !modalStack.length) {
      S.navOpen = false;
      render();
    }
  });
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    S.installEvt = e;
    if (S.route === 'settings/appearance') render();
  });
  window.addEventListener('appinstalled', () => { S.installEvt = null; if (S.route === 'settings/appearance') render(); });
  document.addEventListener('fullscreenchange', () => { if (S.route === 'settings/appearance') render(); });

  /* ==========================================================
     Thème, langue, taille du texte
     ========================================================== */
  const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const THEME_COLOR = { day: '#ffffff', night: '#151821', sepia: '#f3ebd9' };

  function applyTheme() {
    const pref = S.settings.theme;
    const eff = pref === 'auto' ? (darkQuery && darkQuery.matches ? 'night' : 'day') : pref;
    const root = document.documentElement;
    root.dataset.theme = eff;
    root.lang = S.settings.language;
    root.style.fontSize = ((S.settings.data && S.settings.data.textSize) || 100) + '%';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLOR[eff] || '#ffffff');
  }
  if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener('change', applyTheme);

  function mirrorPrefs() {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify({
        theme: S.settings.theme,
        language: S.settings.language,
        textSize: (S.settings.data && S.settings.data.textSize) || 100
      }));
    } catch (e) { /* stockage indisponible : sans conséquence */ }
  }

  async function updateSettings(patch, dataPatch) {
    const s = S.settings;
    if (patch) Object.assign(s, patch);
    if (dataPatch) s.data = { ...(s.data || {}), ...dataPatch };
    s._dirty = true;
    s._rev = (s._rev || 0) + 1;
    await kvSet('settings', s);
    mirrorPrefs();
    applyTheme();
    await loadLists();
    render();
    scheduleSync();
  }

  /* ==========================================================
     Chargement des données locales
     ========================================================== */
  async function loadLocal() {
    const s = await kvGet('settings');
    if (s) S.settings = s;
    else await kvSet('settings', S.settings);
    if (!S.settings.data) S.settings.data = { textSize: 100 };
    const lk = await kvGet('lock');
    S.lock = lk || { enabled: false, delay: 5 };
    S.sync.last = (await kvGet('lastSync')) || null;
    mirrorPrefs();
    applyTheme();
  }

  async function loadLists() {
    const [d, c] = await Promise.all([IDB.all('domains'), IDB.all('categories')]);
    S.domains = d;
    S.categories = c;
    S.pending = d.filter((x) => x._dirty).length + c.filter((x) => x._dirty).length + (S.settings._dirty ? 1 : 0);
  }

  async function wipeLocal() {
    await IDB.clear('domains');
    await IDB.clear('categories');
    for (const k of ['user', 'settings', 'lock', 'lastSync', 'pull_domains', 'pull_categories']) await IDB.del('kv', k);
    const p = readPrefs();
    S.settings = { theme: p.theme || 'auto', language: p.language || guessLang(), data: { textSize: p.textSize || 100 }, _dirty: false, _rev: 0 };
    S.lock = { enabled: false, delay: 5 };
    S.domains = [];
    S.categories = [];
    S.pending = 0;
    S.sync = { state: 'idle', last: null, error: '' };
    S.locked = false;
    await kvSet('settings', S.settings);
    applyTheme();
  }

  /* ==========================================================
     Fenêtres, messages
     ========================================================== */
  function modal({ title, body, actions = [], onDismiss }) {
    const back = h('div', { class: 'modal-back' });
    const api = {
      close() {
        back.remove();
        const i = modalStack.indexOf(api);
        if (i >= 0) modalStack.splice(i, 1);
      },
      dismiss() {
        api.close();
        if (onDismiss) onDismiss();
      }
    };
    const box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h('h2', null, title),
      body || null,
      actions.length ? h('div', { class: 'modal-actions' }, actions.map((a) => h('button', {
        type: 'button',
        class: 'btn ' + (a.kind || ''),
        on: { click: async () => { const r = a.onClick ? await a.onClick() : undefined; if (r !== false) api.close(); } }
      }, a.label))) : null
    );
    back.append(box);
    back.addEventListener('mousedown', (e) => { if (e.target === back) api.dismiss(); });
    document.body.append(back);
    modalStack.push(api);
    const first = box.querySelector('input, .choice, button');
    if (first) first.focus();
    return api;
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalStack.length) modalStack[modalStack.length - 1].dismiss();
  });

  function confirmDialog(message, okLabel, danger) {
    return new Promise((resolve) => {
      modal({
        title: t('common.confirm'),
        body: h('p', null, message),
        actions: [
          { label: t('common.cancel'), onClick: () => resolve(false) },
          { label: okLabel || t('common.ok'), kind: danger ? 'danger' : 'primary', onClick: () => resolve(true) }
        ],
        onDismiss: () => resolve(false)
      });
    });
  }

  function textPrompt({ title, label, value = '', ok }) {
    return new Promise((resolve) => {
      const inp = h('input', { type: 'text', value, maxlength: 80, id: 'tp-input' });
      const submit = () => {
        const v = inp.value.trim();
        if (!v) return false;
        resolve(v);
        return undefined;
      };
      const m = modal({
        title,
        body: h('div', { class: 'field' }, h('label', { for: 'tp-input' }, label), inp),
        actions: [
          { label: t('common.cancel'), onClick: () => resolve(null) },
          { label: ok || t('common.save'), kind: 'primary', onClick: submit }
        ],
        onDismiss: () => resolve(null)
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); if (submit() !== false) m.close(); }
      });
    });
  }

  function pickColor(current) {
    return new Promise((resolve) => {
      let m = null;
      const grid = h('div', { class: 'swatchgrid' }, PALETTE.map((c) => {
        const b = h('button', {
          type: 'button', class: 'swatch', 'aria-label': c, 'aria-pressed': String(c === current),
          on: { click: () => { resolve(c); m.close(); } }
        });
        b.style.background = c;
        return b;
      }));
      m = modal({
        title: t('mgr.color'),
        body: grid,
        actions: [{ label: t('common.cancel'), onClick: () => resolve(null) }],
        onDismiss: () => resolve(null)
      });
    });
  }

  function toast(msg) {
    const el = h('div', { class: 'toast', role: 'status' }, msg);
    document.body.append(el);
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2800);
  }

  /* ==========================================================
     Synchronisation
     ========================================================== */
  function statusInfo() {
    if (!S.user) return { state: 'idle', text: '' };
    if (S.sync.state === 'syncing') return { state: 'syncing', text: t('sync.syncing') };
    if (S.offline || !navigator.onLine) return { state: 'offline', text: t('sync.offline') };
    if (S.sync.state === 'error') return { state: 'error', text: t('sync.error') };
    if (S.pending > 0) return { state: 'pending', text: t('sync.pending', { n: S.pending }) };
    if (S.sync.last) return { state: 'ok', text: t('sync.ok', { time: fmtTime(S.sync.last) }) };
    return { state: 'idle', text: t('sync.never') };
  }

  function chip() {
    const i = statusInfo();
    return h('span', { class: 'chip', 'data-state': i.state, role: 'status' }, i.text);
  }

  function updateChips() {
    const i = statusInfo();
    document.querySelectorAll('.chip').forEach((c) => { c.dataset.state = i.state; c.textContent = i.text; });
    const nt = document.querySelector('.navtoggle');
    if (nt) nt.dataset.state = i.state;
  }

  let syncTimer = null;
  function scheduleSync(ms = 1200) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncAll, ms);
  }

  async function pushSettings() {
    const s = S.settings;
    if (!s._dirty) return;
    const rev = s._rev;
    const { error } = await sb.from('oree_settings').upsert(
      { user_id: S.user.id, theme: s.theme, language: s.language, data: s.data },
      { onConflict: 'user_id' }
    );
    if (error) throw error;
    if (S.settings._rev === rev) { S.settings._dirty = false; await kvSet('settings', S.settings); }
  }

  async function pullSettings() {
    const { data, error } = await sb.from('oree_settings').select('*').eq('user_id', S.user.id).maybeSingle();
    if (error) throw error;
    const local = S.settings;
    if (data) {
      if (!local._dirty) {
        local.theme = data.theme;
        local.language = data.language;
        local.data = { ...(data.data || {}) };
        await kvSet('settings', local);
        mirrorPrefs();
        applyTheme();
      }
    } else if (!local._dirty) {
      local._dirty = true;
      local._rev = (local._rev || 0) + 1;
      await kvSet('settings', local);
    }
  }

  async function pushTable(kind) {
    const rows = (await IDB.all(kind)).filter((r) => r._dirty);
    for (let i = 0; i < rows.length; i += 200) {
      const chunk = rows.slice(i, i + 200);
      const payload = chunk.map((r) => ({ ...strip(r), user_id: S.user.id }));
      const { error } = await sb.from('oree_' + kind).upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      for (const r of chunk) {
        const cur = await IDB.get(kind, r.id);
        if (cur && cur._rev === r._rev) { cur._dirty = false; await IDB.put(kind, cur); }
      }
    }
  }

  async function pullTable(kind) {
    const LIMIT = 1000;
    let since = (await kvGet('pull_' + kind)) || '1970-01-01T00:00:00+00:00';
    for (let guard = 0; guard < 50; guard++) {
      const { data, error } = await sb.from('oree_' + kind).select('*')
        .gte('updated_at', since).order('updated_at', { ascending: true }).limit(LIMIT);
      if (error) throw error;
      if (!data || !data.length) break;
      for (const r of data) {
        const local = await IDB.get(kind, r.id);
        if (local && local._dirty) continue; // la modification locale gagne et sera envoyée
        await IDB.put(kind, { ...r, _dirty: false, _rev: local ? (local._rev || 0) : 0 });
      }
      const last = data[data.length - 1].updated_at;
      await kvSet('pull_' + kind, last);
      if (data.length < LIMIT || last === since) break;
      since = last;
    }
  }

  async function syncAll() {
    if (!S.user || S.offline || !navigator.onLine || S.syncing || !sb) return;
    S.syncing = true;
    S.sync.state = 'syncing';
    updateChips();
    try {
      await pullSettings();
      await pushSettings();
      for (const k of TABLES) { await pushTable(k); await pullTable(k); }
      S.sync.state = 'ok';
      S.sync.error = '';
      S.sync.last = new Date().toISOString();
      await kvSet('lastSync', S.sync.last);
    } catch (e) {
      S.sync.state = 'error';
      S.sync.error = (e && e.message) ? e.message : String(e);
    } finally {
      S.syncing = false;
    }
    await loadLists();
    updateChips();
    if (S.user && !S.locked && !S.recovery) render();
  }

  /* ==========================================================
     Enregistrements (domaines, catégories)
     ========================================================== */
  function newRecord(kind, name, color, position) {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(), user_id: S.user.id, name, color, icon: null,
      position, archived: false, deleted_at: null, created_at: now, updated_at: now,
      _dirty: true, _rev: 1
    };
  }

  async function saveRecord(kind, rec) {
    rec.updated_at = new Date().toISOString();
    rec._dirty = true;
    rec._rev = (rec._rev || 0) + 1;
    await IDB.put(kind, rec);
  }

  async function afterChange() {
    await loadLists();
    render();
    updateChips();
    scheduleSync();
  }

  function nextPosition(kind) {
    return S[kind].reduce((m, r) => Math.max(m, r.position), -1) + 1;
  }

  async function applyKit() {
    for (let i = 1; i <= 7; i++) await saveRecord('domains', newRecord('domains', t('dom.' + i), PALETTE[i - 1], i - 1));
    for (let i = 1; i <= 10; i++) await saveRecord('categories', newRecord('categories', t('cat.' + i), PALETTE[(i - 1) % PALETTE.length], i - 1));
    await afterChange();
  }

  async function maybeOnboard() {
    if (!S.user || S.offline || S.onboarding || S.settings.data.onboarded) return;
    const live = S.domains.filter((d) => !d.deleted_at).length + S.categories.filter((c) => !c.deleted_at).length;
    if (live > 0) { await updateSettings(null, { onboarded: true }); return; }
    S.onboarding = true;
    let m = null;
    const choose = async (kit) => {
      m.close();
      if (kit === 'mine') await applyKit();
      S.onboarding = false;
      await updateSettings(null, { onboarded: true });
      toast(t('welcome.done'));
    };
    const choice = (title, desc, kit) => h('button', { type: 'button', class: 'choice', on: { click: () => choose(kit) } },
      h('strong', null, title), h('span', null, desc));
    m = modal({
      title: t('welcome.title'),
      body: h('div', null,
        h('p', null, t('welcome.text')),
        choice(t('welcome.kitMine'), t('welcome.kitMineDesc'), 'mine'),
        choice(t('welcome.kitEmpty'), t('welcome.kitEmptyDesc'), 'empty')),
      actions: [],
      onDismiss: () => { S.onboarding = false; }
    });
  }

  /* ==========================================================
     Verrouillage par code
     ========================================================== */
  async function hashPin(pin, saltB64) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: b64d(saltB64), iterations: 200000, hash: 'SHA-256' }, key, 256);
    return b64e(new Uint8Array(bits));
  }

  async function makeLock(pin, delay) {
    const salt = b64e(crypto.getRandomValues(new Uint8Array(16)));
    return { enabled: true, salt, hash: await hashPin(pin, salt), len: pin.length, delay };
  }

  async function verifyPin(pin) {
    return (await hashPin(pin, S.lock.salt)) === S.lock.hash;
  }

  async function saveLock(cfg) {
    S.lock = cfg;
    await kvSet('lock', cfg);
  }

  function pinFields(labels) {
    return labels.map((label, i) => h('div', { class: 'field' },
      h('label', { for: 'pin' + i }, label),
      h('input', {
        type: 'password', id: 'pin' + i, inputmode: 'numeric', maxlength: 8,
        autocomplete: 'off', pattern: '[0-9]*'
      })));
  }

  function pinDialog({ title, labels, validate, okLabel }) {
    return new Promise((resolve) => {
      const fields = pinFields(labels);
      const err = h('p', { class: 'msg err', role: 'alert' });
      err.hidden = true;
      const body = h('div', null, fields, err);
      modal({
        title,
        body,
        actions: [
          { label: t('common.cancel'), onClick: () => resolve(null) },
          {
            label: okLabel || t('common.save'), kind: 'primary',
            onClick: async () => {
              const vals = fields.map((f) => f.querySelector('input').value);
              const problem = await validate(vals);
              if (problem) { err.textContent = problem; err.hidden = false; return false; }
              resolve(vals);
              return undefined;
            }
          }
        ],
        onDismiss: () => resolve(null)
      });
    });
  }

  const pinRule = (v) => /^\d{4,8}$/.test(v);

  async function enablePin() {
    const vals = await pinDialog({
      title: t('lockset.enable'),
      labels: [t('lockset.new'), t('lockset.confirm')],
      validate: async ([a, b]) => (!pinRule(a) ? t('lockset.rule') : a !== b ? t('lockset.mismatch') : '')
    });
    if (!vals) return;
    await saveLock(await makeLock(vals[0], S.lock.delay ?? 5));
    toast(t('lockset.on'));
    render();
  }

  async function changePin() {
    const vals = await pinDialog({
      title: t('lockset.change'),
      labels: [t('lockset.current'), t('lockset.new'), t('lockset.confirm')],
      validate: async ([cur, a, b]) => {
        if (!(await verifyPin(cur))) return t('lockset.wrongCurrent');
        if (!pinRule(a)) return t('lockset.rule');
        return a !== b ? t('lockset.mismatch') : '';
      }
    });
    if (!vals) return;
    await saveLock(await makeLock(vals[1], S.lock.delay ?? 5));
    toast(t('lockset.changed'));
    render();
  }

  async function disablePin() {
    const vals = await pinDialog({
      title: t('lockset.disable'),
      labels: [t('lockset.current')],
      validate: async ([cur]) => ((await verifyPin(cur)) ? '' : t('lockset.wrongCurrent'))
    });
    if (!vals) return;
    await saveLock({ enabled: false, delay: S.lock.delay ?? 5 });
    toast(t('lockset.off'));
    render();
  }

  let hiddenAt = null;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hiddenAt = Date.now(); return; }
    if (S.user && S.lock.enabled && hiddenAt !== null && !S.locked &&
        Date.now() - hiddenAt >= (S.lock.delay ?? 5) * 60000) {
      S.locked = true;
      render();
    }
    hiddenAt = null;
    if (S.user && !S.offline) scheduleSync(400);
  });

  let lockCtl = null;
  document.addEventListener('keydown', (e) => {
    if (!S.locked || !lockCtl || modalStack.length) return;
    if (/^[0-9]$/.test(e.key)) lockCtl.press(e.key);
    else if (e.key === 'Backspace') lockCtl.back();
  });

  function viewLock() {
    let entered = '';
    const len = S.lock.len || 4;
    const dots = h('div', { class: 'dots', 'aria-hidden': 'true' }, Array.from({ length: len }, () => h('span')));
    const msg = h('p', { class: 'lock-msg', role: 'status' }, '');
    const paint = () => [...dots.children].forEach((d, i) => d.classList.toggle('on', i < entered.length));
    const press = async (d) => {
      if (Date.now() < S.lockUntil) {
        msg.textContent = t('lock.wait', { n: Math.ceil((S.lockUntil - Date.now()) / 1000) });
        return;
      }
      if (entered.length >= len) return;
      entered += d;
      paint();
      if (entered.length < len) return;
      const ok = await verifyPin(entered);
      if (ok) { S.fails = 0; S.locked = false; lockCtl = null; render(); return; }
      S.fails++;
      entered = '';
      dots.classList.remove('shake');
      void dots.offsetWidth;
      dots.classList.add('shake');
      if (S.fails >= 5) { S.lockUntil = Date.now() + 30000; S.fails = 0; msg.textContent = t('lock.wait', { n: 30 }); }
      else msg.textContent = t('lock.wrong');
      setTimeout(paint, 300);
    };
    const back = () => { entered = entered.slice(0, -1); paint(); };
    lockCtl = { press, back };
    const key = (label, fn, extra) => h('button', {
      type: 'button', class: extra || '', 'aria-label': extra ? undefined : String(label), on: { click: fn }
    }, label);
    const pad = h('div', { class: 'pad' },
      ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => key(d, () => press(d))),
      h('button', { type: 'button', class: 'blank', tabindex: -1, 'aria-hidden': 'true' }, ''),
      key('0', () => press('0')),
      h('button', { type: 'button', 'aria-label': '⌫', on: { click: back } }, '⌫'));
    return h('main', { class: 'lock' },
      logo(),
      h('h1', null, t('lock.title')),
      dots, msg, pad,
      h('button', { type: 'button', class: 'linkbtn', on: { click: forgotPin } }, t('lock.forgot')));
  }

  async function forgotPin() {
    const ok = await confirmDialog(t('lock.forgotConfirm'), t('lock.disconnect'), true);
    if (ok) await doSignOut();
  }

  /* ==========================================================
     Connexion
     ========================================================== */
  function authError(err) {
    const m = (err && err.message) ? err.message : String(err);
    if (/invalid login credentials/i.test(m)) return t('auth.invalid');
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(m)) return t('auth.network');
    return m;
  }

  async function onAuthSubmit(e) {
    e.preventDefault();
    const A = S.auth;
    const f = e.target;
    const email = f.elements.email.value.trim();
    const pw = f.elements.password ? f.elements.password.value : '';
    A.email = email; A.err = ''; A.ok = '';
    if (!navigator.onLine) { A.err = t('auth.offline'); render(); return; }
    if (A.mode === 'forgot' && !email) { A.err = t('auth.needEmailOnly'); render(); return; }
    if (A.mode !== 'forgot' && (!email || !pw)) { A.err = t('auth.needEmail'); render(); return; }
    if (A.mode === 'signup' && pw.length < 8) { A.err = t('auth.shortPw'); render(); return; }
    A.busy = true;
    render();
    try {
      if (A.mode === 'forgot') {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
        if (error) throw error;
        A.ok = t('auth.resetSent');
      } else if (A.mode === 'signup') {
        const { data, error } = await sb.auth.signUp({ email, password: pw, options: { emailRedirectTo: location.origin + location.pathname } });
        if (error) throw error;
        if (data.session) { A.busy = false; await afterLogin(data.session); return; }
        A.ok = t('auth.confirmSent');
      } else {
        const { data, error } = await sb.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        A.busy = false;
        await afterLogin(data.session);
        return;
      }
    } catch (err) {
      A.err = authError(err);
    }
    A.busy = false;
    render();
  }

  function viewAuth() {
    const A = S.auth;
    const mode = A.mode;
    const fields = [
      h('div', { class: 'field' },
        h('label', { for: 'a-email' }, t('auth.email')),
        h('input', { type: 'email', id: 'a-email', name: 'email', autocomplete: 'username', value: A.email || '', inputmode: 'email' }))
    ];
    if (mode !== 'forgot') {
      fields.push(h('div', { class: 'field' },
        h('label', { for: 'a-pw' }, t('auth.password')),
        h('input', { type: 'password', id: 'a-pw', name: 'password', autocomplete: mode === 'signup' ? 'new-password' : 'current-password' })));
    }
    const submitLabel = mode === 'forgot' ? t('auth.sendReset') : mode === 'signup' ? t('auth.signup') : t('auth.signin');
    const form = h('form', { on: { submit: onAuthSubmit }, novalidate: true },
      mode === 'forgot' ? h('p', { class: 'muted' }, t('auth.forgotInfo')) : null,
      A.err ? h('p', { class: 'msg err', role: 'alert' }, A.err) : null,
      A.ok ? h('p', { class: 'msg ok', role: 'status' }, A.ok) : null,
      fields,
      h('button', { type: 'submit', class: 'btn primary block', disabled: A.busy }, submitLabel));
    const links = h('div', null,
      mode === 'signin' ? h('button', { type: 'button', class: 'linkbtn', on: { click: () => { A.mode = 'forgot'; A.err = ''; A.ok = ''; render(); } } }, t('auth.forgot')) : null,
      mode !== 'signin' ? h('button', { type: 'button', class: 'linkbtn', on: { click: () => { A.mode = 'signin'; A.err = ''; A.ok = ''; render(); } } }, t('auth.back')) : null,
      CONFIG.ALLOW_SIGNUP && mode === 'signin' ? h('div', null, h('button', { type: 'button', class: 'linkbtn', on: { click: () => { A.mode = 'signup'; A.err = ''; A.ok = ''; render(); } } }, t('auth.signup'))) : null);
    return h('main', { class: 'auth' },
      h('div', { class: 'auth-box' },
        h('div', { class: 'auth-brand' }, logo(), 'Orée'),
        h('p', { class: 'lede' }, t('app.tagline')),
        form, links));
  }

  function viewRecovery() {
    const f = h('form', {
      novalidate: true,
      on: {
        submit: async (e) => {
          e.preventDefault();
          const pw = e.target.elements.password.value;
          if (pw.length < 8) { S.auth.err = t('auth.shortPw'); render(); return; }
          const { data, error } = await sb.auth.updateUser({ password: pw });
          if (error) { S.auth.err = authError(error); render(); return; }
          S.auth.err = '';
          S.recovery = false;
          const { data: sd } = await sb.auth.getSession();
          if (sd && sd.session) await afterLogin(sd.session);
          else render();
        }
      }
    },
    S.auth.err ? h('p', { class: 'msg err', role: 'alert' }, S.auth.err) : null,
    h('div', { class: 'field' },
      h('label', { for: 'r-pw' }, t('auth.newPassword')),
      h('input', { type: 'password', id: 'r-pw', name: 'password', autocomplete: 'new-password' })),
    h('button', { type: 'submit', class: 'btn primary block' }, t('auth.savePassword')));
    return h('main', { class: 'auth' }, h('div', { class: 'auth-box' },
      h('div', { class: 'auth-brand' }, logo(), 'Orée'), f));
  }

  async function afterLogin(session) {
    const u = { id: session.user.id, email: session.user.email };
    const prev = await kvGet('user');
    if (prev && prev.id !== u.id) await wipeLocal();
    S.user = u;
    S.offline = false;
    await kvSet('user', u);
    await loadLocal();
    await loadLists();
    S.locked = false;
    S.auth = { mode: 'signin', email: '', err: '', ok: '', busy: false };
    if (!location.hash.startsWith('#/')) location.hash = '#/today';
    S.route = currentRoute();
    render();
    await syncAll();
    await maybeOnboard();
  }

  async function doSignOut() {
    S.signingOut = true;
    try { if (sb) await sb.auth.signOut(); } catch (e) { /* hors-ligne : la session locale est supprimée ci-dessous */ }
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('sb-')).forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* sans conséquence */ }
    await wipeLocal();
    S.user = null;
    S.offline = false;
    S.signingOut = false;
    location.hash = '#/today';
    render();
  }

  async function signOut() {
    await loadLists();
    const msg = t('account.signoutConfirm') + (S.pending > 0 ? ' ' + t('account.signoutUnsynced') : '');
    if (await confirmDialog(msg, t('account.signout'), true)) await doSignOut();
  }

  function onAuthEvent(event) {
    if (event === 'PASSWORD_RECOVERY') { S.recovery = true; render(); }
    else if (event === 'SIGNED_OUT' && S.user && !S.signingOut) { S.user = null; render(); }
  }

  /* ==========================================================
     Vues : structure
     ========================================================== */
  const currentRoute = () => { const m = location.hash.match(/^#\/(.*)$/); return m ? m[1] : 'today'; };

  const NAV_ICONS = { today: 'sun', challenge: 'flag', plan: 'calendar', journals: 'book', library: 'bookmark' };
  const NAV = ['today', 'challenge', 'plan', 'journals', 'library'];

  function viewShell() {
    const route = S.route.split('/')[0] || 'today';
    const mode = S.nav.mode;
    const navLink = (k) => h('a', { href: '#/' + k, 'aria-current': route === k ? 'page' : null },
      icon(NAV_ICONS[k]), h('span', { class: 'label' }, t('tab.' + k)));
    const brand = () => h('a', { class: 'brand', href: '#/today' }, logo(), h('span', { class: 'brand-name' }, 'Orée'));
    const navBtn = mode === 'hidden'
      ? h('button', { type: 'button', class: 'side-link', on: { click: () => setNav(S.nav.last || 'visible') } },
        icon('panel'), h('span', { class: 'label' }, t('nav.pin')))
      : h('button', { type: 'button', class: 'side-link', on: { click: () => setNav('hidden') } },
        icon('panel'), h('span', { class: 'label' }, t('nav.hide')));
    const sidebar = h('aside', { class: 'sidebar' },
      brand(),
      h('nav', { class: 'nav', 'aria-label': 'Navigation' }, NAV.map(navLink)),
      h('div', { class: 'side-foot' },
        chip(),
        h('a', { class: 'side-link', href: '#/settings', 'aria-current': route === 'settings' ? 'page' : null },
          icon('sliders'), h('span', { class: 'label' }, t('tab.settings'))),
        navBtn));
    const topbar = h('header', { class: 'topbar' },
      brand(),
      h('div', { class: 'right' }, chip(),
        h('a', { class: 'iconbtn', href: '#/settings', 'aria-label': t('tab.settings') }, icon('sliders'))));
    const tabbar = h('nav', { class: 'tabbar', 'aria-label': 'Navigation' }, NAV.map((k) =>
      h('a', { href: '#/' + k, 'aria-current': route === k ? 'page' : null }, icon(NAV_ICONS[k]), t('tab.' + k))));
    const toggle = mode === 'hidden'
      ? h('button', {
        type: 'button', class: 'navtoggle', 'data-state': statusInfo().state,
        'aria-label': t('nav.show'), 'aria-expanded': String(S.navOpen), title: t('nav.show') + ' (F10)',
        on: { click: () => { S.navOpen = !S.navOpen; render(); } }
      }, icon('menu'))
      : null;
    const backdrop = mode === 'hidden' && S.navOpen
      ? h('div', { class: 'nav-backdrop', on: { click: () => { S.navOpen = false; render(); } } })
      : null;
    return h('div', { class: 'shell' + (S.navOpen ? ' nav-open' : ''), 'data-nav': mode },
      sidebar, h('div', { class: 'main' }, topbar, viewMain()), tabbar, toggle, backdrop);
  }

  function viewMain() {
    const [a, b] = S.route.split('/');
    switch (a) {
      case 'settings': return viewSettings(b);
      case 'challenge': case 'plan': case 'journals': case 'library': return viewSoon(a);
      default: return viewToday();
    }
  }

  function viewToday() {
    const now = new Date();
    const hr = now.getHours();
    const greet = hr < 12 ? t('today.morning') : hr < 18 ? t('today.afternoon') : t('today.evening');
    const dateStr = now.toLocaleDateString(S.settings.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const doms = S.domains.filter((d) => !d.deleted_at && !d.archived).sort(byPos);
    const dotI = (c) => { const i = h('i'); i.style.background = c || 'var(--muted)'; return i; };
    return h('main', { class: 'page' },
      h('h1', { class: 'note-title' }, greet),
      h('p', { class: 'lede' }, cap(dateStr) + ', ', h('span', { class: 'clock' }, fmtTime(now))),
      horizon(),
      h('h2', { class: 'section' }, t('today.domains')),
      doms.length
        ? h('div', { class: 'chips' }, doms.map((d) => h('span', { class: 'dchip' }, dotI(d.color), d.name)))
        : h('p', { class: 'empty' }, t('today.noDomains')),
      h('div', { class: 'actions' }, h('a', { class: 'btn', href: '#/settings/domains' }, t('today.manageDomains'))),
      h('div', { class: 'soon' }, h('p', null, t('soon.today')), h('span', { class: 'pill' }, t('soon.lot', { n: 3 }))));
  }

  function viewSoon(key) {
    return h('main', { class: 'page' },
      h('h1', { class: 'note-title' }, t('tab.' + key)),
      h('div', { class: 'soon' }, h('p', null, t('soon.' + key)), h('span', { class: 'pill' }, t('soon.lot', { n: LOT_OF[key] }))));
  }

  /* ==========================================================
     Vues : réglages
     ========================================================== */
  const SET_SECTIONS = ['account', 'appearance', 'language', 'lock', 'domains', 'categories', 'sync', 'backup', 'about'];

  function viewSettings(sec) {
    if (!sec || !SET_SECTIONS.includes(sec)) return viewSettingsHome();
    const builders = {
      account: secAccount, appearance: secAppearance, language: secLanguage, lock: secLock,
      domains: () => viewManager('domains'), categories: () => viewManager('categories'),
      sync: secSync, backup: secBackup, about: secAbout
    };
    return h('main', { class: 'page' },
      h('a', { class: 'backlink', href: '#/settings' }, icon('back'), t('tab.settings')),
      h('h1', { class: 'note-title' }, t('set.' + sec)),
      builders[sec]());
  }

  function viewSettingsHome() {
    const live = (k) => S[k].filter((r) => !r.deleted_at && !r.archived).length;
    const hints = {
      account: S.user ? S.user.email : '',
      appearance: t('theme.' + S.settings.theme),
      language: t('lang.' + S.settings.language),
      lock: S.lock.enabled ? t('lockset.on').replace('.', '') : '',
      domains: String(live('domains')),
      categories: String(live('categories')),
      sync: statusInfo().text,
      backup: '',
      about: CONFIG.VERSION
    };
    return h('main', { class: 'page' },
      h('h1', { class: 'note-title' }, t('tab.settings')),
      h('ul', { class: 'list' }, SET_SECTIONS.map((k) => h('li', null,
        h('a', { class: 'row', href: '#/settings/' + k },
          h('span', { class: 'grow' }, t('set.' + k)),
          h('span', { class: 'hint' }, hints[k]),
          icon('chev', 'chev'))))));
  }

  function segButtons(options, current, onPick) {
    return h('div', { class: 'seg', role: 'group' }, options.map(([value, label]) => h('button', {
      type: 'button', class: 'btn', 'aria-pressed': String(value === current),
      on: { click: () => onPick(value) }
    }, label)));
  }

  function secAccount() {
    return h('div', null,
      h('p', null, t('account.signedInAs', { email: S.user.email || '' })),
      S.offline ? h('p', { class: 'msg ok' }, t('account.offlineMode')) : null,
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn danger', on: { click: signOut } }, t('account.signout'))));
  }

  function secAppearance() {
    const canFs = !!document.fullscreenEnabled;
    return h('div', null,
      h('h2', { class: 'section' }, t('set.theme')),
      segButtons(['day', 'night', 'sepia', 'auto'].map((k) => [k, t('theme.' + k)]), S.settings.theme,
        (v) => updateSettings({ theme: v })),
      h('h2', { class: 'section' }, t('set.textSize')),
      segButtons(TEXT_SIZES.map((n) => [n, t('size.' + n)]), (S.settings.data && S.settings.data.textSize) || 100,
        (v) => updateSettings(null, { textSize: v })),
      h('h2', { class: 'section' }, t('nav.title')),
      segButtons(NAV_MODES.map((k) => [k, t('nav.' + k)]), S.nav.mode, (v) => setNav(v)),
      h('p', { class: 'muted' }, t('nav.hint')),
      h('h2', { class: 'section' }, t('win.title')),
      h('p', { class: 'muted' }, t('win.fsHint')),
      canFs ? h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn', on: { click: toggleFullscreen } },
        icon('expand'), document.fullscreenElement ? t('win.exitFullscreen') : t('win.fullscreen'))) : null,
      h('p', { class: 'muted' }, t('win.installHint')),
      isStandalone()
        ? h('p', { class: 'msg ok' }, t('win.installed'))
        : S.installEvt
          ? h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary', on: { click: installApp } },
            icon('install'), t('win.install')))
          : null);
  }

  function secLanguage() {
    return segButtons([['fr', t('lang.fr')], ['en', t('lang.en')]], S.settings.language,
      (v) => updateSettings({ language: v }));
  }

  function secLock() {
    const on = S.lock.enabled;
    const delaySel = h('select', {
      id: 'delay', 'aria-label': t('lockset.delay'),
      on: { change: async (e) => { await saveLock({ ...S.lock, delay: Number(e.target.value) }); } }
    }, [0, 1, 5, 15].map((n) => h('option', { value: String(n), selected: n === (S.lock.delay ?? 5) }, t('delay.' + n))));
    return h('div', null,
      h('p', { class: 'lede' }, t('lockset.info')),
      on
        ? h('div', null,
          h('div', { class: 'field' }, h('label', { for: 'delay' }, t('lockset.delay')), delaySel),
          h('div', { class: 'actions' },
            h('button', { type: 'button', class: 'btn', on: { click: changePin } }, t('lockset.change')),
            h('button', { type: 'button', class: 'btn danger', on: { click: disablePin } }, t('lockset.disable'))))
        : h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary', on: { click: enablePin } }, t('lockset.enable'))));
  }

  function secSync() {
    const i = statusInfo();
    return h('div', null,
      h('p', { class: 'lede' }, t('sync.info')),
      h('p', null, chip()),
      h('ul', { class: 'list' },
        h('li', null, h('div', { class: 'row' }, h('span', { class: 'grow' }, t('sync.last')),
          h('span', { class: 'hint' }, S.sync.last ? new Date(S.sync.last).toLocaleString(S.settings.language) : '—'))),
        h('li', null, h('div', { class: 'row' }, h('span', { class: 'grow' }, t('sync.pendingLabel')),
          h('span', { class: 'hint' }, String(S.pending))))),
      S.sync.state === 'error' && S.sync.error
        ? h('p', { class: 'msg err' }, t('sync.detail') + ' : ' + S.sync.error) : null,
      S.offline ? h('p', { class: 'msg err' }, t('sync.notAvailable')) : null,
      h('div', { class: 'actions' }, h('button', {
        type: 'button', class: 'btn primary', disabled: S.offline || i.state === 'syncing',
        on: { click: () => syncAll() }
      }, t('sync.now'))));
  }

  function secBackup() {
    const file = h('input', { type: 'file', accept: '.json,application/json', hidden: true });
    file.addEventListener('change', async () => {
      if (file.files && file.files[0]) await importBackup(file.files[0]);
      file.value = '';
    });
    return h('div', null,
      h('p', { class: 'lede' }, t('bk.info')),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn primary', on: { click: exportBackup } }, t('bk.export')),
        h('button', { type: 'button', class: 'btn', on: { click: () => file.click() } }, t('bk.import')),
        file));
  }

  function secAbout() {
    return h('div', null,
      h('p', null, t('about.text')),
      h('ul', { class: 'list' }, h('li', null, h('div', { class: 'row' },
        h('span', { class: 'grow' }, t('about.version')), h('span', { class: 'hint' }, CONFIG.VERSION)))));
  }

  /* ==========================================================
     Domaines et catégories
     ========================================================== */
  async function mgrAdd(kind) {
    const name = await textPrompt({ title: t('mgr.add'), label: t('mgr.newName') });
    if (!name) return;
    await saveRecord(kind, newRecord(kind, name, PALETTE[S[kind].length % PALETTE.length], nextPosition(kind)));
    await afterChange();
  }

  async function mgrRename(kind, rec) {
    const name = await textPrompt({ title: t('mgr.rename'), label: t('mgr.newName'), value: rec.name });
    if (!name || name === rec.name) return;
    rec.name = name;
    await saveRecord(kind, rec);
    await afterChange();
  }

  async function mgrColor(kind, rec) {
    const c = await pickColor(rec.color);
    if (!c || c === rec.color) return;
    rec.color = c;
    await saveRecord(kind, rec);
    await afterChange();
  }

  async function mgrToggleArchive(kind, rec) {
    rec.archived = !rec.archived;
    await saveRecord(kind, rec);
    await afterChange();
  }

  async function mgrDelete(kind, rec) {
    if (!(await confirmDialog(t('mgr.deleteConfirm', { name: rec.name }), t('mgr.delete'), true))) return;
    rec.deleted_at = new Date().toISOString();
    await saveRecord(kind, rec);
    await afterChange();
  }

  async function mgrMove(kind, list, i, dir) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const arr = list.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    for (let k = 0; k < arr.length; k++) {
      if (arr[k].position !== k) { arr[k].position = k; await saveRecord(kind, arr[k]); }
    }
    await afterChange();
  }

  function viewManager(kind) {
    const showArch = S.ui.showArch[kind];
    const all = S[kind].filter((r) => !r.deleted_at).sort(byPos);
    const vis = showArch ? all : all.filter((r) => !r.archived);
    const hasArch = all.some((r) => r.archived);
    const iconBtn = (name, label, fn, disabled) => h('button', {
      type: 'button', class: 'iconbtn', 'aria-label': label, title: label, disabled: !!disabled, on: { click: fn }
    }, icon(name));
    const rows = vis.map((r, i) => {
      const sw = h('button', { type: 'button', class: 'swatchbtn', 'aria-label': t('mgr.color') + ' : ' + r.name, on: { click: () => mgrColor(kind, r) } },
        (() => { const s = h('span', { class: 'swatch' }); s.style.background = r.color || 'var(--muted)'; return s; })());
      return h('li', { class: 'mrow' + (r.archived ? ' is-archived' : '') },
        sw,
        h('button', { type: 'button', class: 'namebtn', title: t('mgr.rename'), on: { click: () => mgrRename(kind, r) } },
          r.name, r.archived ? h('span', { class: 'tag' }, t('mgr.archivedTag')) : null),
        iconBtn('up', t('mgr.up'), () => mgrMove(kind, vis, i, -1), i === 0),
        iconBtn('down', t('mgr.down'), () => mgrMove(kind, vis, i, 1), i === vis.length - 1),
        iconBtn(r.archived ? 'restore' : 'archive', r.archived ? t('mgr.restore') : t('mgr.archive'), () => mgrToggleArchive(kind, r)),
        iconBtn('trash', t('mgr.delete'), () => mgrDelete(kind, r)));
    });
    return h('div', null,
      h('p', { class: 'lede' }, t(kind === 'domains' ? 'mgr.domainsInfo' : 'mgr.categoriesInfo')),
      rows.length ? h('ul', { class: 'list' }, rows) : h('p', { class: 'empty' }, t('mgr.empty')),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn primary', on: { click: () => mgrAdd(kind) } }, icon('plus'), t('mgr.add')),
        hasArch ? h('button', {
          type: 'button', class: 'btn',
          on: { click: () => { S.ui.showArch[kind] = !showArch; render(); } }
        }, showArch ? t('mgr.hideArchived') : t('mgr.showArchived')) : null));
  }

  /* ==========================================================
     Sauvegarde : export / import
     ========================================================== */
  function exportBackup() {
    const data = {
      app: 'oree', version: 1, exportedAt: new Date().toISOString(),
      settings: { theme: S.settings.theme, language: S.settings.language, data: S.settings.data },
      domains: S.domains.map(strip),
      categories: S.categories.map(strip)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: 'oree-sauvegarde-' + new Date().toISOString().slice(0, 10) + '.json' });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast(t('bk.exported'));
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  async function importBackup(file) {
    let j;
    try {
      j = JSON.parse(await file.text());
      if (!j || j.app !== 'oree' || !Array.isArray(j.domains) || !Array.isArray(j.categories)) throw new Error('format');
    } catch (e) { toast(t('bk.error')); return; }
    if (!(await confirmDialog(t('bk.importConfirm'), t('bk.import')))) return;
    const now = new Date().toISOString();
    try {
      for (const kind of TABLES) {
        for (const r of j[kind]) {
          if (!r || !UUID_RE.test(String(r.id)) || typeof r.name !== 'string') continue;
          await IDB.put(kind, {
            id: r.id, user_id: S.user.id, name: r.name.slice(0, 80), color: typeof r.color === 'string' ? r.color : null,
            icon: null, position: Number.isFinite(r.position) ? r.position : 0, archived: !!r.archived,
            deleted_at: r.deleted_at || null, created_at: r.created_at || now, updated_at: now, _dirty: true, _rev: 1
          });
        }
      }
      const st = j.settings;
      if (st && ['day', 'night', 'sepia', 'auto'].includes(st.theme) && ['fr', 'en'].includes(st.language)) {
        await updateSettings({ theme: st.theme, language: st.language }, st.data && typeof st.data === 'object' ? st.data : null);
      }
      await afterChange();
      toast(t('bk.done'));
    } catch (e) {
      toast(t('err.generic', { msg: e && e.message ? e.message : '' }));
    }
  }

  /* ==========================================================
     Affichage
     ========================================================== */
  function render() {
    const root = document.getElementById('app');
    const y = window.scrollY;
    root.replaceChildren();
    if (S.recovery) root.append(viewRecovery());
    else if (!S.user) root.append(viewAuth());
    else if (S.locked) root.append(viewLock());
    else root.append(viewShell());
    window.scrollTo(0, y);
  }

  window.addEventListener('hashchange', () => {
    if (!location.hash.startsWith('#/')) return;
    S.route = currentRoute();
    S.navOpen = false;
    render();
    window.scrollTo(0, 0);
  });
  window.addEventListener('online', () => { S.offline = false; updateChips(); scheduleSync(300); });
  window.addEventListener('offline', updateChips);
  setInterval(() => {
    const c = document.querySelector('.clock');
    if (c) c.textContent = fmtTime(new Date());
  }, 20000);
  setInterval(() => syncAll(), 5 * 60 * 1000);

  /* ==========================================================
     Démarrage
     ========================================================== */
  async function boot() {
    applyTheme();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    try { await loadLocal(); } catch (e) { /* IndexedDB indisponible : l'app reste utilisable en ligne */ }

    if (!window.supabase) { document.getElementById('app').textContent = 'supabase.js introuvable.'; return; }
    sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    sb.auth.onAuthStateChange((event) => { setTimeout(() => onAuthEvent(event), 0); });

    let session = null;
    try { const r = await sb.auth.getSession(); session = r.data && r.data.session; } catch (e) { /* hors-ligne */ }

    if (session) {
      S.user = { id: session.user.id, email: session.user.email };
      const prev = await kvGet('user');
      if (prev && prev.id !== S.user.id) await wipeLocal();
      await kvSet('user', S.user);
      await loadLocal();
    } else {
      const u = await kvGet('user');
      if (u && !navigator.onLine) { S.user = u; S.offline = true; }
    }

    S.route = currentRoute();
    if (S.user) { await loadLists(); S.locked = !!S.lock.enabled; }
    render();
    if (S.user && !S.offline) { await syncAll(); await maybeOnboard(); }
  }

  boot();
})();
