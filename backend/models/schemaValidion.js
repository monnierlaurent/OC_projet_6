const joi = require('joi');

const schema = joi.object({
    name: joi.string().min(3).max(20).required(),
    manufacturer: joi.string().min(3).max(200).required(),
    description: joi.string().min(3).max(150).required(),
    mainPepper: joi.string().min(3).max(200).required(),
});



module.exports = schema;