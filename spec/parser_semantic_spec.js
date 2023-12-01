const POI = require('../POI');

describe("Program Semantic testing of POI", function(){
	
	beforeAll(function() {

		this.p = new POI("Café d'Albert", 48.857735, 2.394987, [1,3,2]);

	});
	
	it("can create a new POI", function(){
		
		expect(this.p).toBeDefined();
		// toBe is === on simple values
		expect(this.p.name).toBe("Café d'Albert");
		expect(this.p).toEqual(jasmine.objectContaining({name: "Café d'Albert"}));
		
	});
	
	it("can add a new ranking", function(){
		
		this.p.addRating(2);
		// toEqual is === on complex values - deepEquality
		expect(this.p.ratings).toEqual([1,3,2,2]);
		
	});

	
});



describe("Ajoutez un cas de test pour contrôler le comportement de la méthode averageRatings() du type POI", function(){
	
	beforeAll(function() {
		this.p = new POI("Café d'Albert", 48.857735, 2.394987, [1, 3, 2]);
	});
	
	it("can create a new POI", function(){
		expect(this.p).toBeDefined();
		// Utilisez toBeCloseTo pour les comparaisons de nombres à virgule flottante
		expect(this.p.averageRatings()).toBeCloseTo(2); // La moyenne de [1, 3, 2] est 2.
		expect(this.p.ratings).toEqual([1, 3, 2]);
	});
	
	it("can add a new ranking", function(){
		this.p.addRating(2);
		expect(this.p.ratings).toEqual([1, 3, 2, 2]);
	});
});
