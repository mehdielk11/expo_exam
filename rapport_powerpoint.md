# Rapport de Présentation : Application FlavorCraft

Ce document contient la structure détaillée, diapositive par diapositive, pour votre présentation PowerPoint. Chaque section comprend le titre de la slide, les points textuels à afficher et des indications pour insérer vos captures d'écran.

---

## Slide 1 : Page de Garde (Titre)
* **Titre principal** : FlavorCraft
* **Sous-titre** : Carnet de Recettes Mobile & Inspirations Culinaires
* **Cadre** : Projet de Développement Mobile Multiplateforme (React Native & Expo)
* **Informations de l'étudiant** :
  * **Nom & Prénom** : [Votre Nom / Prénom]
  * **Groupe** : [Votre Groupe / Classe]
  * **Enseignant / Tuteur** : [Nom de l'enseignant]
* **Visuel suggéré** : Logo de l'application (l'icône de flamme orange) et un mockup de téléphone au centre.

---

## Slide 2 : Objectif de l'Application
* **Le Problème** : Les applications de cuisine sont souvent trop complexes, surchargées de publicités et nécessitent une connexion internet constante pour accéder à ses propres recettes.
* **La Solution (FlavorCraft)** :
  * Une application mobile épurée, rapide et autonome pour stocker localement ses propres idées culinaires.
  * Zéro friction : sauvegarde instantanée et consultation hors-ligne complète.
  * Inspiration culinaire intégrée pour motiver l'utilisateur à cuisiner.
* **Cibles** : Cuisiniers amateurs, personnes souhaitant organiser leurs repas hebdomadaires.

---

## Slide 3 : Architecture Globale (Navigation)
* **Structure de navigation** : Navigation par onglets (Tab Navigation) moderne et fluide, respectant les recommandations de la zone de confort du pouce.
* **Les 4 sections majeures** :
  1. 🏠 **Home** : Tableau de bord et raccourcis d'actions rapides.
  2. ➕ **Add** : Formulaire interactif de création de recettes.
  3. 📖 **Recipes** : Liste intelligente des recettes avec filtres avancés.
  4. ✨ **Inspire** : Espace d'inspiration culinaire avec requêtes API externes de recettes.
* **Visuel suggéré** : Schéma simple montrant la navigation entre les onglets à l'aide d'Expo Router.

---

## Slide 4 : Accueil & Actions Rapides
* **Fonctionnalités de l'écran d'accueil** :
  * Message de bienvenue personnalisé et identité visuelle claire.
  * Cartes d'actions rapides avec micro-animations au toucher (opacité progressive).
  * Redirection automatique vers les onglets pertinents en un seul clic.
  * Note de bas de page rassurant l'utilisateur sur la confidentialité (sauvegarde 100% locale).
* **Emplacement Capture d'écran** : Capture de l'écran d'accueil complet (`index.tsx`) montrant la disposition des cartes d'action.

---

## Slide 5 : Ajout de Recettes (Formulaires)
* **Interface de Saisie Intuitive** :
  * Saisie du titre et des instructions détaillées de préparation.
  * Sélection intuitive de la catégorie à l'aide d'un sélecteur natif (ActionSheet sous iOS, Picker déroulant sous Android/Web).
* **Contrôles & Validations** :
  * Validation stricte des données avant soumission (titre et instructions obligatoires).
  * Messages d'erreur d'aide à la saisie conviviaux (alertes système).
  * Réinitialisation automatique du formulaire après succès.
* **Emplacement Capture d'écran** : Capture de l'écran de formulaire d'ajout (`add.tsx`) rempli avec un exemple.

---

## Slide 6 : Liste des Recettes & Filtres Avancés
* **Affichage Performant** :
  * Utilisation d'un composant `FlatList` optimisé avec recyclage de cellules pour un défilement à 60 FPS sans dégradation.
* **Filtres Dynamiques instantanés** :
  * **Par Catégorie** (Breakfast, Lunch, Dinner, Dessert).
  * **Par Statut de Cuisson** (Cooked, Uncooked).
  * Bouton contextuel **"Clear"** pour réinitialiser tous les filtres d'un seul clic.
  * Badges de couleurs thématiques pour distinguer les catégories au premier coup d'œil.
* **Emplacement Capture d'écran** : Capture de l'écran liste (`list.tsx`) avec les dropdowns de filtres déployés ou un filtre actif.

---

## Slide 7 : Détails du Plat & CRUD Complet
* **Modal de Détail Immersif** :
  * S'ouvre par dessus la liste sans recharger la page, affichant la recette complète.
* **Cycle de vie complet des données (CRUD)** :
  * **Create** : Via l'écran Add.
  * **Read & Update** : Édition en place dans le modal avec pré-remplissage des champs et validations.
  * **Delete** : Suppression sécurisée avec boîte de dialogue de confirmation (Web & Mobile).
  * **Toggle Status** : Possibilité de marquer une recette comme "Cooked" ou "Uncooked" d'une seule touche.
* **Emplacement Capture d'écran** : Capture du modal de détail ouvert (`list.tsx`) montrant les boutons d'actions en bas.

---

## Slide 8 : Inspiration Culinaire & API Externe (TheMealDB)
* **Recette Aléatoire** :
  * Section dédiée à l'inspiration du jour pour découvrir une nouvelle recette provenant du monde entier.
  * Intégration d'un flux d'API externe (TheMealDB API) pour récupérer une recette aléatoire avec son titre, sa catégorie et sa description/instructions.
* **Aspect Technique** :
  * Appel HTTP asynchrone non-bloquant.
  * Gestion propre des états de chargement (Spinner d'attente) et des cas de perte de connexion réseau.
  * Bouton interactif "Inspire Me Again" pour charger une nouvelle recette aléatoire instantanément.
* **Emplacement Capture d'écran** : Capture de l'onglet Inspire (`inspiration.tsx`) affichant une recette chargée.

---

## Slide 9 : Explications Techniques
* **Framework Core** : React Native & Expo (Architecture New Architecture activable).
* **Navigation** : `expo-router` utilisant le routage par fichiers (Stack et Tabs imbriqués).
* **Persistance des Données** : Base de données relationnelle locale **SQLite** (`expo-sqlite`) :
  * Initialisation automatique des tables au lancement.
  * Requêtes SQL optimisées pour la lecture, l'insertion, la mise à jour et la suppression.
* **API Distante** : Module `fetch` asynchrone pointant sur l'API publique de TheMealDB (`https://www.themealdb.com/api/json/v1/1/random.php`).

---

## Slide 10 : Conclusion
* **Bilan du Projet** :
  * Réalisation réussie d'une application mobile moderne et autonome répondant aux exigences ergonomiques et techniques de l'écosystème iOS & Android.
* **Compétences Acquises** :
  * Gestion du cycle de vie des états en React Native.
  * Manipulation d'une base de données locale SQL sur terminal mobile.
  * Design adaptatif et respect des zones d'insets de sécurité (encoches et barres système iPhone).
* **Perspectives** :
  * Ajout d'une fonctionnalité de partage de recettes.
  * Calcul de la liste de courses automatisée en fonction des ingrédients saisis.
