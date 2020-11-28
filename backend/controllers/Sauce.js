const fs = require('fs');
const sanitize = require('mongo-sanitize');

const Sauce = require('../models/sauce');

// enregistrement d'une sauce
exports.createSauce = (req, res, next) => {

    // vérification que la requête n'est pas vide
    if (req.body.sauce === undefined) {
        return res.status(400).json({ error: 'La syntaxe de la requête est erronée !' });
    };
    if (!req.file) {
        return res.status(400).json({ error: 'La syntaxe de la requête est erronée !' });
    }
    //
    const sauceClean = sanitize(req.body.sauce);
    // convertion du corp de la requête et stockage du JSON dans la constante
    const sauceObject = JSON.parse(sauceClean);

    //suppression de l'_id de la sauce. un nouvel id sera creé par mongoDB
    delete sauceObject._id;

    //céation de l'objet sauce comprenant le corp de la requete et le lien vers le fichier
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    });

    // methode save() pour enregistrement dans la BDD
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(() => {
            const filename = sauce.imageUrl.split("/images")[1];
            fs.unlink(`images/${filename}`, () => { res.status(400).json({ error: 'La syntaxe de la requête est erronée' }) });
        });
};

// récupération de toute les sauces 
exports.displaySauce = (req, res, next) => {
    // methode find() pour récupération de toute les sauces  présente dans la BDD
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(() => res.status(404).json({ error: 'Sauces non trouvées' }));
};

// récupération d'une saul  sauce par son _ID 
exports.displayIdSauce = (req, res, next) => {
    const id = sanitize(req.params.id);
    if (!id) {
        res.status(404).json({ error: 'Cette sauce n\'existe pas !' });
    };

    // methode findOne() our récupération d'une seul sauce dans la BDD par son id
    Sauce.findOne({ _id: id })
        .then(sauces => res.status(200).json(sauces))
        .catch(() => res.status(404).json({ error: 'cette sauce n\'existe pas !' }));
};



exports.updateSauce = (req, res, next) => {
    //console.log(req.valideFalse);
    // methode findOne() pour récupérer dans la BDD la sauce par son id
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            // verification que sa soit bien l'utilisateur qui a creer la sauce
            if (sauce.userId === req.userIdAuth) {

                //verification de la presence d'un fichier dans la requête
                const sauceObject = req.file ? {...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : {...req.body };

                //si un fichier et présent 
                if (req.file) {

                    // methode findOne() pour récupérer dans la BDD la sauce par son id
                    Sauce.findOne({ _id: req.params.id })
                        .then(sauce => {

                            // recuperation de l'anciens fichiers rattaché a la sauce 
                            const filename = sauce.imageUrl.split('/images/')[1];

                            //suppression de l'ancien fichier de la sauce avec le package fs et la function unlink
                            fs.unlink(`images/${filename}`, () => {

                                // methode updateOne() pour mettre a jour la sauce unique dans la BDD 
                                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                                    .then(() => {
                                        res.status(201).json({ message: 'Sauce mise à jour!' });
                                    })
                                    .catch(() => {
                                        res.status(400).json({ error: 'La syntaxe de la requête est erronée' });
                                    });
                            });
                        })
                        .catch(() => {

                            res.status(400).json({ error: 'La syntaxe de la requête est erronée' })
                        });
                } else {
                    // si pas de fichier present mise a jour uniquement avec le corp de la requête
                    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Sauce non modifiée !', });
                        })
                        .catch(() => {
                            res.status(400).json({ error: 'La syntaxe de la requête est erronée' })
                        });
                };
                // response si l'utilisateur qui n'est pas le créateur veu modifier la sauce
            } else {
                res.status(403).json({ error: 'Modification impossible ,vous n\'êtes pas son créateur !' });
            };
        }).catch(() => {
            res.status(400).json({ error: 'La syntaxe de la requête est erronée' })
        });
};
// envoie des likes et dislikes
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            // vérification que la requête n'est pas vide
            if (req.body.like === undefined, req.body.userId === undefined) {
                return res.status(400).json({ error: 'La syntaxe de la requête est erronée !' });
            };

            if (req.body.like === 1) {
                if (sauce.usersLiked.includes(req.body.userId), sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { likes: 0 }, { usersLiked: req.body.userId })
                        .then(() => res.status(201).json({ message: 'Vous avez déjà disliké !' }))
                        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
                } else if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { likes: 1 }, { usersLiked: req.body.userId })
                        .then(() => res.status(201).json({ message: 'Vous avez déjà liké !' }))
                        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $addToSet: { usersLiked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'like enregistré !' }))
                        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
                };
            };

            if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(req.body.userId), sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { dislikes: 0 }, { usersDisliked: req.body.userId })
                        .then(() => res.status(201).json({ message: 'Vous avez déjà liké !' }))
                        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { dislikes: 1 }, { usersDisliked: req.body.userId })
                        .then(() => res.status(201).json({ message: 'Vous avez déjà disliké !' }))
                        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $addToSet: { usersDisliked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'Dislike enregistré !' }))
                        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
                };
            };

            if (req.body.like === 0) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like - 1 }, $pull: { usersLiked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'Like supprimé !' }))
                        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
                };
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: req.body.like - 1 }, $pull: { usersDisliked: req.body.userId } })
                        .then(() => res.status(201).json({ message: 'Dislike supprimé !' }))
                        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
                };
            };
        })
        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
};


exports.deleteSauce = (req, res, next) => {
    const id = sanitize(req.params.id);
    // methode findOne() pour récupérer une sauce dans la BDD 
    Sauce.findOne({ _id: id })
        .then(sauce => {

            if (sauce.userId === req.userIdAuth) {
                console.log(sauce.userId);
                // recuperation du  fichiers rattaché a la sauce 
                const filename = sauce.imageUrl.split('/images/')[1];
                //suppression du fichier de la sauce avec le package fs et la function unlink
                fs.unlink(`images/${filename}`, () => {

                    // methode deleteOne() pour supprimer une sauce dans la BDD
                    Sauce.deleteOne({ _id: id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch(() => res.status(400).json({ error: 'La syntaxe de la requête est erronée' }));
                });
                // response si l'utilisateur qui n'est pas le créateur veux supprimer la sauce
            } else {
                res.status(403).json({ error: 'suppression impossible ,vous n\'êtes pas son créateur !' });
            };
        })
        .catch(() => {
            res.status(500).json({ error: 'Erreur interne du serveur !' });
        });
};