document.addEventListener('DOMContentLoaded', async function () {
    // Event listener para mostrar/ocultar la barra lateral
    document.querySelector('.toggler').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Cargar usuarios al inicio
    await loadUsuarios();

    // Event listener para abrir el modal de creación de usuario
    document.getElementById('agregarUsuarioBtn').addEventListener('click', abrirModalCrearUsuario);

    // Event listener para guardar un usuario nuevo
    document.getElementById('guardarUsuarioBtn').addEventListener('click', async function () {
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rol = document.getElementById('rol').value;

        try {
            const response = await fetch('/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, email, password, rol })
            });

            if (!response.ok) {
                throw new Error('Error al crear usuario');
            }

            // Limpiar formulario de creación después de guardar
            document.getElementById('crearUsuarioForm').reset();

            // Recargar la lista de usuarios
            await loadUsuarios();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Función para cargar usuarios
    async function loadUsuarios() {
        try {
            const response = await fetch('/usuarios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }

            const usuarios = await response.json();
            const usuariosTableBody = document.getElementById('usuariosTableBody');
            usuariosTableBody.innerHTML = '';

            usuarios.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <button type="button" class="btn btn-warning btn-sm editar-btn" data-id="${usuario.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm eliminar-btn" data-id="${usuario.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                usuariosTableBody.appendChild(row);

                // Event listener para el botón de eliminar usuario
                const eliminarBtn = row.querySelector('.eliminar-btn');
                eliminarBtn.addEventListener('click', () => {
                    const confirmarEliminarToast = new bootstrap.Toast(document.querySelector('.toast'));
                    confirmarEliminarToast.show();

                    const confirmarBtn = document.getElementById('confirmarEliminarBtn');
                    confirmarBtn.onclick = async () => {
                        await eliminarUsuario(usuario.id);
                        confirmarEliminarToast.hide();
                    };
                });

                // Event listener para el botón de editar usuario
                const editarBtn = row.querySelector('.editar-btn');
                editarBtn.addEventListener('click', () => {
                    // Función para mostrar el formulario de edición
                    mostrarFormularioEdicion(usuario);
                });
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Función para eliminar un usuario
    async function eliminarUsuario(usuarioId) {
        try {
            const response = await fetch(`/usuario/${usuarioId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            // Recargar la lista de usuarios después de eliminar
            await loadUsuarios();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Función para abrir el modal de creación de usuario
    function abrirModalCrearUsuario() {
        const crearUsuarioModal = new bootstrap.Modal(document.getElementById('crearUsuarioModal'));
        crearUsuarioModal.show();
    }

    // Función para mostrar el formulario de edición de usuario
    function mostrarFormularioEdicion(usuario) {
        document.getElementById('editUsuarioId').value = usuario.id;
        document.getElementById('editNombre').value = usuario.nombre;
        document.getElementById('editEmail').value = usuario.email;
        document.getElementById('editRol').value = usuario.rol;

        const editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
        editarModal.show();
    }

    // Event listener para guardar los cambios al editar un usuario
    document.getElementById('guardarCambiosBtn').addEventListener('click', async function () {
        const id = document.getElementById('editUsuarioId').value;
        const nombre = document.getElementById('editNombre').value;
        const email = document.getElementById('editEmail').value;
        const rol = document.getElementById('editRol').value;

        try {
            const response = await fetch(`/usuario/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, email, rol })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar usuario');
            }

            // Recargar la lista de usuarios después de editar
            await loadUsuarios();

            // Ocultar el modal de edición
            const editarModal = bootstrap.Modal.getInstance(document.getElementById('editarModal'));
            editarModal.hide();
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
