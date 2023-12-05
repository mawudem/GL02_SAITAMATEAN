// addQuestion.js

// Importez votre service d'examen et votre analyseur de questions GIFT
const ExamService = require('./examService');
const GiftParser = require('./GiftParser');

// Exemple de données de question GIFT (à remplacer par les données réelles)
const giftQuestionData = `
    :: Question Example
    {
        ChoixMultiples
        {
            ~ Wrong Option 1
            = Correct Option
            [Rétroaction]
        }
    }
`;

// Initialisez votre service d'examen
const examService = new ExamService();

// Initialisez votre analyseur de questions GIFT
const giftParser = new GiftParser();

// Analysez les données de la question GIFT
giftParser.parse(giftQuestionData);

// Obtenez la question analysée
const parsedQuestion = giftParser.questions[0]; // Assurez-vous que vous ajustez ceci selon la structure réelle

// Ajoutez la question à votre service d'examen
examService.addQuestion(parsedQuestion);

// Exemple de sortie (à ajuster selon vos besoins)
console.log('Question ajoutée avec succès à l\'examen.');
