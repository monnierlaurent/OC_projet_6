const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mask = require('mask-email-phone'); //package de masquage utlisé pour l'email
const crypto = require('crypto'); // package de chiffrement utlisé pour l'email
const passwordValidator = require("password-validator"); // package de vérification du mot de pass
const emailValidator = require("email-validator"); // package de vérification de du format de l'email

const User = require('../models/user');


// enregistrer d'un utilisateur
exports.createUser = (req, res, next) => {

    // vérification que la requête n'est pas vide
    if (req.body.email === undefined, req.body.password === undefined) {
        return res.status(400).json({ error: 'La syntaxe de la requête est erronée !' });
    };
    //verification du forma de l'email
    if (!emailValidator.validate(req.body.email)) {
        return res.status(400).json({ error: 'L\'email ou le mot de passe est invalide !!!' });
    };
    //schema de controle du password
    const schema = new passwordValidator();

    schema
        .is().min(4)
        .is().max(8)
        .has().uppercase(1)
        .has().lowercase()
        .has().digits(1)
        .has().not().spaces()

    //controle de la conformitée du mot de passe avec le schema
    if (schema.validate(req.body.password)) {

        // chiffrage email 

        const hashEmail = crypto.createHmac('sha256', 'abcdefg')
            .update(req.body.email)
            .digest('hex');

        // masquage email dans emailMask:
        const input = req.body.email;
        const emailMask = mask(input);

        // hasher le password avec bcrypt
        bcrypt.hash(req.body.password, 10)
            .then(hash => {

                const user = new User({
                    emailMask: emailMask,
                    email: hashEmail,
                    password: hash
                });

                user.save()
                    .then(() => {
                        res.status(201).json({ message: 'utilisateur enregistré !!' });
                    }).catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
            })
            .catch(() => res.status(500).json({ error: 'Erreur interne du serveur' }));
    } else {
        res.status(201).json({ message: 'Le mot de passe doit comporter entre 4 et 8 caratheres maximum ,1 majuscule , 1 chiffre' })
    };


};

// connection utilisateur
exports.loginUser = (req, res, next) => {

    // vérification que la requête n'est pas vide
    if (req.body.email === undefined, req.body.password === undefined) {
        return res.status(400).json({ error: 'La syntaxe de la requête est erronée !' });
    };

    //chiffrage de l'email de la requête pour conparaison avec l'email de la bdd
    const hashEmail2 = crypto.createHmac('sha256', 'abcdefg')
        .update(req.body.email)
        .digest('hex');


    User.findOne({ email: hashEmail2 })
        .then(user => {

            if (!User) {
                return res.status(401).json({ error: 'utilsateur non inscrit' });
            };
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'L\'email ou le mot de passe est invalide !!!' });
                    }
                    res.status(200).json({
                        userId: user._id,

                        token: jwt.sign({ userId: user._id },
                            'eyJhbGciOiJIUzI1NiIs@InR5cCI6IkpXVCJ9.eyJz#dWIiOiIxMjM0NTY3ODkwIiw/ibmFtZSI6IkpvaG4g&RG9lIiwiYWRtaW4iOnRydWV9.TJVA95Or/M7E2cBab30RM@HrHDcEfxjoYZgeFONFh7HgQ', { expiresIn: '24h' },
                        )
                    });
                })
                .catch(error => res.status(400).json({ error }));
        })
        .catch(() => res.status(500).json({ error: 'L\'email ou le mot de passe est invalide !!!' }));
};