const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const peliculaSchema = new mongoose.Schema({
    titulo: String,
    genero: String,
    duracion: Number,
    sinopsis: String,
    estado: String,
    poster: String
}, 
{
    versionKey: false
});

const Pelicula = mongoose.model("Pelicula", peliculaSchema);

module.exports = Pelicula;
