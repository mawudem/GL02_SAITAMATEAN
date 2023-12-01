# GL02_Saitama


## Context du projet

Le cahier des charges demande de développer un logiciel en ligne de commande répondant aux besoins du ministère de l'éducation nationale de la république du Sealand (SRYEM). Le logiciel doit permettre aux enseignants et gestionnaires d'examen de préparer et de gérer les tests des élèves. Les principales fonctionnalités incluent la création d'examens à partir d'une banque de questions, la visualisation du profil d'examen GIFT, la vérification de la qualité des données, la création de fichiers de contact au format VCard, et la gestion complète des questions d'examen. Le respect des droits d'auteur et de la législation locale est également souligné, tout comme la confidentialité et la sécurité des informations.

##  organisation de notre projet.

project/

- -src/
- --commands/
- --- createExam.js
- --- addQuestion.js
- --- selectQuestion.js
- --- searchAndModifyQuestions.js
- --- viewExamProfile.js
- --- simulateExam.js
- --- checkExamQuality.js
- --- createVCard.js
- --- compareExams.js
- -parsers/
- -- giftParser.js
- -- vCardParser.js
- -services/
- -- examService.js
- -- questionService.js
- -- vCardService.js
- -index.js
- -package.json
- -.gitignore
- -README.md
- -test/
- -- createExam.test.js
- -- addQuestion.test.js
- -- selectQuestion.test.js
- -- searchAndModifyQuestions.test.js
- -- viewExamProfile.test.js
- -- simulateExam.test.js
- -- checkExamQuality.test.js
- -- createVCard.test.js
- -- compareExams.test.js

**Explications :**

- **`src/commands/` :** Contient les fichiers de commandes Caporal pour chaque fonctionnalité spécifiée dans le cahier des charges.

- **`parsers/` :** Contient les fichiers de parsing pour GIFT et VCard.

- **`services/` :** Contient les fichiers de service qui gèrent la logique métier.

- **`index.js` :** Point d'entrée de l'application, où vous enregistrez vos commandes Caporal.

- **`package.json` :** Fichier de configuration de votre projet Node.js.

- **`.gitignore` :** Ignorer les fichiers indésirables lors du suivi des modifications avec Git.

- **`README.md` :** Documentation pour le projet.

- **`test/` :** Contient les fichiers de test pour chaque fonctionnalité.

Adaptez cette structure en fonction de vos besoins spécifiques et assurez-vous que vos fichiers Caporal sont correctement configurés pour interagir avec les services que vous implémentez.

## Environnement

### Installation 
pour installer son environement placez vous dans le projet dans le terminal et tapez :  npm install

### Aide avec git ( optionel)
pour aller plus vite sur les commandes git je vous propose de vous rendre dans le terminal,
- tapez la commande  : git config --global --edit
- un fichie de config s'ouvre.
- utiliser la fleche de bas pour defiler vers la fin
- puis  collez : 
[alias]
  st = status
  ci = commit
  pu = push
  pl = pull
  lg = log --oneline --graph --decorate --all
  co = checkout
  cm = commit -m
  br = branch
  df = diff
  hist = log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short
  type = cat-file -t
  dump = cat-file -p
  last = log -1 HEAD
  unstage = reset HEAD
  amend = commit --amend

- Ctl + X puis Y pour acceter d'enregistrer et sortir et en fin entrez.

#### La mise a distant de vos modifications  
il y a deux branches principales sur le depot.
- Main : pour avoir un code bien fait en rendu je serai le seul a manipuler cette branche
-dev : la branche sur laquelle tous les membres peuvent pusher ou puller. Mais avant de faire une operation vers cette branche distant rassurez vous que vous avez cree une branche en local propre a vous et que la fonctionalite a pusher est ok vous mergez ca avec le dev, vous testez et vous vous assurez que votre local est a jous avant de pusher.


## Liste des Tâches :

- **`createExam.js`**

  - Implémentation de la commande createExam.
  - Intégration avec examService.js.
  - Tests unitaires pour la commande.

- **`addQuestion.js`**

    -  Implémentation de la commande addQuestion.
    - Intégration avec questionService.js.

    -  Tests unitaires pour la commande.

- **`selectQuestion.js`**

     - Implémentation de la commande selectQuestion.
    - Intégration avec questionService.js.

     - Tests unitaires pour la commande.

- **`searchAndModifyQuestions.js`**

     - Implémentation de la commande searchAndModifyQuestions.
    - Intégration avec questionService.js.

     - Tests unitaires pour la commande.

