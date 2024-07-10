document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOMContentLoaded event fired');

    await load();

    // Navbar toggle for mobile
    const navbarToggle = document.getElementById('navbar-toggle');
    if (navbarToggle) {
        console.log('Navbar toggle element found.');
        navbarToggle.addEventListener('click', function() {
            const navbarMenu = document.getElementById('navbar-menu');
            if (navbarMenu) {
                navbarMenu.classList.toggle('active');
            } else {
                console.error('Navbar menu element not found.');
            }
        });
    } else {
        console.error('Navbar toggle element not found.');
    }
});

async function load() {
    try {
        const response = await fetch('/api/programacion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener programacion');
        }

        const data = await response.json();
        const dataContainer = document.getElementById('data-container');
        if (dataContainer) {
            dataContainer.innerHTML = '';

            data.forEach(dato => {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                    <div class="cards">
                        <img src="${dato.img}" alt="${dato.pelicula}">
                        <div class="cards-content">
                            <h3>${dato.pelicula}</h3>
                            <span class="badgeRojo">Sala ${dato.sala} - ${dato.horario} hs</span>
                            <p>${dato.descripcion}</p>
                        </div>
                    </div>
                `;
                dataContainer.appendChild(card);
            });
        } else {
            console.error('Data container element not found.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
