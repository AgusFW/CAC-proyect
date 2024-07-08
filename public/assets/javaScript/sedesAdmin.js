document.addEventListener('DOMContentLoaded', async function () {
    document.querySelector('.toggler').addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('active');
    });
  
    document.getElementById('editarSedeForm').addEventListener('submit', editarSede);
    document.getElementById('crearSedeForm').addEventListener('submit', crearSede);
  
    await loadSedes();
  });
  
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
          <td>${sede.sala}</td>
          <td>${sede.direccion}</td>
          <td>
            <button type="button" class="btn btn-warning btn-sm editar-btn" data-id="${sede.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="btn btn-danger btn-sm eliminar-btn" data-id="${sede.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;
        sedesTableBody.appendChild(row);
  
        const eliminarBtn = row.querySelector('.eliminar-btn');
        eliminarBtn.addEventListener('click', async () => {
          const confirmarEliminarToast = new bootstrap.Toast(document.querySelector('.toast'));
          confirmarEliminarToast.show();
  
          const confirmarBtn = document.getElementById('confirmarEliminarBtn');
          confirmarBtn.onclick = async () => {
            await eliminarSede(sede.id);
            confirmarEliminarToast.hide();
          };
        });
  
        const editarBtn = row.querySelector('.editar-btn');
        editarBtn.addEventListener('click', () => {
          mostrarFormularioEdicion(sede);
        });
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function crearSede(event) {
    event.preventDefault();
  
    const nombre = document.getElementById('nombre').value;
    const sala = document.getElementById('sala').value;
    const direccion = document.getElementById('direccion').value;
    const direccionImg = document.getElementById('direccionImg').value;
    const link = document.getElementById('link').value;
  
    try {
      const response = await fetch('/api/sede', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, sala, direccion, direccion_img: direccionImg, link })
      });
  
      if (!response.ok) {
        throw new Error('Error al crear sede');
      }
  
      // Recargar las sedes después de crear
      await loadSedes();
  
      // Ocultar el modal de creación
      const crearSedeModal = new bootstrap.Modal(document.getElementById('crearSedeModal'));
      crearSedeModal.hide();
  
      // Limpiar formulario de creación
      document.getElementById('nombre').value = '';
      document.getElementById('sala').value = '';
      document.getElementById('direccion').value = '';
      document.getElementById('direccionImg').value = '';
      document.getElementById('link').value = '';
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function editarSede(event) {
    event.preventDefault();
  
    const id = document.getElementById('editSedeId').value;
    const nombre = document.getElementById('editNombre').value;
    const sala = document.getElementById('editSala').value;
    const direccion = document.getElementById('editDireccion').value;
    const direccionImg = document.getElementById('editDireccionImg').value;
    const link = document.getElementById('editLink').value;
  
    try {
      const response = await fetch(`/api/sede/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, sala, direccion, direccion_img: direccionImg, link })
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar sede');
      }
  
      // Recargar las sedes después de editar
      await loadSedes();
  
      // Ocultar el modal de edición
      const editarModal = bootstrap.Modal.getInstance(document.getElementById('editarModal'));
      editarModal.hide();
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  function mostrarFormularioEdicion(sede) {
    // Llenar el formulario de edición con los datos actuales de la sede
    document.getElementById('editSedeId').value = sede.id;
    document.getElementById('editNombre').value = sede.nombre;
    document.getElementById('editSala').value = sede.sala;
    document.getElementById('editDireccion').value = sede.direccion;
    document.getElementById('editDireccionImg').value = sede.direccion_img;
    document.getElementById('editLink').value = sede.link;
  
    const editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
    editarModal.show();
  }
  
  async function eliminarSede(sedeId) {
    try {
      const response = await fetch(`/api/sede/${sedeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar sede');
      }
  
      await loadSedes();
    } catch (error) {
      console.error('Error:', error);
    }
  }
  