const HorarioFuncion = require('../model/horario_FuncionModel');
const Asiento = require('../model/asientoModel');
const Sala = require('../model/salaModel');

const getFunctionsForMovie = async (req, res) => {
    try {
        const functions = await HorarioFuncion.find({ id_pelicula: req.params.movieId })
            .populate('id_sala', 'tipo_sala nombre');

        // Group functions by date
        const groupedFunctions = functions.reduce((acc, func) => {
            const date = func.fecha_proyeccion.split('/')[0]; // Get the day
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push({
                _id: func._id,
                hora_inicio: func.hora_inicio,
                tipo_sala: func.id_sala.tipo_sala,
                nombre_sala: func.id_sala.nombre,
                id_sala: func.id_sala._id // Add this line to include the room ID
            });
            return acc;
        }, {});

        res.json(groupedFunctions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching functions', error: error.message });
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

const getRoomDetails = async (req, res) => {
    try {
        const room = await Sala.findById(req.params.roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        console.error('Error in getRoomDetails:', error);
        res.status(500).json({ message: 'Error fetching room details', error: error.message });
    }
};

module.exports = { 
    getFunctionsForMovie, 
    getSeatsForRoomAndFunction,
    getRoomDetails 
};