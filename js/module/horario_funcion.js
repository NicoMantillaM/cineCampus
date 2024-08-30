const connect = require('../../db/connect/connect');


module.exports = class funcion extends connect {
    collectionFuncion
    constructor(){
        super();
    }
    
    async getFuncionCartelera(){

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
}