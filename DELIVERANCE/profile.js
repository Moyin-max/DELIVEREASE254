import userDB from './userDatabase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = userDB.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize profile elements
    const profileImage = document.getElementById('profileImage');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const imageUpload = document.getElementById('imageUpload');
    const activityList = document.getElementById('activityList');

    // Set initial user data
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    if (currentUser.profileImage) {
        profileImage.src = currentUser.profileImage;
    }

    // Handle profile image upload
    imageUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Convert image to base64
                const base64 = await convertToBase64(file);
                
                // Update user profile image
                currentUser.profileImage = base64;
                userDB.updateUser(currentUser);
                
                // Update displayed image
                profileImage.src = base64;
                
                // Add activity
                userDB.logUserActivity(currentUser.id, 'update_profile_picture');
                updateActivityList();
            } catch (error) {
                alert('Error uploading image: ' + error.message);
            }
        }
    });

    // Handle profile form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(profileForm);
        const updatedUser = {
            ...currentUser,
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address')
        };

        userDB.updateUser(updatedUser);
        userName.textContent = updatedUser.name;
        userDB.logUserActivity(currentUser.id, 'update_profile');
        updateActivityList();
        alert('Profile updated successfully!');
    });

    // Handle password form submission
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(passwordForm);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        try {
            userDB.updatePassword(currentUser.id, currentPassword, newPassword);
            userDB.logUserActivity(currentUser.id, 'update_password');
            updateActivityList();
            passwordForm.reset();
            alert('Password updated successfully!');
        } catch (error) {
            alert(error.message);
        }
    });

    // Update activity list
    function updateActivityList() {
        const activities = userDB.getUserActivity(currentUser.id);
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <i class="fas ${getActivityIcon(activity.action)}"></i>
                <div class="activity-details">
                    <p>${getActivityMessage(activity.action)}</p>
                    <small>${new Date(activity.timestamp).toLocaleString()}</small>
                </div>
            </div>
        `).join('');
    }

    // Helper function to convert file to base64
    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Helper function to get activity icon
    function getActivityIcon(action) {
        const icons = {
            'update_profile_picture': 'fa-camera',
            'update_profile': 'fa-user-edit',
            'update_password': 'fa-key',
            'login': 'fa-sign-in-alt',
            'logout': 'fa-sign-out-alt'
        };
        return icons[action] || 'fa-info-circle';
    }

    // Helper function to get activity message
    function getActivityMessage(action) {
        const messages = {
            'update_profile_picture': 'Updated profile picture',
            'update_profile': 'Updated profile information',
            'update_password': 'Changed password',
            'login': 'Logged in',
            'logout': 'Logged out'
        };
        return messages[action] || action;
    }

    // Initialize activity list
    updateActivityList();
}); 