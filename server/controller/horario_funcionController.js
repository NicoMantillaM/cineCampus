const HorarioFuncion = require('../model/horario_FuncionModel'); // Importa el modelo de HorarioFuncion

const getFuncionCartelera = async (req, res) => {
  try {
    // Realizar la consulta agregada con Mongoose
    const funciones = await HorarioFuncion.aggregate([
      {
        // Realizar un `lookup` para unir la información de la película con la función
        $lookup: {
          from: "peliculas", 
          localField: "id_pelicula",
          foreignField: "_id",
          as: "info_pelicula"
        }
      },
      {
        // Descomponer el array `info_pelicula` en documentos individuales
        $unwind: "$info_pelicula"
      },
      {
        // Filtrar las funciones que están en cartelera
        $match: {
          "info_pelicula.estado": "cartelera"
        }
      },
      {
        // Proyectar los campos específicos que se devolverán en la respuesta
        $project: {
          titulo: "$info_pelicula.titulo",
          genero: "$info_pelicula.genero",
          duracion: "$info_pelicula.duracion",
          sinopsis: "$info_pelicula.sinopsis",
          estado: "$info_pelicula.estado",
          poster: "$info_pelicula.poster"
        }
      }
    ]);
    
    // Si no se encuentran funciones, retornar un estado 404
    if (funciones.length === 0) {
      return res.status(404).send({ status: 404, message: "No hay funciones en cartelera" });
    }

    // Retornar las funciones encontradas
    return res.status(200).send({ status: 200, message: "Funciones obtenidas", data: funciones });
    
  } catch (error) {
    console.error(error);
    // Retornar un error 500 en caso de fallo
    return res.status(500).send({ status: 500, message: "Error al obtener las funciones en cartelera" });
  }
};

module.exports = { getFuncionCartelera };


//   /**
//   * @method addFuncion
//   * @description Agrega una nueva función a la cartelera. 
//   *              Verifica que la película y la sala existan, así como que no haya conflictos de horarios.
//   * @param {Object} nuevaFuncion - Objeto que representa los datos de la nueva función a insertar.
//   * @returns {Object} - Mensaje de éxito si la función fue agregada correctamente.
//   * @throws {Error} - Mensaje de error si hay conflictos o datos incorrectos.
//   */
//   async addFuncion(nuevaFuncion) {
//     // Abrir la conexión a la base de datos
//     await this.open();
//     try {
//       // Asignar la colección `horario_funcion` a `collectionFuncion`
//       this.collectionFuncion = this.db.collection('horario_funcion');
//       const collectionPelicula = this.db.collection('pelicula');
//       const collectionSala = this.db.collection('sala');

//       // Convertir los IDs de película y sala a ObjectId
//       nuevaFuncion.id_pelicula = new ObjectId(nuevaFuncion.id_pelicula);
//       nuevaFuncion.id_sala = new ObjectId(nuevaFuncion.id_sala);

//       // Verificar si la película existe en la base de datos
//       const pelicula = await collectionPelicula.findOne({ _id: nuevaFuncion.id_pelicula });
//       if (!pelicula) {
//         return { status: 404, message: "La película no existe" }; // Error de no encontrado
//       }

//       // Verificar si la película está en cartelera
//       if (pelicula.estado !== "cartelera") {
//         return { status: 400, message: "La película no está en cartelera" }; // Error de solicitud incorrecta
//       }

//       // Verificar si la sala existe en la base de datos
//       const sala = await collectionSala.findOne({ _id: nuevaFuncion.id_sala });
//       if (!sala) {
//         return { status: 404, message: "La sala no existe" }; // Error de no encontrado
//       }

//       // Verificar si ya existe una función en el mismo horario en la sala
//       const conflictoHorario = await this.collectionFuncion.findOne({
//         id_sala: nuevaFuncion.id_sala,
//         fecha_proyeccion: nuevaFuncion.fecha_proyeccion,
//         $or: [
//           { hora_inicio: { $lt: nuevaFuncion.hora_fin, $gt: nuevaFuncion.hora_inicio } },
//           { hora_fin: { $gt: nuevaFuncion.hora_inicio, $lt: nuevaFuncion.hora_fin } }
//         ]
//       });

//       if (conflictoHorario) {
//         return { status: 400, message: "La sala ya está ocupada en el horario seleccionado" }; // Error de solicitud incorrecta
//       }

//       // Insertar la nueva función en la base de datos
//       const res = await this.collectionFuncion.insertOne(nuevaFuncion);

//       // Verificar si la inserción fue exitosa
//       if (!res.insertedId) {
//         return { status: 500, message: "No se pudo agregar la función" }; // Error interno del servidor
//       }

//       // Cerrar la conexión a la base de datos
//       await this.connection.close();

//       // Retornar un mensaje de éxito
//       return { status: 201, message: "Función creada con éxito" };

//     } catch (error) {
//       // Manejo de errores y cierre de conexión si ocurre un error
//       if (this.connection) {
//         await this.connection.close();
//       }
//       console.error(error);
//       return { status: 500, message: "Error al agregar la función." }; // Error interno del servidor
//     }
//   }

// }
