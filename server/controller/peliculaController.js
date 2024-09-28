const Pelicula = require('../model/peliculaModel'); // Asegúrate de importar tu modelo correctamente

const getpeliculaCartelera = async (req, res) => {
  try {
    // Construir el objeto de filtros para buscar películas en 'cartelera' o 'próximamente'
    const filtros = {
      estado: { $in: ["cartelera", "proximamente"] }
    };

    // Realizar la consulta a la base de datos y seleccionar solo los campos 'estado' y 'poster'
    const peliculas = await Pelicula.find(filtros).select('titulo genero poster estado');

    // Si no se encuentran películas, retornar un estado 404
    if (peliculas.length === 0) {
      return res.status(404).send({ status: 404, message: "No se encontraron películas en cartelera" });
    }

    // Retornar las películas encontradas
    return res.status(200).send({ status: 200, message: "Películas obtenidas", data: peliculas });
    
  } catch (error) {
    console.error(error);
    // Retornar un error 500 en caso de fallo
    return res.status(500).send({ status: 500, message: "Error al obtener las películas en catelera" });
  }
};

const getPeliculaById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID recibido:', id);

    const pelicula = await Pelicula.findById(id);
    console.log('Película encontrada:', pelicula);

    if (!pelicula) {
      console.log('Película no encontrada');
      return res.status(404).send({ status: 404, message: "Película no encontrada" });
    }

    console.log('Enviando respuesta exitosa');
    return res.status(200).send({ status: 200, message: "Película encontrada", data: pelicula });
    
  } catch (error) {
    console.error('Error en getPeliculaById:', error);
    return res.status(500).send({ status: 500, message: "Error interno del servidor" });
  }
};

module.exports = { getpeliculaCartelera, getPeliculaById };



// const connect = require('../../db/connect/connect');
// const { ObjectId } = require('mongodb');

// module.exports = class pelicula extends connect {
//     collectionPelicula

//     constructor() {
//         super();
//     }
//     /**
//      * @method addPelicula
//      * @description Agrega una nueva película a la base de datos. 
//      *             Verifica que no exista otra película con el mismo título antes de insertarla.
//      * @param {Object} nuevaPelicula - Objeto que representa los datos de la película a insertar.
//      * @returns {Object} - Mensaje de éxito si la película fue agregada correctamente.
//      */
//     async addPelicula(nuevaPelicula) {
//         await this.open();  // Abre la conexión a la base de datos.
//         try {
//             this.collectionPelicula = this.db.collection('pelicula');
    
//             // Verifica si ya existe una película con el mismo título.
//             const peliculaExistente = await this.collectionPelicula.findOne({ titulo: nuevaPelicula.titulo });
//             if (peliculaExistente) {
//                 return { status: 400, message: "La película con ese nombre ya existe" };
//             }
    
//             // Inserta la nueva película en la base de datos.
//             const res = await this.collectionPelicula.insertOne(nuevaPelicula);
//             if (!res.insertedId) {
//                 return { status: 500, message: "No se pudo agregar la película" };
//             }
    
//             await this.connection.close();  // Cierra la conexión a la base de datos.
//             return { status: 201, message: "Película ingresada con éxito" }; // 201 Created
//         } catch (error) {
//             if (this.connection) {
//                 await this.connection.close();  // Cierra la conexión en caso de error.
//             }
//             console.error(error);
//             return { status: 500, message: "Error interno del servidor" };  // 500 Internal Server Error
//         }
//     }
    
//     /**
//      * @method getPelicula
//      * @description Obtiene una película de la base de datos por su ID.
//      * @param {string} id_pelicula - ID de la película que se desea obtener.
//      * @returns {Object} - Objeto que representa los datos de la película encontrada.
//      */
//     async getPelicula(id_pelicula) {
//         await this.open(); 
//         try {
//             this.collectionPelicula = this.db.collection('pelicula');
    
//             // Busca la película por su ID.
//             const res = await this.collectionPelicula.findOne({ _id: new ObjectId(id_pelicula.id_pelicula) });
    
//             if (!res) {
//                 return { status: 404, message: "La película que ingresó no existe" }; 
//             }
    
//             await this.connection.close();  
//             return { status: 200, pelicula: res };  // 200 OK
//         } catch (error) {
//             if (this.connection) {
//                 await this.connection.close();  
//             }
//             console.error(error);
//             return { status: 500, message: "Error interno del servidor" };  // 500 Internal Server Error
//         }    
//     }    
// }
