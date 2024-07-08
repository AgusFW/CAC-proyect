
async function loadSedes() {
    try {
        const response = await fetch('/api/sedes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener sedes');
        }

        const sedes = await response.json();
        const sedesContainer = document.getElementById('sedes-container');
        sedesContainer.innerHTML = '';

        sedes.forEach(sede => {
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
            <div>
                <a href="${sede.link}" target="_blank">
                <div class="cards">
                    <img src="${sede.direccion_img}" alt="${sede.nombre}">
                    <div class="cards-content">
                    <h3>${sede.nombre}</h3>
                    <span class="badgeRojo">${sede.sala}</span>
                    <p>${sede.direccion}</p>
                    </div>
                </div>
                </a>
            </div>
            `;
            sedesContainer.appendChild(card);


        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar sedes al cargar la página
document.addEventListener('DOMContentLoaded', async function () {
    await loadSedes();
});
