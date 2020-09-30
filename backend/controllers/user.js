const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mask = require('mask-email-phone');
const crypto = require('crypto');
const passwordValidator = require("password-validator");
const emailValidator = require("email-validator");

const User = require('../models/user');
const { userInfo } = require('os');



exports.createUser = (req, res, next) => {

    if (!emailValidator.validate(req.body.email)) {
        return res.status(400).json({ error: 'Format email invalide !!!' });
    };

    const schema = new passwordValidator();

    schema
        .is().min(4)
        .is().max(8)
        .has().uppercase(1)
        .has().lowercase()
        .has().digits(1)
        .has().not().spaces()


    if (schema.validate(req.body.password)) {
        const email = req.body.email;
        const password = req.body.password


        // chiffrage email dans email

        const hashEmail = crypto.createHmac('sha256', 'abcdefg')
            .update(req.body.email)
            .digest('hex');



        // masquage email dans emailMask:
        const input = req.body.email;
        const output = mask(input);

        bcrypt.hash(password, 10) // hasher le password avec bcrypt
            .then(hash => {
                const user = new User({
                    emailMask: output,
                    email: hashEmail,
                    password: hash
                });
                user.save()
                    .then(() => {
                        res.status(201).json({ message: 'utilisateur enregistré !!' });
                    }).catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        res.status(201).json({ message: 'Le mot de passe doit comporter entre 4 et 8 caratheres maximum ,1 majuscule , 1 chiffre' })
    };


};


exports.loginUser = (req, res, next) => {

    //const id = user._id;
    //console.log(id);
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
                        return res.status(401).json({ error: 'mot de passe incorrecte' });
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
        .catch(error => res.status(500).json({ error: 'Email invalide !' }));


};