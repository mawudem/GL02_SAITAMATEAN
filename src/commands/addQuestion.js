const fs = require('fs');
const colors = require('colors');

// Importez votre service d'examen et votre analyseur de questions GIFT
const ExamService = require('../../services/examService');


//const vg = require('vega');
//const vegalite = require('vega-lite');

const cli = require("@caporal/core").default;

cli
	.version('vpf-parser-cli')
	.version('0.07')
		//add_question
		.command('add_question', 'Ajouter une question à un examen')
		.argument('<nomExam>', 'le nom de l\'examen où ajouter la question')
		.argument('<idQuestion>', 'l\'identifiant de la question à ajouter (à écrire entouré de guillemets)')
		.action(({ args }) => {
			var utilisateur = new Utilisateur();
			utilisateur = utilisateur.findConnected();
			if (utilisateur.userName !== undefined && utilisateur.type === 'P') {
				var exam = new Examen(args.nomExam);
				exam.addQuestion(args.nomExam, args.idQuestion);
			}
			else console.log('Veuillez d\'abord vous connecter à un compte possédant les droits nécessaires.'.red)
		})


cli.run(process.argv.slice(2));
