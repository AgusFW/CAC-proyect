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
        const sedesTableBody = document.getElementById('sedesTableBody');
        sedesTableBody.innerHTML = '';

        sedes.forEach(sede => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sede.id}</td>
                <td>${sede.nombre}</td>
                <td>${sede.link}</td>
                <td>${sede.direccion}</td>
                <td>${sede.direccion_img}</td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm eliminar-btn" data-id="${sede.id}">
                        Eliminar
                    </button>
                </td>
            `;
            sedesTableBody.appendChild(row);

            // Agregar event listener para eliminar esta sede
            const eliminarBtn = row.querySelector('.eliminar-btn');
            eliminarBtn.addEventListener('click', async () => {
                const confirmarEliminarToast = new bootstrap.Toast(document.querySelector('.toast'));
                confirmarEliminarToast.show();

                document.getElementById('confirmarEliminarBtn').addEventListener('click', async () => {
                    await eliminarSede(sede.id);
                    confirmarEliminarToast.hide();
                });
            });
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar sedes al cargar la página
document.addEventListener('DOMContentLoaded', async function () {
    await loadSedes();
});
