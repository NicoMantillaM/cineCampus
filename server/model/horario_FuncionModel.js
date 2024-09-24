const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const horarioFuncionSchema = new mongoose.Schema({
    id_sala: ObjectId,
    fecha_proyeccion: String,
    hora_fin: String,
    hora_inicio: String,
    id_pelicula: ObjectId
}, 
{
    versionKey: false
});

const HorarioFuncion = mongoose.model("HorarioFuncion", horarioFuncionSchema);

module.exports = HorarioFuncion;