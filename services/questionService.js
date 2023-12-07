//différents requires
const fs = require('fs');

//déclaration de la variable Question et de ses attributs
var Question = function (id, type, category, comment, enonce, answers, answersWeight, choices, feedback) {
	this.id = id
	this.type = type
	this.category = category
	this.comment = comment
	this.enonce = [].concat(enonce)
	this.choices = [].concat(choices)
	this.answers = [].concat(answers)
	this.answersWeight = [].concat(answersWeight)
	this.feedback = [].concat(feedback)
}

// retourne une chaîne de caractères contenant un énoncé
Question.prototype.returnEnonce = function () {
	var textEnonce = '\nEnoncé :\n\n'
	this.enonce.forEach(element => {
		textEnonce = textEnonce.concat(element)
	})
	textEnonce = textEnonce.concat('\n\n')
	return textEnonce
}

// retourne une chaîne de caractères contenant un énoncé attendant des réponses
Question.prototype.returnEnonceQuestion = function () {
	var textEnonce = '\nEnoncé :\n'
	this.enonce.forEach(element => {
		textEnonce = textEnonce.concat(element + ' ')
	})
	textEnonce = textEnonce.slice(0, -1)
	textEnonce = textEnonce.concat('\n')
	return textEnonce
}

// retourne la liste des choix possibles pour une question avec la réponse placée à un endroit aléatoire dedans
Question.prototype.returnChoices = function (i) {
	var choices = '--> Choix : '
	let rand = Math.floor(Math.random() * this.choices[i].length)
	let j = 0
	this.choices[i].forEach(element => {
		choices = choices.concat(element + ' - ')
		if (this.answers[i].length !== 0 && j === rand)
			choices = choices.concat(this.answers[i]+ ' - ')
		j++
	})
	choices = choices.slice(0,-3)
	choices = choices.concat('\n')
	return choices
}

// retourne la liste des réponses acceptées pour une question
Question.prototype.returnAnswers = function (i) {
	var answers = 'Réponse(s) attendue(s) : '
	this.answers[i].forEach(element => {
		answers = answers.concat(element + ' - ')
	})
	answers = answers.slice(0, -3)
	answers = answers.concat('\n')
	return answers
}

// retourne la liste des réponses avec leur poids
Question.prototype.returnAnswersWithWeight = function (i) {
	var answers = 'Réponse(s) attendue(s) : \n'
	let j = 0
	this.choices[i].forEach(element => {
		answers = answers.concat('-> '+this.answersWeight[i][j]/100+' : '+ element + '\n')
		j++
	})
	answers = answers.concat('\n')
	return answers
}

// découpe une question match de façon à séparer les termes à gauche et les termes à droite des flèches
Question.prototype.splitMatch = function () {
	let matchQuestion = []
	this.answers[0].forEach(element => { matchQuestion.push(element.split('->')) })
	matchQuestion.forEach(element => {
		element[0] = element[0].trim()
		element[1] = element[1].trim()
	})
	return matchQuestion
}

// retourne une chaîne de caractère avec d'abord une liste des mots à gauche puis une liste dans un ordre aléatoire des mots de droite.
Question.prototype.returnRandomMatch = function (matchQuestion) {
	let list1 = []
	let list2 = []
	matchQuestion.forEach(element => {
		list1.push(element[0])
		list2.push(element[1])
	})
	//générer un string avec tous les mots à match dans un ordre random
	let str1 = 'Liste 1 : '
	let str2 = 'Liste 2 : '
	while (list1.length > 0) {
		let rand = Math.floor(Math.random() * list2.length)
		str1 = str1.concat(list1.shift() + ' - ')
		str2 = str2.concat(list2[rand] + ' - ')
		list2.splice(rand, 1)
	}
	str1 = str1.slice(0, -3)
	str1 = str1.concat('\n')
	str2 = str2.slice(0, -3)
	return str1+'\n'+str2+'\n'
}

module.exports = Question;