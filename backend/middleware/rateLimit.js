const rateLimit = require("express-rate-limit");

// OWASP limter le piratage de session
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 //limiter chaque IP à 5 requêtes 
});

module.exports = apiLimiter;