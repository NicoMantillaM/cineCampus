const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const boletaSchema = new mongoose.Schema({
    fecha_adquisicion: String,
    id_usuario: ObjectId, 
    asientos: [ObjectId], 
    id_reserva: ObjectId,
    estado_compra_boleta: String,
    id_horario_funcion: ObjectId, 
    metodo_pago: String,
    precio_total: Number,
}, 
{
    versionKey: false
});

const Boleta = mongoose.model("Boleta", boletaSchema);

module.exports = Boleta;