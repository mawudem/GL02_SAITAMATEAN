
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
        
        	//create_exam
        .command('create_exam', 'Créer un examen avec des questions')
        .argument('<nomExam>', 'le nom de l\'examen')
        .action(({ args }) => {
            var utilisateur = new Utilisateur();
            utilisateur = utilisateur.findConnected();
            if (utilisateur.userName !== undefined && utilisateur.type === 'P') {
                var exam = new Examen(args.nomExam);
                exam.createExam(args.nomExam);
            }
            else console.log('Veuillez d\'abord vous connecter à un compte possédant les droits nécessaires.'.red)
        })
    
        
    cli.run(process.argv.slice(2));