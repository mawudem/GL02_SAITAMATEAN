//const parse = require('gift-pegjs');
//différents require j'en ai trop mis mais mieux vaut trop que pas assez
const fs = require('fs');
const querystring = require('querystring');
//querystring.parse
const vg = require('vega');
const vegalite = require('vega-lite');
const GiftParser = require('../parsers/giftParser')
//const Utilisateur = require('./Utilisateur')


//déclaration de la variable ExamService et de ses attributs
var ExamService = function (name) {
    this.name = name
}

//fonction qui retourne l'ensemble des questions de la banque de questions sous la forme d'objets Question
ExamService.prototype.allQuestions = function () {
    var Parser = new GiftParser()
    var fileContent = []
    filenames = fs.readdirSync('./SujetB_data/');
    filenames.forEach(file => {
        fileContent.push(fs.readFileSync('./SujetB_data/' + file, { encoding: 'utf8' }))
    });

    var parsedQuestions = []
    fileContent.forEach(file => {
        parsedQuestions.push(Parser.parse(file))
    })

    return parsedQuestions
}

//permet de chercher une question à partir d'un mot clé dans l'énoncé de la question en précisant le type de questions recherchés
ExamService.prototype.searchQuestion = function (motCle, all, enonce, tf, mc, sa, match) {
    const BreakError = {};
    let newList = [];
    var listeFichier = this.allQuestions();

    listeFichier.forEach(listeQuestion => {
        listeQuestion.forEach(question => {
            try {
                question.enonce.forEach(element => {
                    if (element.includes(motCle)) {
                        if (all != undefined) {
                            newList.push(question);
                            throw BreakError;
                        }
                        else if (enonce != undefined) {
                            if (question.type === 'enonce') {
                                newList.push(question);
                                throw BreakError;
                            }
                        }
                        else if (tf != undefined) {
                            if (question.type === 'tf') {
                                newList.push(question);
                                throw BreakError;
                            }
                        }
                        else if (mc != undefined) {
                            if (question.type === 'mc') {
                                newList.push(question);
                                throw BreakError;
                            }
                        }
                        else if (sa != undefined) {
                            if (question.type === 'sa') {
                                newList.push(question);
                                throw BreakError;
                            }
                        }
                        else if (match != undefined) {
                            if (question.type === 'match') {
                                newList.push(question);
                                throw BreakError;
                            }
                        }
                    }
                })
            } catch (err) {
                if (err !== BreakError) throw err;
            }
        })
    })
    if (newList.length > 0) {
        return newList;
    } else {
        return 'Aucune question de ce type ne comporte le mot clé "' + motCle + '"';
    }

}

//permet de controler la qualité d'un examen à partir de son nom
ExamService.prototype.submit = function (name) {
    const file = fs.readFileSync(`./Examens/${name}.gift`, { encoding: 'utf-8' });
    var Parser = new GiftParser();
    const parsedQuestions = Parser.parse(file);

    if (parsedQuestions.length >= 15 && parsedQuestions.length <= 20) {
        console.log('l\'examen comporte un nombre de questions correct.');
    }
    else if (parsedQuestions.length < 15) {
        console.log('l\'examen doit comporter entre 15 et 20 questions, il en comporte ' + parsedQuestions.length + '. Veuillez en ajouter.');
    }
    else {
        console.log('l\'examen doit comporter entre 15 et 20 questions,  il en comporte ' + parsedQuestions.length + '. Veuillez en supprimer.');
    }
}

//permet d'afficher les questions contenues dans un examen
ExamService.prototype.display = function (name) {
    const file = fs.readFileSync(`./Examens/${name}.gift`, { encoding: 'utf-8' });
    var Parser = new GiftParser();
    const parsedQuestions = Parser.parse(file);
    return parsedQuestions;
}

//création d'un examen/fichier vide
ExamService.prototype.createExam = function (name) {

    var existeDeja = false;
   

    //on vérifie que le fichier n'existe pas déjà
    filenames = fs.readdirSync('./Examens/');
    filenames.forEach(file => {
        //s'il existe déjà on change le booleen et on avertit l'utilisateur en montrant ou le fichier se trouve
        if (file === name + ".gift") {
            existeDeja = true;
            console.log("L'examen ".red + name.magenta + ".gift".magenta + " existe déjà, vous pouvez le retrouver ici :\n".red +
                process.cwd().blue + "/Examens/".blue + name.blue + ".gift".blue);
        }

    });

    //si le fichier n'existe pas encore on le créer et on indique son emplacement à l'utilisateur
    if (existeDeja === false) {
        this.name = name;
        fs.writeFile(`./Examens/${name}.gift`, "", "utf8", function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("L'examen ".green + name.magenta + ".gift".magenta + " a bien été créé. Vous pouvez le trouver à l'emplacement ci joint : \n".green +
                    process.cwd().blue + "/Examens/".blue + name.blue + ".gift".blue);
            }
        });
    }

}

