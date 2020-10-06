const fs = require('fs');
const Sauce = require('../models/sauce');


exports.createSauce = (req, res, next) => {



    const sauceObject = JSON.parse(req.body.sauce);

    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    });


    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(() => {
            const filename = sauce.imageUrl.split("/images")[1];
            fs.unlink(`images/${filename}`, () => { res.status(400).json({ error: 'code erreur 400' }) });
        });

};


exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            if (req.body.like === undefined, req.body.userId === undefined) {
                return res.status(400).json({ error: 'Le corps de la requête et vide !' });
            };

            if (req.body.like === 1) {
                if (sauce.usersLiked.includes(req.body.userId), sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { likes: 0 }, { usersLiked: req.body.userId })
                        .then(() => res.status(201).json({ message: 'Vous avez déja liker !' }))
                        .catch(() => res.status(400).json({ error: 'Code erreur 400' }));
                } else if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { likes: 1 }, { usersLiked: req.body.userId })
                        .then(() => res.status(201).json({ message: 'Vous avez déja liker !' }))
                        .catch(() => res.status(400).json({ error: 'Code erreur 400' }));
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $addToSet: { usersLiked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'like enregistré !' }))
                        .catch(() => res.status(400).json({ error: 'code erreur 400' }));
                }; //fin de else //fin de if 2
            }; //fin de if 3

            if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(req.body.userId), sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { dislikes: 0 }, { usersDisliked: req.body.userId })
                        .then(() => res.status(201).json({ message: 'Vous avez d2ja liker !' }))
                        .catch(() => res.status(400).json({ error: 'Code erreur 400' }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { dislikes: 1 }, { usersDisliked: req.body.userId })
                        .then(() => res.status(201).json({ message: 'Vous avez déja liker !' }))
                        .catch(() => res.status(400).json({ error: 'code erreur 400' }));
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $addToSet: { usersDisliked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'like enregistré !' }))
                        .catch(() => res.status(400).json({ error: 'code erreur 400' }));
                }; //fin de else //fin de if 2
            }; //fin de if 3

            if (req.body.like === 0) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like - 1 }, $pull: { usersLiked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'like enregistré !' }))
                        .catch(() => res.status(400).json({ error: 'code erreur 400' }));
                };
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: req.body.like - 1 }, $pull: { usersDisliked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'like enregistré !' }))
                        .catch(() => res.status(400).json({ error: 'code erreur 400' }));
                };
            };
        })
        .catch(() => res.status(404).json({ error: 'code erreur 400' }));
};



exports.updateSauce = (req, res, next) => {


    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            if (sauce.userId === req.userIdAuth) {
                const sauceObject = req.file ? {...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : {...req.body };

                if (req.file) {
                    Sauce.findOne({ _id: req.params.id })
                        .then(sauce => {
                            const filename = sauce.imageUrl.split('/images/')[1];
                            fs.unlink(`images/${filename}`, () => {
                                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                                    .then(() => { res.status(201).json({ message: 'Sauce mise à jour!' }); })
                                    .catch(() => {
                                        const filename = sauce.imageUrl.split('/images/')[1];
                                        fs.unlink(`images/${filename}`), res.status(400).json({ error: 'code erreur 400' });
                                    });
                            });
                        })
                        .catch(() => { res.status(400).json({ error: 'code erreur 400' }) });
                } else {
                    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
                        .catch(() => { return res.status(400).json({ error: 'code erreur 400 , la sauce n\'est pas modifiée' }) });
                };



            } else {
                res.status(403).json({ error: 'code erreur 403' });
            };
        }).catch(() => { return res.status(400).json({ error: 'code erreur 400 , la sauce n\'est pas modifiée' }) });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            if (sauce.userId === req.userIdAuth) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
                        .catch(() => res.status(400).json({ error: 'code erreur 400' }));
                });
            } else {
                res.status(403).json({ error: 'code erreur 403' });
            };
        })
        .catch(() => {
            res.status(500).json({ error: 'suppression impossible ,vous n\'êtes pas sont créateur' });
        });
};


exports.displaySauce = (req, res, next) => {

    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(() => res.status(404).json({ error: 'code erreur 404' }));
};

exports.displayIdSauce = (req, res, next) => {
    if (!req.params.id) {
        res.status(404).json({ error: 'Id de la sauce et invalide' });
    };
    Sauce.findOne({ _id: req.params.id })

    .then(sauces => res.status(200).json(sauces))
        .catch(() => res.status(404).json({ error: 'code erreur 404' }));
};