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

