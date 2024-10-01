const layout = require('express').Router();
// const cookieParser = require('cookie-parser');
// const { authLogged } = require('../middleware/authCookies');
const { join } = require('path')
 
layout.get("/", (req, res) => { 
    res.sendFile(join(__dirname, '../../src/views/welcome.html'));
})

module.exports = layout;
