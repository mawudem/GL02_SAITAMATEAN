const fs = require('fs');
const colors = require('colors');
const giftParser = require('../../parsers/giftParser.js');
const vCardParser = require('../../parsers/vCardParser.js');

const vg = require('vega');
const vegalite = require('vega-lite');

const cli = require("@caporal/core").default;

cli.version('vpf-parser-cli')
	.version('0.07')
	// check Vpf


// readme

// Ajoutez la commande "readme"
cli.command('readme', 'Display the README.txt file')
.action(({ logger }) => {
    // Lire le contenu du fichier README.txt
    fs.readFile('../../README.md', 'utf-8', (err, data) => {
        if (err) {
            logger.error(err);
            return;
        }
        // Afficher le contenu dans la console
        logger.info(data);
    });
});


	// Ajoutez la commande "search"
	/*cli.command('search', 'Search for POIs containing a certain string')
		.argument('<file>', 'The Vpf file to search')
		.argument('<needle>', 'The text to look for in POI\'s names')
		.action(({ args, logger }) => {
			fs.readFile(args.file, 'utf-8', (err, data) => {
				if (err) {
					logger.error(err);
					return;
				}
				const needle = args.needle.toLowerCase();
				// Parsez le fichier Vpf et filtrez les POI
				const analyzer = new VpfParser();
				analyzer.parse(data);
				const filteredPOI = analyzer.parsedPOI.filter(poi => poi.name.toLowerCase().includes(needle));
				logger.info(filteredPOI);
			});
		});*/


// Exécutez la CLI avec les arguments de la ligne de commande
cli.run(process.argv.slice(2));
