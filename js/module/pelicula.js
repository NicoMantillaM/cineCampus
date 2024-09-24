const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

module.exports = class pelicula extends connect {
    collectionPelicula

    constructor() {
        super();
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
                return { status: 400, message: "La película con ese nombre ya existe" };
            }
    
            // Inserta la nueva película en la base de datos.
            const res = await this.collectionPelicula.insertOne(nuevaPelicula);
            if (!res.insertedId) {
                return { status: 500, message: "No se pudo agregar la película" };
            }
    
            await this.connection.close();  // Cierra la conexión a la base de datos.
            return { status: 201, message: "Película ingresada con éxito" }; // 201 Created
        } catch (error) {
            if (this.connection) {
                await this.connection.close();  // Cierra la conexión en caso de error.
            }
            console.error(error);
            return { status: 500, message: "Error interno del servidor" };  // 500 Internal Server Error
        }
    }
    
    /**
     * @method getPelicula
     * @description Obtiene una película de la base de datos por su ID.
     * @param {string} id_pelicula - ID de la película que se desea obtener.
     * @returns {Object} - Objeto que representa los datos de la película encontrada.
     */
    async getPelicula(id_pelicula) {
        await this.open(); 
        try {
            this.collectionPelicula = this.db.collection('pelicula');
    
            // Busca la película por su ID.
            const res = await this.collectionPelicula.findOne({ _id: new ObjectId(id_pelicula.id_pelicula) });
    
            if (!res) {
                return { status: 404, message: "La película que ingresó no existe" }; 
            }
    
            await this.connection.close();  
            return { status: 200, pelicula: res };  // 200 OK
        } catch (error) {
            if (this.connection) {
                await this.connection.close();  
            }
            console.error(error);
            return { status: 500, message: "Error interno del servidor" };  // 500 Internal Server Error
        }    
    }    
}