- **`viewExamProfile.js`**

    - Implémentation de la commande viewExamProfile.
    - Intégration avec examService.js.

     - Tests unitaires pour la commande.

- **`simulateExam.js`**

     - Implémentation de la commande simulateExam.
    - Intégration avec examService.js.
     - Génération de rapports d'examen.

     - Tests unitaires pour la commande.

- **`checkExamQuality.js`**

    -  Implémentation de la commande checkExamQuality.
    - Intégration avec examService.js.
    - Génération de rapports de vérification.

     - Tests unitaires pour la commande.

- **`createVCard.js`**

     - Implémentation de la commande createVCard.
    - Intégration avec vCardService.js.

     - Tests unitaires pour la commande.

- **`compareExams.js`**

     - Implémentation de la commande compareExams.
    - Intégration avec examService.js.

     - Tests unitaires pour la commande.

- **`giftParser.js`**

     - Implémentation du parser pour les fichiers GIFT.

     - Tests unitaires pour le parser.

- **`vCardParser.js`**

     - Implémentation du parser pour les fichiers VCard.

     - Tests unitaires pour le parser.

- **`examService.js`**

     - Logique métier pour la gestion des examens.

     - Tests unitaires pour le service.

- **`questionService.js`**

    - Logique métier pour la gestion des questions.

     - Tests unitaires pour le service.

- **`vCardService.js`**

    - Logique métier pour la gestion des fichiers VCard.

     - Tests unitaires pour le service.

- **`Tests unitaires généraux`**

     - Mise en place des tests unitaires pour l'ensemble du projet.

- **`Documentation`**

    - Documentation complète pour chaque fichier.

     - Commentaires explicatifs dans le code.

- **`Intégration Continue`**

     - Configuration de l'intégration continue (CI) pour exécuter les tests automatiquement.

- **`Réunions d'Équipe`**

     - Planification et participation à des réunions d'équipe régulières.

- **`Coordination Générale`**

    - Suivi et coordination générale des progrès.

## Les membres de l'equite : 
NB chaque membre code le tests unitaires pour les commandes ou services sur lesquels il a travaillé.

### KOLEDZI Kokouvi mawudem
    giftParser.js
    vCardParser.js
    examService.js
    questionService.js
    vCardService.js
### ANNA
### SHI
    createExam.js
    addQuestion.js
    viewExamProfile.js
### HANYA
    selectQuestion.js
    searchAndModifyQuestions.js
    simulateExam.js
### HAKIM
    checkExamQuality.js
    createVCard.js
    compareExams.js



## La description des taches :
### Services
Dans le contexte d'une application en ligne de commande pour la gestion d'examens, les services sont responsables de la logique métier. Voici quelques indications sur ce que chaque service peut impliquer :

    examService.js :
        Création et gestion des examens.
        Simulation d'examens.
        Génération de rapports d'examen.
        Vérification de la qualité des données pour les examens.
        Comparaison d'examens.

    questionService.js :
        Création et gestion des questions.
        Recherche et modification des questions.
        Sélection de questions depuis une banque de questions.
        Vérification de la qualité des données pour les questions.

    vCardService.js :
        Création et gestion des fichiers VCard.
        Exportation des fichiers de contact pour les enseignants.
        Vérification du format des fichiers VCard.

Chaque service devrait être conçu de manière modulaire et encapsuler la logique métier associée à son domaine d'activité. Ces services peuvent interagir entre eux pour fournir les fonctionnalités complètes de l'application. Par exemple, examService peut utiliser des fonctions de questionService pour gérer les questions lors de la création d'examens.


### Parsers

Les parsers sont chargés de convertir les données provenant de fichiers externes (format GIFT et VCard dans ce cas) en objets compréhensibles par le reste de l'application. Voici à quoi peuvent ressembler les responsabilités de chaque parser :

    giftParser.js :
        Convertir des fichiers GIFT en objets JavaScript.
        Interpréter la grammaire ABNF spécifiée dans le cahier des charges.
        Créer des structures de données internes représentant des questions.

    vCardParser.js :
        Convertir des fichiers VCard en objets JavaScript.
        Respecter la syntaxe spécifiée dans le cahier des charges.
        Créer des structures de données internes représentant des informations de contact.

Les parsers devraient être robustes pour gérer différentes variations et erreurs possibles dans les fichiers source. De plus, ils peuvent être utilisés par les services pour intégrer les données externes dans le système global de l'application.