//permet d'ajouter une question à un examen en fonction de son ID
ExamService.prototype.addQuestion = function (name, question) {

    var existeDeja = false;

    //on verifie si la question existe déjà dans le fichier exam si c'est le cas on change le booléen et on avertit l'utilisateur
    var questionsExamText = [];
    var arrayQuestionsExamSplit = [];
    questionsExamText = fs.readFileSync('./Examens/' + name + ".gift", 'utf8');
    arrayQuestionsExamSplit = [];
    arrayQuestionsExamSplit.push(questionsExamText.split("::"));
    arrayQuestionsExamSplit.forEach(element => {
        element.forEach(id => {
            if (id === question) {
                console.log("La question ".red + id.yellow + " existe déjà.".red);
                existeDeja = true;
            }
        });
    });

    //si la question n'existe pas encore dans l'examen on la cherche dans les fichier question
    if (existeDeja === false) {
        function Gift() {
            data = "";
            filenames = fs.readdirSync('./SujetB_data/');
            var questionsFichiersText = [];
            var arrayQuestionsFichiersSplit = [];
            //on fait le tour des fichier questions
            filenames.forEach(file => {
                questionsFichiersText = [];
                //on transforme le fichier question en texte
                questionsFichiersText = fs.readFileSync('./SujetB_data/' + file, 'utf8');
                arrayQuestionsFichiersSplit = [];
                //on split le texte avec les :: pour séparer l'id du reste de la question
                arrayQuestionsFichiersSplit.push(questionsFichiersText.split("::"));
                arrayQuestionsFichiersSplit.forEach(element => {
                    var i = 0;
                    element.forEach(id => {
                        //si le contenu du tableau est égale à l'id de la question on l'ajoute à la variable qui sera ajoutée au fichier exam
                        if (id.trim().toLowerCase() === question.trim().toLowerCase()) {
                            data += "::" + element[i] + "::" + element[i + 1];
                            console.log("La question ".green + element[i].yellow + " a bien été ajoutée.".green)
                        }
                        i = i + 1;
                    });
                });
            });
            return data;
        }

        myGift = Gift();
        if (myGift === '') console.log('\nLa question n\'a pas été trouvée.'.red)
        //on ajoute la question au fichier exam
        fs.appendFile(`./Examens/${name}.gift`, myGift, "utf8", function (err) {
            if (err) {
                console.log(err);;
            } else {
                console.log("Vous pouvez trouver l'examen à l'emplacement ci joint : \n".green +
                    process.cwd().blue + "/Examens/".blue + name.blue + ".gift".blue);
            }
        });
        
    }

}

//permet de supprimer une question d'un examen en fonction de l'ID donné
ExamService.prototype.removeQuestion = function (name, question) {

    var existe = false;

    function Gift() {
        data = "";
        var questionsExamText = [];
        var arrayQuestionsExamSplit = [];
        //on lit le fichier exam et on le split dans un tableau après l'avoir transformer en texte
        questionsExamText = fs.readFileSync('./Examens/' + name + ".gift", 'utf8');
        arrayQuestionsExamSplit = [];
        arrayQuestionsExamSplit.push(questionsExamText.split("::"));
        arrayQuestionsExamSplit.forEach(element => {
            var i = 0;
            element.forEach(id => {
                //si on trouve la question on change le booléen et on la supprime du tableau (id+énoncé)
                if (id.trim().toLowerCase() === question.trim().toLowerCase()) {
                    console.log("La question ".green + element[i].yellow + " a bien été supprimée".green);
                    delete element[i];
                    delete element[i + 1];
                    existe = true;
                }
                //si ce n'est pas la question a supprimé on ajoute à la variable a mettre dans le fichier exam
                else {
                    if (i !== 0)
                        data += '::' + id;
                }
                i = i + 1;
            });
        });
        //on avertit l'utilisateur si la question qu'il veut supprimer n'est pas dans l'examen
        if (existe === false) {
            console.log("L'examen ne comprend pas la question ".red + question.yellow);
        }
        return data;
    }

    myGift = Gift();

    //on réécrit le fichier exam sans la question si elle était dans l'examen
    if (existe === true) {
        fs.writeFile(`./Examens/${name}.gift`, myGift, "utf8", function (err, data) {
            if (err) {
                console.log(err);;
            } else {
                console.log("Vous pouvez trouver l'examen à l'emplacement ci joint : \n".green +
                    process.cwd().blue + "/Examens/".blue + name.blue + ".gift".blue);
            }
        })
    }
}

