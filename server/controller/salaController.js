const connect = require('../../../db/connect/connect');
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
    async agregarSala(salaData, res) {
        await this.open(); // Abre la conexión a la base de datos

        try {
            this.collectionSala = this.db.collection('sala'); // Asigna la colección 'sala' a la variable

            // Inserta un nuevo documento en la colección 'sala'
            const resultado = await this.collectionSala.insertOne(salaData);

            await this.connection.close(); // Cierra la conexión a la base de datos

            // Devuelve un mensaje de éxito con el ID de la sala agregada
            return res.status(201).send({ mensaje: "Sala agregada con éxito", salaId: resultado.insertedId });

        } catch (error) {
            // Cierra la conexión en caso de error
            if (this.connection) {
                await this.connection.close();
            }
            console.error(error); // Muestra el error en la consola
            return res.status(500).send({ mensaje: "Error en el servidor. Inténtalo de nuevo más tarde." });
        }
    }

    // Método para actualizar los datos de una sala existente
    async updateSala(id_salA, datosActualizados, res) {
        await this.open(); // Abre la conexión a la base de datos

        try {
            this.collectionSala = this.db.collection('sala'); // Asigna la colección 'sala' a la variable

            // Verifica si la sala con el ID proporcionado existe
            const salaExistente = await this.collectionSala.findOne({ _id: new ObjectId(id_salA.id_sala) });
            if (!salaExistente) {
                return res.status(404).send({ mensaje: `La sala con ID ${id_salA.id_sala} no existe.` });
            }

            // Actualiza el documento en la colección 'sala'
            const resultado = await this.collectionSala.updateOne(
                { _id: new ObjectId(id_salA.id_sala) },
                { $set: datosActualizados } // Aplica solo las actualizaciones necesarias
            );

            await this.connection.close(); // Cierra la conexión a la base de datos

            // Verifica si se realizó alguna actualización y devuelve el mensaje correspondiente
            if (resultado.modifiedCount === 1) {
                return res.status(200).send({ mensaje: "Sala actualizada con éxito", detalles: datosActualizados });
            } else {
                return res.status(304).send({ mensaje: "No se realizó ninguna actualización", detalles: datosActualizados });
            }

        } catch (error) {
            // Cierra la conexión en caso de error
            if (this.connection) {
                await this.connection.close();
            }
            console.error(error); // Muestra el error en la consola
            return res.status(500).send({ mensaje: "Error en el servidor. Inténtalo de nuevo más tarde." });
        }
    }

}
