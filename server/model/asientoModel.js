const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const asientoSchema = new mongoose.Schema({
    id_sala: ObjectId, 
    lugar: String,
    tipo_lugar: String, 
    disponibilidad: String, 
    fila: String, 
    precio: Number, 
    id_horario_funcion: ObjectId
}, 
{
    versionKey: false
});

const Asiento = mongoose.model("Asiento", asientoSchema);

module.exports = Asiento;
