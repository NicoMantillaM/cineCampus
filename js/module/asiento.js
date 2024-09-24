// Importa la conexión a la base de datos desde el archivo 'connect.js'
const connect = require('../../db/connect/connect');

// Importa la clase ObjectId desde el módulo 'mongodb' para manejar identificadores únicos
const { ObjectId } = require('mongodb');

module.exports = class asiento extends connect {
    colletionAsiento; // Declara una propiedad para la colección de asientos

    /**
     * Constructor de la clase asiento.
     * Llama al constructor de la clase padre para establecer la conexión a la base de datos.
     */
    constructor() {
        super(); // Llama al constructor de la clase padre 'connect'
    }

    /**
     * Consulta la disponibilidad de los asientos en una sala específica para un horario de función.
     * @async
     * @param {string} id_sala - El ID de la sala.
     * @param {string} id_horario_funcion - El ID del horario de la función.
     * @returns {Promise<Object[]>} Un array con los asientos disponibles.
     * @throws {Error} Si el ID de la sala o el horario de la función no existen o no coinciden.
     */
    
    async consultarDisponibilidadAsientos(id_sala, id_horario_Funcion) {
        await this.open(); // Abre la conexión a la base de datos
        try {
            const collectionHorarioFuncion = this.db.collection('horario_funcion'); 
            const collectionSala = this.db.collection('sala'); 
    
            // Verifica si el id_sala existe en la colección 'sala'
            const salaExiste = await collectionSala.findOne({ _id: new ObjectId(id_sala.id_sala) });
            if (!salaExiste) {
                return { status: 404, message: 'El id_sala proporcionado no existe.' }; // Error 404 si la sala no existe
            }
    
            // Verifica si el id_horario_funcion existe en la colección 'horario_funcion'
            const horarioExiste = await collectionHorarioFuncion.findOne({ _id: new ObjectId(id_horario_Funcion.id_horario_funcion) });
            if (!horarioExiste) {
                return { status: 404, message: 'El id_horario_funcion proporcionado no existe.' }; // Error 404 si el horario no existe
            }
    
            // Verifica si el id_sala concuerda con el que está en 'horario_funcion'
            const funcion = await collectionHorarioFuncion.findOne({
                _id: new ObjectId(id_horario_Funcion.id_horario_funcion),
                id_sala: new ObjectId(id_sala.id_sala)
            });
    
            if (!funcion) {
                return { status: 404, message: 'No hay ninguna función asignada a esa sala.' }; // Error 404 si no hay función
            }
    
            // Obtiene la colección 'asiento' de la base de datos
            const collectionAsiento = this.db.collection('asiento');
    
            // Busca los asientos disponibles para la sala y el horario especificados
            const res = await collectionAsiento.find({
                id_sala: new ObjectId(id_sala.id_sala),
                id_horario_funcion: new ObjectId(id_horario_Funcion.id_horario_funcion),
                disponibilidad: 'disponible'
            }).toArray();
    
            this.connection.close(); // Cierra la conexión a la base de datos
            return { status: 200, data: res }; // Retorna los asientos disponibles con éxito
    
        } catch (error) {
            console.error(error); // Muestra el error en la consola
            return { status: 500, message: 'Error en el servidor. Intente más tarde.' }; // Error 500 en caso de excepciones
        }
    }
    
    /**
     * Agrega un nuevo asiento a la base de datos.
     * @async
     * @param {Object} nuevoAsiento - El objeto con los datos del nuevo asiento.
     * @param {string} nuevoAsiento.id_sala - El ID de la sala.
     * @param {string} nuevoAsiento.id_horario_funcion - El ID del horario de la función.
     * @param {string} nuevoAsiento.lugar - El lugar específico del asiento.
     * @returns {Promise<Object>} Un mensaje de éxito si se agrega el asiento correctamente.
     * @throws {Error} Si la sala, el horario de función no existen, no coinciden, o si el asiento ya existe.
     */
    async addAsiento(nuevoAsiento) {
        await this.open(); // Abre la conexión a la base de datos
        try {
            const collectionSala = this.db.collection('sala');
            const collectionHorarioFuncion = this.db.collection('horario_funcion');
            this.collectionAsiento = this.db.collection('asiento'); // Define la colección 'asiento'
    
            // Convierte id_sala y id_horario_funcion a ObjectId
            nuevoAsiento.id_sala = new ObjectId(nuevoAsiento.id_sala);
            nuevoAsiento.id_horario_funcion = new ObjectId(nuevoAsiento.id_horario_funcion);
    
            // Verifica si la sala existe
            const sala = await collectionSala.findOne({ _id: nuevoAsiento.id_sala });
            if (!sala) {
                return { status: 404, message: 'La sala especificada no existe.' }; // Error 404 si la sala no existe
            }
    
            // Verifica si el horario de función existe
            const horarioFuncion = await collectionHorarioFuncion.findOne({ _id: nuevoAsiento.id_horario_funcion });
            if (!horarioFuncion) {
                return { status: 404, message: 'El horario de función especificado no existe.' }; // Error 404 si el horario no existe
            }
    
            // Verifica si el id_sala coincide con el id_horario_funcion
            const funcion = await collectionHorarioFuncion.findOne({
                _id: nuevoAsiento.id_horario_funcion,
                id_sala: nuevoAsiento.id_sala
            });
    
            if (!funcion) {
                return { status: 400, message: 'El id_sala no coincide con el id_horario_funcion.' }; // Error 400 si no coinciden
            }
    
            // Verifica si el asiento ya existe para esa función
            const asientoExistente = await this.collectionAsiento.findOne({
                id_sala: nuevoAsiento.id_sala,
                id_horario_funcion: nuevoAsiento.id_horario_funcion,
                lugar: nuevoAsiento.lugar
            });
    
            if (asientoExistente) {
                return { status: 400, message: 'El asiento ya existe para esa función.' }; // Error 400 si el asiento ya está registrado
            }
    
            // Inserta el nuevo asiento en la colección
            const res = await this.collectionAsiento.insertOne(nuevoAsiento);
            if (!res.insertedId) {
                return { status: 500, message: 'No se pudo agregar el asiento.' }; // Error 500 si la inserción falla
            }
    
            await this.connection.close(); // Cierra la conexión a la base de datos
            return { status: 201, message: "Asiento agregado con éxito" }; // Retorna un mensaje de éxito con código 201
    
        } catch (error) {
            if (this.connection) {
                await this.connection.close(); // Asegura que la conexión se cierre en caso de error
            }
            console.error(error); // Muestra el error en la consola
            return { status: 500, message: 'Error en el servidor. Intente más tarde.' }; // Error 500 en caso de excepciones
        }
    }    
}
