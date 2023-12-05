// GiftParser

var GiftParser = function(sTokenize, sParsedSymb) {
    this.symb = ["Questionnaire", "Question", "Titre", "Format", "TexteQuestion", "TypeQuestion",
        "ChoixMultiples", "VraiFaux", "Correspondance", "Ouverte", "Numérique", "MotManquant", "Rétroaction", "Commentaire", "TEXT"];
    this.showTokenize = sTokenize;
    this.showParsedSymbols = sParsedSymb;
    this.errorCount = 0;
}

// Parser procedure

// tokenize : transform the data input into a list
GiftParser.prototype.tokenize = function(data) {
    var separator = /(\r\n|: )/;
    data = data.split(separator);
    data = data.filter((val, idx) => !val.match(separator));
    return data;
}

// parse : analyze data by calling the first non-terminal rule of the grammar
GiftParser.prototype.parse = function(data) {
    var tData = this.tokenize(data);
    if (this.showTokenize) {
        console.log(tData);
    }
    this.questionnaire(tData);
}
// Parser operand

GiftParser.prototype.errMsg = function(msg, input){
	this.errorCount++;
	console.log("Parsing Error ! on "+input+" -- msg : "+msg);
}

// Read and return a symbol from input
GiftParser.prototype.next = function(input){
	var curS = input.shift();
	if(this.showParsedSymbols){
		console.log(curS);
	}
	return curS
}

// accept : verify if the arg s is part of the language symbols.
GiftParser.prototype.accept = function(s){
	var idx = this.symb.indexOf(s);
	// index 0 exists
	if(idx === -1){
		this.errMsg("symbol "+s+" unknown", [" "]);
		return false;
	}

	return idx;
}

// check : check whether the arg elt is on the head of the list
GiftParser.prototype.check = function(s, input){
	if(this.accept(input[0]) == this.accept(s)){
		return true;	
	}
	return false;
}

// expect : expect the next symbol to be s.
GiftParser.prototype.expect = function(s, input){
	if(s == this.next(input)){
		//console.log("Reckognized! "+s)
		return true;
	}else{
		this.errMsg("symbol "+s+" doesn't match", input);
	}
	return false;
}

// Parser rules
GiftParser.prototype.questionnaire = function(input) {
    this.question(input);
}

GiftParser.prototype.question = function(input) {
    this.titre(input);
    this.texteQuestion(input);
    this.typeQuestion(input);
}

GiftParser.prototype.titre = function(input) {
    this.expect("Titre", input);
}

GiftParser.prototype.texteQuestion = function(input) {
    this.expect("TexteQuestion", input);
}

GiftParser.prototype.typeQuestion = function(input) {
    this.expect("{", input);
    // Appeler les méthodes pour gérer les différents types de questions
    // en appelant les méthodes correspondantes (ChoixMultiples, VraiFaux, etc.).
    switch (input[0]) {
        case '{':
            this.choixMultiples(input);
            break;
        case 'TRUE':
        case 'T':
        case 'FALSE':
        case 'F':
            this.vraiFaux(input);
            break;
        case '=':
            this.correspondance(input);
            break;
        case '=': // Ajout pour MotManquant
            this.motManquant(input);
            break;
        case '#=':
            this.numérique(input);
            break;
        default:
            this.ouverte(input);
    }

    this.expect("}", input);
}

//  ChoixMultiples = 1*(~ TEXT [Rétroaction]/= TEXT [Rétroaction])
GiftParser.prototype.choixMultiples = function(input) {
    // Logique pour gérer les choix multiples
    var choices = [];

    while (this.accept('~', input) || this.accept('=', input)) {
        var isCorrect = this.accept('=');

        // Récupérer le texte de la réponse
        var choiceText = this.next(input);

        // Exemple : Stocker les informations de la réponse dans une structure de données appropriée
        var choice = {
            isCorrect: isCorrect,
            text: choiceText,
            retroaction: null, // Initialisez à null, car la rétroaction est optionnelle
        };

        // Optionnel : Gérer la rétroaction
        choice.retroaction = this.optionalRetroaction(input);

        // Ajouter la réponse à la liste des choix
        choices.push(choice);
    }

    // Exemple : Stocker les informations de la question à choix multiples dans une structure de données appropriée
    var questionChoixMultiples = {
        type: 'ChoixMultiples',
        choices: choices,
    };

    // Optionnel : Gérer la rétroaction de la question
    questionChoixMultiples.retroaction = this.optionalRetroaction(input);

    // Exemple : Stocker la question à choix multiples dans une liste ou un autre conteneur
    this.questions.push(questionChoixMultiples);
}

