const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const routeValidator = require('express-route-validator');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


//const apiLimiter = require('./middleware/rateLimit');

mongoose.connect('mongodb+srv://leane140304:leane140304@cluster0.qqzlu.mongodb.net/leane140304?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//app.use('/api/auth', apiLimiter, userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('*', (req, res) => {
    res.status(400).json({ error: 'code erreur 404' });
});


module.exports = app;