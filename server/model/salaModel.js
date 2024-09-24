const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const salaSchema = new mongoose.Schema({
    tipo_sala: String,
    nombre: String
}, 
{
    versionKey: false
});

const Sala = mongoose.model("Sala", salaSchema);

module.exports = Sala;
