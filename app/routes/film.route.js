module.exports = app => {
    const film = require("../controllers/film.controller");

    app.get("/film", film.read);
    app.post("/film", film.create);
};