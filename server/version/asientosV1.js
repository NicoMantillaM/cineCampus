const asiento = require('express').Router();
const { getFunctionsForMovie, getSeatsForRoomAndFunction, getRoomDetails } = require('../controller/asientoController');

asiento.get('/functions/:movieId', getFunctionsForMovie);
asiento.get('/seats/:roomId/:functionId', getSeatsForRoomAndFunction);
asiento.get('/rooms/:roomId', getRoomDetails);

module.exports = asiento;