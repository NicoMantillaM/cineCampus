const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

module.exports = class usuario extends connect {
    collectionUsuario;  
    collectionTarjeta;

    constructor() {
        super();
    }

    /**
     * Crea un nuevo usuario y asigna el rol correspondiente.
     * 
     * @param {string} nombre - Nombre del usuario.
     * @param {string} apellido - Apellido del usuario.
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} nickname - Apodo del usuario.
     * @param {string} telefono - Número de teléfono del usuario.
     * @param {string} rol - Rol del usuario (Administrador, vip, estándar).
     * 
     * @returns {Object} Mensaje y detalles del usuario creado.
     * @throws {Error} Si el email, nickname o teléfono ya están en uso.
     */
    async createUser(nombre, apellido, email, nickname, telefono, rol) {
        await this.open();

        try {
            this.collectionUsuario = this.db.collection('usuario');
            this.collectionTarjeta = this.db.collection('tarjeta'); 

            // Verificar si el email ya está en uso
            const usuarioEmailExiste = await this.collectionUsuario.findOne({ email: email });
            if (usuarioEmailExiste) {
                throw new Error(`El usuario con el email: ${email} ya existe`);
            }

            // Verificar si el nickname ya está en uso
            const usuarioNicknameExiste = await this.collectionUsuario.findOne({ nickname: nickname });
            if (usuarioNicknameExiste) {
                throw new Error(`El usuario con el nickname: ${nickname} ya existe`);
            }

            // Verificar si el teléfono ya está en uso
            const usuarioTelefonoExiste = await this.collectionUsuario.findOne({ telefono: telefono });
            if (usuarioTelefonoExiste) {
                throw new Error(`El usuario con el telefono: ${telefono} ya existe`);
            }

            // Insertar el usuario en la colección 'usuario'
            const res = await this.collectionUsuario.insertOne({
                nombre: nombre,
                apellido: apellido,
                email: email,
                nickname: nickname,
                telefono: telefono,
                rol: rol
            });

            const usuarioId = res.insertedId; // Obtener el ID del usuario recién insertado

            // Asignar el rol adecuado en MongoDB
            if (rol === 'Administrador') {
                await this.db.command({
                    createUser: nickname,
                    pwd: telefono,
                    roles: [
                        { role: "dbOwner", db: "cineCampus" }
                    ]
                });
            } else if (rol === 'vip') {
                // Asignar el rol 'vip' y crear tarjeta VIP
                await this.db.command({
                    createUser: nickname,
                    pwd: telefono,
                    roles: [{ role: 'vip', db: 'cineCampus' }]
                });

                await this.collectionTarjeta.insertOne({
                    _id: new ObjectId(),
                    fecha_expedicion: new Date().toISOString().slice(0, 10), // Fecha actual
                    estado: "activa",
                    id_usuario: usuarioId
                });
            } else {
                // Asignar el rol 'estándar'
                await this.db.command({
                    createUser: nickname,
                    pwd: telefono,
                    roles: [{ role: 'estandar', db: 'cineCampus' }]
                });
            }

            return { message: 'El usuario se registró correctamente y se asignó el rol', usuario: res };

        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Actualiza los datos de un usuario existente.
     * 
     * @param {string} id_usuario - ID del usuario a actualizar.
     * @param {Object} updateData - Datos a actualizar.
     * 
     * @returns {Object} Mensaje y detalles del usuario actualizado.
     * @throws {Error} Si el usuario no existe o si hay problemas con la actualización del rol.
     */
    async updateUser(id_usuario, updateData) {
        await this.open();

        try {
            this.collectionUsuario = this.db.collection('usuario');
            this.collectionTarjeta = this.db.collection('tarjeta');

            // Verificar si el usuario existe
            const usuarioExiste = await this.collectionUsuario.findOne({ _id: new ObjectId(id_usuario) });
            if (!usuarioExiste) {
                throw new Error(`El usuario con el ID: ${id_usuario} no existe`);
            }

            // Actualizar el rol del usuario si se proporciona
            if (updateData.rol) {
                const nuevoRol = updateData.rol;

                if (nuevoRol === 'vip') {
                    // Verificar si el usuario ya tiene una tarjeta VIP
                    const tarjetaExiste = await this.collectionTarjeta.findOne({ id_usuario: new ObjectId(id_usuario) });

                    if (!tarjetaExiste) {
                        // Crear una nueva tarjeta VIP
                        await this.collectionTarjeta.insertOne({
                            _id: new ObjectId(),
                            fecha_expedicion: new Date().toISOString().slice(0, 10), // Fecha actual
                            estado: 'activa',
                            id_usuario: new ObjectId(id_usuario)
                        });
                    }

                    // Asignar el rol 'vip'
                    await this.db.command({
                        grantRolesToUser: usuarioExiste.nickname,
                        roles: [{ role: 'vip', db: 'cineCampus' }]
                    });

                } else if (nuevoRol === 'Administrador') {
                    // Asignar el rol 'dbOwner' para Administradores
                    await this.db.command({
                        grantRolesToUser: usuarioExiste.nickname,
                        roles: [{ role: 'dbOwner', db: 'cineCampus' }]
                    });

                } else {
                    // Asignar el rol 'estándar'
                    await this.db.command({
                        grantRolesToUser: usuarioExiste.nickname,
                        roles: [{ role: 'estandar', db: 'cineCampus' }]
                    });
                }
            }

            // Actualizar los datos del usuario en la colección 'usuario'
            await this.collectionUsuario.updateOne(
                { _id: new ObjectId(id_usuario) },
                { $set: updateData }
            );

            return { message: 'El usuario se actualizó correctamente', usuario: updateData };

        } catch (error) {
            console.log(error);
        } 
    }

    /**
     * Consulta los datos de un usuario específico por ID.
     * 
     * @param {string} id_usuario - ID del usuario a consultar.
     * 
     * @returns {Object} Datos del usuario y tarjetas asociadas.
     * @throws {Error} Si el usuario no existe.
     */
    async consultarUsuario(id_usuario) {
        await this.open();

        try {
            this.collectionUsuario = this.db.collection('usuario');
            this.collectionTarjeta = this.db.collection('tarjeta');

            // Consultar el usuario por ID
            const usuario = await this.collectionUsuario.findOne({ _id: new ObjectId(id_usuario) });
            if (!usuario) {
                throw new Error(`El usuario con ID ${id_usuario} no existe.`);
            }

            // Consultar las tarjetas asociadas al usuario
            const tarjetas = await this.collectionTarjeta.find({
                id_usuario: new ObjectId(id_usuario)
            }).toArray();
    
            const res = {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                nickname: usuario.nickname,
                telefono: usuario.telefono,
                rol: usuario.rol,
                tarjetas: tarjetas.map(tarjeta => ({
                    id_tarjeta: tarjeta._id,
                    estado: tarjeta.estado,
                    fecha_expedicion: tarjeta.fecha_expedicion,
                }))
            };    

            await this.connection.close();

            return res;

        } catch (error) {
            if (this.connection) {
                await this.connection.close();
            }
            console.error(error);
        }
    }

    /**
     * Consulta todos los usuarios, con opción de filtrar por rol.
     * 
     * @param {string|null} rol - Rol del usuario para filtrar (vip, estándar, administrador). Si es null, no filtra por rol.
     * 
     * @returns {Array} Lista de usuarios que cumplen con el filtro.
     * @throws {Error} Si el rol no es válido.
     */
    async consultarUsuarios(rol = null) {
        await this.open();
    
        try {
            this.collectionUsuario = this.db.collection('usuario');
    
            let filtro = {};
            if (rol) {
                if (['vip', 'estándar', 'administrador'].includes(rol.toLowerCase())) {
                    filtro.rol = rol.toLowerCase();
                } else {
                    throw new Error(`Rol '${rol}' no es válido. Debe ser 'vip', 'estándar' o 'administrador'.`);
                }
            }
    
            const res = await this.collectionUsuario.find(filtro).toArray();
            await this.connection.close();
            return res;
    
        } catch (error) {
            if (this.connection) {
                await this.connection.close();
            }
            console.error(error);
        }
    }
}
