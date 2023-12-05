function createVCard() {
    // Données de la VCard
    var nom = "Doe;John;;;";
    var nomComplet = "John Doe";
    var telephone = "1234567890";
    var email = "john.doe@example.com";

    // Création du contenu VCard
    var vCardContent = `BEGIN:VCARD\r\n`;
    vCardContent += `VERSION:4.0\r\n`;
    vCardContent += `N:${nom}\r\n`;
    vCardContent += `FN:${nomComplet}\r\n`;
    vCardContent += `TEL;tel:${telephone}\r\n`;
    vCardContent += `EMAIL:${email}\r\n`;
    vCardContent += `END:VCARD\r\n`;

    // Création d'un Blob avec le contenu VCard
    var blob = new Blob([vCardContent], { type: 'text/vcard' });

    // Création d'un lien pour télécharger le fichier
    var downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "contact.vcf";

    // Ajout du lien au document et déclenchement du téléchargement
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Nettoyage: suppression du lien du document
    document.body.removeChild(downloadLink);
}

// Appeler la fonction pour créer et télécharger la VCard
createVCard();
