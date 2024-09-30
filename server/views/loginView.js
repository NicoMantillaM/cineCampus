const layout = require('express').Router();
const { join } = require('path');
const cookieParser =  require('cookie-parser');
const { authLogged } =  require('../middleware/authCookiesMiddleware');

layout.get("/", cookieParser(), authLogged, (req, res)=>{ 
    res.sendFile(join(process.env.EXPRESS_STATIC, '/views/login.html'));
})

module.exports = layout;