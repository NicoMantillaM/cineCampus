const funcion = require('./js/module/horario_funcion');
const pelicula = require('./js/module/pelicula');
const boleta = require('./js/module/boleta');
const asiento = require('./js/module/asiento');


// let obj = new funcion();
// obj.getFuncionCartelera().then(res=>{console.log(res)})


// let obj = new pelicula();
// let id_pelicula = ("66cfec618d26b5da40f46c21")
// obj.getPelicula(id_pelicula).then(res=>{console.log(res)})


// let obj = new boleta();
// let id_boleta = ('66ce54128588aa1bd07de77e') 


// let id_horario_funcion = ('66cff2dc8d26b5da40f46c3d') 
// let asientos = ['66d1bbcbcbb9384d08cf2b8a', '66d1bbcbcbb9384d08cf2b8d']; 
// let id_usuario = ('66cfe4288d26b5da40f46c1c') 
// let id_reserva = null
// let metodo_pago = ("tarjeta de credito")

// obj.comprarBoleta(id_horario_funcion, asientos, id_usuario, id_reserva, metodo_pago)



let obj = new asiento();
let id_sala = ("66cfeee58d26b5da40f46c2b")
let id_horario_funcion = ("66cff2dc8d26b5da40f46c3d") 

obj.consultarDisponibilidadAsientos(id_sala, id_horario_funcion).then(res=>{console.log(res)})