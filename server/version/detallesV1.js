const detalle = require('express').Router();

const { getPeliculaById } = require('../controller/detallesController')

detalle.get("/:id", getPeliculaById)

module.exports = detalle;