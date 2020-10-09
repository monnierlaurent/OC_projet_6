const express = require('express');
const bodyParser = require('body-parser'); //convertir  le corps des requêtes en objet JSON
const mongoose = require('mongoose'); //package pour les interactions avec BDD
const helmet = require('helmet');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');



// connection a la BDD mongoDB ATLAS
mongoose.connect('mongodb+srv://admin0:moi@cluster0.qqzlu.mongodb.net/SoPekocko?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet());
//définit l'en-tête Content-Security-Policy qui permet atténuer les attaques de script intersite.
//définit l'en-tête Expect-CT qui permet d'atténuer les certificats SSL mal émis.
//définit l'en-tête Referrer-Policy qui contrôle les informations définies dans l'en-tête Referer.
//définit l'en-tête Strict-Transport-Security qui indique aux navigateurs de préférer HTTPS à HTTP non sécurisé.
//définit l'en-tête X-Content-Type-Options sur nosniff.Cela atténue le reniflement de type MIME qui peut entraîner des failles de sécurité.
//définit l'en-tête X-DNS-Prefetch-Control pour aider à contrôler la prélecture DNS, ce qui peut améliorer la confidentialité des utilisateurs.
//xssFilter désactive le filtre de script intersite bogué des navigateurs en définissant l'en-tête X-XSS-Protection sur 0

// middleware qui sera appliqué toutes les routes et pour tous les requêtes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // pour que tous le monde puisse utiliser l'api
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //autorisation pour utiliser certaine entetes sur les req
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // autorise les methodes GET, POST, PUT, DELETE, PATCH, OPTIONS
    next();
});

// sert a convertir  le corps des requêtes en objet JSON
app.use(bodyParser.json());

//middelware pour donné la base des routes pour l'enregistrement et autentification des utilisateurs
app.use('/api/auth', userRoutes);

//middelware pour donné la base des routes les manipulation sur les sauces
app.use('/api/sauces', sauceRoutes);

//middelware pour la gestion des fichiers images des sauces
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('*', (req, res) => {
    res.status(400).json({ error: 'La syntaxe de la requête est erronée' });
});


module.exports = app;