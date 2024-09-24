const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const tarjetaSchema = new mongoose.Schema({
    fecha_expedicion: String,
    estado: String,
    id_usuario: ObjectId
}, 
{
    versionKey: false
});

const Tarjeta = mongoose.model("Tarjeta", tarjetaSchema);

module.exports = Tarjeta;
