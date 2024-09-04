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

### Clase `funcion`

La clase `funcion` gestiona las funciones o proyecciones de películas en un cine. Esta clase extiende la clase `connect`, lo que permite la conexión y manipulación de datos en la base de datos MongoDB.

#### Métodos

1. **`getFuncionCartelera`**

   - **Descripción**: Este método obtiene todas las funciones que están actualmente en cartelera. Se realiza un `lookup` para obtener la información detallada de cada película y se filtran solo aquellas cuyo estado es "cartelera".

   - **Retorno**: Retorna un array de objetos, donde cada objeto contiene detalles de la función y la película correspondiente, incluyendo `id_sala`, `fecha_proyeccion`, `hora_inicio`, `hora_fin`, `titulo`, `genero`, `duracion`, `sinopsis`, y `estado`.

   - Uso

     :

     ```javascript
      let obj = new funcion();
     obj.getFuncionCartelera().then(res => {
         console.log(res);
     });
     ```

2. **`addFuncion`**

   - Descripción

     : Este método permite agregar una nueva función (proyección de una película) a la base de datos. Antes de insertar la nueva función, se realizan varias validaciones:

     - La película debe existir y estar en cartelera.
     - La sala debe existir.
     - No debe haber conflictos de horario con otras funciones en la misma sala.

   - Parámetros

     :

     - `nuevaFuncion` (Object): Un objeto que contiene los detalles de la nueva función a agregar, incluyendo `id_sala`, `fecha_proyeccion`, `hora_inicio`, `hora_fin`, y `id_pelicula`.

   - **Retorno**: Retorna un objeto con un mensaje indicando si la función fue creada con éxito.

   - Uso

     :

     ```javascript
    let obj = new funcion();
     let nuevaFuncion = {
         id_sala: "66cfeee58d26b5da40f46c26",
         fecha_proyeccion: "18/09/2024",
         hora_inicio: "13:20",
         hora_fin: "14:50",
         id_pelicula: "66cfec618d26b5da40f46c1f"
     };
     
     obj.addFuncion(nuevaFuncion).then(res => {
         console.log(res);
     })
     ```

     ### Clase `pelicula`

Esta clase se encarga de gestionar las operaciones relacionadas con las películas en la base de datos, incluyendo la adición de nuevas películas y la obtención de detalles de una película específica.

#### **Ejemplo de uso**

```javascript
 // Crear una instancia de la clase pelicula
let obj = new pelicula();

// Obtener una película por su ID
let id_pelicula = "66cfec618d26b5da40f46c21";
obj.getPelicula(id_pelicula).then(res => { console.log(res) });

// Agregar una nueva película a la base de datos
let nuevaPelicula = {
    titulo: "mi villano favorito 4",
    genero: "comedia",
    duracion: 96,
    sinopsis: "Gru, Lucy, Margo, Edith y Agnes dan la bienvenida a un nuevo miembro de la familia, Gru Jr., quien está decidido a atormentar a su padre. Gru se enfrenta a nuevos némesis, Maxime Le Mal y su novia Valentina, por lo cual la familia se ve obligada a huir.",
    estado: "en cartelera"
};
obj.addPelicula(nuevaPelicula).then(res => { console.log(res) });
```

#### **Métodos**

- **`addPelicula(nuevaPelicula)`**
  Este método agrega una nueva película a la base de datos. Verifica si ya existe una película con el mismo título antes de realizar la inserción.

  **Parámetros:**

  - `nuevaPelicula` (Object): Un objeto que contiene los datos de la película a agregar, incluyendo `titulo`, `genero`, `duracion`, `sinopsis`, y `estado`.

  **Retorna:**

  - Un objeto con un mensaje de éxito si la película fue agregada correctamente.

- **`getPelicula(id_pelicula)`**
  Este método obtiene los detalles de una película específica a partir de su ID.

  **Parámetros:**

  - `id_pelicula` (String): El ID de la película que se desea obtener.

  **Retorna:**

  - Un objeto que representa los datos de la película encontrada, o un error si no existe.

  ### Clase `reserva`

