document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);

    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all inputs before submission
        const formInputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;
        
        formInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Please fix the errors in the form before submitting.', 'error');
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        try {
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showNotification('Thank you for your message! We will get back to you soon.');
            contactForm.reset();

            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;

        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Sorry, there was an error sending your message. Please try again later.', 'error');
            
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });

    // Form validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });

        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (input.id) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                } else if (value.length > 50) {
                    isValid = false;
                    errorMessage = 'Name must be less than 50 characters';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'subject':
                if (value.length < 5) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 5 characters long';
                } else if (value.length > 100) {
                    isValid = false;
                    errorMessage = 'Subject must be less than 100 characters';
                }
                break;

            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                } else if (value.length > 1000) {
                    isValid = false;
                    errorMessage = 'Message must be less than 1000 characters';
                }
                break;
        }

        // Update input styling
        input.classList.toggle('invalid', !isValid);
        
        // Update error message
        let errorElement = input.parentElement.querySelector('.error-message');
        if (!isValid) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                input.parentElement.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        } else if (errorElement) {
            errorElement.remove();
        }

        return isValid;
    }

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.invalid,
        .form-group textarea.invalid {
            border-color: var(--error);
            background-color: rgba(220, 53, 69, 0.05);
        }

        .error-message {
            color: var(--error);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .error-message::before {
            content: '⚠️';
            font-size: 0.75rem;
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            display: none;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .notification.success {
            background-color: var(--success);
        }

        .notification.error {
            background-color: var(--error);
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .btn-primary i {
            margin-right: 0.5rem;
        }
    `;
    document.head.appendChild(style);
}); 