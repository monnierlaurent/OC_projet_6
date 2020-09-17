const mongoose = require('mongoose');


const sauceSchema = mongoose.Schema({

    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0, required: true },
    dislikes: { type: Number, default: 0, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true },
    userId: { type: String, required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);