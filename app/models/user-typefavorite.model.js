const mongoose = require("mongoose");

const UserTypeFavoSchema = mongoose.Schema({
    iduser: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    idtype: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'TypeFilm'
    }
});

module.exports = mongoose.model("TypeFavorite", UserTypeFavoSchema);