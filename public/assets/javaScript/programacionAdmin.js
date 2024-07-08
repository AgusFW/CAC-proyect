document.addEventListener('DOMContentLoaded', async function () {
    document.querySelector('.toggler').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    document.getElementById('editarPeliculaForm').addEventListener('submit', editarPelicula);
    document.getElementById('crearPeliculaForm').addEventListener('submit', crearPelicula);

    await cargarPeliculas();
});

async function cargarPeliculas() {
    try {
        const response = await fetch('api/programacion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener películas');
        }

        const peliculas = await response.json();
        const peliculasTableBody = document.getElementById('peliculasTableBody');
        peliculasTableBody.innerHTML = '';

        peliculas.forEach(pelicula => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pelicula.id}</td>
                <td>${pelicula.pelicula}</td>
                <td>${pelicula.sala}</td>
                <td>${pelicula.horario}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm editar-btn" data-id="${pelicula.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm eliminar-btn" data-id="${pelicula.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            peliculasTableBody.appendChild(row);

            // Event listener para eliminar la película
            const eliminarBtn = row.querySelector('.eliminar-btn');
            eliminarBtn.addEventListener('click', async () => {
                const confirmarEliminarToast = new bootstrap.Toast(document.querySelector('.toast'));
                confirmarEliminarToast.show();

                const confirmarBtn = document.getElementById('confirmarEliminarBtn');
                confirmarBtn.onclick = async () => {
                    await eliminarPelicula(pelicula.id);
                    confirmarEliminarToast.hide();
                };
            });

            const editarBtn = row.querySelector('.editar-btn');
            editarBtn.addEventListener('click', () => {
                mostrarFormularioEdicion(pelicula);
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function crearPelicula(event) {
    event.preventDefault();

    const nombre = document.getElementById('pelicula').value;
    const sala = document.getElementById('sala').value;
    const direccion = document.getElementById('horario').value;
    const direccionImg = document.getElementById('img').value;
    const link = document.getElementById('link').value;

    try {
        const response = await fetch('/api/pelicula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, sala, direccion, direccion_img: direccionImg, link })
        });

        if (!response.ok) {
            throw new Error('Error al crear película');
        }

        // Recargar las películas después de crear
        await cargarPeliculas();

        // Ocultar el modal de creación
        const crearPeliculaModal = new bootstrap.Modal(document.getElementById('crearPeliculaModal'));
        crearPeliculaModal.hide();

        // Limpiar formulario de creación
        document.getElementById('nombre').value = '';
        document.getElementById('sala').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('direccionImg').value = '';
    } catch (error) {
        console.error('Error:', error);
    }
}

async function editarPelicula(event) {
    event.preventDefault();

    const id = document.getElementById('editPeliculaId').value;
    const nombre = document.getElementById('editNombre').value;
    const sala = document.getElementById('editSala').value;
    const direccion = document.getElementById('editDireccion').value;
    const direccionImg = document.getElementById('editDireccionImg').value;
    const link = document.getElementById('editLink').value;

    try {
        const response = await fetch(`/api/pelicula/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, sala, direccion, direccion_img: direccionImg, link })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar película');
        }

        // Recargar las películas después de editar
        await cargarPeliculas();

        // Ocultar el modal de edición
        const editarModal = bootstrap.Modal.getInstance(document.getElementById('editarModal'));
        editarModal.hide();
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarFormularioEdicion(pelicula) {
    document.getElementById('editPeliculaId').value = pelicula.id;
    document.getElementById('editNombre').value = pelicula.nombre;
    document.getElementById('editSala').value = pelicula.sala;
    document.getElementById('editDireccionImg').value = pelicula.direccion_img;

    const editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
    editarModal.show();
}

async function eliminarPelicula(peliculaId) {
    try {
        const response = await fetch(`/api/pelicula/${peliculaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar película');
        }

        await cargarPeliculas();
    } catch (error) {
        console.error('Error:', error);
    }
}
