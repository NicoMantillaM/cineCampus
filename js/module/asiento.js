
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

    async addAsiento(nuevoAsiento) {
        await this.open();
        try {
            const collectionSala = this.db.collection('sala');
            const collectionHorarioFuncion = this.db.collection('horario_funcion');
            this.collectionAsiento = this.db.collection('asiento');
            nuevoAsiento.id_sala = new ObjectId(nuevoAsiento.id_sala);
            nuevoAsiento.id_horario_funcion = new ObjectId(nuevoAsiento.id_horario_funcion);

            const sala = await collectionSala.findOne({ _id: nuevoAsiento.id_sala });
            if (!sala) {
                throw new Error('La sala especificada no existe.');
            }

            const horarioFuncion = await collectionHorarioFuncion.findOne({ _id: nuevoAsiento.id_horario_funcion });
            if (!horarioFuncion) {
                throw new Error('El horario de función especificado no existe.');
            }

            const funcion = await collectionHorarioFuncion.findOne({
                _id: nuevoAsiento.id_horario_funcion,
                id_sala: nuevoAsiento.id_sala
            });

            if (!funcion) {
                throw new Error('El id_sala no coincide con el id_horario_funcion.');
            }

            const asientoExistente = await this.collectionAsiento.findOne({
                id_sala: nuevoAsiento.id_sala,
                id_horario_funcion: nuevoAsiento.id_horario_funcion,
                lugar: nuevoAsiento.lugar
            });

            if (asientoExistente) {
                throw new Error('El asiento ya existe para esa función.');
            }
            const res = await this.collectionAsiento.insertOne(nuevoAsiento);
            if (!res.insertedId) {
                throw new Error('No se pudo agregar el asiento.');
            }

            await this.connection.close();
            return { message: "Asiento agregado con éxito" };

        } catch (error) {
            if (this.connection) {
                await this.connection.close();
            }
            console.error(error);
        }
    }
}