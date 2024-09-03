
const connect = require ('../../db/connect/connect')

const { ObjectId } = require('mongodb');

module.exports = class asiento extends connect{
    colletionAsiento
    constructor(){
        super()
    }

    async consultarDisponibilidadAsientos(id_sala, id_horario_funcion) {

        await this.open();
        try {
            const collectionHorarioFuncion = this.db.collection('horario_funcion'); 
            const collectionSala = this.db.collection('sala'); 

            // Verifica si el id_sala existe en la colección 'sala'
            const salaExiste = await collectionSala.findOne({ _id: new ObjectId(id_sala) });
            if (!salaExiste) {
                throw new Error('El id_sala proporcionado no existe.');
            }

            // Verifica si el id_horario_funcion existe en la colección 'horario_funcion'
            const horarioExiste = await collectionHorarioFuncion.findOne({ _id: new ObjectId(id_horario_funcion) });
            if (!horarioExiste) {
                throw new Error('El id_horario_funcion proporcionado no existe.');
            }

            // Verifica si el id_sala concuerda con el que está en horario_funcion
            const funcion = await collectionHorarioFuncion.findOne({
                _id: new ObjectId(id_horario_funcion),
                id_sala: new ObjectId(id_sala)
            });

            if (!funcion) {
                throw new Error('No hay ninguna función asignada a esa sala.');
            }

            const collectionAsiento = this.db.collection('asiento');

            const res = await collectionAsiento.find({
                id_sala: new ObjectId(id_sala),                
                id_horario_funcion: new ObjectId(id_horario_funcion), 
                disponibilidad: 'disponible'                   
            }).toArray();                                      

            this.connection.close();
            return res; 

        } catch (error) {
            console.log(error); 
        }
    }
}