const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 //limiter chaque IP à 5 requêtes 
});

module.exports = apiLimiter;