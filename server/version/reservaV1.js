const reserva = require('express').Router();
const express = require('express');
const { ReservaTicket } = require('../controller/reservaController')

reserva.post("/", express.json(), ReservaTicket )

module.exports = reserva;
