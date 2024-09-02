const connect = require('../../db/connect/connect');
const { ObjectId } = require('mongodb');

module.exports = class usuario extends connect {
    collectionUsuario;  // Nombre corregido

    constructor() {
        super();
    }

    async createUser(nombre, apellido, email, nickname, telefono, rol) {
        await this.open();


        try {
            this.collectionUsuario = this.db.collection('usuario');
            this.collectionTarjeta = this.db.collection('tarjeta'); // Conectar a la colección 'tarjeta'

            const usuarioEmailExiste = await this.collectionUsuario.findOne({ email: email });
            if (usuarioEmailExiste) {
                throw new Error(`El usuario con el email: ${email} ya existe`);
            }

            const usuarioNicknameExiste = await this.collectionUsuario.findOne({ nickname: nickname });
            if (usuarioNicknameExiste) {
                throw new Error(`El usuario con el nickname: ${nickname} ya existe`);
            }

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
                rol:rol
                
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
                // Asignar el rol 'vip'
                await this.db.command({
                    createUser: nickname,
                    pwd: telefono,
                    roles: [{ role: 'vip', db: 'cineCampus' }]
                });

                // Crear la tarjeta VIP
                await this.collectionTarjeta.insertOne({
                    _id: new ObjectId(),
                    fecha_expedicion: new Date().toISOString().slice(0, 10), // Usar la fecha actual en formato "YYYY-MM-DD"
                    estado: "activa",
                    id_usuario: usuarioId
                });
            } else {
                // Asignar el rol 'estandar'
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

    async updateUser(id_usuario, updateData) {
        await this.open();

        try {
            this.collectionUsuario = this.db.collection('usuario');
            this.collectionTarjeta = this.db.collection('tarjeta');

            // Validar si el usuario existe
            const usuarioExiste = await this.collectionUsuario.findOne({ _id: new ObjectId(id_usuario) });
            if (!usuarioExiste) {
                throw new Error(`El usuario con el ID: ${id_usuario} no existe`);
            }

            // Si el rol está siendo actualizado
            if (updateData.rol) {
                const nuevoRol = updateData.rol;

                if (nuevoRol === 'vip') {
                    // Verificar si el usuario ya tiene una tarjeta VIP
                    const tarjetaExiste = await this.collectionTarjeta.findOne({ id_usuario: new ObjectId(id_usuario) });

                    if (!tarjetaExiste) {
                        // Crear una nueva tarjeta VIP
                        await this.collectionTarjeta.insertOne({
                            _id: new ObjectId(),
                            fecha_expedicion: new Date().toISOString().slice(0, 10), // Fecha actual en formato "YYYY-MM-DD"
                            estado: 'activa',
                            id_usuario: new ObjectId(id_usuario)
                        });
                    }

                    // Asignar el rol 'vip' en MongoDB
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
                    // Asignar el rol 'estandar' para usuarios estándar
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
}
