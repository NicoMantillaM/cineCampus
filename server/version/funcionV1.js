const funcion = require('express').Router();

const { getFuncionCartelera } = require('../controller/horario_funcionController')

funcion.get("/", getFuncionCartelera)

module.exports = funcion;