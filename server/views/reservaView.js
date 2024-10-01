const layout = require('express').Router();
const { join } = require('path');

// Ruta para servir la vista de selección de asientos y reserva
layout.get("/", (req, res) => { 
    res.sendFile(join(__dirname, '../../src/views/seat.html'));
});

module.exports = layout;
