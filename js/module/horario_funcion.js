// Importar la clase `connect` y `ObjectId` de `mongodb`
const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb')

// FIXME: Exportar la clase `funcion` que extiende la clase `connect`
module.exports = class funcion extends connect {
  // FIXME: Declaración de la variable `collectionFuncion` para almacenar la colección de funciones
  collectionFuncion

  // Constructor de la clase que inicializa la conexión a la base de datos
  constructor() {
    super();
  }

  // Método `getFuncionCartelera` que obtiene las funciones que están en cartelera
  async getFuncionCartelera() {

    // FIXME: Abrir la conexión a la base de datos
    await this.open();

    // FIXME: Asignar la colección `horario_funcion` a `collectionFuncion`
    this.collectionFuncion = this.db.collection('horario_funcion');

    // Realizar la consulta agregada para obtener las funciones en cartelera
    let res = await this.collectionFuncion.aggregate([
      {
        // Realizar un `lookup` para unir la información de la película con la función
        $lookup: {
          from: "pelicula",
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
          id_sala: 1,
          fecha_proyeccion: 1,
          hora_fin: 1,
          hora_inicio: 1,
          titulo: "$info_pelicula.titulo",
          genero: "$info_pelicula.genero",
          duracion: "$info_pelicula.duracion",
          sinopsis: "$info_pelicula.sinopsis",
          estado: "$info_pelicula.estado"
        }
      }
    ]).toArray();

    // Cerrar la conexión a la base de datos
    this.connection.close();

    // Retornar el resultado de la consulta
    return res;
  }
  
  // Método `addFuncion` que permite agregar una nueva función a la cartelera
  async addFuncion(nuevaFuncion) {
    // Abrir la conexión a la base de datos
    await this.open();
    try {
        // Asignar la colección `horario_funcion` a `collectionFuncion`
        this.collectionFuncion = this.db.collection('horario_funcion');
        const collectionPelicula = this.db.collection('pelicula');
        const collectionSala = this.db.collection('sala');
        
        // Convertir los IDs de película y sala a ObjectId
        nuevaFuncion.id_pelicula = new ObjectId(nuevaFuncion.id_pelicula);
        nuevaFuncion.id_sala = new ObjectId(nuevaFuncion.id_sala);

        // Verificar si la película existe en la base de datos
        const pelicula = await collectionPelicula.findOne({ _id: nuevaFuncion.id_pelicula });
        if (!pelicula) {
            throw new Error("La película no existe");
        }

        // Verificar si la película está en cartelera
        if (pelicula.estado !== "cartelera") {
            throw new Error("La película no está en cartelera");
        }

        // Verificar si la sala existe en la base de datos
        const sala = await collectionSala.findOne({ _id: nuevaFuncion.id_sala });
        if (!sala) {
            throw new Error("La sala no existe");
        }

        // Verificar si ya existe una función en el mismo horario en la sala
        const conflictoHorario = await this.collectionFuncion.findOne({
            id_sala: nuevaFuncion.id_sala,
            fecha_proyeccion: nuevaFuncion.fecha_proyeccion,
            $or: [
                { hora_inicio: { $lt: nuevaFuncion.hora_fin, $gt: nuevaFuncion.hora_inicio } },
                { hora_fin: { $gt: nuevaFuncion.hora_inicio, $lt: nuevaFuncion.hora_fin } }
            ]
        });

        if (conflictoHorario) {
            throw new Error("La sala ya está ocupada en el horario seleccionado");
        }

        // Insertar la nueva función en la base de datos
        const res = await this.collectionFuncion.insertOne(nuevaFuncion);

        // Verificar si la inserción fue exitosa
        if (!res.insertedId) {
            throw new Error("No se pudo agregar la función");
        }

        // Cerrar la conexión a la base de datos
        await this.connection.close();

        // Retornar un mensaje de éxito
        return { message: "Función creada con éxito" };

    } catch(error){
      // Manejo de errores y cierre de conexión si ocurre un error
      if (this.connection) {
          await this.connection.close();
      }
      console.error(error);
    }
  }
}
