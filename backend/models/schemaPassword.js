const passwordValidator = require("password-validator");

const schema = new passwordValidator();

schema
    .is().min(4)
    .is().max(8)
    .has().uppercase(1)
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces()

module.exports = schema;