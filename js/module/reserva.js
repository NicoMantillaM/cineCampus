const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

module.exports = class reserva extends connect {
    collectionReserva;
    constructor() {
        super();
    }

    // * Método para crear una nueva reserva
    // @param {string} id_usuario - El ID del usuario que realiza la reserva.
    // @param {Array<string>} asientos - Un array de IDs de los asientos que se desean reservar.
    // @param {string} id_horario_funcion - El ID del horario de la función a la cual pertenece la reserva.
    // @returns {Object} Un objeto con un mensaje de éxito y los detalles de la reserva realizada.
    async createReserva(id_usuario, asientos, id_horario_funcion) {
        await this.open();

        try {
            this.collectionReserva = this.db.collection('reserva');
            const collectionHorarioFuncion = this.db.collection('horario_funcion');
            const collectionAsiento = this.db.collection('asiento');
            const collectionUsuario = this.db.collection('usuario');

            // ? Verificar la existencia de id_horario_funcion
            const horarioFuncion = await collectionHorarioFuncion.findOne({ _id: new ObjectId(id_horario_funcion) });
            if (!horarioFuncion) {
                throw new Error('El id_horario_funcion proporcionado no existe.');
            }

            // ? Verificar la existencia del usuario
            const usuarioExiste = await collectionUsuario.findOne({ _id: new ObjectId(id_usuario) });
            if (!usuarioExiste) {
                throw new Error('El usuario proporcionado no existe.');
            }

            // ? Verificar la existencia de los asientos y su disponibilidad
            const asientosDetalles = await collectionAsiento.find({
                _id: { $in: asientos.map(id => new ObjectId(id)) },
                disponibilidad: 'disponible'
            }).toArray();

            //  Si la cantidad de asientos disponibles no coincide con los solicitados, arroja un error.
            if (asientosDetalles.length !== asientos.length) {
                throw new Error('Uno o más asientos no existen o no están disponibles.');
            }

            // ? Verificar que todos los asientos pertenezcan a la misma sala que la proyección
            const idSalaHorario = horarioFuncion.id_sala.toString();
            const asientosInvalidos = asientosDetalles.some(asiento => asiento.id_sala.toString() !== idSalaHorario);
            if (asientosInvalidos) {
                throw new Error('Uno o más asientos no pertenecen a la sala de la función especificada.');
            }

            // * Crear la reserva
            const res =  await this.collectionReserva.insertOne({
                id_usuario: new ObjectId(id_usuario),
                asientos: asientos.map(id => new ObjectId(id)),
                id_horario_funcion: new ObjectId(id_horario_funcion),
                estado: 'en proceso',
                // Asegurarse que la fecha se formatee correctamente
                fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) // Formato dd/mm/yyyy
            });

            // * Actualizar la disponibilidad de los asientos a "reservado"
            await collectionAsiento.updateMany(
                { _id: { $in: asientos.map(id => new ObjectId(id)) } },
                { $set: { disponibilidad: 'reservado' } }
            );

            this.connection.close();
            return { message: 'Reserva realizada con éxito', reserva: res };;

        } catch (error) {
            // Capturar y manejar cualquier error que ocurra durante la operación
            if (this.connection) {
                await this.connection.close();
            }
            console.log(error);
        }
    }

    // * Método para cancelar una reserva existente
    // @param {string} id_reserva - El ID de la reserva que se desea cancelar.
    // @param {string} id_usuario - El ID del usuario que realizó la reserva.
    // @returns {Object} Un objeto con un mensaje de éxito al cancelar la reserva.
    async cancelarReserva(id_reserva, id_usuario) {
        await this.open();

        try {
            this.collectionReserva = this.db.collection('reserva');
            const collectionAsiento = this.db.collection('asiento');

            // ? Verificar la existencia de la reserva y que pertenece al usuario
            const reserva = await this.collectionReserva.findOne({
                _id: new ObjectId(id_reserva),
                id_usuario: new ObjectId(id_usuario)
            });

            // Si la reserva no existe o no pertenece al usuario, arroja un error.
            if (!reserva) {
                throw new Error('La reserva proporcionada no existe o no pertenece al usuario.');
            }

            //  Si la reserva ya fue cancelada, arroja un error.
            if (reserva.estado === 'cancelado') {
                throw new Error('La reserva ya ha sido cancelada.');
            }

            // * Actualizar el estado de la reserva a "cancelado"
            await this.collectionReserva.updateOne(
                { _id: new ObjectId(id_reserva) },
                { $set: { estado: 'cancelado' } }
            );

            // * Actualizar la disponibilidad de los asientos a "disponible"
            await collectionAsiento.updateMany(
                { _id: { $in: reserva.asientos } },
                { $set: { disponibilidad: 'disponible' } }
            );

            this.connection.close();
            return { message: 'Reserva cancelada con éxito' };

        } catch (error) {
            //  Capturar y manejar cualquier error que ocurra durante la operación
            if (this.connection) {
                await this.connection.close();
            }
            console.log(error);
        }
    }
}
