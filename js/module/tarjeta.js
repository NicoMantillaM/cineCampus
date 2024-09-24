const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

module.exports = class tarjeta extends connect {
    collectionTarjeta;

    constructor() {
        super();
    }

    /**
     * Actualiza los datos de una tarjeta existente en la colección `tarjeta`.
     * 
     * @param {string} id_tarjeta - El ID de la tarjeta a actualizar.
     * @param {Object} datosActualizados - Un objeto con los datos que se desean actualizar en la tarjeta.
     * @returns {Object} Un objeto con un mensaje indicando el resultado de la actualización y los detalles actualizados.
     */
    async updateTarjeta(id_tarjetA, datosActualizados, res) {
        await this.open();
    
        try {
            this.collectionTarjeta = this.db.collection('tarjeta');
            
            // Verificar si la tarjeta existe en la base de datos.
            const tarjetaExistente = await this.collectionTarjeta.findOne({ _id: new ObjectId(id_tarjetA.id_tarjeta) });
            if (!tarjetaExistente) {
                return res.status(404).send({ mensaje: `La tarjeta con ID ${id_tarjetA.id_tarjeta} no existe.` });
            }
    
            // Actualizar la tarjeta con los datos proporcionados.
            const resultado = await this.collectionTarjeta.updateOne(
                { _id: new ObjectId(id_tarjetA.id_tarjeta) },
                { $set: datosActualizados }
            );
    
            await this.connection.close();
    
            // Verificar si se realizó la actualización.
            if (resultado.modifiedCount === 1) {
                return res.status(200).send({ mensaje: "Tarjeta actualizada con éxito", detalles: datosActualizados });
            } else {
                return res.status(304).send({ mensaje: "No se realizó ninguna actualización", detalles: datosActualizados });
            }
    
        } catch (error) {
            // Cerrar la conexión en caso de error.
            if (this.connection) {
                await this.connection.close();
            }
            console.error(error);
            return res.status(500).send({ mensaje: "Error en el servidor. Inténtalo de nuevo más tarde." });
        }
    }
}    