La clase `reserva` se utiliza para gestionar las reservas de asientos para una función de cine. Esta clase permite crear y cancelar reservas, asegurando la integridad de los datos y la disponibilidad de los asientos.

## Métodos

### `createReserva(id_usuario, asientos, id_horario_funcion)`

Este método permite crear una nueva reserva para un usuario específico, verificando la disponibilidad de los asientos y su pertenencia a la sala de la función.

#### Parámetros:
- `id_usuario` (String): ID del usuario que realiza la reserva.
- `asientos` (Array<String>): Un array con los IDs de los asientos que se desean reservar.
- `id_horario_funcion` (String): ID del horario de la función a la cual pertenece la reserva.

#### Ejemplo de uso:
```javascript
let obj = new reserva();
let id_usuario = "66cfe4288d26b5da40f46c1e";
let asientos = ['66d1bbcbcbb9384d08cf2b8a', '66d1bbcbcbb9384d08cf2b8d']; 
let id_horario_funcion = "66cff2dc8d26b5da40f46c3d";

obj.createReserva(id_usuario, asientos, id_horario_funcion).then(res => {
    console.log(res);
});

- ### `cancelarReserva(id_reserva, id_usuario)`

  Este método permite cancelar una reserva existente, devolviendo los asientos a su estado disponible.

  #### Parámetros:

  - `id_reserva` (String): ID de la reserva que se desea cancelar.
  - `id_usuario` (String): ID del usuario que realizó la reserva.

  #### Ejemplo de uso:

  javascript
  let obj = new reserva();
  let id_reserva = "66d560f7b70f5e9cdd4a73a8";
  let id_usuario = "66cfe4288d26b5da40f46c1e";
  
  obj.cancelarReserva(id_reserva, id_usuario).then(res => {
      console.log(res);
  });
  ```

### Clase `sala`

La clase `sala` es responsable de gestionar la colección `sala` en la base de datos. Esta clase permite agregar nuevas salas y actualizar la información de salas existentes.

## Métodos

### 1. `agregarSala(salaData)`

Este método permite agregar una nueva sala a la colección `sala`.

#### Parámetros:
- **`salaData`** *(Objeto)*: Contiene los datos de la sala que se desea agregar. Este objeto debe incluir la información necesaria para la sala, como nombre, capacidad, tipo, etc.

