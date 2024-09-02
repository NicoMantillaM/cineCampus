const connect = require('../../db/connect/connect')
const { ObjectId } = require('mongodb');

module.exports = class boleta extends connect {
    collectionBoleta
    constructor() {
        super()
    }

    async comprarBoleta(id_horario_funcion, asientos, id_usuario, id_reserva, metodo_pago) {
        await this.open();

        try {
            this.collectionBoleta = await this.db.collection('boleta');
            const collectionFuncion = this.db.collection('horario_funcion');
            const collectionReserva = this.db.collection('reserva');
            const collectionAsiento = this.db.collection('asiento');
            const collectionUsuario = this.db.collection('usuario');
            const collectionTarjeta = this.db.collection('tarjeta');

            // Validar que el horario de la función existe
            const horario_funcion = await collectionFuncion.findOne({ _id: new ObjectId(id_horario_funcion) });
            if (!horario_funcion) {
                throw new Error(`El horario de la función con el ID ${id_horario_funcion} no existe en la colección de funciones disponibles.`);
            }

            const id_sala_funcion = horario_funcion.id_sala;
            const asientoIds = asientos.map(asiento => new ObjectId(asiento));

            // Obtener todos los asientos seleccionados
            const asientosSeleccionados = await collectionAsiento.find({
                _id: { $in: asientoIds }
            }).toArray();


            // Validar que el usuario exista
            const usuario = await collectionUsuario.findOne({ _id: new ObjectId(id_usuario) });
            if (!usuario) {
                throw new Error(`El usuario con ID ${id_usuario} no existe en la colección de usuarios.`);
            }

            // RESERVA
            if (id_reserva) {
                const reserva = await collectionReserva.findOne({ _id: new ObjectId(id_reserva) });

                if (!reserva) {
                    throw new Error(`La reserva con el ID ${id_reserva} no existe en la colección de reservas.`);
                }

                // Verificar que el ID del usuario que hizo la reserva coincide con el usuario que está comprando
                if (reserva.id_usuario.toString() !== id_usuario.toString()) {
                    throw new Error(`El usuario con ID ${id_usuario} no hizo la reserva con ID ${id_reserva}.`);
                }

                // Verificar que el estado de la reserva sea "en proceso"
                if (reserva.estado !== 'en proceso') {
                    throw new Error(`La reserva con ID ${id_reserva} no está en estado "en proceso".`);
                }

                // Verificar que los asientos en la reserva coinciden con los asientos seleccionados
                const asientosReserva = reserva.asientos.map(asiento => asiento.toString());
                const asientosSeleccionadosStrings = asientos.map(asiento => asiento.toString());

                const coincidenAsientos = asientosSeleccionadosStrings.every(asiento => asientosReserva.includes(asiento));

                if (!coincidenAsientos) {
                    throw new Error(`Los asientos seleccionados no coinciden con los asientos reservados.`);
                }

                // Estado de reserva a 'completada'
                await collectionReserva.updateOne(
                    { _id: new ObjectId(id_reserva) },
                    { $set: { estado: 'completada' } }
                );

            } else {
                // Validar disponibilidad de los asientos cuando no hay reserva
                const asientosDisponibles = asientosSeleccionados.filter(asiento =>
                    asiento.id_sala.toString() === id_sala_funcion.toString() &&
                    asiento.disponibilidad === 'disponible'
                );

                if (asientosDisponibles.length !== asientos.length) {
                    throw new Error('Uno o más de los asientos seleccionados no están disponibles o no pertenecen a la sala o función especificada.');
                }
            }

            // Calcular el precio total 
            let precio_total = asientosSeleccionados.reduce((total, asiento) => total + asiento.precio, 0);


            // Verificar si el usuario tiene una tarjeta VIP activa
            const tarjetaVIP = await collectionTarjeta.findOne({
                id_usuario: new ObjectId(id_usuario),
                estado: 'activa'
            });

            if (tarjetaVIP) {
                const descuento = 0.15;
                precio_total = precio_total * (1 - descuento);
            }

            // Disponibilidad de asientos a "ocupado"
            await collectionAsiento.updateMany(
                { _id: { $in: asientoIds } },
                { $set: { disponibilidad: 'ocupado' } }
            );

            const fecha_adquisicion = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

            // Insertar la boleta
            let res = await this.collectionBoleta.insertOne({
                fecha_de_compra: fecha_adquisicion,
                usuario: new ObjectId(id_usuario),
                asientos: asientoIds,
                reserva: id_reserva ? new ObjectId(id_reserva) : null,  // ObjectId o null
                estado_de_la_compra: 'comprado',
                horario_de_la_funcion: new ObjectId(id_horario_funcion),
                metodo_de_pago: metodo_pago,
                precio_total: precio_total
            });

            this.connection.close();

            return res;

        } catch (error) {
            if (this.connection) {
                await this.connection.close();
            }
            console.log(error);

        }
    }

}