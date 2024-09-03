const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

module.exports = class sala extends connect {
    collectionSala;

    constructor() {
        super();
    }

    async agregarSala(salaData) {
        await this.open();

        try {
            this.collectionSala = this.db.collection('sala');

            const res = await this.collectionSala.insertOne(salaData);

            this.connection.close();

            return { mensaje: "Sala agregada con éxito", salaId: res.insertedId };

        } catch (error) {
            console.log(error);
        }
    }

    async updateSala(id_sala, datosActualizados) {
        await this.open();

        try {
            this.collectionSala = this.db.collection('sala');

            // Verificar si la sala existe
            const salaExistente = await this.collectionSala.findOne({ _id: new ObjectId(id_sala) });
            if (!salaExistente) {
                throw new Error(`La sala con ID ${id_sala} no existe.`);
            }

            // Actualizar la sala
            const res = await this.collectionSala.updateOne(
                { _id: new ObjectId(id_sala) },
                { $set: datosActualizados }
            );

            this.connection.close();

            if (res.modifiedCount === 1) {
                return { mensaje: "Sala actualizada con éxito", detalles: datosActualizados };
            } else {
                return { mensaje: "No se realizó ninguna actualización", detalles: datosActualizados };
            }

        } catch (error) {
            console.log(error);
        }
    }
}
