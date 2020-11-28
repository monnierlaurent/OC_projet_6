const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mask = require('mask-email-phone'); //package de masquage utlisé pour l'email
const crypto = require('crypto'); // package de chiffrement utlisé pour l'email
const emailValidator = require("email-validator"); // package de vérification de du format de l'email

const schemaPassword = require('../models/schemaPassword');
const User = require('../models/user');


// middleware de création d'un utilisateur
exports.createUser = (req, res, next) => {

    // vérification que la requête n'est pas vide
    if (req.body.email === undefined, req.body.password === undefined) {
        return res.status(400).json({ error: 'La syntaxe de la requête est erronée !' });
    };
    //verification du format de l'email
    if (!emailValidator.validate(req.body.email)) {
        return res.status(400).json({ error: 'L\'email ou le mot de passe est invalide !!!' });
    };

    //controle de la conformitée du mot de passe OWASP limiter le piratage de session
    if (schemaPassword.validate(req.body.password)) {

        // chiffrage email , pour la protections des données(RGPD) et (OWASP Exposition de données sensibles)
        const hashEmail = crypto.createHmac('sha256', '@le&Petit%Chat#BoitDu&Laid%De#Poule&Tous%Les#Noel')
            .update(req.body.email)
            .digest('hex');

        // masquage email pour la protections des données(RGPD) et (OWASP Exposition de données sensibles)
        const input = req.body.email;
        const emailMask = mask(input);

        // hasher le password avec bcrypt et sa function HASH, pour la protections des données(RGPD) et (OWASP Exposition de données sensibles)
        bcrypt.hash(req.body.password, 10)
            .then(hash => {

                // creation d'un nouvel utilisateur avec le schema mongoose User
                const user = new User({
                    emailMask: emailMask,
                    email: hashEmail,
                    password: hash
                });

                // methode save() pour enregistrement dans la BDD
                user.save()
                    .then(() => {
                        res.status(201).json({ message: 'Utilisateur enregistré !' });
                    }).catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
            })
            .catch(() => res.status(500).json({ error: 'Erreur interne du serveur' }));
    } else {
        res.status(201).json({ message: 'Le mot de passe doit comporter 8 caratères maximum ,1 majuscule , 1 chiffre' });
    };
};



// middelware de authentification de l'utilisateur
exports.loginUser = (req, res, next) => {

    // vérification que la requête n'est pas vide
    if (req.body.email === undefined, req.body.password === undefined) {
        return res.status(400).json({ error: 'La syntaxe de la requête est erronée !' });
    };

    //chiffrage de l'email de la requête pour conparaison avec l'email de la bdd
    const hashEmail2 = crypto.createHmac('sha256', '@le&Petit%Chat#BoitDu&Laid%De#Poule&Tous%Les#Noel')
        .update(req.body.email)
        .digest('hex');

    // recuperation d'un seul user avec findOne()
    User.findOne({ email: hashEmail2 })
        .then(user => {

            //si l'utilisateur n'existe pas
            if (!user) {
                return res.status(401).json({ error: 'L\'email ou le mot de passe est invalide !' });
            };

            // comparaison password hasher de la bdd et le password hasher de la requête
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {

                    // si les deux hash sont different alors error
                    if (!valid) {
                        return res.status(401).json({ error: 'L\'email ou le mot de passe est invalide !' });
                    };

                    res.status(200).json({
                        // envoi d'une response avec le token d'authentification et (OWASP évite le piratage de session)
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            'eyJhbGciOiJIUzI1NiIs@InR5cCI6IkpXVCJ9.eyJz#dWIiOiIxMjM0NTY3ODkwIiw/ibmFtZSI6IkpvaG4g&RG9lIiwiYWRtaW4iOnRydWV9.TJVA95Or/M7E2cBab30RM@HrHDcEfxjoYZgeFONFh7HgQ', { expiresIn: '24h' },
                        )
                    });
                })
                .catch(() => res.status(500).json({ error: 'Erreur interne du serveur ' }));
        })
        .catch(() => res.status(401).json({ error: 'L\'email ou le mot de passe est invalide !' }));
};