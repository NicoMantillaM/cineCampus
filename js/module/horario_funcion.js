const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb')

module.exports = class funcion extends connect {
  collectionFuncion
  constructor() {
    super();
  }

  async getFuncionCartelera() {

    await this.open();

    this.collectionFuncion = this.db.collection('horario_funcion');
    let res = await this.collectionFuncion.aggregate([
      {
        $lookup: {
          from: "pelicula",
          localField: "id_pelicula",
          foreignField: "_id",
          as: "info_pelicula"
        }
      },
      {
        $unwind: "$info_pelicula"
      },
      {
        $match: {
          "info_pelicula.estado": "cartelera"
        }
      },
      {
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
    this.connection.close();
    return res;
  }
  
  async addFuncion(nuevaFuncion) {
    await this.open();
    try {
        this.collectionFuncion = this.db.collection('horario_funcion');
        const collectionPelicula = this.db.collection('pelicula');
        const collectionSala = this.db.collection('sala');
        nuevaFuncion.id_pelicula = new ObjectId(nuevaFuncion.id_pelicula);
        nuevaFuncion.id_sala = new ObjectId(nuevaFuncion.id_sala);

        const pelicula = await collectionPelicula.findOne({ _id: nuevaFuncion.id_pelicula });
        if (!pelicula) {
            throw new Error("La película no existe");
        }
        if (pelicula.estado !== "cartelera") {
            throw new Error("La película no está en cartelera");
        }

        const sala = await collectionSala.findOne({ _id: nuevaFuncion.id_sala });
        if (!sala) {
            throw new Error("La sala no existe");
        }

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

        const res = await this.collectionFuncion.insertOne(nuevaFuncion);

        if (!res.insertedId) {
            throw new Error("No se pudo agregar la función");
        }

        await this.connection.close();
        return { message: "Función creada con éxito" };

    } catch(error){
      if (this.connection) {
          await this.connection.close();
      }
      console.error(error);
    }
  }
}