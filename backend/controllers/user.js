const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mask = require('mask-email-phone');
const crypto = require('crypto');

const User = require('../models/user');


const emailRegex = /^[a-zA-Z1-9-._]+?@{1}[a-zA-Z1-9.-_]+[.]{1}[a-zA-Z1-9]{2,10}$/;
const passewordRegex = /^[a-zA-Z0-9]{4,8}$/;

exports.createUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password

    if (!emailRegex.test(email)) {
        return res.status(400).json({ 'error': 'Format email invalide !!!' });
    }
    if (!passewordRegex.test(password)) {
        return res.status(400).json({ 'error': 'Format du mot de passe invalide !!!' });
    }

    // crypter email dans email:

    const hashEmail = crypto.createHmac('sha256', 'abcdefg')
        .update(req.body.email)
        .digest('hex');
    console.log(hashEmail);


    // masquer email dans emailMask:
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
                    res.status(201).json({ message: 'utilisateur enregistré !!' })
                }).catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.loginUser = (req, res, next) => {


    const hashEmail2 = crypto.createHmac('sha256', 'abcdefg')
        .update(req.body.email)
        .digest('hex');
    console.log(hashEmail2);

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
        .catch(error => res.status(500).json({ error }));
};