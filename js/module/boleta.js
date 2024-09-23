// Importar las dependencias necesarias
const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

// Definir la clase `boleta` que extiende de `connect`
module.exports = class boleta extends connect {
    collectionBoleta;

    // Constructor de la clase `boleta`
    constructor() {
        super();
    }

    /**
     * @function comprarBoleta
     * @description Este método permite la compra de una boleta para una función de cine. 
     * Valida que el horario de la función exista, que el usuario y los asientos sean válidos, 
     * y procesa la compra aplicando descuentos si corresponde.
     * @param {string} id_horario_funcion - El ID del horario de la función.
     * @param {Array} asientos - Un array con los IDs de los asientos seleccionados.
     * @param {string} id_usuario - El ID del usuario que está comprando la boleta.
     * @param {string} [id_reserva] - El ID de la reserva (opcional).
     * @param {string} metodo_pago - El método de pago utilizado para la compra.
     * @returns {Object} - Un objeto que incluye un mensaje de confirmación y los detalles de la compra.
     * @throws {Error} - Si se produce un error durante la compra, se lanza un error con un mensaje descriptivo.
     */
    async comprarBoleta(nuevaBoleta) {
        await this.open();
        try {
            this.collectionBoleta = this.db.collection('boleta');
            const collectionFuncion = this.db.collection('horario_funcion');
            const collectionUsuario = this.db.collection('usuario');
            const collectionAsiento = this.db.collection('asiento');
            const collectionReserva = this.db.collection('reserva');
            const collectionTarjeta = this.db.collection('tarjeta');
    
            // Convertir los IDs a ObjectId
            nuevaBoleta.id_horario_funcion = new ObjectId(nuevaBoleta.id_horario_funcion);
            nuevaBoleta.id_usuario = new ObjectId(nuevaBoleta.id_usuario);
            nuevaBoleta.asientos = nuevaBoleta.asientos.map(asiento => new ObjectId(asiento));
            if (nuevaBoleta.id_reserva) {
                nuevaBoleta.id_reserva = new ObjectId(nuevaBoleta.id_reserva);
            }
    
            // Validar que el horario de la función existe
            const funcion = await collectionFuncion.findOne({ _id: nuevaBoleta.id_horario_funcion });
            if (!funcion) {
                throw new Error("La función no existe");
            }
    
            // Validar que el usuario existe
            const usuario = await collectionUsuario.findOne({ _id: nuevaBoleta.id_usuario });
            if (!usuario) {
                throw new Error("El usuario no existe");
            }
    
            // Validar si hay reserva y coinciden los asientos
            if (nuevaBoleta.id_reserva) {
                const reserva = await collectionReserva.findOne({ _id: nuevaBoleta.id_reserva });
                if (!reserva) {
                    throw new Error("La reserva no existe");
                }
                if (reserva.id_usuario.toString() !== nuevaBoleta.id_usuario.toString()) {
                    throw new Error("El usuario no coincide con la reserva");
                }
                const asientosReservados = reserva.asientos.map(asiento => asiento.toString());
                const asientosSeleccionados = nuevaBoleta.asientos.map(asiento => asiento.toString());
    
                const coincideAsientos = asientosSeleccionados.every(asiento => asientosReservados.includes(asiento));
                if (!coincideAsientos) {
                    throw new Error("Los asientos seleccionados no coinciden con los reservados");
                }
            } else {
                // Validar la disponibilidad de los asientos si no hay reserva
                const asientosDisponibles = await collectionAsiento.find({
                    _id: { $in: nuevaBoleta.asientos },
                    disponibilidad: 'disponible'
                }).toArray();
    
                if (asientosDisponibles.length !== nuevaBoleta.asientos.length) {
                    throw new Error("Uno o más asientos no están disponibles");
                }
            }
    
            // Calcular el precio total de la compra
            let precio_total = asientosDisponibles.reduce((total, asiento) => total + asiento.precio, 0);
    
            // Aplicar descuento si el usuario tiene tarjeta VIP
            const tarjetaVIP = await collectionTarjeta.findOne({
                id_usuario: nuevaBoleta.id_usuario,
                estado: 'activa'
            });
    
            if (tarjetaVIP) {
                const descuento = 0.15; // 15% de descuento
                precio_total = precio_total * (1 - descuento);
            }
    
            // Actualizar la disponibilidad de los asientos a "ocupado"
            await collectionAsiento.updateMany(
                { _id: { $in: nuevaBoleta.asientos } },
                { $set: { disponibilidad: 'ocupado' } }
            );
    
            // Insertar la boleta en la base de datos
            nuevaBoleta.fecha_compra = new Date();
            nuevaBoleta.precio_total = precio_total;
            nuevaBoleta.estado_compra = 'comprado';
    
            const res = await this.collectionBoleta.insertOne(nuevaBoleta);
    
            if (!res.insertedId) {
                throw new Error("No se pudo registrar la compra de la boleta");
            }
    
            await this.connection.close();
            return { message: "Boleta comprada con éxito", id_boleta: res.insertedId };
    
        } catch (error) {
            if (this.connection) {
                await this.connection.close();
            }
            console.error(error);
            throw new Error(error.message);
        }
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
}    
    
