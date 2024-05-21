//BOOSTRAP

"https://code.jquery.com/jquery-3.6.0.min.js"
"https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"


//
document.addEventListener("DOMContentLoaded", function () {
    const img = document.querySelector(".fade-in");
    img.classList.add("loaded");
  });

document.getElementById('navbar-toggle').addEventListener('click', function() {
    const navbarMenu = document.getElementById('navbar-menu');
    navbarMenu.classList.toggle('active');
});


//VALIDACIONES

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const fields = ['firstname', 'lastname', 'address', 'city', 'zipcode', 'birthdate'];

  fields.forEach(field => {
      const input = form.elements[field];
      const messageElement = input.nextElementSibling;

      console.log(messageElement);

      // Add event listeners for focus and blur
      input.addEventListener('focus', () => {
          showMessage(messageElement, 'Este campo es obligatorio', 'red');
      });

      input.addEventListener('blur', () => {
          if (field === 'zipcode' && !isZipcodeValid(input.value)) {
              showMessage(messageElement, 'El código postal debe ser numérico y no mayor de 3 dígitos', 'red');
          } else if (field === 'birthdate' && !isOldEnough(input.value)) {
              showMessage(messageElement, 'Debe ser mayor de edad (nacido antes del 2007)', 'red');
          } else if (input.value.trim() === '') {
              showMessage(messageElement, 'Este campo es obligatorio', 'red');
          } else {
              showMessage(messageElement, 'Correcto', 'green');
          }
      });
  });

  form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the form from submitting

      let isValid = true;
      let formData = {};

      fields.forEach(field => {
          const input = form.elements[field];
          const messageElement = input.nextElementSibling;

          if (field === 'zipcode' && !isZipcodeValid(input.value)) {
              showMessage(messageElement, 'El código postal debe ser numérico y no mayor de 3 dígitos', 'red');
              isValid = false;
          } else if (field === 'birthdate' && !isOldEnough(input.value)) {
              showMessage(messageElement, 'Debe ser mayor de edad (nacido antes del 2007)', 'red');
              isValid = false;
          } else if (input.value.trim() === '') {
              showMessage(messageElement, 'Este campo es obligatorio', 'red');
              isValid = false;
          } else {
              showMessage(messageElement, 'Correcto', 'green');
              formData[field] = input.value.trim();
          }
      });

      if (isValid) {
          const alertMessage = generateAlertMessage(formData);
          alert(alertMessage);
      }
  });

  function showMessage(element, message, color) {
      element.textContent = message;
      element.style.color = color;
  }

  function isZipcodeValid(value) {
      return /^\d{1,4}$/.test(value);
  }

  function isOldEnough(dateString) {
      const date = new Date(dateString);
      const cutoffDate = new Date('2007-01-01');
      return date < cutoffDate;
  }

  function generateAlertMessage(data) {
      return `Nombre: ${data.firstname}
Apellido: ${data.lastname}
Dirección: ${data.address}
Ciudad: ${data.city}
Código Postal: ${data.zipcode}
Fecha de nacimiento: ${data.birthdate}
Género: ${form.querySelector('input[name="gender"]:checked').value}
Estudios: ${Array.from(form.querySelectorAll('input[name="estudio"]:checked')).map(input => input.value).join(', ')}`;
  }
});



