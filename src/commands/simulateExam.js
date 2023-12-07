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
	
		// simulate
        .command('simulate', 'Simule le passage d\'un examen')
        .argument('<nomExam>', 'le nom de l\examen')
        .action(({ args, options, logger }) => {
            var utilisateur = new Utilisateur()
            utilisateur = utilisateur.findConnected()
            if (utilisateur.userName !== undefined && utilisateur.type === 'E') {
                var examen = new Examen()
                examen.simulate(args.nomExam)
            }
            else console.log('Veuillez d\'abord vous connecter à un compte possédants les droits nécessaires.'.red)
        })

	
cli.run(process.argv.slice(2));