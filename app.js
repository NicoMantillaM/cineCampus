const funcion = require('./js/module/horario_funcion');

let obj = new funcion();

obj.getFuncionCartelera().then(res=>{console.log(res)})