Les tests unitaires pour les parsers sont également essentiels pour garantir qu'ils interprètent correctement les données et qu'ils sont capables de gérer différentes situations.


### Commandes

Les commandes sont responsables de l'interaction avec l'utilisateur et d'exécuter des actions spécifiques du programme en fonction des entrées fournies par l'utilisateur. Voici à quoi peuvent ressembler les responsabilités de chaque commande dans le contexte de ce projet :

1. **createExam.js :**
   - Interagir avec l'utilisateur pour créer un nouvel examen.
   - Utiliser `examService.js` pour gérer la logique métier associée à la création d'un examen.
   - Afficher des messages à l'utilisateur pour indiquer le succès ou l'échec de l'opération.

2. **addQuestion.js :**
   - Permettre à l'utilisateur d'ajouter une question à un examen existant.
   - Utiliser `questionService.js` pour gérer la logique métier associée à l'ajout de questions.
   - Afficher des messages à l'utilisateur pour indiquer le succès ou l'échec de l'opération.

3. **selectQuestion.js :**
   - Permettre à l'utilisateur de sélectionner une question à partir d'une banque de questions.
   - Utiliser `questionService.js` pour gérer la récupération des questions disponibles.
   - Afficher les questions à l'utilisateur et lui permettre de faire des sélections.

4. **searchAndModifyQuestions.js :**
   - Permettre à l'utilisateur de rechercher, d'afficher et de modifier des questions dans un examen existant.
   - Utiliser `questionService.js` pour gérer la logique métier associée à la recherche et à la modification de questions.
   - Afficher des messages à l'utilisateur pour indiquer le succès ou l'échec de l'opération.

5. **viewExamProfile.js :**
   - Permettre à l'utilisateur de visualiser le profil d'un examen GIFT.
   - Utiliser `examService.js` pour récupérer les informations de l'examen.
   - Afficher les détails de l'examen à l'utilisateur.

6. **simulateExam.js :**
   - Permettre à l'utilisateur de simuler un examen et générer des rapports.
   - Utiliser `examService.js` pour gérer la logique métier associée à la simulation d'un examen.
   - Afficher des résultats ou des rapports à l'utilisateur.

7. **checkExamQuality.js :**
   - Permettre à l'utilisateur de vérifier la qualité d'un examen (pas de questions répétitives, nombre correct de questions, etc.).
   - Utiliser `examService.js` pour gérer la logique métier associée à la vérification de la qualité de l'examen.
   - Afficher des résultats ou des rapports à l'utilisateur.

8. **createVCard.js :**
   - Permettre à l'utilisateur de créer un fichier VCard pour un professeur.
   - Utiliser `vCardService.js` pour gérer la logique métier associée à la création d'un fichier VCard.
   - Afficher des messages à l'utilisateur pour indiquer le succès ou l'échec de l'opération.

9. **compareExams.js :**
   - Permettre à l'utilisateur de comparer différents profils d'examens.
   - Utiliser `examService.js` pour récupérer les informations nécessaires.
   - Afficher des graphiques ou des résultats de comparaison à l'utilisateur.

Chaque commande devrait être conçue pour être modulaire et réutilisable, en utilisant les services pour effectuer les opérations métier et en fournissant un feedback clair à l'utilisateur. Les tests unitaires pour chaque commande sont essentiels pour s'assurer de leur bon fonctionnement.


### Test

Les tests unitaires sont une partie cruciale du processus de développement. Ils garantissent que chaque composant du logiciel fonctionne comme prévu individuellement, ce qui contribue à la fiabilité globale du système. Pour chaque commande, parser, et service que vous avez, vous devriez envisager d'écrire des tests unitaires correspondants.

Voici une idée générale de ce que vous pourriez tester pour chaque composant :

### Tests Unitaires pour les Commandes :
1. **createExam.js :**
   - Tester la création réussie d'un examen.
   - Tester les scénarios d'échec de création d'un examen.
   - Vérifier si les messages à l'utilisateur sont corrects.

2. **addQuestion.js :**
   - Tester l'ajout réussi d'une question à un examen existant.
   - Tester les scénarios d'échec de l'ajout de question.
   - Vérifier si les messages à l'utilisateur sont corrects.

3. **selectQuestion.js :**
   - Tester la sélection réussie d'une question.
   - Tester les scénarios d'échec de la sélection de question.
   - Vérifier si les questions sont correctement affichées.

