import userDB from './userDatabase.js';

class Auth {
    constructor() {
        this.initAuth();
    }

    initAuth() {
        // Create auth modal
        this.createAuthModal();
        
        // Add event listeners
        this.addEventListeners();
        
        // Check if user is logged in
        this.checkAuthStatus();
    }

    createAuthModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <button class="close-modal">&times;</button>
                <div id="loginForm" class="auth-form">
                    <h2>Login</h2>
                    <div class="error-message" id="loginError"></div>
                    <form id="loginFormElement">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <div class="password-field">
                                <input type="password" id="password" required>
                                <button type="button" class="password-toggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="submit-btn">Login</button>
                        <div class="auth-switch">
                            Don't have an account? <a href="#" id="showSignup">Sign Up</a>
                        </div>
                    </form>
                </div>
                <div id="signupForm" class="auth-form" style="display: none;">
                    <h2>Sign Up</h2>
                    <div class="error-message" id="signupError"></div>
                    <form id="signupFormElement">
                        <div class="form-group">
                            <label for="signupName">Name</label>
                            <input type="text" id="signupName" required>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email</label>
                            <input type="email" id="signupEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Password</label>
                            <div class="password-field">
                                <input type="password" id="signupPassword" required>
                                <button type="button" class="password-toggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="submit-btn">Sign Up</button>
                        <div class="auth-switch">
                            Already have an account? <a href="#" id="showLogin">Login</a>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Create profile modal
        const profileModal = document.createElement('div');
        profileModal.className = 'profile-modal';
        profileModal.innerHTML = `
            <div class="profile-modal-content">
                <button class="close-modal">&times;</button>
                <div class="profile-header">
                    <div class="profile-image-container">
                        <img id="profileImage" src="images/default-avatar.png" alt="Profile">
                        <div class="profile-image-overlay">
                            <label for="imageUpload" class="upload-btn">
                                <i class="fas fa-camera"></i>
                            </label>
                            <input type="file" id="imageUpload" accept="image/*" style="display: none;">
                        </div>
                    </div>
                    <h2 id="profileName">User Name</h2>
                </div>
                <div class="profile-details">
                    <div class="profile-info">
                        <p><i class="fas fa-envelope"></i> <span id="profileEmail">user@email.com</span></p>
                        <p><i class="fas fa-calendar"></i> Member since: <span id="profileJoinDate">Date</span></p>
                    </div>
                    <div class="profile-actions">
                        <button id="editProfileBtn" class="btn-secondary">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                        <button id="logoutBtn" class="btn-danger">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(profileModal);
    }

    addEventListeners() {
        // Login/Signup buttons in navbar
        document.querySelector('.login-btn').addEventListener('click', () => this.showAuthModal('login'));
        document.querySelector('.signup-btn').addEventListener('click', () => this.showAuthModal('signup'));

        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.auth-modal, .profile-modal');
                modal.classList.remove('show');
            });
        });

        // Form switches
        document.getElementById('showSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('signup');
        });
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('login');
        });

        // Password toggles
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const passwordField = e.target.closest('.password-field');
                const input = passwordField.querySelector('input');
                const icon = toggle.querySelector('i');
                this.togglePasswordVisibility(input, icon);
            });
        });

        // Form submissions
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signupFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Profile image upload
        document.getElementById('imageUpload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const user = userDB.currentUser;
                    user.profileImage = e.target.result;
                    userDB.updateUser(user);
                    document.getElementById('profileImage').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });
    }

    showAuthModal(form = 'login') {
        const modal = document.querySelector('.auth-modal');
        modal.classList.add('show');
        this.switchForm(form);
    }

    hideAuthModal() {
        const modal = document.querySelector('.auth-modal');
        modal.classList.remove('show');
    }

    switchForm(form) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        if (form === 'login') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    }

    togglePasswordVisibility(input, icon) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('loginError');

        try {
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            const user = userDB.loginUser(email, password);
            this.hideAuthModal();
            this.updateAuthUI(user);
            
            // Clear form
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            errorElement.textContent = '';
            errorElement.classList.remove('show');

            // Redirect to admin dashboard if admin
            if (user.isAdmin) {
                window.location.href = 'admin-dashboard.html';
            }
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.classList.add('show');
        }
    }

    async handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const errorElement = document.getElementById('signupError');

        try {
            if (!name || !email || !password) {
                throw new Error('Please fill in all fields');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const user = userDB.registerUser({ name, email, password });
            this.hideAuthModal();
            this.updateAuthUI(user);
            
            // Clear form
            document.getElementById('signupName').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.classList.add('show');
        }
    }

    updateAuthUI(user) {
        const authButtons = document.querySelector('.auth-buttons');
        if (user) {
            authButtons.innerHTML = `
                <div class="user-profile" onclick="document.querySelector('.profile-modal').classList.add('show')">
                    <img src="${user.profileImage || 'images/default-avatar.png'}" alt="Profile" class="profile-thumbnail">
                    <span class="user-name">${user.name}</span>
                </div>
                ${user.isAdmin ? '<a href="admin-dashboard.html" class="admin-link">Admin Dashboard</a>' : ''}
            `;

            // Update profile modal
            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileJoinDate').textContent = new Date(user.createdAt).toLocaleDateString();
            document.getElementById('profileImage').src = user.profileImage || 'images/default-avatar.png';
        } else {
            authButtons.innerHTML = `
                <button class="login-btn">Login</button>
                <button class="signup-btn">Sign Up</button>
            `;
            this.addEventListeners();
        }
    }

    handleLogout() {
        userDB.logoutUser();
        this.updateAuthUI(null);
        document.querySelector('.profile-modal').classList.remove('show');
        window.location.href = 'index.html';
    }

    checkAuthStatus() {
        const currentUser = userDB.currentUser;
        this.updateAuthUI(currentUser);
    }
}

// Initialize auth
const auth = new Auth();

export default auth; 