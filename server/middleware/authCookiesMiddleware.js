exports.authLogged = async (req, res, next) => {
    try {
        if(req.cookies.token) res.redirect ("/pelicula");
        next();
    } catch (error) {
        res.status(401).json({status: 401, message: "You cannot access the requested view"});
    }
}