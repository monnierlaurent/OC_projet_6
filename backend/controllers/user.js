const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.createUser = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save().then(() => {
                res.status(201).json({ message: 'utilisateur enregistré !!' })
            }).catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.loginUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
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
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' },
                        )
                    });
                })
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};