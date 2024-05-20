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

