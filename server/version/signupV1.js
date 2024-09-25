const signup = require('express').Router();
const express = require('express');
const { saveUsuario } = require('../controller/signUpController')

signup.post("/", express.json(), saveUsuario)


module.exports = signup;