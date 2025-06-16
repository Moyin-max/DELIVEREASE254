import userDB from './userDatabase.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        try {
            const user = await userDB.loginUser(emailInput.value, passwordInput.value);
            
            if (user.isAdmin) {
                // Redirect to admin dashboard if user is admin
                window.location.href = 'admin-dashboard.html';
            } else {
                // Redirect to home page for regular users
                window.location.href = 'index.html';
            }
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}); 