const asiento = require('express').Router();

const  { consultarDisponibilidadAsientos, getFunctionsForMovie, getRoomForFunction, getSeatsForRoomAndFunction } = require('../controller/asientoController');

asiento.get("/asientos", consultarDisponibilidadAsientos)
asiento.get('/functions/:movieId', getFunctionsForMovie);
asiento.get('/rooms/:functionId', getRoomForFunction);
asiento.get('/seats/:roomId/:functionId', getSeatsForRoomAndFunction);

module.exports = asiento;