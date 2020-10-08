const schema = require('../models/schemaValidion');
const fs = require('fs');

module.exports = async(req, res, next) => {

    try {
        // verification si un fichier et present dans la requête/ si oui convertion de la key :valeur en JSON
        const reqResult = req.file ? JSON.parse(req.body.sauce) : req.body;
        //console.log(req.file);

        //console.log(req.file);
        // controle de chaque données du corps de la requête
        const valuename = await schema.validateAsync({ name: reqResult.name });

        const valuemanufacturer = await schema.validateAsync({ manufacturer: reqResult.manufacturer });
        const valueDescription = await schema.validateAsync({ description: reqResult.description });
        const valueMainPepper = await schema.validateAsync({ mainPepper: reqResult.mainPepper });
        const valueHeat = await schema.validateAsync({ heat: reqResult.heat });

        // si erreur de données
        if (valuename.error, valuemanufacturer.error, valueDescription.error, valueMainPepper.error, valueHeat.error) {

            res.status(400).json({ error: 'La syntaxe de la requête est erronée' });

        } else {
            // si données sont conforme au schema on passe au middelware suivant
            next();
        };
    } catch {
        //suppression du fichier image si erreur de modification
        if (req.file) {
            const file = req.file.path;
            fs.unlink(`${file}`, () => { res.status(404).json({ error: 'les champs ne sont pas conformes!' }); });
        } else {
            res.status(404).json({ error: 'les champs ne sont pas conformes!' });
        };


    };
};