const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
    id_usuario: ObjectId,
    asientos: [ObjectId],
    id_horario_funcion: ObjectId,
    estado: String,
    fecha: String
}, 
{
    versionKey: false
});

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = Reserva;
