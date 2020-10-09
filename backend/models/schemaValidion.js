const joi = require('joi');


const schema = joi.object({
    name: joi.string().min(3).max(20),
    manufacturer: joi.string().min(3).max(20),
    description: joi.string().min(3).max(300),
    mainPepper: joi.string().min(3).max(200),
    heat: joi.number().integer().min(1),
    userId: joi.string()
});


module.exports = schema;