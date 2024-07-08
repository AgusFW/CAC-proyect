
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

                <div class="cards">
                    <img src="${dato.img}" alt="${dato.pelicula}">
                    <div class="cards-content">
                    <h3>${dato.pelicula}</h3>
                    <span class="badgeRojo">Sala ${dato.sala} - ${dato.horario} hs</span>
                    <p>${dato.descripcion}</p>
                    </div>
                </div>

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
