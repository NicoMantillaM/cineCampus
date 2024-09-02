const connect = require ('../../db/connect/connect')

const { ObjectId } = require('mongodb');

module.exports = class pelicula extends connect{
    colletionPelicula
    constructor(){
        super()
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