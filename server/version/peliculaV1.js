const pelicula = require('express').Router();

const { getpeliculaCartelera, getPeliculaById  } = require('../controller/peliculaController')

pelicula.get("/", getpeliculaCartelera)
pelicula.get("/:id", getPeliculaById)


module.exports = pelicula;