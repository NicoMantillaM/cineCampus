const Usuario = require('../model/usuarioModel');
const bcrypt = require('bcrypt');

const saveUsuario = async (req, res) => {
    try {
        const { nick, email, password, nombre, apellido, telefono, rol } = req.body;

        // Verificar si el usuario ya existe
        const existingUsuario = await Usuario.findOne({ $or: [{ nick }, { email }] });

        if (existingUsuario) {
            return res.status(409).send({ status: 409, message: 'Usuario already exists' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        // Crear y guardar el nuevo usuario
        const newUsuario = new Usuario({
            nick,
            email,
            password: hashedPassword,
            nombre,
            apellido,
            telefono,
            rol
        });
        const savedUsuario = await newUsuario.save();

        res.status(201).send({ status: 201, message: 'Usuario saved successfully', data: savedUsuario });
    } catch (err) {
        console.error("Usuario creation failed", err);
        res.status(500).send({ status: 500, message: "Usuario not created" });
    }
};

module.exports = { saveUsuario };
