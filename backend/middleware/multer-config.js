const { diskStorage } = require('multer');
const multer = require('multer'); // package de gestion de fichiers

const MIME_TYPES = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg'
};
// objet de configuration pour multer

//function diskStorage de multer sert a enregister sur le disque
const storage = multer.diskStorage({
    // explique a multer dans quel dossier enregister les fichiers
    destination: (req, file, callback) => {

        // arguments NULL pour specifier qu'il n'y a pas eu d'erreur puis le mon du dossier d'enregistrement
        callback(null, 'images');
    },

    //donner le nom du fichier a utiliser pour l'enregistrement
    filename: (req, file, callback) => {
        // creation du nouveau nom du fichier

        //recuperation du nom original du fichier avec "originalname" avec élimination des espaces et remplacement par des _
        const name = file.originalname.split(' ').join('_');

        // creation de l'extention du nouveau fichier
        const extention = MIME_TYPES[file.mimetype];

        // creation du nouveau nom de fichier avec nom ,date et heure + extention
        callback(null, name.split(extention).join('') + Date.now() + extention);
    }
});

module.exports = multer({ storage: storage }).single('image');