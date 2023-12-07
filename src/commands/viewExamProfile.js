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
	


	// exam profil
	.command('exam_profil', "Dresse le profil d'un examen")
	.argument('<nomExam>', "Le nom de l'examen")
	.action(({ args, options, logger }) => {
		var utilisateur = new Utilisateur();
		utilisateur = utilisateur.findConnected();
		if (utilisateur.userName !== undefined && utilisateur.type === 'P') {
			fs.readFile('./Examens/' + args.nomExam + '.gift', 'utf8', function (err, data) {
				if (err) {
					return logger.warn(err);
				}

				analyzer = new GiftParser();
				analyzer.parse(data);

				if (analyzer.errorCount === 0) {

					var type = analyzer.parsedQuestion;

					var histogramme = {
						"width": 200,
						"data": {
							"values": type
						},
						"mark": "bar",
						"encoding": {
							"x": {
								"field": "type",
								"type": "ordinal",
								"title": "Exam type of questions"
							},
							"y": {
								"aggregate": "count",
								"type": "quantitative",
								"title": "Number of questions"
							},
							"color": {
								"field": "type",
								"type": "nominal",
								"scale": {
									"domain": ["mc", "tf", "sa", "enonce", "match"],
									"range": ["#e75266", "#e7ba52", "#52e77f", "#527fe7", "#a825e1"]
								},
								"title": "Question type"
							}
						}
					}

					const myChart = vegalite.compile(histogramme).spec;

					// Canvas version 

					var runtime = vg.parse(myChart);
					var view = new vg.View(runtime).renderer('canvas').background("#FFF").run();
					var myCanvas = view.toCanvas(2);
					myCanvas.then(function (res) {
						fs.writeFileSync("Exam_profil.png", res.toBuffer());
						view.finalize();
						logger.info(`L'histogramme a bien été créé. Vous pouvez le trouver à l'emplacement ci joint : \n` +
							process.cwd() + `/Exam_profil.png`);
					})

				} else {
					logger.info("The .png file contains error".red);
				}

			})
		}
		else console.log('Veuillez d\'abord vous connecter à un compte possédant les droits nécessaires.'.red)
	})



	
	
	
cli.run(process.argv.slice(2));
	