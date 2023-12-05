var VCardParser = function (sTokenize, sParsedSymb) {
    // The list of VCard parsed from the input file.
    this.parsedVCard = [];
    this.symb = ["BEGIN:VCARD", "VERSION:4.0","Name", "Fn", "Tel", "Email", "TEXT", "END:VCARD"];
    this.showTokenize = sTokenize;
    this.showParsedSymbols = sParsedSymb;
    this.errorCount = 0;
}

// Parser procedure

// tokenize: transform the data input into a list
// CRLF
VCardParser.prototype.tokenize = function (data) {
    var separator = /(\r\n|:)/;
    data = data.split(separator);
    data = data.filter((val, idx) => !val.match(separator));
    return data;
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
    if (this.showTokenize) {
        console.log(tData);
    }
    this.vCard(tData);
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
        this.ligne(input);
        this.expect("END:VCARD", input);
        if (input.length > 0) {
            this.vCard(input);
        }
        return true;
    } else {
        return false;
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
    this.parsedVCards.push(vcard);
}


// <name> = 'N:' <TEXT> <eol>
VCardParser.prototype.name = function (input) {
    this.expect("N:", input);
    var curS = this.next(input);
    if(matched = curS.match(/[\wàéèêîù'\s]+/i)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
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
	}
}

// <tel> = 'TEL;tel:' <10DIGIT> <eol>
VCardParser.prototype.tel = function (input) {
    this.expect("TEL;tel:", input);
    var curS = this.next(input);
    if(matched = curS.match(/\d/)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
	}
}
// <email> = 'EMAIL:' <1*ALPHA> '@' <1*CHAR> '.' <1*CHAR> <eol>
VCardParser.prototype.email = function (input) {
    this.expect("EMAIL:", input);
    var curS = this.next(input);
    if(matched = curS.match(/([A-Za-z]+)@([A-Za-z]+)\.([A-Za-z]+)/)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
	}
}

module.exports = VCardParser;


