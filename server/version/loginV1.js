const loginRouter = require('express').Router();
const express = require('express');
const cookieParser = require('cookie-parser');
const loginController = require('../controller/loginController')

loginRouter.post("/", cookieParser(), express.json(), loginController.login )

module.exports = loginRouter;
