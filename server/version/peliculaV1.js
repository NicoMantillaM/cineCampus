const pelicula = require('express').Router();

const { getpeliculaCartelera } = require('../controller/peliculaController')

pelicula.get("/", getpeliculaCartelera)


module.exports = pelicula;