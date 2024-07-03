document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, password })
            });

            const result = await response.json();
            const messageElement = document.getElementById('responseMessage');

            if (response.ok) {
                messageElement.textContent = result.message;
                messageElement.style.color = 'green';

                setTimeout(() => {
                    window.location.href = 'UsersAdmin.html';
                }, 900);
            } else {
                messageElement.textContent = result.message;
                messageElement.style.color = 'red';
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    });
});