4. **searchAndModifyQuestions.js :**
   - Tester la recherche et la modification réussies de questions dans un examen.
   - Tester les scénarios d'échec de recherche et de modification de questions.
   - Vérifier si les messages à l'utilisateur sont corrects.

5. **viewExamProfile.js :**
   - Tester la visualisation réussie du profil d'un examen.
   - Tester les scénarios d'échec de la visualisation du profil.
   - Vérifier si les détails de l'examen sont correctement affichés.

6. **simulateExam.js :**
   - Tester la simulation réussie d'un examen.
   - Tester les scénarios d'échec de la simulation de l'examen.
   - Vérifier si les résultats ou les rapports sont correctement générés.

7. **checkExamQuality.js :**
   - Tester la vérification réussie de la qualité d'un examen.
   - Tester les scénarios d'échec de la vérification de la qualité de l'examen.
   - Vérifier si les résultats ou les rapports sont correctement générés.

8. **createVCard.js :**
   - Tester la création réussie d'un fichier VCard.
   - Tester les scénarios d'échec de la création du fichier VCard.
   - Vérifier si les messages à l'utilisateur sont corrects.

9. **compareExams.js :**
   - Tester la comparaison réussie de différents profils d'examens.
   - Tester les scénarios d'échec de la comparaison des profils d'examens.
   - Vérifier si les résultats ou les graphiques sont correctement générés.

### Tests Unitaires pour les Parsers :
1. **giftParser.js :**
   - Tester la bonne analyse des fichiers GIFT.
   - Tester les scénarios d'échec d'analyse des fichiers GIFT.

2. **vCardParser.js :**
   - Tester la bonne analyse des fichiers VCard.
   - Tester les scénarios d'échec d'analyse des fichiers VCard.

### Tests Unitaires pour les Services :
1. **examService.js :**
   - Tester la logique métier associée à la gestion des examens.
   - Tester les scénarios d'échec des opérations liées aux examens.

2. **questionService.js :**
   - Tester la logique métier associée à la gestion des questions.
   - Tester les scénarios d'échec des opérations liées aux questions.

3. **vCardService.js :**
   - Tester la logique métier associée à la gestion des fichiers VCard.
   - Tester les scénarios d'échec des opérations liées aux fichiers VCard.

Chaque test unitaire devrait être conçu pour être indépendant des autres tests et devrait couvrir différents cas de scénarios d'utilisation. Vous pouvez utiliser des bibliothèques de test comme Jest, Mocha,jasmine ou d'autres, en fonction de votre environnement de développement JavaScript/Node.js mais dans notre cas nous allons utiliser  **jasmine**.

### Index.js

Le fichier `index.js` est souvent le point d'entrée principal de votre application. Il agrège généralement toutes les fonctionnalités et démarre le programme. Voici une structure générale que vous pourriez suivre pour votre `index.js` :

```javascript
// index.js

// Importez les modules nécessaires
const caporal = require('caporal');
const createExamCommand = require('./src/commands/createExam');
const addQuestionCommand = require('./src/commands/addQuestion');
// ... Importez d'autres commandes

// Configurez Caporal
caporal
  .version('1.0.0')
  .description('Votre description ici');

// Ajoutez les commandes
createExamCommand.configure(caporal);
addQuestionCommand.configure(caporal);
// ... Configurez d'autres commandes

// Lancez l'application
caporal.parse(process.argv);
```

Chaque module de commande (`createExam.js`, `addQuestion.js`, etc.) devrait avoir une méthode `configure` qui prend l'objet `caporal` en argument et configure la commande correspondante. Voici à quoi cela pourrait ressembler :

```javascript
// createExam.js

// Importez les modules nécessaires
const examService = require('../services/examService');

// Configurez la commande
function configure(caporal) {
  caporal
    .command('create-exam', 'Description de la commande')
    .action(({ logger }) => {
      // Implémentez la logique de la commande ici
      const exam = examService.createExam();
      logger.info('Examen créé avec succès:', exam);
    });
}

// Exportez la méthode configure
module.exports = { configure };
```

De cette façon, chaque module de commande est responsable de sa propre configuration, ce qui facilite l'ajout ou la modification de commandes individuelles. Vous pouvez suivre une approche similaire pour les autres modules (`addQuestion.js`, `selectQuestion.js`, etc.).


## Exemple : 
POI.js
VpfParser.js
Sample.vpf
caporalCli.js
spec/

###pour aller plus rapidement avec git



# Merci Bon travail a tous. Un travail bien fait est toujours valorisé.
