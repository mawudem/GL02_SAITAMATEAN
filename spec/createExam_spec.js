const GiftParser = require('../parsers/giftParser')
//const Utilisateur = require('../Utilisateur')
const Examen = require('../services/examService')

describe("Test création examen & connection utilisateur", function () {

    beforeAll(function () {
        this.analyzer = new GiftParser();
        this.examen = new Examen("sonPetitNom");
        //this.utilisateur = new Utilisateur("lePetitCobaye", "topsecret", "g");
        //this.utilisateurConnecte = new Utilisateur();
    });

    it("Test de la création d'un examen", function () {

        this.examen.createExam("sonPetitNom");
        expect(this.examen.name).toBe("sonPetitNom");

    });
});

