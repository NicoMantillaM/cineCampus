const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    nickname: String,
    telefono: String,
    rol: String
}, 
{
    versionKey: false
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
