const fs = require('fs');
const colors = require('colors');
const giftParser = require('../../parsers/giftParser.js');
const vCardParser = require('../../parsers/vCardParser.js');
const vg = require('vega');
const vegalite = require('vega-lite');

const cli = require("@caporal/core").default;

cli
	.version('vpf-parser-cli')
	.version('0.07')
	
	//remove_question
	.command('remove_question', 'Ajouter une question à un examen')
	.argument('<nomExam>', 'le nom de l\'examen où supprimer la question')
	.argument('<idQuestion>', 'l\'identifiant de la question à supprimer (à écrire entouré de guillemets)')
	.action(({ args }) => {
		var exam = new Examen(args.nomExam);
		var utilisateur = new Utilisateur();
		utilisateur = utilisateur.findConnected();
		if (utilisateur.userName !== undefined && utilisateur.type === 'P') {
			exam.removeQuestion(args.nomExam, args.idQuestion);
		}
		else console.log('Veuillez d\'abord vous connecter à un compte possédant les droits nécessaires.'.red)
	})

	
cli.run(process.argv.slice(2));
	