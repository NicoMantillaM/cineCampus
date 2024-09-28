// const Pelicula = require('../model/peliculaModel'); // Asegúrate de importar tu modelo correctamente

// const getPeliculaById = async (req, res) => {
// try {
//     const { id } = req.params;
//     console.log('ID recibido:', id);

//     const pelicula = await Pelicula.findById(id);
//     console.log('Película encontrada:', pelicula);

//     if (!pelicula) {
//     console.log('Película no encontrada');
//     return res.status(404).send({ status: 404, message: "Película no encontrada" });
//     }

//     console.log('Enviando respuesta exitosa');
//     return res.status(200).send({ status: 200, message: "Película encontrada", data: pelicula });
    
// } catch (error) {
//     console.error('Error en getPeliculaById:', error);
//     return res.status(500).send({ status: 500, message: "Error interno del servidor" });
// }
// };

//   module.exports = { getPeliculaById };
