const connect = require ('../../db/connect/connect')

const { ObjectId } = require('mongodb');

module.exports = class pelicula extends connect{
    colletionPelicula
    constructor(){
        super()
    }
    async addPelicula(nuevaPelicula) {
        await this.open();
        try {
            this.collectionPelicula = this.db.collection('pelicula');
              
            const peliculaExistente = await this.collectionPelicula.findOne({ titulo: nuevaPelicula.titulo });
            if (peliculaExistente) {
                throw new Error("La película con ese nombre ya existe");
            }
            const res = await this.collectionPelicula.insertOne(nuevaPelicula);
            if (!res.insertedId) {
                throw new Error("No se pudo agregar la película");
            }

            await this.connection.close();
            return { message: "Película ingresada con éxito" };
        } catch (error) {
            if (this.connection) {
                await this.connection.close();
            }
            console.error(error);
        }
    }

    async getPelicula(id_pelicula){

        await this.open();
        try {
            
            this.colletionPelicula = this.db.collection('pelicula');
            const res = await this.colletionPelicula.findOne({ _id: new ObjectId(id_pelicula)});

            if (!res) {
                throw new Error("La pelicula que ingreso no existe");
            }
            this.connection.close();

            return res;
            } catch (error) {
                if (this.connection) {
                    await this.connection.close();
                }
                console.error(error);
            }
    }
}