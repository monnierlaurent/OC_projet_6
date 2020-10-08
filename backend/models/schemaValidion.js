const joi = require('joi');


const schema = joi.object({
    name: joi.string().pattern(/^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\' .-]{3,20} *$/),
    manufacturer: joi.string(),
    description: joi.string(),
    mainPepper: joi.string(),
    heat: joi.number(),
    userId: joi.string()
});


module.exports = schema;