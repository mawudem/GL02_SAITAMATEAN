const fs = require('fs');
const { program } = require('commander');

function createVCard() {
    // Données de la VCard
    let nom = "Doe;John;;;";
    let nomComplet = "John Doe";
    let telephone = "1234567890";
    let email = "john.doe@example.com";

    // Création du contenu VCard
    let vCardContent = `BEGIN:VCARD\r\n`;
    vCardContent += `VERSION:4.0\r\n`;
    vCardContent += `N:${nom}\r\n`;
    vCardContent += `FN:${nomComplet}\r\n`;
    vCardContent += `TEL;tel:${telephone}\r\n`;
    vCardContent += `EMAIL:${email}\r\n`;
    vCardContent += `END:VCARD\r\n`;

    // Écriture du contenu VCard dans un fichier
    fs.writeFile('./contact.vcf', vCardContent, 'utf8', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('VCard créée avec succès!');
        }
    });
}

program
    .command('createvcard', 'Créer et télécharger une VCard')
    .action(({ args, options, logger }) => {
        createVCard();
    });

program.parse(process.argv);
