let uri = `${location.href}/v1`;

document.getElementById('signup-form').addEventListener("submit", async (e) => {
    e.preventDefault();

    let peticion = await fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nick: document.getElementById("nick").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            telefono: document.getElementById("telefono").value
        }),
    });

    if (peticion.ok) {
        window.location.href = '/pelicula';
    } else {
        // Manejo de error
        const error = await peticion.json();
        console.error('Error:', error);
        alert('Failed to create account. Please try again.');
    }
});
