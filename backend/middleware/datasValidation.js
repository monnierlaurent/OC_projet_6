const schema = require('../models/schemaValidion');

module.exports = async(req, res, next) => {
    try {
        const valuename = await schema.validateAsync({ name: req.body.name });
        const valuemanufacturer = await schema.validateAsync({ name: req.body.manufacturer });

        if (valuename.error, valuemanufacturer.error) {
            return res.json({ error: 'value.error.details[0].message' });
        } else {
            next();
        };
    } catch {
        res.status(400).json({
            message: 'tous est cramé !!!'
        })
    }
};