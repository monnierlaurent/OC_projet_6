const schema = require('../models/schemaValidion');

module.exports = {

    SauceValidation: async(req, res, next) => {
        const value = await schema.validate(req.body);
        if (value.error) {
            res.json({ error: value.error.details[0].message });
        } else {
            next();
        };
    }

};