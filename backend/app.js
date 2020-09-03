const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");

const userRoutes = require('./routes/user');

const sauceRoutes = require('./routes/sauce');

const apiLimiter = require('./middleware/rateLimit');

mongoose.connect('mongodb+srv://leane140304:leane140304@cluster0.qqzlu.mongodb.net/leane140304?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet.contentSecurityPolicy()); // permet d'atténuer les attaques de scripts intersites
app.use(helmet.dnsPrefetchControl()); // permet d'atténuer les certificats SSL mal émis
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts()); //indique aux navigateurs de préférer HTTPS à HTTP non sécurisé
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff()); // Cela atténue le reniflement de type MIME qui peut entraîner des failles de sécurité
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());


app.use('/api/auth', apiLimiter, userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);


module.exports = app;