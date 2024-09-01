const { MongoClient } = require("mongodb");
/**
 * Clase para manejar la conexión a la base de datos MongoDB
 */
module.exports = class connect {
    /**
     * Propiedad para almacenar la conexión a la base de datos
     * @type {MongoClient|Object}
     */
    connection;
    /**
     * Propiedad para almacenar la instancia de la base de datos
     * @type {Db}
     */
    db;
    /**
     * Propiedad estática para implementar el patrón singleton y evitar múltiples instancias de conexión
     * @type {connect|undefined}
     */
    static instanceConnect;
    /**
     * Constructor que implementa el patrón singleton para evitar múltiples instancias de la conexión
     */
    constructor(){
        // Si ya existe una instancia, retorna esa instancia
        if(connect.instanceConnect) return connect.instanceConnect;

        // Asigna esta instancia a la propiedad estática
        connect.instanceConnect = this;

        // Retorna la instancia actual
        return connect.instanceConnect;
    }
    /**
     * Método para abrir la conexión a la base de datos
     * @async
     */
    async open(){
        // Construye la URI de conexión usando variables de entorno
            const uri = `${process.env.MONGO_PROTOCOLO}${process.env.MONGO_USER}:${process.env.MONGO_PSW}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
            try{
            // Crea una nueva instancia de MongoClient con la URI
            this.connection = new MongoClient(uri);

            // Establece la conexión con la base de datos
            await this.connection.connect();

            // Asigna la base de datos específica a la propiedad db
            this.db = this.connection.db(process.env.MONGO_DB_NAME);
        } catch (error){
            // En caso de error, asigna un objeto con el estado y mensaje de error a la propiedad connection
            this.connection = {status:400, message: "Error en la uri"};
        }
    }
}