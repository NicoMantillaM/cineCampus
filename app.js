const funcion = require('./js/module/horario_funcion');
const pelicula = require('./js/module/pelicula');
const boleta = require('./js/module/boleta');
const asiento = require('./js/module/asiento');
const reserva = require('./js/module/reserva');


// let obj = new funcion();
// obj.getFuncionCartelera().then(res=>{console.log(res)})

// let nuevaFuncion = {
//     id_sala: "66cfeee58d26b5da40f46c26",
//     fecha_proyeccion: "18/09/2024",
//     hora_inicio: "13:20",
//     hora_fin: "14:50",
//     id_pelicula: "66cfec618d26b5da40f46c1f"
// }
// obj.addFuncion(nuevaFuncion).then(res=>{console.log(res)})

// let obj = new pelicula();
// let id_pelicula = ("66cfec618d26b5da40f46c21")
// obj.getPelicula(id_pelicula).then(res=>{console.log(res)})


let obj = new boleta();
let id_boleta = ('66ce54128588aa1bd07de77e') 


let id_horario_funcion = ('66cff2dc8d26b5da40f46c3d') 
let asientos = ['66d1bbcbcbb9384d08cf2b8a', '66d1bbcbcbb9384d08cf2b8d']; 
let id_usuario = ('66cfe4288d26b5da40f46c1b') 
let id_reserva = null
let metodo_pago = ("tarjeta de credito")

// obj.comprarBoleta(id_horario_funcion, asientos, id_usuario, id_reserva, metodo_pago).then(res=>{console.log(res)})




let obj = new asiento();
// let id_sala = ("66cfeee58d26b5da40f46c2b")
// let id_horario_funcion = ("66cff2dc8d26b5da40f46c3d") 

// obj.consultarDisponibilidadAsientos(id_sala, id_horario_funcion).then(res=>{console.log(res)})
let nuevoAsiento = {
    id_sala: "66cfeee58d26b5da40f46c2b",
    lugar: "A8",
    tipo_lugar: "general",
    disponibilidad: "disponible",
    fila: "A",
    precio: 12000,
    id_horario_funcion: "66cff2dc8d26b5da40f46c3d",
};
obj.addAsiento(nuevoAsiento).then(res=>{console.log(res)})


// let obj = new reserva();
// let id_usuario = ("66cfe4288d26b5da40f46c1e")
// let asientos = ['66d1bbcbcbb9384d08cf2b8a', '66d1bbcbcbb9384d08cf2b8d']; 
// let id_horario_funcion = ("66cff2dc8d26b5da40f46c3d") 

// obj.createReserva( id_usuario, asientos, id_horario_funcion).then(res=>{console.log(res)})  


// let id_reserva = ("66d560f7b70f5e9cdd4a73a8")
// let id_usuario = ("66cfe4288d26b5da40f46c1e")

// obj.cancelarReserva( id_reserva, id_usuario).then(res=>{console.log(res)})  
