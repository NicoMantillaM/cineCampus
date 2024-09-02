const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

module.exports = class pelicula extends connect {
    collectionPelicula

    constructor() {
        super();
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

    /**
     * @method addPelicula
     * @description Agrega una nueva película a la base de datos. 
     *             Verifica que no exista otra película con el mismo título antes de insertarla.
     * @param {Object} nuevaPelicula - Objeto que representa los datos de la película a insertar.
     * @returns {Object} - Mensaje de éxito si la película fue agregada correctamente.
     */
    async addPelicula(nuevaPelicula) {
        await this.open();  // Abre la conexión a la base de datos.
        try {
            this.collectionPelicula = this.db.collection('pelicula');
              
            // Verifica si ya existe una película con el mismo título.
            const peliculaExistente = await this.collectionPelicula.findOne({ titulo: nuevaPelicula.titulo });
            if (peliculaExistente) {
                throw new Error("La película con ese nombre ya existe");
            }

            // Inserta la nueva película en la base de datos.
            const res = await this.collectionPelicula.insertOne(nuevaPelicula);
            if (!res.insertedId) {
                throw new Error("No se pudo agregar la película");
            }

            await this.connection.close();  // Cierra la conexión a la base de datos.
            return { message: "Película ingresada con éxito" };
        } catch (error) {
            if (this.connection) {
                await this.connection.close();  // Cierra la conexión en caso de error.
            }
            console.error(error);
        }
    }

    /**
     * @method getPelicula
     * @description Obtiene una película de la base de datos por su ID.
     * @param {string} id_pelicula - ID de la película que se desea obtener.
     * @returns {Object} - Objeto que representa los datos de la película encontrada.
     */
    async getPelicula(id_pelicula) {
        await this.open();  // Abre la conexión a la base de datos.
        try {
            this.collectionPelicula = this.db.collection('pelicula');

            // Busca la película por su ID.
            const res = await this.collectionPelicula.findOne({ _id: new ObjectId(id_pelicula) });

            if (!res) {
                throw new Error("La película que ingresó no existe");
            }

            this.connection.close();  // Cierra la conexión a la base de datos.
            return res;
        } catch (error) {
            if (this.connection) {
                await this.connection.close();  // Cierra la conexión en caso de error.
            }
            console.error(error);
        }
    }
}