//génère l'histogramme de comparaison des examens
var createHistogramme = function (data, logger) {

    var histogramme = {
        "data": {
            "values": data
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
                "type": "quantitative"
            },
            "xOffset": { "field": "exam" },
            "color": {
                "field": "exam",
                "type": "nominal",
                "scale": {
                    "range": ["#e75266", "#e7ba52", "#52e77f", "#527fe7"]
                },
                "title": "Exams' name"
            }
        }
    }

    const myChart = vegalite.compile(histogramme).spec;

    var runtime = vg.parse(myChart);
    var view = new vg.View(runtime).renderer('canvas').background("#FFF").run();
    var myCanvas = view.toCanvas();
    myCanvas.then(function (res) {
        fs.writeFileSync("./comparaisonExam.png", res.toBuffer());
        view.finalize();
        logger.info(`La comparaison a bien été effectuée. Veuillez retrouver l'histogramme à l'emplacement suivant : \n` +
            process.cwd() + `/comparaisonExam.png`);

    })

}

//analyse les fichiers, stocke les données, et créer l'histogramme selon le nombre d'examens à comparer
ExamService.prototype.compare = function (exam1, exam2, exam3 = 'undefined', exam4 = 'undefined', logger) {

    fs.readFile('./Examens/' + exam1 + '.gift', 'utf8', function (err, data) {
        if (err) {
            return logger.warn(err);
        }

        analyzer = new GiftParser();
        analyzer.parse(data);

        if (analyzer.errorCount === 0) {
            //Ajout d'une ligne "exam" dans le tableau, utile pour générer l'histogramme souhaité
            var data1 = analyzer.parsedQuestion.map(p => {
                p["exam"] = exam1;
                return p;
            })
        }


        fs.readFile('./Examens/' + exam2 + '.gift', 'utf8', function (err, data) {
            if (err) {
                return logger.warn(err);
            }

            analyzer2 = new GiftParser();
            analyzer2.parse(data);

            if (analyzer2.errorCount === 0) {
                //Ajout d'une ligne "exam" dans le tableau, utile pour générer l'histogramme souhaité
                var data2 = analyzer2.parsedQuestion.map(p => {
                    p["exam"] = exam2;
                    return p;
                })
            }


            /*Au minimum 2 examens sont nécessaires pour la comparaison, 
            si on ajoute un 3ème on rentre dans le if statement suivant*/

            if (exam3 != 'undefined') {
                fs.readFile('./Examens/' + exam3 + '.gift', 'utf8', function (err, data) {
                    if (err) {
                        return logger.warn(err);
                    }

                    analyzer3 = new GiftParser();
                    analyzer3.parse(data);

                    if (analyzer3.errorCount === 0) {
                        //Ajout d'une ligne "exam" dans le tableau, utile pour générer l'histogramme souhaité
                        var data3 = analyzer3.parsedQuestion.map(p => {
                            p["exam"] = exam3;
                            return p;
                        })
                    }

                    //Si on compare exactement 3 examens, on génère l'histogramme ici
                    if (exam4 === 'undefined') {
                        //On merge les données dans une unique array 
                        var data = [...data1, ...data2, ...data3];
                        createHistogramme(data, logger);
                    }


                    /*Au minimum 2 examens sont nécessaires pour la comparaison, 
                    si on en compare 4 on rentre dans le if statement suivant.
                    Pour que l'histogramme possède toutes les infos, on garde la data
                    des autres exams : d'où le if statement dans un autre if statement*/

                    if (exam4 != 'undefined') {
                        fs.readFile('./Examens/' + exam4 + '.gift', 'utf8', function (err, data) {
                            if (err) {
                                return logger.warn(err);
                            }

                            analyzer4 = new GiftParser();
                            analyzer4.parse(data);

                            if (analyzer4.errorCount === 0) {
                                //Ajout d'une ligne "exam" dans le tableau, utile pour générer l'histogramme souhaité
                                var data4 = analyzer4.parsedQuestion.map(p => {
                                    p["exam"] = exam4;
                                    return p;
                                })
                            }

                            //Si on compare exactement 4 examens, on génère l'histogramme ici
                            //On merge les données dans une unique array
                            var data = [...data1, ...data2, ...data3, ...data4];
                            createHistogramme(data, logger);

                        });

                    }

                });

            } else {

                /*Si on compare exactement 2 examens, on génère l'histogramme ici,
                après avoir vérifier qu'il n'y ait pas 3 ou 4 examens à comparer*/
                //On merge les données dans une unique array
                var data = [...data1, ...data2];
                createHistogramme(data, logger);

            }


        });

    });

}

