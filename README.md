# Clase `asiento`

La clase `asiento` gestiona las operaciones relacionadas con los asientos en una sala de cine, como la consulta de disponibilidad y la adición de nuevos asientos en la base de datos.

## Métodos

### `consultarDisponibilidadAsientos(id_sala, id_horario_funcion)`

Este método consulta la disponibilidad de asientos en una sala específica para un horario de función determinado.

**Código:**

```javascript
async consultarDisponibilidadAsientos(id_sala, id_horario_funcion) {
    await this.open();
    try {
        const collectionHorarioFuncion = this.db.collection('horario_funcion');
        const collectionSala = this.db.collection('sala');

        const salaExiste = await collectionSala.findOne({ _id: new ObjectId(id_sala) });
        if (!salaExiste) {
            throw new Error('El id_sala proporcionado no existe.');
        }

        const horarioExiste = await collectionHorarioFuncion.findOne({ _id: new ObjectId(id_horario_funcion) });
        if (!horarioExiste) {
            throw new Error('El id_horario_funcion proporcionado no existe.');
        }

        const funcion = await collectionHorarioFuncion.findOne({
            _id: new ObjectId(id_horario_funcion),
            id_sala: new ObjectId(id_sala)
        });

        if (!funcion) {
            throw new Error('No hay ninguna función asignada a esa sala.');
        }

        const collectionAsiento = this.db.collection('asiento');
        const res = await collectionAsiento.find({
            id_sala: new ObjectId(id_sala),
            id_horario_funcion: new ObjectId(id_horario_funcion),
            disponibilidad: 'disponible'
        }).toArray();

        this.connection.close();
        return res;

    } catch (error) {
        console.log(error);
    }
}
```

**Ejemplo de Ejecución:**

```javascript
let obj = new asiento();
let id_sala = "66cfeee58d26b5da40f46c2b";
let id_horario_funcion = "66cff2dc8d26b5da40f46c3d";

obj.consultarDisponibilidadAsientos(id_sala, id_horario_funcion).then(res => {
    console.log(res);
});
```

### `addAsiento(nuevoAsiento)`

Este método agrega un nuevo asiento a la base de datos, verificando que la sala y el horario de función existen, y que el asiento no esté ya registrado.

**Código:**

```javascript
async addAsiento(nuevoAsiento) {
    await this.open();
    try {
        const collectionSala = this.db.collection('sala');
        const collectionHorarioFuncion = this.db.collection('horario_funcion');
        this.collectionAsiento = this.db.collection('asiento');

        nuevoAsiento.id_sala = new ObjectId(nuevoAsiento.id_sala);
        nuevoAsiento.id_horario_funcion = new ObjectId(nuevoAsiento.id_horario_funcion);

        const sala = await collectionSala.findOne({ _id: nuevoAsiento.id_sala });
        if (!sala) {
            throw new Error('La sala especificada no existe.');
        }

        const horarioFuncion = await collectionHorarioFuncion.findOne({ _id: nuevoAsiento.id_horario_funcion });
        if (!horarioFuncion) {
            throw new Error('El horario de función especificado no existe.');
        }

        const funcion = await collectionHorarioFuncion.findOne({
            _id: nuevoAsiento.id_horario_funcion,
            id_sala: nuevoAsiento.id_sala
        });

        if (!funcion) {
            throw new Error('El id_sala no coincide con el id_horario_funcion.');
        }

        const asientoExistente = await this.collectionAsiento.findOne({
            id_sala: nuevoAsiento.id_sala,
            id_horario_funcion: nuevoAsiento.id_horario_funcion,
            lugar: nuevoAsiento.lugar
        });

        if (asientoExistente) {
            throw new Error('El asiento ya existe para esa función.');
        }

        const res = await this.collectionAsiento.insertOne(nuevoAsiento);
        if (!res.insertedId) {
            throw new Error('No se pudo agregar el asiento.');
        }

        await this.connection.close();
        return { message: "Asiento agregado con éxito" };

    } catch (error) {
        if (this.connection) {
            await this.connection.close();
        }
        console.error(error);
    }
}
```

**Ejemplo de Ejecución:**

```javascript
let obj = new asiento();
let nuevoAsiento = {
    id_sala: "66cfeee58d26b5da40f46c2b",
    lugar: "A8",
    tipo_lugar: "general",
    disponibilidad: "disponible",
    fila: "A",
    precio: 12000,
    id_horario_funcion: "66cff2dc8d26b5da40f46c3d",
};

obj.addAsiento(nuevoAsiento).then(res => {
    console.log(res);
});
```

## Clase `boleta`

La clase `boleta` es una extensión de la clase `connect` que permite gestionar la compra de boletos para funciones de cine. A través de esta clase, puedes validar la existencia de funciones, usuarios y asientos, además de procesar la compra aplicando descuentos si corresponde.

### Métodos

#### `comprarBoleta(id_horario_funcion, asientos, id_usuario, id_reserva, metodo_pago)`

Este método realiza la compra de una boleta para una función de cine.

##### Parámetros

- `id_horario_funcion` (string): El ID del horario de la función.
- `asientos` (Array): Un array con los IDs de los asientos seleccionados.
- `id_usuario` (string): El ID del usuario que está comprando la boleta.
- `id_reserva` (string, opcional): El ID de la reserva (puede ser null si no se utiliza).
- `metodo_pago` (string): El método de pago utilizado para la compra.

##### Retorno

Este método retorna un objeto que incluye:

- `mensaje` (string): Un mensaje de confirmación de la compra.
- `detalles` (Object): Un objeto con los detalles de la compra, incluyendo:
  - `id_boleta` (ObjectId): El ID de la boleta generada.
  - `fecha_de_compra` (string): La fecha de compra en formato `dd/mm/yyyy`.
  - `usuario` (string): El ID del usuario que realizó la compra.
  - `asientos` (Array): Los IDs de los asientos comprados.
  - `horario_de_la_funcion` (string): El ID del horario de la función.
  - `metodo_de_pago` (string): El método de pago utilizado.
  - `precio_total` (number): El precio total de la compra.

##### Ejemplo de uso

```
//  Importar la clase `boleta`
const boleta = require('./path_to_boleta_class/boleta');

// Crear una instancia de la clase `boleta`
let obj = new boleta();

// Definir los datos necesarios para la compra de la boleta
let id_horario_funcion = ('66cff2dc8d26b5da40f46c3d');
let asientos = ['66d1bbcbcbb9384d08cf2b8e'];
let id_usuario = ('66cfe4288d26b5da40f46c1b');
let id_reserva = null;
let metodo_pago = ("tarjeta de credito");

//  Realizar la compra de la boleta y manejar la respuesta
obj.comprarBoleta(id_horario_funcion, asientos, id_usuario, id_reserva, metodo_pago)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });
```

### Ejemplo de respuesta esperada

```
{
  "mensaje": "Boleta comprada con éxito",
  "detalles": {
    "id_boleta": "ObjectId('66ce54128588aa1bd07de77e')",
    "fecha_de_compra": "03/09/2024",
    "usuario": "66cfe4288d26b5da40f46c1b",
    "asientos": ["66d1bbcbcbb9384d08cf2b8e"],
    "horario_de_la_funcion": "66cff2dc8d26b5da40f46c3d",
    "metodo_de_pago": "tarjeta de credito",
    "precio_total": 50000
  }
}
```

### Manejo de errores

En caso de que ocurra un error durante la compra, el método `comprarBoleta` lanzará un error con un mensaje descriptivo. Asegúrate de manejar estos errores adecuadamente en tu aplicación.