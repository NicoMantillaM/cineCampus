// const Pelicula = require('../model/peliculaModel'); // Asegúrate de importar tu modelo correctamente

// const getPeliculaById = async (req, res) => {
// try {
//     const { id } = req.params;
//     const pelicula = await Pelicula.findById(id);

//     if (!pelicula) {
//     return res.status(404).send({ status: 404, message: "Película no encontrada" });
//     }

//     return res.status(200).send({ status: 200, message: "Película encontrada", data: pelicula });
    
// } catch (error) {
//     return res.status(500).send({ status: 500, message: "Error interno del servidor" });
// }
// };

// module.exports = { getPeliculaById };
