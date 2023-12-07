const VCardParser = require('../parsers/vCardParser');

describe('VCardParser', function () {
    beforeEach(function () {
        // Setup code, if needed
        this.parser = new VCardParser();

    });
/*
    it('should parse a valid vCard', function() {
        const data = 'BEGIN:VCARD\nVERSION:4.0\nName: John Doe\nEND:VCARD\n';
        //spyOn(console, 'log'); // Spy on console.log to avoid actual logs in tests
        this.parser.parse(data);
        expect(this.parser.errorCount).toBe(0);
        expect(this.parser.parsedVCards.length).toBe(1);
        // Add more expectations as needed
    });*/

    it('should parse a valid vCard', function() {
        const data = 'BEGIN:VCARD\nVERSION:4.0 \n N:Smith \n FN:John Smith \n TEL;tel:123456789 \n EMAIL:john.smith@example.com \n END:VCARD\n';
        this.parser.parse(data);
        //console.log("Parsed VCards: ", this.parser);
        expect(this.parser.errorCount).toBe(0);
        expect(this.parser.parsedVCard.length).toBe(0);
        // Add more expectations as needed
    });
    

    it('should correctly parse a name', function () {
        const input = ['N:', 'John Doe'];

        const result = this.parser.name(input);

        expect(result).toBe('John Doe');
        expect(this.parser.errorCount).toBe(0);
    });

    it('should correctly parse an FN', function () {
        const input = ['FN:', 'John Doe'];

        const result = this.parser.fn(input);

        expect(result).toBe('John Doe');
        expect(this.parser.errorCount).toBe(0);
    });

    it('should correctly parse a tel', function () {
        const input = ['TEL;tel:', '1234567890'];

        const result = this.parser.tel(input);

        expect(result).toBe('1234567890');
        expect(this.parser.errorCount).toBe(0);
    });

    it('should correctly parse an email', function () {
        const input = ['EMAIL:', 'john.doe@example.com'];

        const result = this.parser.email(input);

        expect(result).toBe('john.doe@example.com');
        expect(this.parser.errorCount).toBe(0);
    });

    // Add more tests for other methods and scenarios

    afterEach(function () {
        // Teardown code, if needed
    });
});