//   VraiFaux = 1('TRUE'/'T'/'FALSE'/'F') [Rétroaction]
GiftParser.prototype.vraiFaux = function(input) {
    // Logique pour gérer les questions vrai/faux
    var vraiFauxValue = this.next(input);

    // Exemple : Stocker les informations de la question vrai/faux dans une structure de données appropriée
    var questionVraiFaux = {
        type: 'VraiFaux',
        value: vraiFauxValue,
        retroaction: null, // Initialisez à null, car la rétroaction est optionnelle
    };

    // Optionnel : Gérer la rétroaction
    questionVraiFaux.retroaction = this.optionalRetroaction(input);

    // Exemple : Stocker la question vrai/faux dans une liste ou un autre conteneur
    this.questions.push(questionVraiFaux);
}

// Correspondance = 1*('=' TEXT '->' TEXT)
GiftParser.prototype.correspondance = function(input) {
    this.expect('=', input);
    var text1 = this.next(input);
    this.expect('->', input);
    var text2 = this.next(input);

    // Logique pour traiter les informations de correspondance
    // Exemple : Stocker les informations de correspondance dans une structure de données appropriée
    var questionCorrespondance = {
        type: 'Correspondance',
        text1: text1,
        text2: text2,
        retroaction: null, // Initialisez à null, car la rétroaction est optionnelle
    };

    // Optionnel : Gérer la rétroaction
    questionCorrespondance.retroaction = this.optionalRetroaction(input);

    // Exemple : Stocker la question de correspondance dans une liste ou un autre conteneur
    this.questions.push(questionCorrespondance);
}

//MotManquant = 1*(~TEXT/~= TEXT) [Rétroaction]

GiftParser.prototype.motManquant = function(input) {
    // Logique pour gérer les questions à trou
    var answerText = "";

    while (this.accept("~", input) || this.accept("=", input)) {
        answerText += this.next(input);
    }
    /*this.expect('~', input);
    var text1 = this.next(input);
    this.expect('~=', input);
    var text2 = this.next(input);*/
    

    // Exemple : Stocker les informations de la question à trou dans une structure de données appropriée
    var questionMotManquant = {
        type: 'MotManquant',
        correctAnswer: correctAnswer,
        retroaction: null, // Initialisez à null, car la rétroaction est optionnelle
    };

    // Optionnel : Gérer la rétroaction
    questionMotManquant.retroaction = this.optionalRetroaction(input);

    // Exemple : Stocker la question à trou dans une liste ou un autre conteneur
    this.questions.push(questionMotManquant);
}

//  Numérique = '#=' 1*DIGIT[':' 1*DIGIT] [Rétroaction]
GiftParser.prototype.numérique = function(input) {
    this.expect('#=', input);
    var numText = this.next(input);
    var marginText = null;

    // Vérifier si une marge est spécifiée
    if (this.accept(':', input)) {
        this.expect(':', input);
        marginText = this.next(input);
    }

    // Logique pour traiter les informations numériques
    var numValue = parseInt(numText);
    var marginValue = (marginText !== null) ? parseInt(marginText) : null;

    // Exemple : Stocker les informations numériques dans une structure de données appropriée
    var questionNumérique = {
        type: 'Numérique',
        num: numValue,
        margin: marginValue,
        retroaction: null, // Initialisez à null, car la rétroaction est optionnelle
    };

    // Optionnel : Gérer la rétroaction
    questionNumérique.retroaction = this.optionalRetroaction(input);

    // Exemple : Stocker la question numérique dans une liste ou un autre conteneur
    this.questions.push(questionNumérique);
}

// Règle pour les questions ouvertes :     Ouverte = 1*('=' TEXT) [Rétroaction]
GiftParser.prototype.ouverte = function(input) {
    this.expect('=', input);
    var ouverteText = this.next(input);
    // Exemple : Stocker la question ouverte dans une structure de données appropriée
    var questionOuverte = {
        type: 'Ouverte',
        text: ouverteText,
        retroaction: null, // Initialisez à null, car la rétroaction est optionnelle
    };

    // Optionnel : Gérer la rétroaction
    questionOuverte.retroaction = this.optionalRetroaction(input);

    // Exemple : Stocker la question ouverte dans une liste ou un autre conteneur
    this.questions.push(questionOuverte);
}

// Ajouter la méthode pour gérer la rétroaction optionnelle
GiftParser.prototype.optionalRetroaction = function(input) {
    if (this.accept("[", input)) {
        this.expect("[", input);
        // Logique pour gérer la rétroaction
        var opr = this.retroaction(input);
        this.expect("]", input);
    }

    if(opr){
		return opr;
	}else{
		this.errMsg("Invalid name", input);
	}
}


GiftParser.prototype.retroaction = function(input) {
    this.expect("#", input);
    var retroactionText = this.next(input);
    if(matched = retroactionText.match(/[\wàéèêîù'\s]+/i)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
	}
}

// Ajouter la méthode pour gérer les commentaires         Commentaire = '//' 1*VCHAR
GiftParser.prototype.commentaire = function(input) {
    this.expect("//", input);
	var curS = this.next(input);
    if(matched = curS.match(/[\wàéèêîù'\s]+/i)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
	}
}


module.exports = GiftParser;
