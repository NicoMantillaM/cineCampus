const express = require('express');
const indexRouter = require('./server/router/indexRouter')
// const log_In_Router = require('./server/router/loginRouter')
const sign_Up_Router = require('./server/router/signUpRouter')


const app = express();
const { join } = require('path');

const Database = require('./server/database/databaseMongo')

Database.getInstance()

app.use('/css', express.static(join( process.env.EXPRESS_STATIC, 'css')));
app.use('/js', express.static(join( process.env.EXPRESS_STATIC, 'js')));
app.use('/storage', express.static(join( process.env.EXPRESS_STATIC, 'storage')));



app.use("/", indexRouter);
// app.use("/login",  log_In_Router);
app.use("/createAccount", sign_Up_Router);


app.use((req, res) => {
    res.status(404).json({ message: "The endpoint is not available" });
});

let config = {
    port: process.env.EXPRESS_PORT,
    host: process.env.EXPRESS_HOST_NAME
}
app.listen(config, () => {
    console.log(`${process.env.EXPRESS_PROTOCOL}${config.host}:${config.port}`);
});













// const funcion = require('./server/js/controller/horario_funcionController');
// const pelicula = require('./server/js/controller/peliculaController');
// const boleta = require('./server/js/controller/boletaController');
// const asiento = require('./server/js/controller/asientoController');
// const reserva = require('./server/js/controller/reservaController');
// const usuario = require('./server/js/controller/usuarioController');
// const tarjeta = require('./server/js/controller/tarjetaController');
// const sala = require('./server/js/controller/salaController');


// let obj = new funcion();
// obj.getFuncionCartelera().then(res=>{console.log(res)})

// let nuevaFuncion = {
//     id_sala: "66cfeee58d26b5da40f46c2b",
//     fecha_proyeccion: "18/09/2024",
//     hora_inicio: "13:20",
//     hora_fin: "14:50",
//     id_pelicula: "66cfec618d26b5da40f46c1f"
// }
// obj.addFuncion(nuevaFuncion).then(res=>{console.log(res)})



// let obj = new pelicula();
// let id_peliculA = {id_pelicula: "66cfec618d26b5da40f46c21"}
// obj.getPelicula(id_peliculA).then(res=>{console.log(res)})

// let nuevaPelicula = {
//     titulo: "mi villano favorito 4",
//     genero: "comedia",
//     duracion: 96,
//     sinopsis: "Gru, Lucy, Margo, Edith y Agnes dan la bienvenida a un nuevo miembro de la familia, Gru Jr., quien está decidido a atormentar a su padre. Gru se enfrenta a nuevos némesis, Maxime Le Mal y su novia Valentina , por lo cual la familia se ve obligada a huir.",
//     estado: "en cartelera"
// }
// obj.addPelicula(nuevaPelicula).then(res=>{console.log(res)})




// let obj = new boleta();
// let id_boletA = {id_boleta: '66ce54128588aa1bd07de77e'}
// obj.getPelicula(id_peliculA).then(res=>{console.log(res)})

// let nuevaBoleta = {
//     id_horario_funcion: '66cff2dc8d26b5da40f46c3d',
//     asientos: ['66d1bbcbcbb9384d08cf2b8e'],
//     id_usuario: '66cfe4288d26b5da40f46c1b',
//     id_reserva: null,
//     metodo_pago: 'tarjeta de credito'
// };

// obj.comprarBoleta(nuevaBoleta).then(res=>{console.log(res)})




// let obj = new asiento();
// let id_salA = { id_sala: '66cfeee58d26b5da40f46c2b'}
// let id_horario_Funcion = { id_horario_funcion: '66cff2dc8d26b5da40f46c3d'} 

// obj.consultarDisponibilidadAsientos(id_salA, id_horario_Funcion).then(res=>{console.log(res)})

// let nuevoAsiento = {
//     id_sala: "66cfeee58d26b5da40f46c2b",
//     lugar: "A8",
//     tipo_lugar: "general",
//     disponibilidad: "disponible",
//     fila: "A",
//     precio: 12000,
//     id_horario_funcion: "66cff2dc8d26b5da40f46c3d",
// };
// obj.addAsiento(nuevoAsiento).then(res=>{console.log(res)})



// let obj = new reserva();
// let id_usuariO = { id_usuario: '66cfe4288d26b5da40f46c1e'}
// let asientOs = {
//     asientos: ['66cff1bf8d26b5da40f46c38', '66d1bbcbcbb9384d08cf2b8f']
// };
// let id_horario_funciOn = { id_horario_funcion: '66cff2dc8d26b5da40f46c3d'} 

// obj.createReserva( id_usuariO, asientOs, id_horario_funciOn).then(res=>{console.log(res)})  



// let id_reservA = { id_reserva: '66f2aae7529c4e969c83bc85'}
// let id_usuariO = { id_usuario:'66cfe4288d26b5da40f46c1e'}

// obj.cancelarReserva( id_reservA, id_usuariO).then(res=>{console.log(res)})  



// let obj = new usuario();

// let newUser = {
//     nombre: "lolitaa",
//     apellido: "Perez",
//     email: "loli@example.com",
//     nickname: "loli",
//     telefono: "3123456760",
//     rol: "estandar"
// };

// obj.createUser(newUser).then(res=>{console.log(res)})



// let id_usuariO = { id_usuario: '66d853b0419398a541eced2f'}
    
// let updateData =
// {
    //     nombre: "guillermo",
    //     apellido: "Peritz",
    //     email: "juanpeo@example.com",
    //     nickname: "juatito",
    //     telefono: "3123456790",
    //     rol: "vip" 
    // };
    
// obj.updateUser(id_usuariO,updateData).then(res=>{console.log(res)})

// obj.consultarUsuario(id_usuariO).then(res=>{console.log(res)})

// obj.consultarUsuarios().then(res=>{console.log(res)})

// obj.consultarUsuarios('vip').then(res=>{console.log(res)})
        


// let obj = new tarjeta();
// let id_tarjetA = { id_tarjeta: '66d63e7ad7e9769a531c505e'}
// const datosActualizados = {
//     fecha_expedicion: "15/10/2024",
//     estado: "inactiva"
// };

// obj.updateTarjeta(id_tarjetA, datosActualizados).then(res=>{console.log(res)})



// let obj = new sala();
// const salaData = {
//     tipo_sala: "4D",
//     nombre: "marte"
// };

// obj.agregarSala(salaData).then(res=>{console.log(res)})

// let id_salA = { id_sala: '66cfeee58d26b5da40f46c2a'};
// const datosActualizados = {
//     tipo_sala: "XD",
//     nombre: "skylab"
// };

// obj.updateSala( id_salA ,datosActualizados).then(res=>{console.log(res)})


