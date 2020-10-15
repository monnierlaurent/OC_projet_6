const passwordValidator = require("password-validator");

const schema = new passwordValidator();

schema
    .is().min(4)
    .has().uppercase(1)
    .has().lowercase()
    .has().digits(1)


module.exports = schema;