//permet de simuler le passage d'un examen pour un étudiant avec affichage du bilan des réponses et le score à la fin
ExamService.prototype.simulate = function (nomExam) {
    givenAnswers = []
    let nbQuestions = 0
    let openQuestions = 0
    let match = []

    try {

            //on lit le fichier de l'examen à simuler :
    const file = fs.readFileSync('./Examens/' + nomExam + '.gift', { encoding: 'utf8' })
    //on parse les questions de l'examen :
    var Parser = new GiftParser()
    const parsedQuestions = Parser.parse(file)
    //on lance le timer de l'examen :
    const start = Date.now()
    //ensuite on lit chaque question et on attends les réponses : 
    
    if(parsedQuestions.length > 15) {

        parsedQuestions.forEach(question => {
            //si c'est un énoncé on affiche juste le texte on attends aucune réponse :
            if (question.type === 'enonce')
                console.log(question.returnEnonce())
            //si c'est une question à choix multiple, on affiche les choix et on demande de choisir
            else if (question.type === 'mc') {
                console.log(question.returnEnonceQuestion())
                for (let i = 0; i < question.answers.length; i++) {
                    console.log('(' + (i + 1) + ') : \n\n')
                    if (question.answers[i].length === 0)
                        console.log('Pour choisir plusieurs choix, il faut les séparer par une virgule.')
                    console.log(question.returnChoices(i))
                    givenAnswers.push(querystring.parse('-> Réponse : '))
                    console.log('\n')
                    nbQuestions += 1
                }
            }
            //si c'est une question à réponse courte ouverte, on affiche l'énoncé et on demande à l'utilisateur de saisir sa réponse
            else if (question.type === 'sa') {
                console.log(question.returnEnonceQuestion())
                for (let i = 0; i < question.answers.length; i++) {
                    console.log('(' + (i + 1) + ') : \n\n')
                    givenAnswers.push(querystring.parse('-> Réponse : '))
                    console.log('\n')
                    nbQuestions += 1
                }
            }
            else if (question.type === 'tf') {
                console.log('Entrez TRUE / T si l\'affirmation est vraie ou FALSE / F si l\'affirmation est fausse :')
                console.log(question.returnEnonceQuestion())
                for (let i = 0; i < question.answers.length; i++) {
                    console.log('(' + (i + 1) + ') : \n\n')
                    givenAnswers.push(querystring.parse('-> Réponse : '))
                    console.log('\n')
                    nbQuestions += 1
                }
            }
            //si c'est une question de type match, on affiche les 2 listes de mots à matcher et on demande de rentrer 1 par 1 les différents matchs
            else if (question.type === 'match') {
                match.push(question.splitMatch())
                console.log(question.returnEnonceQuestion())
                console.log(question.returnRandomMatch(match[match.length - 1]))
                match[match.length - 1].forEach(element => {
                    givenAnswers.push(querystring.parse('-> ' + element[0] + ' : '))
                    nbQuestions += 1
                })
    
            }
            else if (question.type === 'open') {
                console.log(question.returnEnonceQuestion())
                for (let i = 0; i < question.answers.length; i++) {
                    console.log('(' + (i + 1) + ') : \n\n')
                    givenAnswers.push(querystring.parse('-> Réponse : '))
                    console.log('\n')
                    nbQuestions += 1
                    openQuestions += 1
                }
    
            }
            else {
                nbQuestions += 1
            }
        })
        if (nbQuestions === 0) {
            givenAnswers = querystring.parse('--> Réponse : ')
            console.log('\nCet examen nécessite une correction ultérieure par un professeur.')
        }
        else {
            let j = 1
            let score = 0
            console.log('Bilan des réponses :\n\n')
            //après on affiche un bilan avec les bonnes réponses :
            parsedQuestions.forEach(question => {
                if (question.type === 'mc') {
                    console.log('--> Question ' + j + ' : \n')
                    for (let i = 0; i < question.answers.length; i++) {
                        console.log('\n\n(' + (i + 1) + ') : \n')
                        if (question.answers[i].length !== 0) {
                            console.log(question.returnAnswers(i))
                            console.log('Réponse donnée : ' + givenAnswers[0])
                            if (question.answers[i][0].replace(/\s/g, '').toLowerCase() === givenAnswers[0].replace(/\s/g, '').toLowerCase()) {
                                score += question.answersWeight[i][0] / 100
                                console.log('+' + question.answersWeight[i][0] / 100 + ' point')
                            }
                        }
                        else {
                            console.log(question.returnAnswersWithWeight(i))
                            console.log('Réponse(s) donnée(s) : ' + givenAnswers[0])
                            let k = 0
                            let multipleAnswers = givenAnswers[0].split(',')
                            question.choices[i].forEach(element => {
                                for (let j = 0; j < multipleAnswers.length; j++) {
                                    if (element.replace(/\s/g, '').toLowerCase() === multipleAnswers[j].replace(/\s/g, '').toLowerCase()) {
                                        score += question.answersWeight[i][k] / 100
                                        if (question.answersWeight[i][k] > 0)
                                            console.log('+' + question.answersWeight[i][k] / 100 + ' point')
                                        else
                                            console.log(question.answersWeight[i][k] / 100 + ' point')
                                    }
                                }
                                k++
                            })
                        }
                        givenAnswers.shift()
                    }
                    j += 1
                    console.log('\n')
                }
                else if (question.type === 'sa') {
                    console.log('--> Question ' + j + ' : \n')
                    for (let i = 0; i < question.answers.length; i++) {
                        console.log('\n\n(' + (i + 1) + ') : \n')
                        console.log(question.returnAnswers(i))
                        console.log('Réponse donnée : ' + givenAnswers[0])
                        let k = 0
                        question.answers[i].forEach(element => {
                            element = element.split('|')
                            let found = false
                            element.forEach(el => {
                                if (el.replace(/\s/g, '').toLowerCase() === givenAnswers[0].replace(/\s/g, '').toLowerCase()) {
                                    if (found === false) {
                                        score += question.answersWeight[i][k] / 100
                                        console.log('+' + question.answersWeight[i][k] / 100 + ' point')
                                        found = true
                                    }
                                }
                            })
                            k++
                        })
                        givenAnswers.shift()
                    }
                    j += 1
                    console.log('\n')
                }
                else if (question.type === 'match') {
                    console.log('--> Question ' + j + ' : \n')
                    match.shift().forEach(element => {
                        console.log(element[0] + ' -> ' + element[1])
                        console.log('Réponse donnée : ' + givenAnswers[0])
                        if (givenAnswers[0].toLowerCase() === element[1].toLowerCase()) {
                            score += 1
                            console.log('+1 point')
                        }
                        givenAnswers.shift()
                    })
                    j += 1
                    console.log('\n')
                }
                else if (question.type === 'tf') {
                    console.log('--> Question ' + j + ' : \n')
                    for (let i = 0; i < question.answers.length; i++) {
                        console.log('\n\n(' + (i + 1) + ') : \n')
                        console.log(question.returnAnswers(i))
                        console.log('Réponse donnée : ' + givenAnswers[0])
                        question.answers[i].forEach(element => {
                            if (element.replace(/\s/g, '').toLowerCase() === givenAnswers[0].replace(/\s/g, '').toLowerCase() || element.replace(/\s/g, '').toLowerCase().charAt(0) === givenAnswers[0].replace(/\s/g, '').toLowerCase()) {
                                score += 1
                                console.log('+1 point')
                            }
                        })
                        givenAnswers.shift()
                    }
                    j += 1
                    console.log('\n')
                }
                else if (question.type === 'open') {
                    console.log('--> Question ' + j + ' : \n')
                    console.log('Réponse donnée : ' + givenAnswers[0])
                    console.log('Cette question nécessite la correction d\'un professeur.')
                    nbQuestions -= 1
                    givenAnswers.shift()
                    j += 1
                    console.log('\n')
    
                }
            })
            //user = new Utilisateur()
            //user = user.findConnected()
            //console.log('Etudiant : ' + user.userName)
            if (nbQuestions > 0)
                console.log('\nScore total : ' + score + ' / ' + nbQuestions)
            console.log(openQuestions + ' question(s) nécessite(nt) la correction d\'un professeur')
            const elapsedTime = Date.now() - start
            var minutes = Math.floor(elapsedTime / 60000);
            var seconds = ((elapsedTime % 60000) / 1000).toFixed(0);
            console.log('Durée de l\'examen - ' + minutes + " min " + (seconds < 10 ? '0' : '') + seconds + ' secondes.')
        }

    } else {

        console.log('Il n\'y a pas assez de questions dans l\'examen')
    }

    } catch(ENOENT) {

        console.log(`Le fichier ${nomExam} n'existe pas`)
    }

}

module.exports = ExamService;