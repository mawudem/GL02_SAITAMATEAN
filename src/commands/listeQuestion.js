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
	
		//search
		.command('search', 'Cherche des questions pour créer un examen')
		.argument('<sujet>', 'sujet de questions')
		.option('-a, --all', 'tous les types de question', { validator: cli.BOOLEAN, default: true })
		.option('-e, --enonce', 'uniquement les questions de type énoncé', { validator: cli.BOOLEAN, default: false })
		.option('-t, --trueFalse', 'uniquement les questions vrai ou faux', { validator: cli.BOOLEAN, default: false })
		.option('-c, --multipleChoice', 'uniquement les questions à choix multiples', { validator: cli.BOOLEAN, default: false })
		.option('-s, --shortAnswer', 'uniquement les questions ouvertes', { validator: cli.BOOLEAN, default: false })
		.option('-m, --match', 'uniquement les questions matching', { validator: cli.BOOLEAN, default: false })
		.action(({ args, options }) => {
			var utilisateur = new Utilisateur();
			utilisateur = utilisateur.findConnected();
			if (utilisateur.userName !== undefined && utilisateur.type === 'P') {
				var examen = new Examen();
				questionsCorrespondantes = examen.searchQuestion(args.sujet, options.a, options.e, options.t, options.c, options.s, options.m);
				console.log(questionsCorrespondantes);
			}
			else console.log('Veuillez d\'abord vous connecter à un compte possédant les droits nécessaires.'.red);
		})

	
cli.run(process.argv.slice(2));