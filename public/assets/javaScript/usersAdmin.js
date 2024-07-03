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
                <td>${usuario._id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.password}</td>
                <td>${usuario.email}</td>
                <td>${usuario.rol}</td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm eliminar-btn" data-id="${usuario._id}">
                        Eliminar
                    </button>
                </td>
            `;
            usuariosTableBody.appendChild(row);
        });

       // Agregar event listener a los botones de eliminar
       const eliminarButtons = document.querySelectorAll('.eliminar-btn');
       eliminarButtons.forEach(btn => {
           btn.addEventListener('click', () => {
               const usuarioId = btn.getAttribute('data-id');
               const confirmarEliminarToast = new bootstrap.Toast(document.querySelector('.toast'));
               confirmarEliminarToast.show();

               document.getElementById('confirmarEliminarBtn').addEventListener('click', async () => {
                   await eliminarUsuario(usuarioId);
                   confirmarEliminarToast.hide();
               });
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

       await loadUsuarios();
   } catch (error) {
       console.error('Error:', error);
   }
}

// Función para abrir el modal de crear usuario
function abrirModalCrearUsuario() {
    const crearUsuarioModal = new bootstrap.Modal(document.getElementById('crearUsuarioModal'));
    crearUsuarioModal.show();
}

document.getElementById('agregarUsuarioBtn').addEventListener('click', abrirModalCrearUsuario);

// Función para guardar un nuevo usuario
document.getElementById('guardarUsuarioBtn').addEventListener('click', async function () {
    const nombre = document.getElementById('nombre').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const rol = document.getElementById('rol').value;

    try {
        const response = await fetch('/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, password, email, rol })
        });

        if (!response.ok) {
            throw new Error('Error al crear usuario');
        }

        document.getElementById('crearUsuarioForm').reset();

        await loadUsuarios();
    } catch (error) {
        console.error('Error:', error);
    }
});

// Cargar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', async function () {
    await loadUsuarios();
});
