//differents require
const Question = require('../services/questionService')

var GiftParser = function () {
	// La liste des questions traitées
	this.parsedQuestion = [];
	this.errorCount = 0;
}

// Parser procedure

// tokenize : tranform the data input into a list
GiftParser.prototype.tokenize = function (data) {
	var separator = /(::|{|}|=|~|#|MC|SA|\/\/|\n?\n|\$CATEGORY:|%)/g
	var bool = /(T|F|TRUE|FALSE)/g
	data = data.split(separator)
	data.forEach(element => {
		return element.split(bool)
	});
	return data
}

//cleanData : remove all non useful elements from the data
GiftParser.prototype.cleanData = function (data) {
	var cleanedData = []
	data.forEach(element => {
		//to remove html tags :
		cleanedData.push(element.replace(/(<([^>]+)>)/gi, ""))
	});
	//remove [format]
	cleanedData = cleanedData.map((el) => { return el.replace('[html]', '') })
	cleanedData = cleanedData.map((el) => { return el.replace('[markdown]', '') })
	cleanedData = cleanedData.map((el) => { return el.replace('[plain]', '') })
	cleanedData = cleanedData.map((el) => { return el.replace('[moodle]', '') })
	//remove \n elements
	cleanedData = cleanedData.map((el) => { return el.replace(/\r?\n|\n?\n|\t|\r/g, ' ') })
	cleanedData = cleanedData.map((el) => { return el.replace('\n  ', ' ') })
	cleanedData = cleanedData.map((el) => { return el.replace('::', '') });
	cleanedData = cleanedData.map((el) => { return el.replace('//', '') });
	//remove empty elements
	cleanedData = cleanedData.filter(item => { return item !== '' && item !== ' ' && item !== '  ' && item !== '   ' && item !== '    '})
	return cleanedData
}

// permet de découper le fichier en questions
GiftParser.prototype.parse = function (data) {
	var tData = this.tokenize(data)
	tData = this.cleanData(tData)
	this.parsedQuestion = []
	this.listQuestion(tData)
	return this.parsedQuestion
}

// Parser rules

// <liste_questions> = *(<question>)
GiftParser.prototype.listQuestion = function (input) {
	this.question(input);
}

// permet d'identifier chaque partie de la question et de la placer au bon endroit
GiftParser.prototype.question = function (input) {
	//checker si on a une nouvelle question (présence de ::)
	var inAnswer = false
	var question = 0
	var enonce = []
	var answer = []
	var choice = []
	var feedback = []
	var comment = []
	var previous
	var answersWeight = []
	var category = 'none'
	var type
	var i = 1
	while (question <= 2 && input.length > 0) {
		if (this.check('::', input)) {
			question += 1
			//ici, on veut que lors du 3ème :: détecté, on comprenne que c'est une nouvelle question
			//donc faut créer un nouvel objet question et stocker tout ce qu'il faut dedans
			//ajouter cet objet question à la liste d'objets question
			//et continuer de faire ça jusqu'à ce que le fichier soit vide.
			if (question === 1) {
				var title = this.title(input)
			}
			else if (question === 2 && input[1] !== '{' && input[1] !== '//') {
				this.expect('::', input)
				enonce.push(this.enonce(input))
			}
			else if (question === 2 || input[1] === '{' || input[1] === '//')
				this.next(input)
		}
		//si on détecte '$CATEGORY:', c'est que la catégorie va être donnée
		else if (this.check('$CATEGORY:', input)) {
			category = this.category(input)
		}
		//si on détecte %, c'est que le poids de la réponse va être donné
		else if (this.check('%', input)) {
			answersWeight[answersWeight.length-1].push(parseInt(this.answerWeight(input)))
			input[0] = previous
		}
		//si on détecte =, que le suivant n'est pas % et qu'on est dans une zone de réponse, c'est que le prochain élément et une réponse
		else if (this.check('=', input) && input[1] != '%' && inAnswer) {
			answer[answer.length-1].push(this.answer(input))
			if (answer[answer.length-1].length > answersWeight[answersWeight.length-1].length)
				answersWeight[answersWeight.length-1].push(100)
			// voir si c'est un exercice de matching
			if (answer[answer.length-1][0].includes('->'))
				type = 'match'
		}
		//si on détecte { c'est qu'on rentre dans une zone ou des réponses et des choix seront donnés
		else if (this.check('{', input)) {
			//si la question a des {} mais la variable type n'est pas redéfini par une autre caractéristique c'est une question ouverte
			inAnswer = true
			type = 'open'
			if(input[1] === '=' || input[1] === '~' || input[1] === '}' || input[1] === '1:'){
				answer.push([])
				choice.push([])
				answersWeight.push([])
				enonce.push('('+i+')')
				i ++
			}
			this.next(input)
		}
		//si on détecte un des mots suivants, c'est qu'il s'agit d'une question vrai ou faux
		else if (this.check('TRUE', input) || this.check('T', input) || this.check('FALSE', input) || this.check('F', input)) {
			type = 'tf'
			answer.push([])
			answersWeight.push([])
			answer[answer.length-1].push(input[0])
			if (answer[answer.length-1].length > answersWeight[answersWeight.length-1].length)
				answersWeight[answersWeight.length-1].push(100)
			this.next(input)
		}
		//si on détecte // c'est que le prochain élément est un caractère (sauf dans le cas d'URL présente dans l'énoncé)
		else if (this.check('//', input) && enonce.slice(-1)[0] !== 'https:') {
			comment.push(this.comment(input))
		}
		// si on détecte } c'est qu'on quitte une zone de réponse et que si le prochain élément n'est pas :: et que le fichier n'est pas fini, on a encore des éléments d'énoncé
		else if (this.check('}', input) && input.length > 1 && input[1] != '::') {
			inAnswer = false
			this.expect('}', input)
			if (input[0] != '//') //bancal peut être à modifier
				enonce.push(this.enonce(input))
		}
		// si on détecte ~ et qu'il n'y a ni = ni % ensuite, c'est que l'élément est un choix de qcm
		else if (this.check('~', input) && input[1] != '=' && input[1] != '%') {
			type = 'mc'
			choice[choice.length-1].push(this.choice(input))
		}
		// si on détecte un # et que l'élément suivant n'est pas un = alors il s'agit d'un feedback
		else if (this.check('#', input) && input[1] !== '=') {
			feedback.push(this.feedback(input))
		}
		//si on détecte l'élement SA alors il s'agit d'une question de type réponse courte
		else if (this.check('SA', input) && previous === "1:") {
			type = 'sa'
			this.next(input)
		}
		//si on détecte l'élement MC alors il s'agit d'une question de type QCM
		else if (this.check('MC', input) && previous === "1:") {
			type = 'mc'
			this.next(input)
		}
		//si on détecte un des éléments suivants mais qu'il ne répond à aucune condition citée plus haut, on peut passer à l'élement suivant
		else if (this.check('1:', input) || this.check(':', input) || this.check('~', input) || this.check('#', input) || this.check('=', input) || this.check('}', input)) {
			if (this.check('}', input))
				inAnswer = false
			else if (this.check('#', input) && input[1] === '=') {
				choice.push([])
				answer.push([])
				answersWeight.push([])
			}
			previous = this.next(input)
		}
		else {
			enonce.push(this.enonce(input))
		}
	}
	//si le type de la question est open mais qu'il y a des réponses sans choix
	if (type === 'open' && choice[choice.length-1].length === 0 && answer[answer.length-1].length > 0)
		type = 'sa'
	//si le type n'est pas défini
	else if (type === undefined)
		type = 'enonce'
	var q = new Question(title, type, category, comment, enonce, answer, answersWeight, choice, feedback)
	this.parsedQuestion.push(q);
	if (input.length > 0) {
		this.question(input);
	}
	return true;
}

// <title> = "::" 1*(VCHAR / WSP)
GiftParser.prototype.title = function (input) {
	this.expect("::", input)
	var curS = this.next(input);
	if (matched = curS.match(/^(\w|\.|\/|\+|-|"|'|&|\(|\)|\[|\]|:|,|\u2013|\u2014| )+$/i)) {
		return matched[0]
	} else {
		this.errMsg("Invalid title", curS);
	}
}

// <enonce> = 1*(VCHAR / WSP)
GiftParser.prototype.enonce = function (input) {
	var curS = this.next(input)
	if (matched = curS.match(/^(\w|\.|:|;|\/|-|"|'|’|\(|\)|\[|\]|,|\?|!|_|\u2013|\u2014|\u00a0|\u002c|\u00ad|\\|…|‘|´|•|“|”|é|„|<|>| )+$/i)) {
		return matched[0];
	} else {
		this.errMsg("Invalid enonce", curS);
	}
}

// <answer> = "=" 1*(VCHAR / WSP)
GiftParser.prototype.answer = function (input) {
	this.expect('=', input)
	var curS = this.next(input);
	if (matched = curS.match(/^(\w|\.|-|,|\u2014|\u2013|\u00a0|\\|\/|\||\*|:|'|\?|->|’|´|‘|’|\$|\(|\)| )+$/i)) {
		return matched[0];
	} else {
		this.errMsg("Invalid answer\n", curS);
	}
}

// <answerWeight> = '%' 0*1(-) 1*3(DIGIT) '%'
GiftParser.prototype.answerWeight = function (input) {
	this.expect("%", input)
	var curS = this.next(input);
	if (matched = curS.match(/^(-?)\d{1,3}$/)) {
		return matched[0];
	} else {
		this.errMsg("Invalid answer weight", curS);
	}
}
// <category> = "$CATEGORY$:" '$' 1*(ALPHA) '$' 1*(0*1'/' 1*(ALPHA/WSP/DIGIT) 0*1'/' / ',')
GiftParser.prototype.category = function (input) {
	this.expect("$CATEGORY:", input)
	var curS = this.next(input);
	if (matched = curS.match(/\$\w+\$((\/?(\w| )+\/?)|,)+/i)) {
		return matched[0];
	} else {
		this.errMsg("Invalid category", curS);
	}
}

// <comment> = "//" 1*(VCHAR / WSP)
GiftParser.prototype.comment = function (input) {
	this.expect("//", input)
	var curS = this.next(input);
	if (matched = curS.match(/^(\w| |\:|\.|\(|\)|\'|\"|\,|\-|\/)+$/i)) {
		return matched[0];
	} else {
		this.errMsg("Invalid comment", curS);
	}
}

//<choice> = "~" 1*(VCHAR / WSP)
GiftParser.prototype.choice = function (input) {
	this.expect("~", input)
	var curS = this.next(input);
	if (matched = curS.match(/^(\w|\.|-|,|\u2014|\u2013|\u00a0|\\|\/|:|'|\?|’|´|‘|’|\(|\)| )+$/i)) {
		return matched[0];
	} else {
		this.errMsg("Invalid choice", curS);
	}
}

// <feedback> = "#"  1*(VCHAR / WSP)
GiftParser.prototype.feedback = function (input) {
	this.expect("#", input)
	var curS = this.next(input);
	if (matched = curS.match(/^(\w|\.|:|–|,|!|'| )+$/i)) {
		return matched[0];
	} else {
		this.errMsg("Invalid feedback", curS);
	}
}

// Parser operand

//Displays all the errors
GiftParser.prototype.errMsg = function (msg, input) {
	this.errorCount++;
	console.log("Parsing Error ! on " + input + " -- msg : " + msg);
}

// Read and return a symbol from input
GiftParser.prototype.next = function (input) {
	var curS = input.shift();
	return curS
}

// check : check whether the arg elt is on the head of the list
GiftParser.prototype.check = function (s, input) {
	if (input[0] === s) {
		return true;
	}
	return false;
}

// expect : expect the next symbol to be s.
GiftParser.prototype.expect = function (s, input) {
	if (s == this.next(input)) {
		return true;
	} else {
		this.errMsg("symbol " + s + " doesn't match", input);
	}
	return false;
}

module.exports = GiftParser;