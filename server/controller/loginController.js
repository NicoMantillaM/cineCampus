const bcrypt = require('bcrypt');
const Usuario = require('../model/usuarioModel');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario por email usando Mongoose directamente
        const user = await Usuario.findOne({ email });
        
        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        // Comparar la contraseña proporcionada con la contraseña en la base de datos
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(406).json({ status: 406, message: "Invalid password" });
        }

        // Limpiar el campo de contraseña antes de enviar el usuario de vuelta
        user.password = undefined;

        // Crear cookie y responder con éxito
        res.cookie('token', JSON.stringify(user), { maxAge: 1800000, httpOnly: false })
            .status(200)
            .json({ status: 200, message: "Logged in successfully", data: user });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.findcookie = async (req, res) => {
    console.log(req.cookies);
    res.json({ message: "ok" });
};
