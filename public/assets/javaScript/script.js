//BOOSTRAP

"https://code.jquery.com/jquery-3.6.0.min.js"
"https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"


//Efectos y manejo de navBar
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

        // Add event listeners for focus and blur
        input.addEventListener('focus', () => {
            showMessage(messageElement, 'Este campo es obligatorio', 'red');
        });

        input.addEventListener('blur', () => {
            if (field === 'zipcode' && !isZipcodeValid(input.value)) {
                showMessage(messageElement, 'El código postal debe ser numérico y no mayor de 4 dígitos', 'red');
            } else if (field === 'birthdate' && !isOldEnough(input.value)) {
                showMessage(messageElement, 'Debe ser mayor de edad (nacido antes del 2007)', 'red');
            } else if (input.value.trim() === '') {
                showMessage(messageElement, 'Este campo es obligatorio', 'red');
            } else {
                showMessage(messageElement, 'Correcto', 'green');
            }
        });
    });

    form.addEventListener('submit', function () {
        let isValid = true;
        let formData = {};

        fields.forEach(field => {
            const input = form.elements[field];
            const messageElement = input.nextElementSibling;

            if (field === 'zipcode' && !isZipcodeValid(input.value)) {
                showMessage(messageElement, 'El código postal debe ser numérico y no mayor de 4 dígitos', 'red');
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
            formData.gender = form.querySelector('input[name="gender"]:checked').value;
            formData.estudio = Array.from(form.querySelectorAll('input[name="estudio"]:checked')).map(input => input.value).join(', ');

            const formDataJSON = JSON.stringify(formData);
            localStorage.setItem('formData', formDataJSON);
        } else {
            event.preventDefault(); // Prevent the form from submitting if the validation fails
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
});

//ENVIO EXITOSO
document.addEventListener('DOMContentLoaded', function() {
    const formDataJSON = localStorage.getItem('formData');
    if (formDataJSON) {
        const formData = JSON.parse(formDataJSON);
        const formDataDisplay = document.getElementById('formDataDisplay');
        const formDataList = document.createElement('ul'); // Creamos la lista
        formDataDisplay.appendChild(formDataList); // Agregamos la lista al contenedor
        formDataList.innerHTML = `
            <li>Nombre: ${formData.firstname}</li>
            <li>Apellido: ${formData.lastname}</li>
            <li>Dirección: ${formData.address}</li>
            <li>Ciudad: ${formData.city}</li>
            <li>Código Postal: ${formData.zipcode}</li>
            <li>Fecha de nacimiento: ${formData.birthdate}</li>
        `;
    }
});