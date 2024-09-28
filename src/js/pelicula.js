let uri =  `${location.href}/v1`;
console.log(uri);
async function fetchPeliculas() {
    try {
        const response = await fetch(uri);

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();

        if (data.status === 200) {
            displayPeliculas(data.data);
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error al obtener las películas:', error);
    }
}

function displayPeliculas(peliculas) {
    const nowPlayingWrapper = document.getElementById('swiper-wrapper');
    const comingSoonSection = document.getElementById('coming-soon-section');

    nowPlayingWrapper.innerHTML = '';
    comingSoonSection.innerHTML = '';

    peliculas.forEach(pelicula => {
        if (pelicula.estado === 'cartelera') {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide flex flex-col items-center';
            slide.setAttribute('data-id', pelicula._id);

            slide.innerHTML = `
                <img src="${pelicula.poster}" alt="${pelicula.titulo}" class="movie-poster rounded-lg mb-3">
                <div class="text-center">
                    <h3 class="font-semibold mb-2">${pelicula.titulo}</h3>
                    <p class="text-xs text-gray-400">${pelicula.genero}</p>
                </div>
            `;

            slide.addEventListener('click', handleMovieClick);
            nowPlayingWrapper.appendChild(slide);
        } else if (pelicula.estado === 'proximamente') {
            const comingSoonMovie = document.createElement('div');
            comingSoonMovie.className = 'flex items-center space-x-4 mb-4';
            comingSoonMovie.setAttribute('data-id', pelicula._id);

            comingSoonMovie.innerHTML = `
                <img src="${pelicula.poster}" alt="${pelicula.titulo}" class="w-24 h-32 object-cover rounded-lg">
                <div>
                    <h3 class="font-semibold">${pelicula.titulo}</h3>
                    <p class="text-xs text-gray-400">${pelicula.genero}</p>
                </div>
            `;

            comingSoonMovie.addEventListener('click', handleMovieClick);
            comingSoonSection.appendChild(comingSoonMovie);
        }
    });

    // Configurar el Swiper para la sección de "Now Playing"
    new Swiper('.mySwiper', {
        slidesPerView: 2,
        centeredSlides: true,
        spaceBetween: 20,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
        on: {
            slideChange: function () {
                const slides = this.slides;
                slides.forEach((slide, index) => {
                    if (index === this.activeIndex) {
                        slide.style.opacity = 1;
                        slide.style.transform = 'scale(1)';
                    } else {
                        slide.style.opacity = 0.5;
                        slide.style.transform = 'scale(0.8)';
                    }
                });
            },
        },
    });
}


async function handleMovieClick(e) {
    const movieId = e.currentTarget.getAttribute('data-id');
    try {
        const response = await fetch(`${uri}/${movieId}`);
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();

        if (data.status === 200) {
            console.log('Detalles de la película:', data.data);
            
            localStorage.setItem('movieDetails', JSON.stringify(data.data));

            window.location.href = '/detalles';
        } else {
            console.error(data.message);
            alert('No se pudo obtener los detalles de la película');
        }
    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
        alert('Error al obtener los detalles de la película');
    }
}

document.addEventListener('DOMContentLoaded', fetchPeliculas);