#### Ejemplo de uso:
```javascript
const sala = require('./ruta/a/la/clase/sala');
let obj = new sala();

let nuevaSala = {
    nombre: "Sala 1",
    capacidad: 200,
    tipo: "IMAX",
    ubicacion: "Piso 1"
};

obj.agregarSala(nuevaSala).then(res => { console.log(res) });

- ### 2. `updateSala(id_sala, datosActualizados)`

  Este método permite actualizar los datos de una sala existente en la colección `sala`.

  #### Parámetros:

  - **`id_sala`** *(String)*: ID de la sala que se desea actualizar.
  - **`datosActualizados`** *(Objeto)*: Contiene los campos que se desean actualizar en la sala. Solo se actualizarán los campos proporcionados en este objeto.

  #### Ejemplo de uso:

  ```javascript
  const sala = require('./ruta/a/la/clase/sala');
  let obj = new sala();
  
  let id_sala = "66cfec618d26b5da40f46c21";
  
  let datosActualizados = {
      capacidad: 220,
      tipo: "4DX"
  };
  
  obj.updateSala(id_sala, datosActualizados).then(res => { console.log(res) });
  ```

- ### Clase `tarjeta`

  La clase `tarjeta` gestiona operaciones relacionadas con las tarjetas en la base de datos, permitiendo actualizar la información de una tarjeta específica.

  #### Métodos

  ##### `updateTarjeta(id_tarjeta, datosActualizados)`

  Actualiza los datos de una tarjeta existente en la colección `tarjeta`.

  - **Parámetros:**

    - `id_tarjeta` (string): El ID de la tarjeta que se desea actualizar.
    - `datosActualizados` (Object): Un objeto con los campos que se deben actualizar en la tarjeta.

  - **Retorno:**

    - Éxito

      : Un objeto con el siguiente formato:

      ```javascript
      {
        "mensaje": "Tarjeta actualizada con éxito",
        "detalles": { /* Datos actualizados */ }
      }
      ```

    - Fallido

      : En caso de no realizar ninguna actualización, retorna:

      ```javascript
      {
        "mensaje": "No se realizó ninguna actualización",
        "detalles": { /* Datos actualizados */ }
      }
      ```

  - **Excepciones:**

    - Lanza un error si la tarjeta con el `id_tarjeta` proporcionado no existe en la base de datos.

  #### Ejemplos de Uso

  1. **Actualizar una tarjeta existente**

     ```javascript
      // Crear una instancia de la clase tarjeta
     let obj = new tarjeta();
     
     // Definir el ID de la tarjeta y los datos a actualizar
     let id_tarjeta = "66cfed428d26b5da40f46c24";
     const datosActualizados = {
         fecha_expedicion: "15/10/2024",
         estado: "inactiva"
     };
     
     // Llamar al método updateTarjeta
     obj.updateTarjeta(id_tarjeta, datosActualizados).then(res => {
         console.log(res);
     });
     ```

   ### Clase `usuario`

La clase `usuario` proporciona funcionalidades para gestionar usuarios en una base de datos MongoDB, incluyendo la creación, actualización, y consulta de usuarios. A continuación se detallan los métodos disponibles y ejemplos de uso.

## Métodos Disponibles

### `createUser(nombre, apellido, email, nickname, telefono, rol)`

Crea un nuevo usuario con el rol especificado. Asigna roles en MongoDB y crea una tarjeta VIP si el rol es 'vip'.

**Parámetros:**
- `nombre` (string): Nombre del usuario.
- `apellido` (string): Apellido del usuario.
- `email` (string): Correo electrónico del usuario.
- `nickname` (string): Apodo del usuario.
- `telefono` (string): Número de teléfono del usuario.
- `rol` (string): Rol del usuario. Puede ser 'Administrador', 'vip', o 'estándar'.

**Ejemplo de Uso:**
```javascript
let obj = new usuario();
let nombre = "Juan";
let apellido = "Perez";
let email = "juanpeo@example.com";
let nickname = "juanpe";
let telefono = "3123456790";
let rol = "vip";

obj.createUser(nombre, apellido, email, nickname, telefono, rol).then(res => {
    console.log(res);
});

### `updateUser(id_usuario, updateData)`

Actualiza la información de un usuario existente. Si se actualiza el rol a 'vip', se crea una tarjeta VIP si no existe. También actualiza el rol del usuario en MongoDB.

**Parámetros:**

- `id_usuario` (string): ID del usuario a actualizar.
- `updateData` (Object): Datos a actualizar, incluyendo nombre, apellido, email, nickname, teléfono y rol.

**Ejemplo de Uso:**

```javascript
let obj = new usuario();
let id_usuario = "66d6160f545ff2532832f401";
let updateData = {
    nombre: "Guillermo",
    apellido: "Perez",
    email: "juanpeo@example.com",
    nickname: "juatito",
    telefono: "3123456790",
    rol: "vip"
};

obj.updateUser(id_usuario, updateData).then(res => {
    console.log(res);
});
```

### `consultarUsuario(id_usuario)`

Consulta los datos de un usuario específico por su ID, incluyendo las tarjetas asociadas al usuario.

**Parámetros:**

- `id_usuario` (string): ID del usuario a consultar.

**Ejemplo de Uso:**

```javascript
let obj = new usuario();
let id_usuario = "66d6160f545ff2532832f401";

obj.consultarUsuario(id_usuario).then(res => {
    console.log(res);
});
```

### `consultarUsuarios(rol = null)`

Consulta todos los usuarios, con opción de filtrar por rol. Los roles válidos son 'vip', 'estándar', y 'administrador'.

**Parámetros:**

- `rol` (string|null): Rol del usuario para filtrar. Si es `null`, no filtra por rol.

**Ejemplo de Uso:**

```javascript
let obj = new usuario();

obj.consultarUsuarios('vip').then(res => {
    console.log(res);
});
```