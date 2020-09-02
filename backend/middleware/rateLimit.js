const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 5 //limiter chaque IP à 5 requêtes 
});

module.exports = apiLimiter;