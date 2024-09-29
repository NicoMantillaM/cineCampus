const Sala = require('../model/salaModel');
const HorarioFuncion = require('../model/horario_FuncionModel');
const Asiento = require('../model/asientoModel');

const consultarDisponibilidadAsientos = async (req, res) => {
  const { id_sala, id_horario_funcion } = req.params;

    try {
        // Verifica si el id_sala existe en la colección 'Sala'
        const salaExiste = await Sala.findById(id_sala);
        if (!salaExiste) {
        return res.status(404).send({ status: 404, message: 'El id_sala proporcionado no existe.' });
        }

        // Verifica si el id_horario_funcion existe en la colección 'HorarioFuncion'
        const horarioExiste = await HorarioFuncion.findById(id_horario_funcion);
        if (!horarioExiste) {
        return res.status(404).send({ status: 404, message: 'El id_horario_funcion proporcionado no existe.' });
        }

        // Verifica si el id_sala concuerda con el que está en 'HorarioFuncion'
        const funcion = await HorarioFuncion.findOne({
        _id: id_horario_funcion,
        id_sala: id_sala
        });

        if (!funcion) {
        return res.status(404).send({ status: 404, message: 'No hay ninguna función asignada a esa sala.' });
        }

        // Busca los asientos disponibles para la sala y el horario especificados
        const asientosDisponibles = await Asiento.find({
        id_sala: id_sala,
        id_horario_funcion: id_horario_funcion,
        disponibilidad: 'disponible'
        }).select('fila numero disponibilidad'); // Seleccionamos los campos relevantes

        // Si no hay asientos disponibles, retorna 404
        if (asientosDisponibles.length === 0) {
        return res.status(404).send({ status: 404, message: 'No hay asientos disponibles para esta función.' });
        }

        // Retorna los asientos disponibles con éxito
        return res.status(200).send({ status: 200, message: 'Asientos disponibles obtenidos', data: asientosDisponibles });

    } catch (error) {
        console.error(error);
        // Retornar un error 500 en caso de fallo
        return res.status(500).send({ status: 500, message: 'Error en el servidor. Intente más tarde.' });
    }
};


const getFunctionsForMovie = async (req, res) => {
        try {
        const functions = await HorarioFuncion.find({ id_pelicula: req.params.movieId });
        res.json(functions);
        } catch (error) {
        res.status(500).json({ message: 'Error fetching functions', error: error.message });
        }
    };
    
    const getRoomForFunction = async (req, res) => {
        try {
        const functione = await HorarioFuncion.findById(req.params.functionId);
        const room = await Sala.findById(functione.id_sala);
        res.json(room);
        } catch (error) {
        res.status(500).json({ message: 'Error fetching room', error: error.message });
        }
    };
    
    const getSeatsForRoomAndFunction = async (req, res) => {
        try {
        const seats = await Asiento.find({
            id_sala: req.params.roomId,
            id_horario_funcion: req.params.functionId
        });
        res.json(seats);
        } catch (error) {
        res.status(500).json({ message: 'Error fetching seats', error: error.message });
        }
    };
    
module.exports = { 
        consultarDisponibilidadAsientos, 
        getFunctionsForMovie, 
        getRoomForFunction, 
        getSeatsForRoomAndFunction 
    };
    
//     /**
//      * Agrega un nuevo asiento a la base de datos.
//      * @async
//      * @param {Object} nuevoAsiento - El objeto con los datos del nuevo asiento.
//      * @param {string} nuevoAsiento.id_sala - El ID de la sala.
//      * @param {string} nuevoAsiento.id_horario_funcion - El ID del horario de la función.
//      * @param {string} nuevoAsiento.lugar - El lugar específico del asiento.
//      * @returns {Promise<Object>} Un mensaje de éxito si se agrega el asiento correctamente.
//      * @throws {Error} Si la sala, el horario de función no existen, no coinciden, o si el asiento ya existe.
//      */
//     async addAsiento(nuevoAsiento) {
//         await this.open(); // Abre la conexión a la base de datos
//         try {
//             const collectionSala = this.db.collection('sala');
//             const collectionHorarioFuncion = this.db.collection('horario_funcion');
//             this.collectionAsiento = this.db.collection('asiento'); // Define la colección 'asiento'
    
//             // Convierte id_sala y id_horario_funcion a ObjectId
//             nuevoAsiento.id_sala = new ObjectId(nuevoAsiento.id_sala);
//             nuevoAsiento.id_horario_funcion = new ObjectId(nuevoAsiento.id_horario_funcion);
    
//             // Verifica si la sala existe
//             const sala = await collectionSala.findOne({ _id: nuevoAsiento.id_sala });
//             if (!sala) {
//                 return { status: 404, message: 'La sala especificada no existe.' }; // Error 404 si la sala no existe
//             }
    
//             // Verifica si el horario de función existe
//             const horarioFuncion = await collectionHorarioFuncion.findOne({ _id: nuevoAsiento.id_horario_funcion });
//             if (!horarioFuncion) {
//                 return { status: 404, message: 'El horario de función especificado no existe.' }; // Error 404 si el horario no existe
//             }
    
//             // Verifica si el id_sala coincide con el id_horario_funcion
//             const funcion = await collectionHorarioFuncion.findOne({
//                 _id: nuevoAsiento.id_horario_funcion,
//                 id_sala: nuevoAsiento.id_sala
//             });
    
//             if (!funcion) {
//                 return { status: 400, message: 'El id_sala no coincide con el id_horario_funcion.' }; // Error 400 si no coinciden
//             }
    
//             // Verifica si el asiento ya existe para esa función
//             const asientoExistente = await this.collectionAsiento.findOne({
//                 id_sala: nuevoAsiento.id_sala,
//                 id_horario_funcion: nuevoAsiento.id_horario_funcion,
//                 lugar: nuevoAsiento.lugar
//             });
    
//             if (asientoExistente) {
//                 return { status: 400, message: 'El asiento ya existe para esa función.' }; // Error 400 si el asiento ya está registrado
//             }
    
//             // Inserta el nuevo asiento en la colección
//             const res = await this.collectionAsiento.insertOne(nuevoAsiento);
//             if (!res.insertedId) {
//                 return { status: 500, message: 'No se pudo agregar el asiento.' }; // Error 500 si la inserción falla
//             }
    
//             await this.connection.close(); // Cierra la conexión a la base de datos
//             return { status: 201, message: "Asiento agregado con éxito" }; // Retorna un mensaje de éxito con código 201
    
//         } catch (error) {
//             if (this.connection) {
//                 await this.connection.close(); // Asegura que la conexión se cierre en caso de error
//             }
//             console.error(error); // Muestra el error en la consola
//             return { status: 500, message: 'Error en el servidor. Intente más tarde.' }; // Error 500 en caso de excepciones
//         }
//     }    
// }
