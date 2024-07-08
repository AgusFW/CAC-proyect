
async function load() {
    try {
        const response = await fetch('/api/programacion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener progamacion');
        }

        const data = await response.json();
        const dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = '';

        data.forEach(dato => {
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
            <div>
                <a href="${dato.pelicula}" target="_blank">
                <div class="cards">
                    <img src="${dato.descripcion}" alt="${dato.nombre}">
                    <div class="cards-content">
                    <h3>${dato.sala}</h3>
                    <span class="badgeRojo">${dato.horario}</span>
                    <p>${dato.direccion}</p>
                    </div>
                </div>
                </a>
            </div>
            `;
            dataContainer.appendChild(card);


        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar sedes al cargar la página
document.addEventListener('DOMContentLoaded', async function () {
    await load();
});
