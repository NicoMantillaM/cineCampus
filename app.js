const funcion = require('./js/module/horario_funcion');
const pelicula = require('./js/module/pelicula');

// let obj = new funcion();
// obj.getFuncionCartelera().then(res=>{console.log(res)})

let obj = new pelicula();
let id_pelicula = ("66cfec618d26b5da40f46c21")
obj.getPelicula(id_pelicula).then(res=>{console.log(res)})
