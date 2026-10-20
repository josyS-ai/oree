/* Orée — lot 1 : le socle
   Navigation, thèmes, connexion, verrouillage par code, domaines et catégories,
   synchronisation Supabase avec fonctionnement hors-ligne, français / anglais. */
'use strict';

(() => {
  /* ==========================================================
     Configuration
     ========================================================== */
  /* ==========================================================
     Contenu par défaut du défi de 30 jours
     ========================================================== */
  const SEED_STEPS = [
    { block: 'Bilan positif', title: 'Gratitude envers Dieu',
      parts: [{ type: 'bullets', key: 'gratitudes', label: 'Actions de grâce' }],
      help: { objective: 'Prendre le temps de repenser à ce que le Seigneur a été pour moi cette année.', scripture: 'Psaume 63:2-5' } },
    { block: 'Bilan positif', title: 'Transformation intérieure',
      parts: [{ type: 'table', key: 'transformations', columns: ['Attitude / trait initial', 'Changement opéré'], scale: true, scaleLabel: 'Progression (1 à 10)' },
        { type: 'text', key: 'conclusion', label: 'Conclusion' }],
      help: { objective: 'Apprécier les changements que Dieu a opérés en moi, même les plus petits.', scripture: '2 Corinthiens 4:16' } },
    { block: 'Bilan positif', title: 'Bénédiction pour les autres',
      parts: [{ type: 'table', key: 'benedictions', columns: ['Bénéficiaires', 'Bénédiction apportée', 'Motivation'] },
        { type: 'text', key: 'conclusion', label: 'Conclusion' }],
      help: { objective: 'Examiner ma marche dans l’amour et me réjouir d’avoir été un canal de bénédiction.', scripture: 'Actes 20:35' } },
    { block: 'Bilan positif', title: 'Délivrances et personnes-relais',
      parts: [{ type: 'bullets', key: 'bienfaits', label: 'Bienfaits, victoires, prières exaucées' },
        { type: 'bullets', key: 'personnes', label: 'Personnes par lesquelles Dieu m’a bénie' }],
      help: { objective: 'Me souvenir des délivrances et des personnes que Dieu a mises sur ma route.', scripture: 'Psaume 71:6' } },
    { block: 'Bilan positif', title: 'Objectifs accomplis',
      parts: [{ type: 'checklist', key: 'objectifs', label: 'Objectifs atteints cette année' },
        { type: 'text', key: 'horsplan', label: 'Accomplissements non planifiés' }],
      help: { objective: 'Rendre grâce pour ce que Dieu m’a permis d’accomplir cette année.', scripture: 'Jean 6:63' } },
    { block: 'Bilan positif', title: 'Actions de grâce pour les épreuves',
      parts: [{ type: 'text', key: 'revelation', label: 'Ce que le Seigneur m’a révélé à travers ces épreuves' },
        { type: 'text', key: 'priere', label: 'Prière et remerciement' }],
      help: { objective: 'Dire merci à Dieu même pour les épreuves traversées cette année.', scripture: 'Jacques 1:2 ; 1 Thessaloniciens 5:18' } },
    { block: 'Analyse et ajustements', title: 'Objectifs non atteints',
      parts: [{ type: 'table', key: 'nonatteints', columns: ['Objectif non atteint', 'Causes / obstacles', 'Mesures d’ajustement'] }],
      help: { objective: 'Identifier les objectifs non atteints et réfléchir aux causes sans me juger.', scripture: 'Proverbes 26:11' } },
    { block: 'Analyse et ajustements', title: 'Audit du temps',
      parts: [{ type: 'table', key: 'audittemps', columns: ['Activité', 'Impact (m’aide ou m’éloigne)'], scale: true, scaleLabel: 'Fréquence (1 à 10)' },
        { type: 'text', key: 'conclusion', label: 'Conclusion' }],
      help: {
        objective: 'Prendre conscience des activités qui me rapprochent de mes objectifs et de celles qui m’en éloignent.',
        howto: '1. Je liste mes activités les plus fréquentes cette année.\n2. J’indique la fréquence de 1 à 10.\n3. Je note si chacune m’a aidée ou éloignée de mes objectifs.',
        example: 'Réseaux sociaux (fréquence : 8/10) → m’éloigne de mes objectifs.',
        scripture: 'Éphésiens 5:16'
      } },
    { block: 'Analyse et ajustements', title: 'Audit du temps numérique & réseaux sociaux',
      parts: [{ type: 'table', key: 'numerique', columns: ['Activité numérique', 'Fruit produit'], scale: true, scaleLabel: 'Temps passé (1 à 10)' },
        { type: 'text', key: 'conclusion', label: 'Conclusion' }],
      help: { objective: 'Examiner le temps que je passe sur mes écrans et les réseaux sociaux, et ce qu’ils produisent réellement dans ma vie.', scripture: 'Éphésiens 5:16' } },
    { block: 'Analyse et ajustements', title: 'Audit financier',
      parts: [{ type: 'table', key: 'auditfinances', columns: ['Poste de dépense', 'Alignement spirituel'], scale: true, scaleLabel: 'Montant ou proportion (1 à 10)' },
        { type: 'text', key: 'conclusion', label: 'Conclusion sur l’intendance' }],
      help: { objective: 'Examiner comment j’ai utilisé mon argent cette année, en bonne intendance.', scripture: 'Proverbes 3:9 ; 1 Timothée 6:17' } },
    { block: 'Analyse et ajustements', title: 'Audit des dons et talents',
      parts: [{ type: 'cards', key: 'dons', fields: ['Don / talent', 'Utilisation actuelle', 'Ajustement souhaité'] },
        { type: 'text', key: 'conclusion', label: 'Conclusion' }],
      help: { objective: 'Faire le point sur les dons et talents que Dieu m’a confiés, et sur la façon dont je les utilise.', scripture: 'Matthieu 25:14-30' } },
    { block: 'Analyse et ajustements', title: 'Revue des relations clés',
      parts: [{ type: 'cards', key: 'relations', fields: ['Personne', 'État de la relation', 'Action à poser'] }],
      help: { objective: 'Passer en revue mes relations les plus importantes et discerner les ajustements à faire.', scripture: 'Romains 12:18' } },
    { block: 'Analyse et ajustements', title: 'Erreurs à ne plus répéter',
      parts: [{ type: 'cards', key: 'erreurs', fields: ['Domaine', 'Erreur commise', 'Cause profonde', 'Mesure à cultiver'] }],
      help: { objective: 'Identifier les causes profondes de mes erreurs pour ne plus y retomber.', scripture: 'Proverbes 26:11' } },
    { block: 'Vision', title: 'Prière d’alignement & vision globale',
      parts: [{ type: 'text', key: 'vision', label: 'Impressions, versets reçus, révélations', rows: 8 }],
      help: { objective: 'Demander au Seigneur de me révéler Sa vision pour mon année, dans chaque domaine de ma vie.', scripture: 'Jérémie 33:3 ; Éphésiens 2:10' } },
    { block: 'Vision', title: 'Semaine de consécration & jeûne',
      parts: [{ type: 'text', key: 'consecration', label: 'Ce que je consacre au Seigneur cette semaine', rows: 6 },
        { type: 'text', key: 'ressenti', label: 'Ce que le Seigneur me montre' }],
      help: { objective: 'Mettre à part un temps pour me consacrer au Seigneur avant de recevoir Sa vision pour mon année.', scripture: 'Joël 2:12' } },
    { block: 'Vision', title: 'Vision — Vie spirituelle',
      parts: [{ type: 'text', key: 'spirituel', label: 'Ma vie spirituelle (j’écris au présent, comme si c’était déjà une réalité)', rows: 6 },
        { type: 'text', key: 'ancrage', label: 'Verset d’ancrage' }],
      help: { objective: 'Voir ma relation et ma marche avec le Seigneur au travers de Son regard.', scripture: 'Marc 1:35' } },
    { block: 'Vision', title: 'Lecture biblique de l’année',
      parts: [{ type: 'text', key: 'plan', label: 'Mon plan de lecture pour cette année' },
        { type: 'checklist', key: 'livres', label: 'Livres lus' }],
      help: { objective: 'Prévoir comment je vais parcourir la Parole de Dieu cette année.', scripture: 'Josué 1:8' } },
    { block: 'Vision', title: 'Vision — Ministère, carrière & études',
      parts: [{ type: 'text', key: 'court', label: 'Court terme (1 an)' }, { type: 'text', key: 'long', label: 'Long terme (5 à 15 ans)' }],
      help: { objective: 'Voir mon ministère, ma carrière ou mes études au travers du regard de Dieu, à court et long terme.', scripture: 'Jérémie 29:11' } },
    { block: 'Vision', title: 'Vision — Relations, famille, santé & développement',
      parts: [{ type: 'text', key: 'relations', label: 'Relations & famille' }, { type: 'text', key: 'sante', label: 'Santé & bien-être' },
        { type: 'text', key: 'talents', label: 'Talents & compétences à développer' }],
      help: { objective: 'Voir mes relations, ma santé et mon développement personnel comme Dieu les voit.', scripture: 'Ésaïe 53:5 ; 3 Jean 2' } },
    { block: 'Vision', title: 'Vision — Finances & influence',
      parts: [{ type: 'text', key: 'finances', label: 'Finances — prospérité & gestion' }, { type: 'text', key: 'influence', label: 'Influence — héritage & impact' }],
      help: { objective: 'Voir mes finances et mon impact dans la société au travers du regard de Dieu.', scripture: 'Proverbes 10:22 ; Tite 3:8' } },
    { block: 'Objectifs SMART', title: 'Objectifs — Spirituel',
      parts: [{ type: 'cards', key: 'objectifs', fields: ['Titre de l’objectif', 'Indicateur de mesure (KPI)', 'Date cible'] }],
      help: { objective: 'Écrire des objectifs pour ma vie spirituelle, à partir de la vision reçue.', scripture: null } },
    { block: 'Objectifs SMART', title: 'Objectifs — Ministère & carrière',
      parts: [{ type: 'cards', key: 'objectifs', fields: ['Titre de l’objectif', 'Indicateur de mesure (KPI)', 'Date cible'] }],
      help: { objective: 'Écrire mes objectifs pour mon ministère, ma carrière, mes affaires ou mes études.', scripture: null } },
    { block: 'Objectifs SMART', title: 'Objectifs — Social & personnel',
      parts: [{ type: 'cards', key: 'objectifs', fields: ['Titre de l’objectif', 'Indicateur de mesure (KPI)', 'Date cible'] }],
      help: { objective: 'Écrire mes objectifs pour mes relations, ma famille, ma santé et mon développement personnel.', scripture: null } },
    { block: 'Objectifs SMART', title: 'Objectifs — Finances & influence',
      parts: [{ type: 'cards', key: 'objectifs', fields: ['Titre de l’objectif', 'Indicateur de mesure (KPI)', 'Date cible'] }],
      help: { objective: 'Écrire mes objectifs financiers et ceux liés à mon influence dans la société.', scripture: null } },
    { block: 'Objectifs SMART', title: 'Consolidation & validation SMART',
      parts: [{ type: 'text', key: 'revue', label: 'Revue de mes objectifs', rows: 8 }, { type: 'bullets', key: 'retenus', label: 'Liste finale des objectifs retenus' }],
      help: {
        objective: 'Relire mes objectifs pour m’assurer qu’ils sont bien formulés avant de passer au plan d’action.',
        howto: '1. Je formule chaque objectif de façon positive.\n2. Je vérifie qu’il est spécifique, mesurable, réaliste et limité dans le temps.\n3. Je regroupe ou découpe mes objectifs si besoin, puis je retiens ma liste définitive.',
        scripture: null
      } },
    { block: 'Plan d’action', title: 'Plan d’action — Spirituel',
      parts: [{ type: 'bullets', key: 'ressources', label: 'Ressources & forces à mobiliser' }, { type: 'bullets', key: 'obstacles', label: 'Obstacles & faiblesses à surmonter' },
        { type: 'table', key: 'strategies', columns: ['Étape / stratégie', 'Échéance'] }],
      help: { objective: 'Élaborer mon plan d’action pour atteindre mes objectifs spirituels.', scripture: null } },
    { block: 'Plan d’action', title: 'Plan d’action — Ministère',
      parts: [{ type: 'bullets', key: 'ressources', label: 'Ressources & forces à mobiliser' }, { type: 'bullets', key: 'obstacles', label: 'Obstacles & faiblesses à surmonter' },
        { type: 'table', key: 'strategies', columns: ['Étape / stratégie', 'Échéance'] }],
      help: { objective: 'Élaborer mon plan d’action pour mon ministère.', scripture: null } },
    { block: 'Plan d’action', title: 'Plan d’action — Professionnel / académique',
      parts: [{ type: 'bullets', key: 'ressources', label: 'Ressources & forces à mobiliser' }, { type: 'bullets', key: 'obstacles', label: 'Obstacles & faiblesses à surmonter' },
        { type: 'table', key: 'strategies', columns: ['Étape / stratégie', 'Échéance'] }],
      help: { objective: 'Élaborer mon plan d’action pour mon travail, mes affaires ou mes études.', scripture: null } },
    { block: 'Plan d’action', title: 'Plan d’action — Social & couple',
      parts: [{ type: 'bullets', key: 'ressources', label: 'Ressources & forces à mobiliser' }, { type: 'bullets', key: 'obstacles', label: 'Obstacles & faiblesses à surmonter' },
        { type: 'table', key: 'strategies', columns: ['Étape / stratégie', 'Échéance'] }],
      help: { objective: 'Élaborer mon plan d’action pour mes relations, ma famille et ma vie de couple.', scripture: null } },
    { block: 'Plan d’action', title: 'Plan d’action — Santé & développement personnel',
      parts: [{ type: 'bullets', key: 'ressources', label: 'Ressources & forces à mobiliser' }, { type: 'bullets', key: 'obstacles', label: 'Obstacles & faiblesses à surmonter' },
        { type: 'table', key: 'strategies', columns: ['Étape / stratégie', 'Échéance'] }],
      help: { objective: 'Élaborer mon plan d’action pour ma santé, mon bien-être et mon développement personnel.', scripture: null } },
    { block: 'Plan d’action', title: 'Plan d’action — Finances',
      parts: [{ type: 'bullets', key: 'ressources', label: 'Ressources & forces à mobiliser' }, { type: 'bullets', key: 'obstacles', label: 'Obstacles & faiblesses à surmonter' },
        { type: 'table', key: 'strategies', columns: ['Étape / stratégie', 'Échéance'] }],
      help: { objective: 'Élaborer mon plan d’action pour mes finances.', scripture: null } },
    { block: 'Plan d’action', title: 'Plan d’action — Influence',
      parts: [{ type: 'bullets', key: 'ressources', label: 'Ressources & forces à mobiliser' }, { type: 'bullets', key: 'obstacles', label: 'Obstacles & faiblesses à surmonter' },
        { type: 'table', key: 'strategies', columns: ['Étape / stratégie', 'Échéance'] }],
      help: { objective: 'Élaborer mon plan d’action pour mon influence et mon apport dans la société.', scripture: null } },
    { block: 'Clôture', title: 'Optimisation et délais',
      parts: [{ type: 'table', key: 'echeances', columns: ['Action', 'Domaine', 'Date limite'] }],
      help: { objective: 'Relire tous mes plans d’action et m’assurer que chaque échéance est réaliste.', scripture: null } },
    { block: 'Clôture', title: 'Tableau de bord d’engagement',
      parts: [{ type: 'text', key: 'engagement', label: 'Ce que je veux mettre en place pour tenir mes objectifs', rows: 6 }],
      help: {
        objective: 'Me donner les moyens de rester fidèle à ma vision tout au long de l’année.',
        howto: '1. Je garde ma vision et mes objectifs à portée de main.\n2. Je reste ouverte à toute nouvelle direction du Saint-Esprit.\n3. Je fais un bilan mensuel de ma progression.\n4. Je compte sur la puissance du Saint-Esprit.\n5. Je ne renonce pas à ces habitudes de suivi.',
        scripture: null
      } },
    { block: 'Clôture', title: 'Attestation de fin de défi', closing: true, parts: [], help: null }
  ];


  const CONFIG = {
    SUPABASE_URL: 'https://foboghwbppqbyvfcjkoj.supabase.co',
    SUPABASE_KEY: 'sb_publishable_qh12xNgNAnoVTLhaUL8g6A_absINt8r', // clé publique : sans danger dans le code
    ALLOW_SIGNUP: false, // usage personnel : les comptes se créent dans Supabase
    VERSION: '1.5 (lot 3)'
  };

  const TABLES = ['domains', 'categories', 'challenge_steps', 'challenge_runs', 'challenge_entries', 'schedule_slots', 'vrac_items', 'protocol_segments', 'day_state'];
  const PALETTE = ['#7c5cbf', '#2f7fd1', '#2e9c8a', '#4aa04a', '#c99a1c', '#d9772b',
    '#d4577a', '#c0392b', '#6b7480', '#8d6e63', '#00838f', '#5c6bc0'];
  const TEXT_SIZES = [90, 100, 112, 125];
  const LOT_OF = { plan: 5, journals: 4, library: 6 };

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
      'set.schedule': 'Emploi du temps', 'set.vrac': 'Vrac de tâches', 'set.protocol': 'Protocole',
      'set.sync': 'Synchronisation', 'set.backup': 'Sauvegarde', 'set.about': 'À propos',
      'set.theme': 'Thème', 'set.textSize': 'Taille du texte',
      'theme.day': 'Jour', 'theme.night': 'Nuit', 'theme.sepia': 'Sépia', 'theme.auto': 'Automatique',
      'size.90': 'Petit', 'size.100': 'Normal', 'size.112': 'Grand', 'size.125': 'Très grand',
      'lang.fr': 'Français', 'lang.en': 'English',

      'rhythm.weekTab': 'Semaine type', 'rhythm.tempTab': 'Moments ponctuels',
      'rhythm.addSlot': 'Ajouter un créneau', 'rhythm.editSlot': 'Modifier le créneau', 'rhythm.addMoment': 'Ajouter un moment',
      'rhythm.start': 'Début', 'rhythm.end': 'Fin', 'rhythm.category': 'Catégorie',
      'rhythm.mode': 'Type de créneau', 'rhythm.modeFixed': 'Fixe', 'rhythm.modeVrac': 'À préciser',
      'rhythm.label': 'Intitulé', 'rhythm.labelFixedHint': 'Ce qui est prévu (ex. Ménage, Étude...)',
      'rhythm.noCategory': 'Sans catégorie',
      'rhythm.needTimes': 'Indique une heure de début et de fin.',
      'rhythm.needEnd': "L'heure de fin doit être après l'heure de début.",
      'rhythm.startDate': 'Date', 'rhythm.endDateOptional': 'Jusqu’au (facultatif)',
      'rhythm.repeatWeekday': 'Se répète chaque semaine ce jour-là',
      'rhythm.needStartDate': 'Choisis une date.',
      'rhythm.empty': 'Aucun créneau pour ce jour.', 'rhythm.emptyTemp': 'Aucun moment ponctuel.',
      'rhythm.oneTime': 'Ponctuel', 'rhythm.repeats': 'Se répète',
      'rhythm.vracInfo': "Ajoute des tâches par catégorie : l'app te les proposera dans tes créneaux « à préciser ».",
      'rhythm.vracAdd': 'Ajouter une tâche', 'rhythm.vracPickCategory': 'Catégorie de cette tâche',
      'rhythm.protocolInfo': 'Organise ton protocole en stations (ex. Matin, Soir), chacune avec ses segments.',
      'rhythm.addStation': 'Ajouter une station', 'rhythm.stationName': 'Nom de la station',
      'rhythm.addSegment': 'Ajouter un segment', 'rhythm.segmentTitle': 'Titre du segment',
      'rhythm.segmentDuration': 'Durée (minutes, facultatif)', 'rhythm.segmentMode': 'Type',
      'rhythm.modeReading': 'Lecture', 'rhythm.modeText': 'Texte libre', 'rhythm.modeTimer': 'Minuteur', 'rhythm.modeFree': 'Libre',
      'rhythm.segmentContent': 'Note ou contenu (facultatif)',
      'rhythm.pickStation': 'Dans quelle station ?', 'rhythm.newStation': 'Nouvelle station…',
      'rhythm.todayTitle': 'Mon rythme',
      'rhythm.todayEmpty': "Aucun créneau aujourd'hui. Configure ta semaine type dans Réglages.",
      'rhythm.choose': 'Choisir', 'rhythm.pickOrType': 'Choisis dans ta liste ou écris autre chose',
      'rhythm.freeText': 'Autre chose…', 'rhythm.protocolTitle': 'Protocole du jour',
      'rhythm.min': 'min', 'rhythm.segmentNote': 'Note du segment', 'rhythm.noSegments': 'Aucun segment pour le moment.',

      'challenge.welcomeTitle': 'Ton défi de bilan et de vision',
      'challenge.welcomeText': 'Choisis ton point de départ pour ce module. Tu pourras tout modifier ensuite.',
      'challenge.kitMine': 'Mon défi de 30 jours', 'challenge.kitMineDesc': 'Les 30 étapes de ton programme, prêtes à suivre et à modifier.',
      'challenge.kitEmpty': 'Partir de zéro', 'challenge.kitEmptyDesc': 'Aucune étape : tu construis ton propre programme.',
      'challenge.needSteps': 'Ajoute au moins une étape pour commencer ton défi.',
      'challenge.manageSteps': 'Gérer les étapes', 'challenge.stepsTitle': 'Étapes du défi',
      'challenge.stepsInfo': 'Ajoute, modifie, réordonne ou archive les étapes de ton programme.',
      'challenge.stepTitleLabel': 'Titre', 'challenge.stepBlockLabel': 'Bloc / thème',
      'challenge.newStepTitle': 'Nouvelle étape',
      'challenge.columnsTitle': 'Colonnes du tableau', 'challenge.columnsLabel': 'Colonnes (séparées par des virgules)',
      'challenge.col1': 'Colonne 1', 'challenge.col2': 'Colonne 2',
      'challenge.fieldsTitle': 'Champs de la carte', 'challenge.fieldsLabel': 'Champs (séparés par des virgules)',
      'challenge.field1': 'Champ 1', 'challenge.field2': 'Champ 2',
      'challenge.brickTitle': 'Type de saisie',
      'brick.text': 'Texte libre', 'brick.textDesc': "Une zone d'écriture, façon journal.",
      'brick.bullets': 'Puces dynamiques', 'brick.bulletsDesc': 'Une liste que tu complètes au fil de l’eau.',
      'brick.checklist': 'Liste à cocher', 'brick.checklistDesc': 'Des éléments que tu coches un par un.',
      'brick.table': 'Tableau', 'brick.tableDesc': 'Des lignes avec les colonnes de ton choix.',
      'brick.cards': 'Cartes', 'brick.cardsDesc': 'Des fiches répétables avec plusieurs champs.',
      'challenge.setupTitle': 'Commencer le défi', 'challenge.editTitle': 'Changer la cadence',
      'challenge.cadenceLabel': 'Cadence', 'challenge.startLabel': 'Date de départ',
      'cadence.intensive': 'Intensif', 'cadence.moderate': 'Modéré', 'cadence.custom': 'Sur-mesure',
      'day.0': 'Dim', 'day.1': 'Lun', 'day.2': 'Mar', 'day.3': 'Mer', 'day.4': 'Jeu', 'day.5': 'Ven', 'day.6': 'Sam',
      'challenge.saveCadence': 'Enregistrer', 'challenge.start': 'Commencer',
      'challenge.pickDay': 'Choisis au moins un jour de la semaine.', 'challenge.needDate': 'Choisis une date de départ.',
      'challenge.summary': '{n} étapes, du {start} au {end}.', 'challenge.defaultName': 'Défi {year}',
      'challenge.progress': '{done} sur {total} étapes accomplies.', 'challenge.changeCadence': 'Changer la cadence',
      'challenge.noRun': 'Aucun défi en cours.', 'challenge.missing': 'Étape introuvable.',
      'challenge.help': 'Conseil & exemple', 'challenge.helpTitle': 'Conseil pour cette étape',
      'challenge.helpWhy': "L'objectif :", 'challenge.helpHow': 'Comment faire :', 'challenge.helpExample': 'Exemple :',
      'challenge.noHelp': "Pas encore d'aide pour cette étape.",
      'challenge.markDone': 'Marquer comme fait', 'challenge.done': 'Fait',
      'challenge.closingText': 'Tu as accompli {done} étape(s) sur {total}. Cette étape clôture ton défi et verrouille ton année.',
      'challenge.close': 'Clôturer le défi', 'challenge.closed': 'Défi clôturé. Bravo !',
      'tpl.addLine': 'Ajouter une ligne', 'tpl.addRow': 'Ajouter une ligne', 'tpl.addCard': 'Ajouter une carte',
      'tpl.scale': 'Évaluation (1 à 10)', 'common.remove': 'Supprimer',
      'challenge.verseTextHint': 'Ajoute le texte du verset selon la version de la Bible que tu préfères.',
      'challenge.verseTextPlaceholder': 'Texte du verset',
      'challenge.resetProgress': 'Réinitialiser la progression',
      'challenge.resetConfirm': 'Toutes les réponses déjà saisies pour ce défi seront effacées, mais tes étapes et ta cadence restent inchangées.',
      'challenge.resetConfirmBtn': 'Réinitialiser', 'challenge.resetDone': 'Progression réinitialisée.',
      'challenge.editStepTitle': "Modifier l'étape", 'challenge.contentTitle': 'Contenu',
      'challenge.noParts': 'Aucune brique pour le moment.', 'challenge.addPart': 'Ajouter une brique',
      'challenge.partLabelTitle': 'Titre de cette brique', 'challenge.partLabelHint': 'Titre',
      'challenge.closingFixed': 'Cette étape clôture le défi ; son contenu ne se modifie pas.',
      'challenge.snapshotSave': 'Sauvegarder ce programme', 'challenge.snapshotLoad': 'Restaurer un programme',
      'challenge.snapshotSaved': 'Programme sauvegardé.',
      'challenge.snapshotRestoreConfirm': "Restaurer ce programme ? Tes étapes actuelles seront remplacées ; les réponses déjà saisies restent conservées mais ne seront plus reliées à une étape visible.",
      'challenge.snapshotRestore': 'Restaurer', 'challenge.snapshotRestored': 'Programme restauré.',
      'challenge.helpSectionTitle': 'Conseil', 'challenge.addHelp': 'Ajouter un conseil', 'challenge.editHelpBtn': 'Modifier le conseil',
      'challenge.editHelpTitle': 'Conseil de cette étape', 'challenge.scriptureRefLabel': 'Référence biblique (ex. Psaume 23:1)',
      'challenge.syncAction': 'Mettre à jour le contenu par défaut',
      'challenge.syncConfirm': "Les conseils des étapes d'origine seront actualisés, et les nouvelles étapes proposées qui manquent encore seront ajoutées au bon endroit. Tes propres étapes et tes réponses déjà saisies ne sont pas touchées.",
      'challenge.syncConfirmBtn': 'Mettre à jour',
      'challenge.syncDone': '{updated} conseil(s) actualisé(s), {added} étape(s) ajoutée(s).',

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
      'set.schedule': 'Schedule', 'set.vrac': 'Task bank', 'set.protocol': 'Protocol',
      'set.sync': 'Sync', 'set.backup': 'Backup', 'set.about': 'About',
      'set.theme': 'Theme', 'set.textSize': 'Text size',
      'theme.day': 'Day', 'theme.night': 'Night', 'theme.sepia': 'Sepia', 'theme.auto': 'Automatic',
      'size.90': 'Small', 'size.100': 'Normal', 'size.112': 'Large', 'size.125': 'Extra large',
      'lang.fr': 'Français', 'lang.en': 'English',

      'rhythm.weekTab': 'Weekly schedule', 'rhythm.tempTab': 'One-off moments',
      'rhythm.addSlot': 'Add a slot', 'rhythm.editSlot': 'Edit the slot', 'rhythm.addMoment': 'Add a moment',
      'rhythm.start': 'Start', 'rhythm.end': 'End', 'rhythm.category': 'Category',
      'rhythm.mode': 'Slot type', 'rhythm.modeFixed': 'Fixed', 'rhythm.modeVrac': 'To specify',
      'rhythm.label': 'Label', 'rhythm.labelFixedHint': "What's planned (e.g. Housework, Study...)",
      'rhythm.noCategory': 'No category',
      'rhythm.needTimes': 'Enter a start and an end time.',
      'rhythm.needEnd': 'The end time must be after the start time.',
      'rhythm.startDate': 'Date', 'rhythm.endDateOptional': 'Until (optional)',
      'rhythm.repeatWeekday': 'Repeats weekly on that day',
      'rhythm.needStartDate': 'Choose a date.',
      'rhythm.empty': 'No slot for this day.', 'rhythm.emptyTemp': 'No one-off moment.',
      'rhythm.oneTime': 'One-off', 'rhythm.repeats': 'Repeats',
      'rhythm.vracInfo': "Add tasks by category: the app will suggest them in your “to specify” slots.",
      'rhythm.vracAdd': 'Add a task', 'rhythm.vracPickCategory': 'Category for this task',
      'rhythm.protocolInfo': 'Organize your protocol into stations (e.g. Morning, Evening), each with its segments.',
      'rhythm.addStation': 'Add a station', 'rhythm.stationName': 'Station name',
      'rhythm.addSegment': 'Add a segment', 'rhythm.segmentTitle': 'Segment title',
      'rhythm.segmentDuration': 'Duration (minutes, optional)', 'rhythm.segmentMode': 'Type',
      'rhythm.modeReading': 'Reading', 'rhythm.modeText': 'Free text', 'rhythm.modeTimer': 'Timer', 'rhythm.modeFree': 'Free',
      'rhythm.segmentContent': 'Note or content (optional)',
      'rhythm.pickStation': 'Which station?', 'rhythm.newStation': 'New station…',
      'rhythm.todayTitle': 'My rhythm',
      'rhythm.todayEmpty': 'No slot today. Set up your weekly schedule in Settings.',
      'rhythm.choose': 'Choose', 'rhythm.pickOrType': 'Pick from your list or write something else',
      'rhythm.freeText': 'Something else…', 'rhythm.protocolTitle': "Today's protocol",
      'rhythm.min': 'min', 'rhythm.segmentNote': 'Segment note', 'rhythm.noSegments': 'No segment yet.',

      'challenge.welcomeTitle': 'Your review and vision challenge',
      'challenge.welcomeText': 'Choose your starting point for this module. You can change everything afterwards.',
      'challenge.kitMine': 'My 30-day challenge', 'challenge.kitMineDesc': 'The 30 steps of your program, ready to follow and edit.',
      'challenge.kitEmpty': 'Start from scratch', 'challenge.kitEmptyDesc': 'No steps: you build your own program.',
      'challenge.needSteps': 'Add at least one step to start your challenge.',
      'challenge.manageSteps': 'Manage steps', 'challenge.stepsTitle': 'Challenge steps',
      'challenge.stepsInfo': 'Add, edit, reorder or archive the steps of your program.',
      'challenge.stepTitleLabel': 'Title', 'challenge.stepBlockLabel': 'Block / theme',
      'challenge.newStepTitle': 'New step',
      'challenge.columnsTitle': 'Table columns', 'challenge.columnsLabel': 'Columns (comma-separated)',
      'challenge.col1': 'Column 1', 'challenge.col2': 'Column 2',
      'challenge.fieldsTitle': 'Card fields', 'challenge.fieldsLabel': 'Fields (comma-separated)',
      'challenge.field1': 'Field 1', 'challenge.field2': 'Field 2',
      'challenge.brickTitle': 'Input type',
      'brick.text': 'Free text', 'brick.textDesc': 'A journal-style writing area.',
      'brick.bullets': 'Dynamic bullets', 'brick.bulletsDesc': 'A list you build up over time.',
      'brick.checklist': 'Checklist', 'brick.checklistDesc': 'Items you check off one by one.',
      'brick.table': 'Table', 'brick.tableDesc': 'Rows with the columns you choose.',
      'brick.cards': 'Cards', 'brick.cardsDesc': 'Repeatable cards with several fields.',
      'challenge.setupTitle': 'Start the challenge', 'challenge.editTitle': 'Change the pace',
      'challenge.cadenceLabel': 'Pace', 'challenge.startLabel': 'Start date',
      'cadence.intensive': 'Intensive', 'cadence.moderate': 'Moderate', 'cadence.custom': 'Custom',
      'day.0': 'Sun', 'day.1': 'Mon', 'day.2': 'Tue', 'day.3': 'Wed', 'day.4': 'Thu', 'day.5': 'Fri', 'day.6': 'Sat',
      'challenge.saveCadence': 'Save', 'challenge.start': 'Start',
      'challenge.pickDay': 'Pick at least one day of the week.', 'challenge.needDate': 'Choose a start date.',
      'challenge.summary': '{n} steps, from {start} to {end}.', 'challenge.defaultName': 'Challenge {year}',
      'challenge.progress': '{done} of {total} steps completed.', 'challenge.changeCadence': 'Change the pace',
      'challenge.noRun': 'No challenge in progress.', 'challenge.missing': 'Step not found.',
      'challenge.help': 'Tip & example', 'challenge.helpTitle': 'Tip for this step',
      'challenge.helpWhy': 'The goal:', 'challenge.helpHow': 'How to do it:', 'challenge.helpExample': 'Example:',
      'challenge.noHelp': 'No tip yet for this step.',
      'challenge.markDone': 'Mark as done', 'challenge.done': 'Done',
      'challenge.closingText': 'You completed {done} of {total} step(s). This step closes your challenge and locks your year.',
      'challenge.close': 'Close the challenge', 'challenge.closed': 'Challenge closed. Well done!',
      'tpl.addLine': 'Add a line', 'tpl.addRow': 'Add a row', 'tpl.addCard': 'Add a card',
      'tpl.scale': 'Rating (1 to 10)', 'common.remove': 'Remove',
      'challenge.verseTextHint': 'Add the verse text in the Bible version you prefer.',
      'challenge.verseTextPlaceholder': 'Verse text',
      'challenge.resetProgress': 'Reset progress',
      'challenge.resetConfirm': 'All answers already entered for this challenge will be cleared, but your steps and pace stay unchanged.',
      'challenge.resetConfirmBtn': 'Reset', 'challenge.resetDone': 'Progress reset.',
      'challenge.editStepTitle': 'Edit step', 'challenge.contentTitle': 'Content',
      'challenge.noParts': 'No block yet.', 'challenge.addPart': 'Add a block',
      'challenge.partLabelTitle': 'Title of this block', 'challenge.partLabelHint': 'Title',
      'challenge.closingFixed': 'This step closes the challenge; its content cannot be changed.',
      'challenge.snapshotSave': 'Save this program', 'challenge.snapshotLoad': 'Restore a program',
      'challenge.snapshotSaved': 'Program saved.',
      'challenge.snapshotRestoreConfirm': "Restore this program? Your current steps will be replaced; answers already entered stay saved but won't be linked to a visible step anymore.",
      'challenge.snapshotRestore': 'Restore', 'challenge.snapshotRestored': 'Program restored.',
      'challenge.helpSectionTitle': 'Tip', 'challenge.addHelp': 'Add a tip', 'challenge.editHelpBtn': 'Edit the tip',
      'challenge.editHelpTitle': 'Tip for this step', 'challenge.scriptureRefLabel': 'Bible reference (e.g. Psalm 23:1)',
      'challenge.syncAction': 'Update default content',
      'challenge.syncConfirm': "The original steps' tips will be refreshed, and any of the newly proposed steps still missing will be added in a sensible spot. Your own steps and answers already entered are left untouched.",
      'challenge.syncConfirmBtn': 'Update',
      'challenge.syncDone': '{updated} tip(s) refreshed, {added} step(s) added.',

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
    install: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.45 1.1 1.15 1.1 1.9V16h5v-.3c0-.75.5-1.45 1.1-1.9A6 6 0 0 0 12 3z"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    lock2: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
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
      const r = indexedDB.open('oree', 3);
      r.onupgradeneeded = () => {
        const db = r.result;
        TABLES.forEach((s) => { if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' }); });
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
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
    ui: { showArch: { domains: false, categories: false, challenge_steps: false, vrac_items: false } },
    nav: { mode: 'visible', last: 'visible' },
    navOpen: false,
    installEvt: null,
    currentEntry: null,
    currentDay: null
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
    const lists = await Promise.all(TABLES.map((k) => IDB.all(k)));
    TABLES.forEach((k, i) => { S[k] = lists[i]; });
    S.pending = TABLES.reduce((n, k) => n + S[k].filter((x) => x._dirty).length, 0) + (S.settings._dirty ? 1 : 0);
  }

  async function wipeLocal() {
    for (const k of TABLES) await IDB.clear(k);
    const pullKeys = TABLES.map((k) => 'pull_' + k);
    for (const k of ['user', 'settings', 'lock', 'lastSync', ...pullKeys]) await IDB.del('kv', k);
    const p = readPrefs();
    S.settings = { theme: p.theme || 'auto', language: p.language || guessLang(), data: { textSize: p.textSize || 100 }, _dirty: false, _rev: 0 };
    S.lock = { enabled: false, delay: 5 };
    TABLES.forEach((k) => { S[k] = []; });
    S.pending = 0;
    S.sync = { state: 'idle', last: null, error: '' };
    S.locked = false;
    S.currentEntry = null;
    S.currentDay = null;
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
      if (ok) { S.fails = 0; S.locked = false; lockCtl = null; await prepareRoute(); render(); return; }
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
    await prepareRoute();
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
    const parts = S.route.split('/');
    switch (parts[0]) {
      case 'settings': return viewSettings(parts[1]);
      case 'challenge': return viewChallenge(parts.slice(1));
      case 'plan': case 'journals': case 'library': return viewSoon(parts[0]);
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
    const rhythm = S.currentDay ? viewTodayRhythm(S.currentDay) : null;
    return h('main', { class: 'page' },
      h('h1', { class: 'note-title' }, greet),
      h('p', { class: 'lede' }, cap(dateStr) + ', ', h('span', { class: 'clock' }, fmtTime(now))),
      horizon(),
      rhythm,
      h('h2', { class: 'section' }, t('today.domains')),
      doms.length
        ? h('div', { class: 'chips' }, doms.map((d) => h('span', { class: 'dchip' }, dotI(d.color), d.name)))
        : h('p', { class: 'empty' }, t('today.noDomains')),
      h('div', { class: 'actions' }, h('a', { class: 'btn', href: '#/settings/domains' }, t('today.manageDomains'))));
  }

  function viewSoon(key) {
    return h('main', { class: 'page' },
      h('h1', { class: 'note-title' }, t('tab.' + key)),
      h('div', { class: 'soon' }, h('p', null, t('soon.' + key)), h('span', { class: 'pill' }, t('soon.lot', { n: LOT_OF[key] }))));
  }

  /* ==========================================================
     Vues : réglages
     ========================================================== */
  const SET_SECTIONS = ['account', 'appearance', 'language', 'lock', 'domains', 'categories', 'schedule', 'vrac', 'protocol', 'sync', 'backup', 'about'];

  function viewSettings(sec) {
    if (!sec || !SET_SECTIONS.includes(sec)) return viewSettingsHome();
    const builders = {
      account: secAccount, appearance: secAppearance, language: secLanguage, lock: secLock,
      domains: () => viewManager('domains'), categories: () => viewManager('categories'),
      schedule: viewSchedule, vrac: viewVrac, protocol: viewProtocol,
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
      schedule: String(S.schedule_slots.filter((r) => !r.deleted_at && !r.archived).length),
      vrac: String(live('vrac_items')),
      protocol: String(S.protocol_segments.filter((r) => !r.deleted_at && !r.archived).length),
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
    const label = rec.name || rec.title || rec.text || rec.label || '';
    if (!(await confirmDialog(t('mgr.deleteConfirm', { name: label }), t('mgr.delete'), true))) return;
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
     Défi (Bilan & Vision) : dates, gabarits, entrées
     ========================================================== */
  function parseYMD(str) { const [y, m, d] = str.split('-').map(Number); return new Date(y, m - 1, d); }
  function fmtYMD(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function fmtDateLong(d) { return cap(d.toLocaleDateString(S.settings.language, { day: 'numeric', month: 'long', year: 'numeric' })); }
  function fmtDateShort(d) { return cap(d.toLocaleDateString(S.settings.language, { day: 'numeric', month: 'short' })); }

  function stepDateForIndex(run, index) {
    const start = parseYMD(run.start_date);
    if (run.cadence === 'intensive' || !run.weekdays || !run.weekdays.length) return addDays(start, index);
    let count = -1;
    let cur = start;
    for (let guard = 0; guard < 3660; guard++) {
      if (run.weekdays.includes(cur.getDay())) { count++; if (count === index) return cur; }
      cur = addDays(cur, 1);
    }
    return addDays(start, index);
  }

  const activeChallengeSteps = () => S.challenge_steps.filter((r) => !r.deleted_at && !r.archived).sort(byPos);
  const activeRun = () => S.challenge_runs.find((r) => r.status === 'active' && !r.deleted_at) || null;

  async function getOrCreateEntry(run, step) {
    let entry = S.challenge_entries.find((e) => e.run_id === run.id && e.step_id === step.id && !e.deleted_at);
    if (!entry) {
      const now = new Date().toISOString();
      entry = {
        id: crypto.randomUUID(), user_id: S.user.id, run_id: run.id, step_id: step.id,
        data: {}, done: false, done_at: null, deleted_at: null, created_at: now, updated_at: now, _dirty: true, _rev: 1
      };
      await IDB.put('challenge_entries', entry);
      await loadLists();
    }
    return entry;
  }

  let entrySaveTimer = null;
  function touchEntry(entry) {
    entry._dirty = true;
    entry._rev = (entry._rev || 0) + 1;
    entry.updated_at = new Date().toISOString();
    clearTimeout(entrySaveTimer);
    entrySaveTimer = setTimeout(async () => {
      await IDB.put('challenge_entries', entry);
      await loadLists();
      // Ne redessine que si on n'est plus en train d'écrire dans une étape (sinon on perdrait le focus du champ en cours de saisie).
      const onAnyStep = S.route.split('/')[0] === 'challenge' && S.route.split('/')[1] === 'step';
      if (!onAnyStep) render(); else updateChips();
      scheduleSync(800);
    }, 500);
  }

  async function prepareRoute() {
    const parts = S.route.split('/');
    S.currentEntry = null;
    if (!S.user) { S.currentDay = null; return; }
    S.currentDay = await getOrCreateDayState(fmtYMD(new Date()));
    if (parts[0] !== 'challenge') return;
    await maybeChallengeOnboard();
    if (parts[1] === 'step' && parts[2]) {
      const step = S.challenge_steps.find((s) => s.id === parts[2] && !s.deleted_at);
      const run = activeRun();
      if (step && run) S.currentEntry = await getOrCreateEntry(run, step);
    }
  }

  async function seedChallengeSteps() {
    for (let i = 0; i < SEED_STEPS.length; i++) {
      const seed = SEED_STEPS[i];
      const now = new Date().toISOString();
      await IDB.put('challenge_steps', {
        id: crypto.randomUUID(), user_id: S.user.id, position: i, day_label: null,
        title: seed.title, block: seed.block, help: seed.help || null, parts: seed.parts,
        closing: !!seed.closing, archived: false, deleted_at: null, created_at: now, updated_at: now, _dirty: true, _rev: 1
      });
    }
    await afterChange();
  }

  function maybeChallengeOnboard() {
    if (S.settings.data && S.settings.data.challengeStarted) return Promise.resolve();
    return new Promise((resolve) => {
      let m = null;
      const choose = async (which) => {
        m.close();
        if (which === 'seed') await seedChallengeSteps();
        await updateSettings(null, { challengeStarted: true });
        resolve();
      };
      const choice = (title, desc, which) => h('button', { type: 'button', class: 'choice', on: { click: () => choose(which) } },
        h('strong', null, title), h('span', null, desc));
      m = modal({
        title: t('challenge.welcomeTitle'),
        body: h('div', null, h('p', null, t('challenge.welcomeText')),
          choice(t('challenge.kitMine'), t('challenge.kitMineDesc'), 'seed'),
          choice(t('challenge.kitEmpty'), t('challenge.kitEmptyDesc'), 'empty')),
        actions: [],
        onDismiss: () => resolve()
      });
    });
  }

  /* --- Briques de saisie (parts) --- */
  function ensureArr(data, key) { if (!Array.isArray(data[key])) data[key] = []; return data[key]; }

  function autoGrow(ta) {
    const resize = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; };
    ta.addEventListener('input', resize);
    requestAnimationFrame(resize);
    return ta;
  }
  function growField(value, placeholder) {
    const ta = h('textarea', { rows: '1', class: 'grow-field', placeholder: placeholder || undefined });
    ta.value = value || '';
    return autoGrow(ta);
  }

  function partBullets(part, data, touch) {
    const arr = ensureArr(data, part.key);
    const list = h('ul', { class: 'blist' });
    const renderItem = (val) => {
      const inp = growField(val, part.label || t('tpl.bulletItem'));
      const li = h('li', { class: 'brow' });
      const del = h('button', {
        type: 'button', class: 'iconbtn', 'aria-label': t('common.remove'),
        on: { click: () => { const i = [...list.children].indexOf(li); if (i > -1) arr.splice(i, 1); li.remove(); touch(); } }
      }, icon('trash'));
      inp.addEventListener('input', () => { const i = [...list.children].indexOf(li); if (i > -1) arr[i] = inp.value; touch(); });
      li.append(inp, del);
      return { li, inp };
    };
    arr.forEach((v) => { const { li } = renderItem(v); list.append(li); });
    const addBtn = h('button', {
      type: 'button', class: 'btn ghost',
      on: { click: () => { arr.push(''); const { li, inp } = renderItem(''); list.append(li); inp.focus(); touch(); } }
    }, icon('plus'), t('tpl.addLine'));
    return h('div', { class: 'part' }, part.label ? h('h3', { class: 'part-label' }, part.label) : null, list, addBtn);
  }

  function partChecklist(part, data, touch) {
    const arr = ensureArr(data, part.key);
    const list = h('ul', { class: 'blist' });
    const renderItem = (item) => {
      const cb = h('input', { type: 'checkbox', checked: !!item.done });
      const inp = growField(item.text, part.label);
      const li = h('li', { class: 'brow' + (item.done ? ' done' : '') });
      const del = h('button', {
        type: 'button', class: 'iconbtn', 'aria-label': t('common.remove'),
        on: { click: () => { const i = arr.indexOf(item); if (i > -1) arr.splice(i, 1); li.remove(); touch(); } }
      }, icon('trash'));
      cb.addEventListener('change', () => { item.done = cb.checked; li.classList.toggle('done', cb.checked); touch(); });
      inp.addEventListener('input', () => { item.text = inp.value; touch(); });
      li.append(cb, inp, del);
      return { li, inp };
    };
    arr.forEach((it) => { const { li } = renderItem(it); list.append(li); });
    const addBtn = h('button', {
      type: 'button', class: 'btn ghost',
      on: { click: () => { const it = { text: '', done: false }; arr.push(it); const { li, inp } = renderItem(it); list.append(li); inp.focus(); touch(); } }
    }, icon('plus'), t('tpl.addLine'));
    return h('div', { class: 'part' }, part.label ? h('h3', { class: 'part-label' }, part.label) : null, list, addBtn);
  }

  function partText(part, data, touch) {
    const ta = growField(data[part.key], null);
    ta.rows = String(part.rows || 5);
    ta.style.height = '';
    requestAnimationFrame(() => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; });
    ta.addEventListener('input', () => { data[part.key] = ta.value; touch(); });
    return h('div', { class: 'part' }, part.label ? h('h3', { class: 'part-label' }, part.label) : null, ta);
  }

  function partTable(part, data, touch) {
    const arr = ensureArr(data, part.key);
    const gridCols = part.columns.map(() => '1fr').join(' ') + (part.scale ? ' 8.5rem' : '');
    const head = h('div', { class: 'ttable-head', style: { gridTemplateColumns: gridCols } },
      part.columns.map((c) => h('span', null, c)),
      part.scale ? h('span', null, part.scaleLabel || t('tpl.scale')) : null);
    const list = h('div', { class: 'ttable' });
    const renderRow = (row) => {
      const cells = part.columns.map((label, ci) => {
        const inp = growField(row['c' + ci], label);
        inp.addEventListener('input', () => { row['c' + ci] = inp.value; touch(); });
        return inp;
      });
      let scaleEl = null;
      if (part.scale) {
        if (row.scale == null) row.scale = 5;
        const rng = h('input', { type: 'range', min: '1', max: '10', value: String(row.scale) });
        const out = h('span', { class: 'rangeval' }, String(row.scale));
        rng.addEventListener('input', () => { row.scale = Number(rng.value); out.textContent = rng.value; touch(); });
        scaleEl = h('div', { class: 'rangewrap' }, rng, out);
      }
      const el = h('div', { class: 'ttable-row', style: { gridTemplateColumns: gridCols } });
      const del = h('button', {
        type: 'button', class: 'iconbtn', 'aria-label': t('common.remove'),
        on: { click: () => { const i = arr.indexOf(row); if (i > -1) arr.splice(i, 1); el.remove(); touch(); } }
      }, icon('trash'));
      el.append(...cells, scaleEl || document.createDocumentFragment(), h('div', { class: 'trow-actions' }, del));
      return el;
    };
    arr.forEach((r) => list.append(renderRow(r)));
    const addBtn = h('button', {
      type: 'button', class: 'btn ghost',
      on: { click: () => { const r = {}; arr.push(r); list.append(renderRow(r)); touch(); } }
    }, icon('plus'), t('tpl.addRow'));
    return h('div', { class: 'part' }, part.label ? h('h3', { class: 'part-label' }, part.label) : null, head, list, addBtn);
  }

  function partCards(part, data, touch) {
    const arr = ensureArr(data, part.key);
    const list = h('div', { class: 'trows' });
    const renderCard = (card) => {
      const fields = part.fields.map((label, fi) => {
        const inp = growField(card['f' + fi], label);
        inp.addEventListener('input', () => { card['f' + fi] = inp.value; touch(); });
        return h('div', { class: 'field' }, h('label', null, label), inp);
      });
      const el = h('div', { class: 'trow' });
      const del = h('button', {
        type: 'button', class: 'iconbtn', 'aria-label': t('common.remove'),
        on: { click: () => { const i = arr.indexOf(card); if (i > -1) arr.splice(i, 1); el.remove(); touch(); } }
      }, icon('trash'));
      el.append(...fields, h('div', { class: 'trow-actions' }, del));
      return el;
    };
    arr.forEach((c) => list.append(renderCard(c)));
    const addBtn = h('button', {
      type: 'button', class: 'btn ghost',
      on: { click: () => { const c = {}; arr.push(c); const el = renderCard(c); list.append(el); const f = el.querySelector('textarea,input'); if (f) f.focus(); touch(); } }
    }, icon('plus'), t('tpl.addCard'));
    return h('div', { class: 'part' }, part.label ? h('h3', { class: 'part-label' }, part.label) : null, list, addBtn);
  }

  function renderPart(part, data, touch) {
    switch (part.type) {
      case 'bullets': return partBullets(part, data, touch);
      case 'checklist': return partChecklist(part, data, touch);
      case 'text': return partText(part, data, touch);
      case 'table': return partTable(part, data, touch);
      case 'cards': return partCards(part, data, touch);
      default: return null;
    }
  }

  /* --- Réglage de la cadence --- */
  async function createOrUpdateRun(run, cadence, startDate, weekdays) {
    if (run) {
      run.cadence = cadence;
      run.start_date = startDate;
      run.weekdays = cadence === 'intensive' ? [] : weekdays;
      await saveRecord('challenge_runs', run);
    } else {
      const now = new Date().toISOString();
      await IDB.put('challenge_runs', {
        id: crypto.randomUUID(), user_id: S.user.id, name: t('challenge.defaultName', { year: parseYMD(startDate).getFullYear() }),
        cadence, start_date: startDate, weekdays: cadence === 'intensive' ? [] : weekdays,
        status: 'active', completed_at: null, deleted_at: null, created_at: now, updated_at: now, _dirty: true, _rev: 1
      });
    }
    await afterChange();
    location.hash = '#/challenge';
  }

  async function resetRunProgress(run) {
    const ok = await confirmDialog(t('challenge.resetConfirm'), t('challenge.resetConfirmBtn'), true);
    if (!ok) return;
    const now = new Date().toISOString();
    const mine = S.challenge_entries.filter((e) => e.run_id === run.id && !e.deleted_at);
    for (const e of mine) { e.deleted_at = now; e.data = {}; e.done = false; e.done_at = null; await saveRecord('challenge_entries', e); }
    await afterChange();
    toast(t('challenge.resetDone'));
  }

  /* --- Étapes : ajout, édition --- */
  function pickBrick() {
    return new Promise((resolve) => {
      let m = null;
      const opt = (kind, title, desc) => h('button', {
        type: 'button', class: 'choice', on: { click: () => { m.close(); resolve(kind); } }
      }, h('strong', null, title), h('span', null, desc));
      m = modal({
        title: t('challenge.brickTitle'),
        body: h('div', null,
          opt('text', t('brick.text'), t('brick.textDesc')),
          opt('bullets', t('brick.bullets'), t('brick.bulletsDesc')),
          opt('checklist', t('brick.checklist'), t('brick.checklistDesc')),
          opt('table', t('brick.table'), t('brick.tableDesc')),
          opt('cards', t('brick.cards'), t('brick.cardsDesc'))),
        actions: [{ label: t('common.cancel'), onClick: () => resolve(null) }],
        onDismiss: () => resolve(null)
      });
    });
  }

  function partSummary(part) {
    const kindLabel = t('brick.' + part.type);
    if (part.type === 'table') return kindLabel + ' — ' + part.columns.join(', ');
    if (part.type === 'cards') return kindLabel + ' — ' + part.fields.join(', ');
    if (part.label) return kindLabel + ' — ' + part.label;
    return kindLabel;
  }

  async function addPartToStep(step) {
    const kind = await pickBrick();
    if (!kind) return;
    const isFirst = step.parts.length === 0;
    let label = step.title;
    if (!isFirst && (kind === 'text' || kind === 'bullets' || kind === 'checklist')) {
      label = await textPrompt({ title: t('challenge.partLabelTitle'), label: t('challenge.partLabelHint') });
      if (!label) return;
    }
    const uid = kind + '_' + Math.random().toString(36).slice(2, 8);
    let part;
    if (kind === 'table') {
      const raw = await textPrompt({ title: t('challenge.columnsTitle'), label: t('challenge.columnsLabel') });
      const cols = (raw || '').split(',').map((x) => x.trim()).filter(Boolean);
      part = { type: 'table', key: uid, columns: cols.length ? cols : [t('challenge.col1'), t('challenge.col2')] };
    } else if (kind === 'cards') {
      const raw = await textPrompt({ title: t('challenge.fieldsTitle'), label: t('challenge.fieldsLabel') });
      const flds = (raw || '').split(',').map((x) => x.trim()).filter(Boolean);
      part = { type: 'cards', key: uid, fields: flds.length ? flds : [t('challenge.field1'), t('challenge.field2')] };
    } else if (kind === 'bullets') {
      part = { type: 'bullets', key: uid, label };
    } else if (kind === 'checklist') {
      part = { type: 'checklist', key: uid, label };
    } else {
      part = { type: 'text', key: uid, label, rows: 6 };
    }
    step.parts = [...step.parts, part];
    await saveRecord('challenge_steps', step);
    await afterChange();
  }

  async function movePart(step, i, dir) {
    const j = i + dir;
    if (j < 0 || j >= step.parts.length) return;
    const arr = step.parts.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    step.parts = arr;
    await saveRecord('challenge_steps', step);
    await afterChange();
  }

  async function removePart(step, i) {
    const arr = step.parts.slice();
    arr.splice(i, 1);
    step.parts = arr;
    await saveRecord('challenge_steps', step);
    await afterChange();
  }

  async function addChallengeStepFlow() {
    const title = await textPrompt({ title: t('challenge.newStepTitle'), label: t('challenge.stepTitleLabel') });
    if (!title) return;
    const now = new Date().toISOString();
    const rec = {
      id: crypto.randomUUID(), user_id: S.user.id, position: nextPosition('challenge_steps'), day_label: null,
      title, block: '', help: null, parts: [], closing: false, archived: false, deleted_at: null,
      created_at: now, updated_at: now, _dirty: true, _rev: 1
    };
    await IDB.put('challenge_steps', rec);
    await afterChange();
    location.hash = '#/challenge/steps/' + rec.id;
  }

  function iconBtnGeneric(name, label, fn, disabled) {
    return h('button', {
      type: 'button', class: 'iconbtn', 'aria-label': label, title: label, disabled: !!disabled, on: { click: fn }
    }, icon(name));
  }

  function viewStepEditor(step) {
    const titleInput = h('input', { type: 'text', id: 'st-title', value: step.title, maxlength: 140 });
    titleInput.addEventListener('change', async () => {
      const v = titleInput.value.trim();
      if (v && v !== step.title) { step.title = v; await saveRecord('challenge_steps', step); await afterChange(); }
    });
    const blockInput = h('input', { type: 'text', id: 'st-block', value: step.block || '', maxlength: 60 });
    blockInput.addEventListener('change', async () => {
      const v = blockInput.value.trim();
      if (v !== (step.block || '')) { step.block = v; await saveRecord('challenge_steps', step); await afterChange(); }
    });

    let content;
    if (step.closing) {
      content = h('p', { class: 'muted' }, t('challenge.closingFixed'));
    } else {
      const rows = step.parts.map((part, i) => h('li', { class: 'mrow' },
        h('span', { class: 'namebtn', style: { cursor: 'default' } }, partSummary(part)),
        iconBtnGeneric('up', t('mgr.up'), () => movePart(step, i, -1), i === 0),
        iconBtnGeneric('down', t('mgr.down'), () => movePart(step, i, 1), i === step.parts.length - 1),
        iconBtnGeneric('trash', t('mgr.delete'), () => removePart(step, i))));
      content = h('div', null,
        step.parts.length ? h('ul', { class: 'list' }, rows) : h('p', { class: 'empty' }, t('challenge.noParts')),
        h('div', { class: 'actions' }, h('button', {
          type: 'button', class: 'btn primary', on: { click: () => addPartToStep(step) }
        }, icon('plus'), t('challenge.addPart'))));
    }
    const hasHelp = step.help && (step.help.objective || step.help.howto || step.help.example || step.help.scripture || step.help.scriptureText);
    const helpSection = h('div', null,
      hasHelp ? h('p', { class: 'muted' }, step.help.objective || '') : h('p', { class: 'empty' }, t('challenge.noHelp')),
      h('div', { class: 'actions' }, h('button', {
        type: 'button', class: 'btn', on: { click: () => editHelp(step) }
      }, icon('bulb'), hasHelp ? t('challenge.editHelpBtn') : t('challenge.addHelp'))));

    return h('main', { class: 'page' },
      h('a', { class: 'backlink', href: '#/challenge/steps' }, icon('back'), t('challenge.stepsTitle')),
      h('h1', { class: 'note-title' }, t('challenge.editStepTitle')),
      h('div', { class: 'field' }, h('label', { for: 'st-title' }, t('challenge.stepTitleLabel')), titleInput),
      h('div', { class: 'field' }, h('label', { for: 'st-block' }, t('challenge.stepBlockLabel')), blockInput),
      h('h2', { class: 'section' }, t('challenge.helpSectionTitle')),
      helpSection,
      h('h2', { class: 'section' }, t('challenge.contentTitle')),
      content);
  }

  function editHelp(step) {
    const hlp = step.help || {};
    const objective = h('textarea', { rows: '2' });
    objective.value = hlp.objective || '';
    const howto = h('textarea', { rows: '4' });
    howto.value = hlp.howto || '';
    const example = h('input', { type: 'text' });
    example.value = hlp.example || '';
    const scripture = h('input', { type: 'text' });
    scripture.value = hlp.scripture || '';
    const scriptureText = h('textarea', { rows: '4' });
    scriptureText.value = hlp.scriptureText || '';
    modal({
      title: t('challenge.editHelpTitle'),
      body: h('div', null,
        h('div', { class: 'field' }, h('label', null, t('challenge.helpWhy')), objective),
        h('div', { class: 'field' }, h('label', null, t('challenge.helpHow')), howto),
        h('div', { class: 'field' }, h('label', null, t('challenge.helpExample')), example),
        h('div', { class: 'field' }, h('label', null, t('challenge.scriptureRefLabel')), scripture),
        h('div', { class: 'field' }, h('label', null, t('challenge.verseTextPlaceholder')), scriptureText)),
      actions: [
        { label: t('common.cancel') },
        {
          label: t('common.save'), kind: 'primary',
          onClick: async () => {
            const obj = objective.value.trim();
            const how = howto.value.trim();
            const ex = example.value.trim();
            const scr = scripture.value.trim();
            const scrT = scriptureText.value.trim();
            step.help = (obj || how || ex || scr || scrT)
              ? { objective: obj || null, howto: how || null, example: ex || null, scripture: scr || null, scriptureText: scrT || null }
              : null;
            await saveRecord('challenge_steps', step);
            await afterChange();
          }
        }
      ]
    });
  }

  function openVerse(step) {
    const hlp = step.help || {};
    const ta = h('textarea', { rows: '6' });
    ta.value = hlp.scriptureText || '';
    modal({
      title: hlp.scripture || t('challenge.verseTextPlaceholder'),
      body: h('div', null, h('p', { class: 'muted' }, t('challenge.verseTextHint')), ta),
      actions: [
        { label: t('common.cancel') },
        {
          label: t('common.save'), kind: 'primary',
          onClick: async () => {
            step.help = { ...(step.help || {}), scriptureText: ta.value };
            await saveRecord('challenge_steps', step);
            await afterChange();
          }
        }
      ]
    });
  }

  function openHelp(step) {
    const hlp = step.help;
    const body = hlp
      ? h('div', null,
        hlp.objective ? h('p', null, h('strong', null, t('challenge.helpWhy') + ' '), hlp.objective) : null,
        hlp.howto ? h('div', null, h('strong', null, t('challenge.helpHow')), h('p', { style: { whiteSpace: 'pre-line' } }, hlp.howto)) : null,
        hlp.example ? h('p', null, h('strong', null, t('challenge.helpExample') + ' '), hlp.example) : null,
        hlp.scripture ? h('button', { type: 'button', class: 'versebtn', on: { click: () => openVerse(step) } }, hlp.scripture) : null,
        hlp.scriptureText ? h('p', { class: 'muted versequote' }, hlp.scriptureText) : null)
      : h('p', { class: 'muted' }, t('challenge.noHelp'));
    modal({ title: t('challenge.helpTitle'), body, actions: [{ label: t('common.ok'), kind: 'primary' }] });
  }

  function exportStepsSnapshot() {
    const steps = S.challenge_steps.filter((s) => !s.deleted_at).sort(byPos).map(strip);
    const data = { app: 'oree-steps', version: 1, exportedAt: new Date().toISOString(), steps };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: 'oree-defi-' + new Date().toISOString().slice(0, 10) + '.json' });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast(t('challenge.snapshotSaved'));
  }

  async function importStepsSnapshot(file) {
    let j;
    try {
      j = JSON.parse(await file.text());
      if (!j || j.app !== 'oree-steps' || !Array.isArray(j.steps)) throw new Error('format');
    } catch (e) { toast(t('bk.error')); return; }
    if (!(await confirmDialog(t('challenge.snapshotRestoreConfirm'), t('challenge.snapshotRestore'), true))) return;
    const now = new Date().toISOString();
    for (const st of S.challenge_steps.filter((s) => !s.deleted_at)) { st.deleted_at = now; await saveRecord('challenge_steps', st); }
    for (const s of j.steps) {
      if (!s || typeof s.title !== 'string') continue;
      await IDB.put('challenge_steps', {
        id: crypto.randomUUID(), user_id: S.user.id, position: Number.isFinite(s.position) ? s.position : 0,
        day_label: typeof s.day_label === 'string' ? s.day_label : null, title: s.title.slice(0, 140),
        block: typeof s.block === 'string' ? s.block : '', help: (s.help && typeof s.help === 'object') ? s.help : null,
        parts: Array.isArray(s.parts) ? s.parts : [], closing: !!s.closing, archived: !!s.archived, deleted_at: null,
        created_at: now, updated_at: now, _dirty: true, _rev: 1
      });
    }
    await afterChange();
    toast(t('challenge.snapshotRestored'));
  }

  /* --- Écrans --- */
  function viewChallenge(parts) {
    const sub = parts[0];
    if (sub === 'steps') {
      if (parts[1]) {
        const step = S.challenge_steps.find((s) => s.id === parts[1] && !s.deleted_at);
        if (!step) return h('main', { class: 'page' }, h('a', { class: 'backlink', href: '#/challenge/steps' }, icon('back'), t('challenge.stepsTitle')), h('p', { class: 'empty' }, t('challenge.missing')));
        return viewStepEditor(step);
      }
      return viewChallengeSteps();
    }
    if (sub === 'step' && parts[1]) {
      const step = S.challenge_steps.find((s) => s.id === parts[1] && !s.deleted_at);
      if (!step) return h('main', { class: 'page' }, h('a', { class: 'backlink', href: '#/challenge' }, icon('back'), t('tab.challenge')), h('p', { class: 'empty' }, t('challenge.missing')));
      return viewChallengeStepDetail(activeRun(), step);
    }
    const run = activeRun();
    if (sub === 'setup' || !run) return viewChallengeSetup(run);
    return viewChallengeRun(run);
  }

  function viewChallengeSetup(run) {
    const steps = activeChallengeSteps();
    if (!steps.length) {
      return h('main', { class: 'page' },
        h('h1', { class: 'note-title' }, t('tab.challenge')),
        h('p', { class: 'lede' }, t('challenge.needSteps')),
        h('div', { class: 'actions' }, h('a', { class: 'btn primary', href: '#/challenge/steps' }, t('challenge.manageSteps'))));
    }
    let cadence = (run && run.cadence) || 'intensive';
    const selectedDays = new Set(run && run.weekdays && run.weekdays.length ? run.weekdays : [1, 3, 5]);
    const today = fmtYMD(new Date());
    const dateInput = h('input', { type: 'date', id: 'startdate', value: (run && run.start_date) || today });

    const cadKeys = ['intensive', 'moderate', 'custom'];
    const cadBtns = cadKeys.map((c) => h('button', {
      type: 'button', class: 'btn', 'aria-pressed': String(c === cadence),
      on: {
        click: () => {
          cadence = c;
          cadBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(cadKeys[i] === c)));
          weekWrap.hidden = c === 'intensive';
          updateSummary();
        }
      }
    }, t('cadence.' + c)));

    const dayBtns = [0, 1, 2, 3, 4, 5, 6].map((i) => h('button', {
      type: 'button', class: 'btn', 'aria-pressed': String(selectedDays.has(i)), title: t('day.' + i),
      on: {
        click: (e) => {
          if (selectedDays.has(i)) selectedDays.delete(i); else selectedDays.add(i);
          e.currentTarget.setAttribute('aria-pressed', String(selectedDays.has(i)));
          updateSummary();
        }
      }
    }, t('day.' + i)));
    const weekWrap = h('div', { class: 'seg', hidden: cadence === 'intensive' }, dayBtns);

    const summary = h('p', { class: 'muted' });
    function updateSummary() {
      if (cadence !== 'intensive' && !selectedDays.size) { summary.textContent = t('challenge.pickDay'); return; }
      const draft = { cadence, start_date: dateInput.value || today, weekdays: [...selectedDays] };
      const last = stepDateForIndex(draft, steps.length - 1);
      summary.textContent = t('challenge.summary', { n: steps.length, start: fmtDateLong(parseYMD(draft.start_date)), end: fmtDateLong(last) });
    }
    dateInput.addEventListener('input', updateSummary);
    updateSummary();

    const err = h('p', { class: 'msg err', role: 'alert' });
    err.hidden = true;
    const form = h('form', {
      novalidate: true,
      on: {
        submit: async (e) => {
          e.preventDefault();
          if (!dateInput.value) { err.textContent = t('challenge.needDate'); err.hidden = false; return; }
          if (cadence !== 'intensive' && !selectedDays.size) { err.textContent = t('challenge.pickDay'); err.hidden = false; return; }
          err.hidden = true;
          await createOrUpdateRun(run, cadence, dateInput.value, [...selectedDays].sort());
        }
      }
    },
    err,
    h('div', { class: 'field' }, h('label', null, t('challenge.cadenceLabel')), h('div', { class: 'seg' }, cadBtns)),
    weekWrap,
    h('div', { class: 'field' }, h('label', { for: 'startdate' }, t('challenge.startLabel')), dateInput),
    summary,
    h('div', { class: 'actions' },
      h('button', { type: 'submit', class: 'btn primary' }, run ? t('challenge.saveCadence') : t('challenge.start')),
      h('a', { class: 'btn ghost', href: '#/challenge/steps' }, t('challenge.manageSteps'))));

    return h('main', { class: 'page' },
      run ? h('a', { class: 'backlink', href: '#/challenge' }, icon('back'), t('tab.challenge')) : null,
      h('h1', { class: 'note-title' }, t(run ? 'challenge.editTitle' : 'challenge.setupTitle')),
      form);
  }

  function viewChallengeRun(run) {
    const steps = activeChallengeSteps();
    const doneIds = new Set(S.challenge_entries.filter((e) => e.run_id === run.id && !e.deleted_at && e.done).map((e) => e.step_id));
    const dataIds = new Set(S.challenge_entries.filter((e) => e.run_id === run.id && !e.deleted_at && e.data && Object.keys(e.data).length).map((e) => e.step_id));
    const rows = steps.map((st, i) => {
      const date = stepDateForIndex(run, i);
      const state = doneIds.has(st.id) ? 'done' : dataIds.has(st.id) ? 'progress' : 'empty';
      return h('li', null, h('a', { class: 'row steprow', href: '#/challenge/step/' + st.id },
        h('span', { class: 'stepdate' }, fmtDateShort(date)),
        h('span', { class: 'statedot', 'data-state': state, 'aria-hidden': 'true' }),
        h('span', { class: 'grow' }, st.title, st.block ? h('span', { class: 'tag' }, ' · ' + st.block) : null),
        icon('chev', 'chev')));
    });
    return h('main', { class: 'page' },
      h('h1', { class: 'note-title' }, run.name),
      h('p', { class: 'lede' }, t('challenge.progress', { done: doneIds.size, total: steps.length })),
      h('div', { class: 'actions' },
        h('a', { class: 'btn', href: '#/challenge/steps' }, t('challenge.manageSteps')),
        h('a', { class: 'btn ghost', href: '#/challenge/setup' }, t('challenge.changeCadence')),
        h('button', { type: 'button', class: 'btn ghost', on: { click: () => resetRunProgress(run) } }, t('challenge.resetProgress'))),
      h('ul', { class: 'list' }, rows));
  }

  function viewChallengeStepDetail(run, step) {
    if (!run || !S.currentEntry) {
      return h('main', { class: 'page' },
        h('a', { class: 'backlink', href: '#/challenge' }, icon('back'), t('tab.challenge')),
        h('p', { class: 'empty' }, t('challenge.noRun')));
    }
    const steps = activeChallengeSteps();
    const idx = steps.findIndex((s) => s.id === step.id);
    const date = idx >= 0 ? stepDateForIndex(run, idx) : null;
    const entry = S.currentEntry;
    const touch = () => touchEntry(entry);
    const isClosing = !!step.closing;

    const helpBtn = h('button', { type: 'button', class: 'btn ghost helpbtn', on: { click: () => openHelp(step) } }, icon('bulb'), t('challenge.help'));
    const doneBtn = h('button', {
      type: 'button', class: 'btn' + (entry.done ? ' primary' : ''),
      on: {
        click: () => {
          entry.done = !entry.done;
          entry.done_at = entry.done ? new Date().toISOString() : null;
          touchEntry(entry);
          render();
        }
      }
    }, entry.done ? icon('check') : null, entry.done ? t('challenge.done') : t('challenge.markDone'));

    let body;
    if (isClosing) {
      const total = steps.length - 1;
      const doneCount = S.challenge_entries.filter((e) => e.run_id === run.id && !e.deleted_at && e.done && e.step_id !== step.id).length;
      body = h('div', null,
        h('p', null, t('challenge.closingText', { done: doneCount, total })),
        h('div', { class: 'actions' }, h('button', {
          type: 'button', class: 'btn primary',
          on: {
            click: async () => {
              run.status = 'completed';
              run.completed_at = new Date().toISOString();
              await saveRecord('challenge_runs', run);
              entry.done = true;
              entry.done_at = new Date().toISOString();
              touchEntry(entry);
              toast(t('challenge.closed'));
              render();
            }
          }
        }, icon('lock2'), t('challenge.close'))));
    } else {
      const rendered = (step.parts || []).map((p) => renderPart(p, entry.data, touch)).filter(Boolean);
      body = h('div', null, rendered);
    }

    return h('main', { class: 'page' },
      h('a', { class: 'backlink', href: '#/challenge' }, icon('back'), t('tab.challenge')),
      date ? h('p', { class: 'muted' }, cap(date.toLocaleDateString(S.settings.language, { weekday: 'long', day: 'numeric', month: 'long' }))) : null,
      step.block ? h('span', { class: 'pill' }, step.block) : null,
      h('h1', { class: 'note-title' }, step.title),
      h('div', { class: 'actions' }, helpBtn, !isClosing ? doneBtn : null),
      body);
  }

  async function syncDefaultContent() {
    const ok = await confirmDialog(t('challenge.syncConfirm'), t('challenge.syncConfirmBtn'));
    if (!ok) return;
    const everKnownTitles = new Set(S.challenge_steps.map((s) => s.title));
    const current = S.challenge_steps.filter((s) => !s.deleted_at).sort(byPos);
    // placedByTitle suit, au fil de la boucle, aussi bien les étapes déjà là que celles qu'on vient d'insérer,
    // pour que chaque nouvelle étape s'accroche à la plus proche déjà positionnée (existante ou tout juste ajoutée).
    const placedByTitle = new Map(current.map((s) => [s.title, s]));
    const finalOrder = current.slice();
    let updated = 0;

    for (let i = 0; i < SEED_STEPS.length; i++) {
      const seed = SEED_STEPS[i];
      const existing = placedByTitle.get(seed.title);
      if (existing && current.includes(existing)) {
        if (seed.help) {
          const keep = existing.help && existing.help.scriptureText;
          const nextHelp = keep ? { ...seed.help, scriptureText: keep } : seed.help;
          if (JSON.stringify(existing.help) !== JSON.stringify(nextHelp)) {
            existing.help = nextHelp;
            await saveRecord('challenge_steps', existing);
            updated++;
          }
        }
        continue;
      }
      if (everKnownTitles.has(seed.title)) continue; // supprimée volontairement par le passé : on ne la recrée pas
      let anchorIdx = -1;
      for (let k = i - 1; k >= 0; k--) {
        const prev = placedByTitle.get(SEED_STEPS[k].title);
        if (prev) { anchorIdx = finalOrder.indexOf(prev); break; }
      }
      let insertAt;
      if (anchorIdx >= 0) {
        insertAt = anchorIdx + 1;
      } else {
        let followIdx = -1;
        for (let k = i + 1; k < SEED_STEPS.length; k++) {
          const nxt = placedByTitle.get(SEED_STEPS[k].title);
          if (nxt) { followIdx = finalOrder.indexOf(nxt); break; }
        }
        insertAt = followIdx >= 0 ? followIdx : finalOrder.length;
      }
      const now = new Date().toISOString();
      const rec = {
        id: crypto.randomUUID(), user_id: S.user.id, position: 0, day_label: null,
        title: seed.title, block: seed.block, help: seed.help || null, parts: seed.parts,
        closing: !!seed.closing, archived: false, deleted_at: null, created_at: now, updated_at: now, _dirty: true, _rev: 1
      };
      finalOrder.splice(insertAt, 0, rec);
      placedByTitle.set(seed.title, rec);
    }

    const closeIdx = finalOrder.findIndex((s) => s.closing);
    if (closeIdx > -1 && closeIdx !== finalOrder.length - 1) {
      const [closeStep] = finalOrder.splice(closeIdx, 1);
      finalOrder.push(closeStep);
    }

    let added = 0;
    for (let i = 0; i < finalOrder.length; i++) {
      const st = finalOrder[i];
      const wasExisting = current.includes(st);
      if (!wasExisting) {
        st.position = i;
        await IDB.put('challenge_steps', st);
        added++;
      } else if (st.position !== i) {
        st.position = i;
        await saveRecord('challenge_steps', st);
      }
    }

    await afterChange();
    toast(t('challenge.syncDone', { updated, added }));
  }

  function viewChallengeSteps() {
    const showArch = S.ui.showArch.challenge_steps;
    const all = S.challenge_steps.filter((r) => !r.deleted_at).sort(byPos);
    const vis = showArch ? all : all.filter((r) => !r.archived);
    const hasArch = all.some((r) => r.archived);
    const rows = vis.map((st, i) => h('li', { class: 'mrow' + (st.archived ? ' is-archived' : '') },
      h('a', { class: 'namebtn', href: '#/challenge/steps/' + st.id },
        st.title, st.block ? h('span', { class: 'tag' }, ' · ' + st.block) : null, st.archived ? h('span', { class: 'tag' }, t('mgr.archivedTag')) : null),
      iconBtnGeneric('up', t('mgr.up'), () => mgrMove('challenge_steps', vis, i, -1), i === 0),
      iconBtnGeneric('down', t('mgr.down'), () => mgrMove('challenge_steps', vis, i, 1), i === vis.length - 1),
      iconBtnGeneric(st.archived ? 'restore' : 'archive', st.archived ? t('mgr.restore') : t('mgr.archive'), () => mgrToggleArchive('challenge_steps', st)),
      iconBtnGeneric('trash', t('mgr.delete'), () => mgrDelete('challenge_steps', st))));
    const file = h('input', { type: 'file', accept: '.json,application/json', hidden: true });
    file.addEventListener('change', async () => { if (file.files && file.files[0]) await importStepsSnapshot(file.files[0]); file.value = ''; });
    return h('main', { class: 'page' },
      h('a', { class: 'backlink', href: '#/challenge' }, icon('back'), t('tab.challenge')),
      h('h1', { class: 'note-title' }, t('challenge.stepsTitle')),
      h('p', { class: 'lede' }, t('challenge.stepsInfo')),
      vis.length ? h('ul', { class: 'list' }, rows) : h('p', { class: 'empty' }, t('mgr.empty')),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn primary', on: { click: addChallengeStepFlow } }, icon('plus'), t('mgr.add')),
        hasArch ? h('button', {
          type: 'button', class: 'btn',
          on: { click: () => { S.ui.showArch.challenge_steps = !showArch; render(); } }
        }, showArch ? t('mgr.hideArchived') : t('mgr.showArchived')) : null),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn ghost', on: { click: exportStepsSnapshot } }, t('challenge.snapshotSave')),
        h('button', { type: 'button', class: 'btn ghost', on: { click: () => file.click() } }, t('challenge.snapshotLoad')),
        file),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn ghost', on: { click: syncDefaultContent } }, t('challenge.syncAction'))));
  }

  /* ==========================================================
     Rythme du jour : semaine type, moments ponctuels, vrac, protocole
     ========================================================== */
  const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Lun..Dim pour l'affichage, même si getDay() renvoie 0=dim
  const activeSlots = () => S.schedule_slots.filter((r) => !r.deleted_at && !r.archived);
  const activeVrac = () => S.vrac_items.filter((r) => !r.deleted_at && !r.archived);
  const activeSegments = () => S.protocol_segments.filter((r) => !r.deleted_at && !r.archived);
  const catById = (id) => S.categories.find((c) => c.id === id && !c.deleted_at);

  function timeToMin(hm) { const [h, m] = (hm || '0:0').split(':').map(Number); return h * 60 + (m || 0); }
  function catChip(id) {
    const c = catById(id);
    const dot = h('i'); dot.style.background = c ? c.color : 'var(--muted)';
    return h('span', { class: 'dchip' }, dot, c ? c.name : t('rhythm.noCategory'));
  }

  function categoryPicker(selectedId) {
    return new Promise((resolve) => {
      let m = null;
      const cats = S.categories.filter((c) => !c.deleted_at && !c.archived).sort(byPos);
      const opt = (id, name, color) => {
        const dot = h('i'); if (color) dot.style.background = color;
        return h('button', { type: 'button', class: 'choice', on: { click: () => { m.close(); resolve(id); } } },
          h('strong', null, color ? h('span', { class: 'dchip' }, dot, name) : name));
      };
      m = modal({
        title: t('rhythm.category'),
        body: h('div', null, opt(null, t('rhythm.noCategory'), null), cats.map((c) => opt(c.id, c.name, c.color))),
        actions: [{ label: t('common.cancel'), onClick: () => resolve(undefined) }],
        onDismiss: () => resolve(undefined)
      });
    });
  }

  /* --- Créneaux (semaine type + ponctuels) --- */
  async function slotForm(existing, fixedKind, fixedWeekday) {
    const kind = fixedKind || (existing && existing.kind) || 'weekly';
    let categoryId = existing ? existing.category_id : null;
    let mode = (existing && existing.mode) || 'fixed';
    const start = h('input', { type: 'time', value: (existing && existing.start_time) || '' });
    const end = h('input', { type: 'time', value: (existing && existing.end_time) || '' });
    const label = h('input', { type: 'text', maxlength: 80, value: (existing && existing.label) || '' });
    const catBtn = h('button', { type: 'button', class: 'btn' }, catChip(categoryId));
    catBtn.addEventListener('click', async () => {
      const v = await categoryPicker(categoryId);
      if (v !== undefined) { categoryId = v; catBtn.replaceChildren(catChip(categoryId)); }
    });
    const modeBtns = ['fixed', 'vrac'].map((mo) => h('button', {
      type: 'button', class: 'btn', 'aria-pressed': String(mo === mode),
      on: { click: (e) => { mode = mo; modeBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(['fixed', 'vrac'][i] === mo))); labelField.hidden = mo !== 'fixed'; } }
    }, t(mo === 'fixed' ? 'rhythm.modeFixed' : 'rhythm.modeVrac')));
    const labelField = h('div', { class: 'field', hidden: mode !== 'fixed' }, h('label', null, t('rhythm.label')), label);
    label.placeholder = t('rhythm.labelFixedHint');

    const fields = [
      h('div', { class: 'field' }, h('label', null, t('rhythm.category')), catBtn),
      h('div', { class: 'field' }, h('label', null, t('rhythm.mode')), h('div', { class: 'seg' }, modeBtns)),
      labelField
    ];

    let dateInput = null, endDateInput = null, repeatCb = null;
    if (kind === 'temporary') {
      dateInput = h('input', { type: 'date', value: (existing && existing.start_date) || fmtYMD(new Date()) });
      endDateInput = h('input', { type: 'date', value: (existing && existing.end_date) || '' });
      repeatCb = h('input', { type: 'checkbox', checked: !!(existing && existing.weekday != null) });
      const endWrap = h('div', { class: 'field', hidden: !repeatCb.checked }, h('label', null, t('rhythm.endDateOptional')), endDateInput);
      repeatCb.addEventListener('change', () => { endWrap.hidden = !repeatCb.checked; });
      fields.unshift(
        h('div', { class: 'field' }, h('label', null, t('rhythm.startDate')), dateInput),
        h('div', { class: 'field' }, h('label', { class: 'row', style: { minHeight: '0', padding: '0' } },
          repeatCb, ' ', t('rhythm.repeatWeekday'))),
        endWrap
      );
    }

    const timeFields = h('div', { class: 'seg' },
      h('div', { class: 'field' }, h('label', null, t('rhythm.start')), start),
      h('div', { class: 'field' }, h('label', null, t('rhythm.end')), end));

    return new Promise((resolve) => {
      const err = h('p', { class: 'msg err', role: 'alert' }); err.hidden = true;
      modal({
        title: existing ? t('rhythm.editSlot') : (kind === 'temporary' ? t('rhythm.addMoment') : t('rhythm.addSlot')),
        body: h('div', null, err, timeFields, fields),
        actions: [
          { label: t('common.cancel'), onClick: () => resolve(null) },
          {
            label: t('common.save'), kind: 'primary',
            onClick: () => {
              if (!start.value || !end.value) { err.textContent = t('rhythm.needTimes'); err.hidden = false; return false; }
              if (timeToMin(end.value) <= timeToMin(start.value)) { err.textContent = t('rhythm.needEnd'); err.hidden = false; return false; }
              if (kind === 'temporary' && !dateInput.value) { err.textContent = t('rhythm.needStartDate'); err.hidden = false; return false; }
              resolve({
                kind,
                weekday: kind === 'weekly' ? fixedWeekday : (repeatCb && repeatCb.checked ? parseYMD(dateInput.value).getDay() : null),
                start_date: kind === 'temporary' ? dateInput.value : null,
                end_date: kind === 'temporary' && repeatCb.checked ? (endDateInput.value || null) : null,
                start_time: start.value, end_time: end.value,
                category_id: categoryId, mode, label: label.value.trim()
              });
              return undefined;
            }
          }
        ],
        onDismiss: () => resolve(null)
      });
    });
  }

  async function addSlot(kind, weekday) {
    const data = await slotForm(null, kind, weekday);
    if (!data) return;
    const now = new Date().toISOString();
    await IDB.put('schedule_slots', {
      id: crypto.randomUUID(), user_id: S.user.id, ...data,
      archived: false, deleted_at: null, created_at: now, updated_at: now, _dirty: true, _rev: 1
    });
    await afterChange();
  }

  async function editSlot(slot) {
    const data = await slotForm(slot, slot.kind, slot.weekday);
    if (!data) return;
    Object.assign(slot, data);
    await saveRecord('schedule_slots', slot);
    await afterChange();
  }

  function slotRow(slot) {
    const sub = slot.mode === 'fixed' ? (slot.label || t('rhythm.modeFixed')) : t('rhythm.modeVrac');
    const del = h('button', {
      type: 'button', class: 'iconbtn', 'aria-label': t('common.remove'),
      on: { click: () => mgrDelete('schedule_slots', slot) }
    }, icon('trash'));
    return h('li', null, h('div', { class: 'row', style: { cursor: 'pointer' }, on: { click: () => editSlot(slot) } },
      h('span', { class: 'stepdate' }, slot.start_time + '–' + slot.end_time),
      catChip(slot.category_id),
      h('span', { class: 'grow hint' }, sub),
      del));
  }

  function viewSchedule() {
    const tab = (S.route.split('/')[2]) || 'week';
    const dayIdx = Number(S.route.split('/')[3]);
    const curDay = Number.isFinite(dayIdx) ? dayIdx : new Date().getDay();

    const tabs = h('div', { class: 'seg' },
      h('a', { class: 'btn', href: '#/settings/schedule/week/' + curDay, 'aria-pressed': String(tab === 'week') }, t('rhythm.weekTab')),
      h('a', { class: 'btn', href: '#/settings/schedule/temp', 'aria-pressed': String(tab === 'temp') }, t('rhythm.tempTab')));

    let body;
    if (tab === 'temp') {
      const temp = activeSlots().filter((s) => s.kind === 'temporary').sort((a, b) => (a.start_date || '').localeCompare(b.start_date || ''));
      const rows = temp.map((s) => h('li', null, h('div', { class: 'row', style: { cursor: 'pointer' }, on: { click: () => editSlot(s) } },
        h('span', { class: 'stepdate' }, fmtDateShort(parseYMD(s.start_date))),
        catChip(s.category_id),
        h('span', { class: 'grow hint' }, (s.mode === 'fixed' ? (s.label || '') : t('rhythm.modeVrac')) + ' · ' + s.start_time + '–' + s.end_time + (s.weekday != null ? ' · ' + t('rhythm.repeats') : ' · ' + t('rhythm.oneTime'))),
        h('button', { type: 'button', class: 'iconbtn', 'aria-label': t('common.remove'), on: { click: (e) => { e.stopPropagation(); mgrDelete('schedule_slots', s); } } }, icon('trash')))));
      body = h('div', null,
        rows.length ? h('ul', { class: 'list' }, rows) : h('p', { class: 'empty' }, t('rhythm.emptyTemp')),
        h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary', on: { click: () => addSlot('temporary') } }, icon('plus'), t('rhythm.addMoment'))));
    } else {
      const dayBtns = WEEKDAY_ORDER.map((d) => h('a', {
        href: '#/settings/schedule/week/' + d, class: 'btn', 'aria-pressed': String(d === curDay)
      }, t('day.' + d)));
      const dayRows = activeSlots().filter((s) => s.kind === 'weekly' && s.weekday === curDay)
        .sort((a, b) => timeToMin(a.start_time) - timeToMin(b.start_time)).map(slotRow);
      body = h('div', null,
        h('div', { class: 'seg' }, dayBtns),
        dayRows.length ? h('ul', { class: 'list' }, dayRows) : h('p', { class: 'empty' }, t('rhythm.empty')),
        h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary', on: { click: () => addSlot('weekly', curDay) } }, icon('plus'), t('rhythm.addSlot'))));
    }
    return h('div', null, tabs, body);
  }

  /* --- Vrac --- */
  async function addVracItem() {
    const text = await textPrompt({ title: t('rhythm.vracAdd'), label: t('challenge.stepTitleLabel') });
    if (!text) return;
    const categoryId = await categoryPicker(null);
    if (categoryId === undefined) return;
    const now = new Date().toISOString();
    await IDB.put('vrac_items', {
      id: crypto.randomUUID(), user_id: S.user.id, category_id: categoryId, text, done: false,
      position: nextPosition('vrac_items'), archived: false, deleted_at: null, created_at: now, updated_at: now, _dirty: true, _rev: 1
    });
    await afterChange();
  }

  async function toggleVracDone(item) {
    item.done = !item.done;
    await saveRecord('vrac_items', item);
    await afterChange();
  }

  function viewVrac() {
    const showArch = S.ui.showArch.vrac_items;
    const all = S.vrac_items.filter((r) => !r.deleted_at).sort(byPos);
    const vis = showArch ? all : all.filter((r) => !r.archived);
    const hasArch = all.some((r) => r.archived);
    const rows = vis.map((it, i) => {
      const cb = h('input', { type: 'checkbox', checked: !!it.done });
      cb.addEventListener('change', () => toggleVracDone(it));
      return h('li', { class: 'mrow' + (it.archived ? ' is-archived' : '') },
        cb,
        h('button', { type: 'button', class: 'namebtn', on: { click: () => editVracText(it) } },
          it.text, catChip(it.category_id), it.archived ? h('span', { class: 'tag' }, t('mgr.archivedTag')) : null),
        iconBtnGeneric('up', t('mgr.up'), () => mgrMove('vrac_items', vis, i, -1), i === 0),
        iconBtnGeneric('down', t('mgr.down'), () => mgrMove('vrac_items', vis, i, 1), i === vis.length - 1),
        iconBtnGeneric(it.archived ? 'restore' : 'archive', it.archived ? t('mgr.restore') : t('mgr.archive'), () => mgrToggleArchive('vrac_items', it)),
        iconBtnGeneric('trash', t('mgr.delete'), () => mgrDelete('vrac_items', it)));
    });
    return h('div', null,
      h('p', { class: 'lede' }, t('rhythm.vracInfo')),
      vis.length ? h('ul', { class: 'list' }, rows) : h('p', { class: 'empty' }, t('mgr.empty')),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn primary', on: { click: addVracItem } }, icon('plus'), t('rhythm.vracAdd')),
        hasArch ? h('button', { type: 'button', class: 'btn', on: { click: () => { S.ui.showArch.vrac_items = !showArch; render(); } } }, showArch ? t('mgr.hideArchived') : t('mgr.showArchived')) : null));
  }

  async function editVracText(item) {
    const text = await textPrompt({ title: t('mgr.rename'), label: t('challenge.stepTitleLabel'), value: item.text });
    if (!text) return;
    item.text = text;
    await saveRecord('vrac_items', item);
    await afterChange();
  }

  /* --- Protocole : stations et segments --- */
  function stationNames() {
    const fromSettings = (S.settings.data && S.settings.data.protocolStations) || [];
    const fromSegs = [];
    activeSegments().forEach((s) => { if (!fromSettings.includes(s.station) && !fromSegs.includes(s.station)) fromSegs.push(s.station); });
    return [...fromSettings.filter((n) => activeSegments().some((s) => s.station === n)), ...fromSegs];
  }

  async function ensureStation(name) {
    const list = (S.settings.data && S.settings.data.protocolStations) || [];
    if (!list.includes(name)) await updateSettings(null, { protocolStations: [...list, name] });
  }

  async function pickOrCreateStation() {
    const names = stationNames();
    return new Promise((resolve) => {
      let m = null;
      const opt = (label, value) => h('button', { type: 'button', class: 'choice', on: { click: async () => {
        if (value === '__new__') {
          const name = await textPrompt({ title: t('rhythm.stationName'), label: t('rhythm.stationName') });
          m.close();
          resolve(name || null);
        } else { m.close(); resolve(value); }
      } } }, h('strong', null, label));
      m = modal({
        title: t('rhythm.pickStation'),
        body: h('div', null, names.map((n) => opt(n, n)), opt(t('rhythm.newStation'), '__new__')),
        actions: [{ label: t('common.cancel'), onClick: () => resolve(null) }],
        onDismiss: () => resolve(null)
      });
    });
  }

  async function addSegmentFlow() {
    const station = await pickOrCreateStation();
    if (!station) return;
    const title = await textPrompt({ title: t('rhythm.segmentTitle'), label: t('rhythm.segmentTitle') });
    if (!title) return;
    await ensureStation(station);
    const stationSegs = activeSegments().filter((s) => s.station === station);
    const now = new Date().toISOString();
    await IDB.put('protocol_segments', {
      id: crypto.randomUUID(), user_id: S.user.id, station, station_position: 0,
      position: stationSegs.length, title, duration_minutes: null, mode: 'libre', content: null,
      archived: false, deleted_at: null, created_at: now, updated_at: now, _dirty: true, _rev: 1
    });
    await afterChange();
  }

  function editSegment(seg) {
    const titleInput = h('input', { type: 'text', value: seg.title, maxlength: 100 });
    const duration = h('input', { type: 'number', min: '0', step: '1', value: seg.duration_minutes != null ? String(seg.duration_minutes) : '' });
    const modeKeys = { libre: 'rhythm.modeFree', lecture: 'rhythm.modeReading', texte: 'rhythm.modeText', minuteur: 'rhythm.modeTimer' };
    const modes = ['libre', 'lecture', 'texte', 'minuteur'];
    const modeBtns = modes.map((mo) => h('button', {
      type: 'button', class: 'btn', 'aria-pressed': String(mo === seg.mode),
      on: { click: () => { seg.mode = mo; modeBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(modes[i] === mo))); } }
    }, t(modeKeys[mo])));
    const content = h('textarea', { rows: '4' }); content.value = seg.content || '';
    modal({
      title: t('rhythm.addSegment'),
      body: h('div', null,
        h('div', { class: 'field' }, h('label', null, t('rhythm.segmentTitle')), titleInput),
        h('div', { class: 'field' }, h('label', null, t('rhythm.segmentDuration')), duration),
        h('div', { class: 'field' }, h('label', null, t('rhythm.segmentMode')), h('div', { class: 'seg' }, modeBtns)),
        h('div', { class: 'field' }, h('label', null, t('rhythm.segmentContent')), content)),
      actions: [
        { label: t('common.cancel') },
        {
          label: t('common.save'), kind: 'primary',
          onClick: async () => {
            const v = titleInput.value.trim();
            if (!v) return false;
            seg.title = v;
            seg.duration_minutes = duration.value ? Number(duration.value) : null;
            seg.content = content.value.trim() || null;
            await saveRecord('protocol_segments', seg);
            await afterChange();
            return undefined;
          }
        }
      ]
    });
  }

  function viewProtocol() {
    const stations = stationNames();
    const groups = stations.map((name) => {
      const segs = activeSegments().filter((s) => s.station === name).sort(byPos);
      const rows = segs.map((seg, i) => h('li', { class: 'mrow' },
        h('button', { type: 'button', class: 'namebtn', on: { click: () => editSegment(seg) } },
          seg.title, seg.duration_minutes ? h('span', { class: 'tag' }, ' · ' + seg.duration_minutes + ' ' + t('rhythm.min')) : null),
        iconBtnGeneric('up', t('mgr.up'), () => mgrMove('protocol_segments', segs, i, -1), i === 0),
        iconBtnGeneric('down', t('mgr.down'), () => mgrMove('protocol_segments', segs, i, 1), i === segs.length - 1),
        iconBtnGeneric('trash', t('mgr.delete'), () => mgrDelete('protocol_segments', seg))));
      return h('div', null, h('h2', { class: 'section' }, name), rows.length ? h('ul', { class: 'list' }, rows) : h('p', { class: 'empty' }, t('rhythm.noSegments')));
    });
    return h('div', null,
      h('p', { class: 'lede' }, t('rhythm.protocolInfo')),
      groups,
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary', on: { click: addSegmentFlow } }, icon('plus'), t('rhythm.addSegment'))));
  }

  /* --- État du jour (choix dans les créneaux « à préciser », segments cochés) --- */
  function getDayState(dateStr) {
    return S.day_state.find((d) => d.date === dateStr && !d.deleted_at) || null;
  }
  let dayStatePending = null; // garde-fou : évite de créer deux fois la même journée si prepareRoute est relancé avant la fin de la première création (ex. hashchange + appel direct au login)
  async function getOrCreateDayState(dateStr) {
    let rec = getDayState(dateStr);
    if (!rec) {
      if (dayStatePending && dayStatePending.date === dateStr) {
        rec = await dayStatePending.promise;
      } else {
        const now = new Date().toISOString();
        const fresh = { id: crypto.randomUUID(), user_id: S.user.id, date: dateStr, data: { choices: {}, protocolDone: [] }, deleted_at: null, created_at: now, updated_at: now, _dirty: true, _rev: 1 };
        const p = (async () => { await IDB.put('day_state', fresh); await loadLists(); return fresh; })();
        dayStatePending = { date: dateStr, promise: p };
        try { rec = await p; } finally { if (dayStatePending && dayStatePending.promise === p) dayStatePending = null; }
      }
    }
    if (!rec.data) rec.data = {};
    if (!rec.data.choices) rec.data.choices = {};
    if (!rec.data.protocolDone) rec.data.protocolDone = [];
    return rec;
  }
  let dayStateSaveTimer = null;
  function touchDayState(rec) {
    rec._dirty = true; rec._rev = (rec._rev || 0) + 1; rec.updated_at = new Date().toISOString();
    clearTimeout(dayStateSaveTimer);
    dayStateSaveTimer = setTimeout(async () => {
      await IDB.put('day_state', rec);
      await loadLists();
      render();
      scheduleSync(800);
    }, 500);
  }

  function matchesTemporary(s, dateStr, weekday) {
    if (s.weekday == null) return s.start_date === dateStr;
    return s.weekday === weekday && dateStr >= s.start_date && (!s.end_date || dateStr <= s.end_date);
  }
  function todaysSlots() {
    const now = new Date();
    const dateStr = fmtYMD(now);
    const weekday = now.getDay();
    const weekly = activeSlots().filter((s) => s.kind === 'weekly' && s.weekday === weekday);
    const temp = activeSlots().filter((s) => s.kind === 'temporary' && matchesTemporary(s, dateStr, weekday));
    return [...weekly, ...temp].sort((a, b) => timeToMin(a.start_time) - timeToMin(b.start_time));
  }

  async function chooseVracFor(slot, dayRec) {
    const cat = slot.category_id;
    const items = activeVrac().filter((v) => v.category_id === cat && !v.done).sort(byPos);
    const freeInput = h('input', { type: 'text', placeholder: t('rhythm.freeText') });
    return new Promise((resolve) => {
      let m = null;
      const choose = (val) => { m.close(); resolve(val); };
      const opt = (label) => h('button', { type: 'button', class: 'choice', on: { click: () => choose(label) } }, h('strong', null, label));
      m = modal({
        title: t('rhythm.choose'),
        body: h('div', null,
          h('p', { class: 'muted' }, t('rhythm.pickOrType')),
          items.map((it) => opt(it.text)),
          h('div', { class: 'field' }, h('label', null, t('rhythm.freeText')), freeInput)),
        actions: [
          { label: t('common.cancel'), onClick: () => resolve(null) },
          { label: t('common.save'), kind: 'primary', onClick: () => { const v = freeInput.value.trim(); if (v) resolve(v); else return false; return undefined; } }
        ],
        onDismiss: () => resolve(null)
      });
    }).then(async (val) => {
      if (!val) return;
      dayRec.data.choices[slot.id] = val;
      touchDayState(dayRec);
    });
  }

  function viewTodayRhythm(dayRec) {
    const slots = todaysSlots();
    if (!slots.length && !activeSegments().length) return null;
    const slotRows = slots.map((s) => {
      const choice = dayRec.data.choices[s.id];
      const content = s.mode === 'fixed'
        ? h('span', { class: 'grow hint' }, s.label || t('rhythm.modeFixed'))
        : h('button', { type: 'button', class: 'btn ghost', style: { marginLeft: 'auto' }, on: { click: () => chooseVracFor(s, dayRec) } }, choice || t('rhythm.choose'));
      return h('li', null, h('div', { class: 'row' },
        h('span', { class: 'stepdate' }, s.start_time),
        catChip(s.category_id),
        s.mode === 'fixed' ? content : h('span', { class: 'grow hint' }, choice || ''),
        s.mode !== 'fixed' ? content : null));
    });
    const stations = stationNames();
    const protoGroups = stations.map((name) => {
      const segs = activeSegments().filter((s) => s.station === name).sort(byPos);
      if (!segs.length) return null;
      const rows = segs.map((seg) => {
        const done = dayRec.data.protocolDone.includes(seg.id);
        const cb = h('input', { type: 'checkbox', checked: done });
        cb.addEventListener('change', () => {
          const arr = dayRec.data.protocolDone;
          const i = arr.indexOf(seg.id);
          if (cb.checked) { if (i === -1) arr.push(seg.id); } else if (i > -1) arr.splice(i, 1);
          touchDayState(dayRec);
        });
        const label = h('button', { type: 'button', class: 'namebtn', style: { cursor: seg.content ? 'pointer' : 'default' },
          on: { click: () => { if (seg.content) modal({ title: seg.title, body: h('p', { style: { whiteSpace: 'pre-line' } }, seg.content), actions: [{ label: t('common.ok'), kind: 'primary' }] }); } } },
          seg.title, seg.duration_minutes ? h('span', { class: 'tag' }, ' · ' + seg.duration_minutes + ' ' + t('rhythm.min')) : null);
        return h('li', { class: 'mrow' + (done ? ' is-archived' : '') }, cb, label);
      });
      return h('div', null, h('h3', { class: 'part-label' }, name), h('ul', { class: 'list' }, rows));
    }).filter(Boolean);

    return h('div', null,
      h('h2', { class: 'section' }, t('rhythm.todayTitle')),
      slots.length ? h('ul', { class: 'list' }, slotRows) : h('p', { class: 'empty' }, t('rhythm.todayEmpty')),
      protoGroups.length ? h('div', null, h('h2', { class: 'section' }, t('rhythm.protocolTitle')), protoGroups) : null);
  }

  /* ==========================================================
     Sauvegarde : export / import
     ========================================================== */
  function exportBackup() {
    const data = {
      app: 'oree', version: 2, exportedAt: new Date().toISOString(),
      settings: { theme: S.settings.theme, language: S.settings.language, data: S.settings.data }
    };
    TABLES.forEach((k) => { data[k] = S[k].map(strip); });
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
      // Domaines et catégories : forme simple, validée champ par champ.
      for (const kind of ['domains', 'categories']) {
        for (const r of Array.isArray(j[kind]) ? j[kind] : []) {
          if (!r || !UUID_RE.test(String(r.id)) || typeof r.name !== 'string') continue;
          await IDB.put(kind, {
            id: r.id, user_id: S.user.id, name: r.name.slice(0, 80), color: typeof r.color === 'string' ? r.color : null,
            icon: null, position: Number.isFinite(r.position) ? r.position : 0, archived: !!r.archived,
            deleted_at: r.deleted_at || null, created_at: r.created_at || now, updated_at: now, _dirty: true, _rev: 1
          });
        }
      }
      // Défi : présent seulement dans les sauvegardes plus récentes (absent = ignoré, sans erreur).
      for (const r of Array.isArray(j.challenge_steps) ? j.challenge_steps : []) {
        if (!r || !UUID_RE.test(String(r.id)) || typeof r.title !== 'string' || !Array.isArray(r.parts)) continue;
        await IDB.put('challenge_steps', {
          id: r.id, user_id: S.user.id, position: Number.isFinite(r.position) ? r.position : 0,
          day_label: typeof r.day_label === 'string' ? r.day_label : null, title: r.title.slice(0, 200),
          block: typeof r.block === 'string' ? r.block : '', help: r.help && typeof r.help === 'object' ? r.help : null,
          parts: r.parts, closing: !!r.closing, archived: !!r.archived, deleted_at: r.deleted_at || null,
          created_at: r.created_at || now, updated_at: now, _dirty: true, _rev: 1
        });
      }
      for (const r of Array.isArray(j.challenge_runs) ? j.challenge_runs : []) {
        if (!r || !UUID_RE.test(String(r.id)) || !['intensive', 'moderate', 'custom'].includes(r.cadence) || typeof r.start_date !== 'string') continue;
        await IDB.put('challenge_runs', {
          id: r.id, user_id: S.user.id, name: typeof r.name === 'string' ? r.name.slice(0, 120) : t('challenge.defaultName', { year: '' }),
          cadence: r.cadence, start_date: r.start_date, weekdays: Array.isArray(r.weekdays) ? r.weekdays : [],
          status: typeof r.status === 'string' ? r.status : 'active', completed_at: r.completed_at || null,
          deleted_at: r.deleted_at || null, created_at: r.created_at || now, updated_at: now, _dirty: true, _rev: 1
        });
      }
      for (const r of Array.isArray(j.challenge_entries) ? j.challenge_entries : []) {
        if (!r || !UUID_RE.test(String(r.id)) || !UUID_RE.test(String(r.run_id)) || !UUID_RE.test(String(r.step_id))) continue;
        await IDB.put('challenge_entries', {
          id: r.id, user_id: S.user.id, run_id: r.run_id, step_id: r.step_id,
          data: r.data && typeof r.data === 'object' ? r.data : {}, done: !!r.done, done_at: r.done_at || null,
          deleted_at: r.deleted_at || null, created_at: r.created_at || now, updated_at: now, _dirty: true, _rev: 1
        });
      }
      for (const r of Array.isArray(j.schedule_slots) ? j.schedule_slots : []) {
        if (!r || !UUID_RE.test(String(r.id)) || !['weekly', 'temporary'].includes(r.kind) || typeof r.start_time !== 'string' || typeof r.end_time !== 'string') continue;
        await IDB.put('schedule_slots', {
          id: r.id, user_id: S.user.id, kind: r.kind, weekday: Number.isFinite(r.weekday) ? r.weekday : null,
          start_date: typeof r.start_date === 'string' ? r.start_date : null, end_date: typeof r.end_date === 'string' ? r.end_date : null,
          start_time: r.start_time, end_time: r.end_time, category_id: typeof r.category_id === 'string' ? r.category_id : null,
          mode: r.mode === 'vrac' ? 'vrac' : 'fixed', label: typeof r.label === 'string' ? r.label.slice(0, 80) : '',
          archived: !!r.archived, deleted_at: r.deleted_at || null, created_at: r.created_at || now, updated_at: now, _dirty: true, _rev: 1
        });
      }
      for (const r of Array.isArray(j.vrac_items) ? j.vrac_items : []) {
        if (!r || !UUID_RE.test(String(r.id)) || typeof r.text !== 'string') continue;
        await IDB.put('vrac_items', {
          id: r.id, user_id: S.user.id, category_id: typeof r.category_id === 'string' ? r.category_id : null,
          text: r.text.slice(0, 160), done: !!r.done, position: Number.isFinite(r.position) ? r.position : 0,
          archived: !!r.archived, deleted_at: r.deleted_at || null, created_at: r.created_at || now, updated_at: now, _dirty: true, _rev: 1
        });
      }
      for (const r of Array.isArray(j.protocol_segments) ? j.protocol_segments : []) {
        if (!r || !UUID_RE.test(String(r.id)) || typeof r.station !== 'string' || typeof r.title !== 'string') continue;
        await IDB.put('protocol_segments', {
          id: r.id, user_id: S.user.id, station: r.station.slice(0, 60), station_position: 0,
          position: Number.isFinite(r.position) ? r.position : 0, title: r.title.slice(0, 100),
          duration_minutes: Number.isFinite(r.duration_minutes) ? r.duration_minutes : null,
          mode: ['lecture', 'texte', 'minuteur', 'libre'].includes(r.mode) ? r.mode : 'libre',
          content: typeof r.content === 'string' ? r.content : null,
          archived: !!r.archived, deleted_at: r.deleted_at || null, created_at: r.created_at || now, updated_at: now, _dirty: true, _rev: 1
        });
      }
      for (const r of Array.isArray(j.day_state) ? j.day_state : []) {
        if (!r || !UUID_RE.test(String(r.id)) || typeof r.date !== 'string') continue;
        await IDB.put('day_state', {
          id: r.id, user_id: S.user.id, date: r.date, data: r.data && typeof r.data === 'object' ? r.data : {},
          deleted_at: r.deleted_at || null, created_at: r.created_at || now, updated_at: now, _dirty: true, _rev: 1
        });
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

  window.addEventListener('hashchange', async () => {
    if (!location.hash.startsWith('#/')) return;
    S.route = currentRoute();
    S.navOpen = false;
    await prepareRoute();
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
    if (S.user) { await loadLists(); S.locked = !!S.lock.enabled; if (!S.locked) await prepareRoute(); }
    render();
    if (S.user && !S.offline) { await syncAll(); await maybeOnboard(); }
  }

  boot();
})();
