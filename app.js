const funcion = require('./js/module/horario_funcion');
const pelicula = require('./js/module/pelicula');
const boleta = require('./js/module/boleta');
const asiento = require('./js/module/asiento');
const reserva = require('./js/module/reserva');
const usuario = require('./js/module/usuario');
const tarjeta = require('./js/module/tarjeta');
const sala = require('./js/module/sala');


// let obj = new funcion();
// obj.getFuncionCartelera().then(res=>{console.log(res)})


// let obj = new pelicula();
// let id_pelicula = ("66cfec618d26b5da40f46c21")
// obj.getPelicula(id_pelicula).then(res=>{console.log(res)})


// let obj = new boleta();
// let id_boleta = ('66ce54128588aa1bd07de77e') 


// let id_horario_funcion = ('66cff2dc8d26b5da40f46c3d') 
// let asientos = ['66d1bbcbcbb9384d08cf2b8a', '66d1bbcbcbb9384d08cf2b8d']; 
// let id_usuario = ('66cfe4288d26b5da40f46c1b') 
// let id_reserva = null
// let metodo_pago = ("tarjeta de credito")

// obj.comprarBoleta(id_horario_funcion, asientos, id_usuario, id_reserva, metodo_pago)



// let obj = new asiento();
// let id_sala = ("66cfeee58d26b5da40f46c2b")
// let id_horario_funcion = ("66cff2dc8d26b5da40f46c3d") 

// obj.consultarDisponibilidadAsientos(id_sala, id_horario_funcion).then(res=>{console.log(res)})


// let obj = new reserva();
// let id_usuario = ("66cfe4288d26b5da40f46c1e")
// let asientos = ['66d1bbcbcbb9384d08cf2b8a', '66d1bbcbcbb9384d08cf2b8d']; 
// let id_horario_funcion = ("66cff2dc8d26b5da40f46c3d") 

// obj.createReserva( id_usuario, asientos, id_horario_funcion).then(res=>{console.log(res)})  


// let id_reserva = ("66d560f7b70f5e9cdd4a73a8")
// let id_usuario = ("66cfe4288d26b5da40f46c1e")

// obj.cancelarReserva( id_reserva, id_usuario).then(res=>{console.log(res)})  


// let obj = new usuario();
// let id_usuario = ("66d6160f545ff2532832f401")
// let nombre = ("Juan")
// let apellido = ("Perez")
// let email = ("juanpeo@example.com")
// let nickname = ("juanpe")
// let telefono = ("3123456790")
// let rol = ("vip")

// obj.createUser(nombre, apellido, email, nickname, telefono, rol).then(res=>{console.log(res)})


// let updateData =
// {
//     nombre: "guillermo",
//     apellido: "Perez",
//     email: "juanpeo@example.com",
//     nickname: "juatito",
//     telefono: "3123456790",
//     rol: "vip" 
// };

// obj.updateUser(id_usuario,updateData).then(res=>{console.log(res)})


// let obj = new tarjeta();
// let id_tarjeta = ("66cfed428d26b5da40f46c24")
// const datosActualizados = {
//     fecha_expedicion: "15/10/2024",
//     estado: "inactiva"
// };

// obj.updateTarjeta(id_tarjeta, datosActualizados).then(res=>{console.log(res)})


let obj = new sala();
// const salaData = {
//     tipo_sala: "4D",
//     nombre: "marte"
// };

// obj.agregarSala(salaData).then(res=>{console.log(res)})

let id_sala = ("66d68b169c0c70a8f651de7a");
const datosActualizados = {
    tipo_sala: "XD",
    nombre: "crack"
};

obj.updateSala( id_sala ,datosActualizados).then(res=>{console.log(res)})