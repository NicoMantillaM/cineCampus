const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

// * Clase para gestionar la colección 'sala' en la base de datos
module.exports = class sala extends connect {
    collectionSala;

    // * Constructor de la clase
    constructor() {
        super(); // Llama al constructor de la clase base 'connect'
    }

    // * Método para agregar una nueva sala a la colección 'sala'
    //  Este método inserta un nuevo documento en la colección
    //  Mejorar la validación de los datos antes de la inserción
    async agregarSala(salaData) {
        await this.open(); // Abre la conexión a la base de datos

        try {
            this.collectionSala = this.db.collection('sala'); //  Asigna la colección 'sala' a la variable

            // * Inserta un nuevo documento en la colección 'sala'
            const res = await this.collectionSala.insertOne(salaData);

            this.connection.close(); //  Cierra la conexión a la base de datos

            // * Devuelve un mensaje de éxito con el ID de la sala agregada
            return { mensaje: "Sala agregada con éxito", salaId: res.insertedId };

        } catch (error) {
            console.log(error); //  Muestra el error en caso de que ocurra alguno
        }
    }

    // * Método para actualizar los datos de una sala existente
    //  Este método actualiza un documento en la colección 'sala'
    //  Implementar una validación más robusta para los datos actualizados
    async updateSala(id_sala, datosActualizados) {
        await this.open(); //Abre la conexión a la base de datos

        try {
            this.collectionSala = this.db.collection('sala'); //  Asigna la colección 'sala' a la variable

            // * Verifica si la sala con el ID proporcionado existe
            const salaExistente = await this.collectionSala.findOne({ _id: new ObjectId(id_sala) });
            if (!salaExistente) {
                //  Lanza un error si la sala no existe
                throw new Error(`La sala con ID ${id_sala} no existe.`);
            }

            // * Actualiza el documento en la colección 'sala'
            const res = await this.collectionSala.updateOne(
                { _id: new ObjectId(id_sala) },
                { $set: datosActualizados } //  Aplica solo las actualizaciones necesarias
            );

            this.connection.close(); //  Cierra la conexión a la base de datos

            // * Verifica si se realizó alguna actualización y devuelve el mensaje correspondiente
            if (res.modifiedCount === 1) {
                return { mensaje: "Sala actualizada con éxito", detalles: datosActualizados };
            } else {
                return { mensaje: "No se realizó ninguna actualización", detalles: datosActualizados };
            }

        } catch (error) {
            console.log(error); //  Muestra el error en caso de que ocurra alguno
        }
    }
}
