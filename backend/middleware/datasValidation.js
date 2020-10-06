const schema = require('../models/schemaValidion');

module.exports = async(req, res, next) => {
    try {
        console.log(req.body);
        const reqResult = req.file ? JSON.parse(req.body.sauce) : req.body;

        const valuename = await schema.validateAsync({ name: reqResult.name });
        const valuemanufacturer = await schema.validateAsync({ name: reqResult.manufacturer });

        if (valuename.error, valuemanufacturer.error) {
            return res.json({ error: 'value.error.details[0].message' });
        } else {
            next();
        };
    } catch {
        res.status(404).json({
            message: 'les champs ne sont pas conformes !'
        })
    }
};