const multer = require('multer');

const MIME_TYPES = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {

        const name = file.originalname.split(' ').join('_');
        const extention = MIME_TYPES[file.mimetype];

        callback(null, name.split(extention).join('') + Date.now() + extention);
    }
});

module.exports = multer({ storage: storage }).single('image');