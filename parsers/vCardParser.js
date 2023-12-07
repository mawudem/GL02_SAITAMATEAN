var VCardParser = function (sTokenize, sParsedSymb) {
    // The list of VCard parsed from the input file.
    this.parsedVCard = [];
    this.symb = ["BEGIN:VCARD", "VERSION:4.0","Name", "Fn", "Tel", "EMAIL", "END:VCARD"];
    this.showTokenize = sTokenize;
    this.showParsedSymbols = sParsedSymb;
    this.errorCount = 0;
}

// Parser procedure

// tokenize: transform the data input into a list
// CRLF
/*VCardParser.prototype.tokenize = function (data) {
    var separator = /(\r\n|:)/;
    data = data.split(separator);
    data = data.filter((val, idx) => !val.match(separator));
    return data;
}*/
// tokenize: transform the data input into a list
// CRLF
/*VCardParser.prototype.tokenize = function (data) {
    var separator = /\r\n|:/;
    data = data.split(separator);
    data = data.map(val => val.trim()).filter(val => val !== ''); // Trim and filter out empty lines
    return data;
}*/

// tokenize : tranform the data input into a list
VCardParser.prototype.tokenize = function (data) {
	var separator = /(::|{|}|=|~|#|MC|SA|\/\/|\n?\n|\$CATEGORY:|%)/g
	var bool = /(T|F|TRUE|FALSE)/g
	data = data.split(separator)
	data.forEach(element => {
		return element.split(bool)
	});
	return data
}
VCardParser.prototype.cleanData = function (data) {
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
// Read and return a symbol from input
VCardParser.prototype.next = function(input){
	var curS = input.shift();
	if(this.showParsedSymbols){
		console.log(curS);
	}
	return curS
}

// accept : verify if the arg s is part of the language symbols.
VCardParser.prototype.accept = function(s){
	var idx = this.symb.indexOf(s);
	// index 0 exists
	if(idx === -1){
		this.errMsg("symbol "+s+" unknown", [" "]);
		return false;
	}

	return idx;
}

// check : check whether the arg elt is on the head of the list
VCardParser.prototype.check = function(s, input){
	if(this.accept(input[0]) == this.accept(s)){
		return true;	
	}
	return false;
}

// expect : expect the next symbol to be s.
VCardParser.prototype.expect = function(s, input){
	if(s == this.next(input)){
		//console.log("Reckognized! "+s)
		return true;
	}else{
		this.errMsg("symbol "+s+" doesn't match", input);
	}
	return false;
}


// parse: analyze data by calling the first non-terminal rule of the grammar
VCardParser.prototype.parse = function (data) {
    var tData = this.tokenize(data);
    tData = this.cleanData(tData)
    console.log("tokenized data : " +tData);
    return tData;
}

// Parser operand

VCardParser.prototype.errMsg = function (msg, input) {
    this.errorCount++;
    console.log("Parsing Error! on " + input + " -- msg: " + msg);
}

// Parser rules
// <vCard> = "BEGIN:VCARD" <eol> "VERSION:4.0" <eol> *(<name> / <fn> / <tel> / <email>) "END:VCARD" <eol>
VCardParser.prototype.vCard = function (input) {
    if (this.check("BEGIN:VCARD", input)) {
        this.expect("BEGIN:VCARD", input);
        this.expect("VERSION:4.0", input);
        var ligne =this.ligne(input);
        this.expect("END:VCARD", input);
        var vCard =[]
        this.vCard.push("BEGIN:VCARD");
        this.vCard.push("BEGIN:VCARD");
        this.vCard.push("VERSION:4.0");
        this.vCard.push(ligne);
        this.vCard.push("END:VCARD");

        this.parsedVCard.push(vCard);

        return vCard;
    }
    
}

VCardParser.prototype.ligne = function (input) {
    var name = this.name(input)
    var fn = this.fn(input);
    var tel = this.tel(input);
    var email = this.email(input);
    vcard = {
        name : name,
        fn : fn,
        tel: tel,
        email : email
    }
    return vcard;
}


// <name> = 'N:' <TEXT> <eol>
VCardParser.prototype.name = function (input) {
    this.expect("N:", input);
    var curS = this.next(input);
    if(matched = curS.match(/[\wàéèêîù'\s]+/i)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
        return ''; // Return an empty string in case of an error
	}
}


// <fn> = 'FN:' <TEXT> <eol>
VCardParser.prototype.fn = function (input) {
    this.expect("FN:", input);
    var curS = this.next(input);
    if(matched = curS.match(/[\wàéèêîù'\s]+/i)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
        return ''; // Return an empty string in case of an error
	}
}


// <tel> = 'TEL;tel:' <10DIGIT> <eol>
VCardParser.prototype.tel = function (input) {
    this.expect("TEL;tel:", input);
    var curS = this.next(input);
    if (curS && (matched = curS.match(/\d{10}/))) {
        return matched[0];
    } else {
        this.errMsg("Invalid telephone number", input);
    }
}

// <email> = 'EMAIL:' <1*ALPHA> '@' <1*CHAR> '.' <1*CHAR> <eol>
VCardParser.prototype.email = function (input) {
    this.expect("EMAIL:", input);
    var curS = this.next(input);
    if (curS && (matched = curS.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/))) {
        return matched[0];
    } else {
        this.errMsg("Invalid email address", input);
    }
}

module.exports = VCardParser;


