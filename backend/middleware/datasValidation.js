const schema = require('../models/schemaValidion');


module.exports = async(req, res, next) => {

    try {

        const reqResult = req.file ? JSON.parse(req.body.sauce) : req.body;

        const valuename = await schema.validateAsync({ name: reqResult.name });
        const valuemanufacturer = await schema.validateAsync({ manufacturer: reqResult.manufacturer });

        if (valuename.error, valuemanufacturer.error) {
            res.status(400).json({ error: 'La syntaxe de la requête est erronée' });

        } else {

            next();
        };
    } catch {

        res.status(404).json({ error: 'les champs ne sont pas conformes!' });
    };
};