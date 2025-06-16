import userDB from './userDatabase.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorMessage = document.getElementById('errorMessage');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        // Validate passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            errorMessage.textContent = 'Passwords do not match';
            return;
        }

        try {
            const userData = {
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            };

            await userDB.registerUser(userData);
            window.location.href = 'login.html';
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}); 