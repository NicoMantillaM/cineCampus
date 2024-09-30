let uri = `${location.href}/v1`;

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de manera tradicional

    // Extrae los datos del formulario
    let data = Object.fromEntries(new FormData(e.target));
    
    // Configuración de la petición
    let config = {
        method: "POST", // El método POST para enviar los datos de login
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    try {
        // Realiza la petición fetch a la URI del backend
        let peticion = await fetch(uri, config);
        let res = await peticion.json();
        console.log(res);

        // Si el login es exitoso (status 200), redirigir a la página de películas
        if (res.status === 200) {
            location.href = "/pelicula";
        } else {
            // Maneja errores (puedes mostrar un mensaje en la UI)
            console.error(res.message);
        }
    } catch (error) {
        // Manejo de errores generales
        console.error('Error:', error);
    }
});
