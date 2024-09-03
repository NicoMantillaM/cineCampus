const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

module.exports = class tarjeta extends connect {
    collectionTarjeta;

    constructor() {
        super();
    }

    async updateTarjeta(id_tarjeta, datosActualizados) {
        await this.open();

        try {
            this.collectionTarjeta = this.db.collection('tarjeta');
            
            // Verificar si la tarjeta existe
            const tarjetaExistente = await this.collectionTarjeta.findOne({ _id: new ObjectId(id_tarjeta) });
            if (!tarjetaExistente) {
                throw new Error(`La tarjeta con ID ${id_tarjeta} no existe.`);
            }

            // Actualizar la tarjeta
            const res = await this.collectionTarjeta.updateOne(
                { _id: new ObjectId(id_tarjeta) },
                { $set: datosActualizados }
            );

            this.connection.close();

            if (res.modifiedCount === 1) {
                return { mensaje: "Tarjeta actualizada con éxito", detalles: datosActualizados };
            } else {
                return { mensaje: "No se realizó ninguna actualización", detalles: datosActualizados };
            }

        } catch (error) {
            if (this.connection) {
                await this.connection.close();
            }
            console.log(error);
        }
    }
}
