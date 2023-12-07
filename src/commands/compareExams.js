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
	
	
	// compare
	.command('compare', 'Compare les profils de deux à quatre examens')
	.argument('<nomExam1>', 'Le nom du premier examen')
	.argument('<nomExam2>', 'Le nom du deuxième examen')
	.argument('[nomExam3]', 'Le nom du troisième examen : facultatif')
	.argument('[nomExam4]', 'Le nom du quatrième examen : facultatif')
	.action(({ args, options, logger }) => {
		var utilisateur = new Utilisateur();
		utilisateur = utilisateur.findConnected();
		if (utilisateur.userName !== undefined && utilisateur.type === 'P') {
			var exam = new Examen();
			exam.compare(args.nomExam1, args.nomExam2, args.nomExam3, args.nomExam4, logger);
		}
		else console.log('Veuillez d\'abord vous connecter à un compte possédant les droits nécessaires.'.red)

	})

	
cli.run(process.argv.slice(2));