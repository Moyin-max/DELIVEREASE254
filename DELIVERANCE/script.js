// Sample delivery services data
const services = [
    {
        name: "Express Delivery",
        image: "images/express.png", // Fast delivery bike
        rating: 4.8,
        type: "Same Day",
        deliveryTime: "2-4 hours",
        description: "Fastest delivery option for urgent packages within Nairobi",
        price: "$15",
        features: [
            "Real-time tracking",
            "Priority handling",
            "Insurance included",
            "Maximum weight: 10kg"
        ]
    },
    {
        name: "Standard Delivery",
        image: "images/car.png", // Parcel in hand
        rating: 4.5,
        type: "Next Day",
        deliveryTime: "24 hours",
        description: "Reliable next-day delivery across major cities in Kenya",
        price: "$8",
        features: [
            "Package tracking",
            "Standard insurance",
            "Maximum weight: 20kg",
            "Free packaging"
        ]
    },
    {
        name: "International Shipping",
        image: "images/aeroplane.png", // Airplane cargo
        rating: 4.7,
        type: "Global",
        deliveryTime: "3-5 days",
        description: "Worldwide shipping with customs handling",
        price: "$50",
        features: [
            "Customs clearance",
            "Full insurance",
            "Documentation support",
            "Maximum weight: 30kg"
        ]
    },
    {
        name: "Bulk Delivery",
        image: "images/bulk.png", // Warehouse boxes
        rating: 4.6,
        type: "Business",
        deliveryTime: "2-3 days",
        description: "Specialized service for business and bulk shipments",
        price: "$30",
        features: [
            "Dedicated account manager",
            "Bulk discounts available",
            "Custom packaging",
            "No weight limit"
        ]
    },
    {
        name: "Same Day Delivery",
        image: "images/same.png", // Courier running
        rating: 4.9,
        type: "Premium",
        deliveryTime: "4-6 hours",
        description: "Premium same-day delivery for time-sensitive items",
        price: "$25",
        features: [
            "Priority handling",
            "Premium insurance",
            "Maximum weight: 5kg",
            "Dedicated courier"
        ]
    },
    {
        name: "Economy Delivery",
        image: "images/economy.png", // Small package
        rating: 4.4,
        type: "Budget",
        deliveryTime: "2-3 days",
        description: "Cost-effective delivery for non-urgent packages",
        price: "$5",
        features: [
            "Basic tracking",
            "Standard insurance",
            "Maximum weight: 15kg",
            "Nairobi only"
        ]
    }
];

// Function to create service cards
function createServiceCard(service) {
    return `
        <div class="service-card">
            <img src="${service.image}" alt="${service.name}">
            <div class="service-info">
                <h3>${service.name}</h3>
                <div class="service-details">
                    <span class="rating">⭐ ${service.rating}</span>
                    <span class="type">${service.type}</span>
                    <span class="delivery-time">${service.deliveryTime}</span>
                </div>
                <p class="service-description">${service.description}</p>
                <div class="service-price">${service.price}</div>
                <ul class="service-features">
                    ${service.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
                <button class="book-now-btn">Book Now</button>
            </div>
        </div>
    `;
}

// Populate service grid
function populateServices() {
    const serviceGrid = document.querySelector('.service-grid');
    serviceGrid.innerHTML = services.map(service => createServiceCard(service)).join('');
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll event listener for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.backgroundColor = '#ffffff';
    }
});

// Add search functionality
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-container input');

searchBtn.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Check if the search term looks like a tracking number
        if (searchTerm.match(/^TRK\d{6}$/)) {
            showModal(trackingModal);
            document.getElementById('trackingNumber').value = searchTerm;
            trackPackage();
        } else {
            // Existing service search functionality
            const filteredServices = services.filter(service => 
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            const serviceGrid = document.querySelector('.service-grid');
            if (filteredServices.length > 0) {
                serviceGrid.innerHTML = filteredServices.map(service => createServiceCard(service)).join('');
            } else {
                serviceGrid.innerHTML = '<p class="no-results">No services found matching your search.</p>';
            }
        }
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    populateServices();
    
    // Add styles for service cards
    const style = document.createElement('style');
    style.textContent = `
        .service-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .service-card:hover {
            transform: translateY(-5px);
        }

        .service-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .service-info {
            padding: 1rem;
        }

        .service-info h3 {
            margin-bottom: 0.5rem;
            color: #333;
        }

        .service-details {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            color: #666;
        }

        .no-results {
            text-align: center;
            grid-column: 1 / -1;
            padding: 2rem;
            color: #666;
        }
    `;
    document.head.appendChild(style);
});

// Modal functionality
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const bookingModal = document.getElementById('bookingModal');
const closeButtons = document.querySelectorAll('.close-modal');
const switchFormLinks = document.querySelectorAll('.switch-form');

// Show modal functions
function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners for opening modals
loginBtn.addEventListener('click', () => showModal(loginModal));
signupBtn.addEventListener('click', () => showModal(signupModal));

// Event listeners for closing modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        hideModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        hideModal(e.target);
    }
});

// Switch between login and signup forms
switchFormLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const formToShow = link.getAttribute('data-form');
        if (formToShow === 'login') {
            hideModal(signupModal);
            showModal(loginModal);
        } else {
            hideModal(loginModal);
            showModal(signupModal);
        }
    });
});

// Form submission handling
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Add error message element to forms
function addErrorMessage(form, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    form.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Add success message element to forms
function addSuccessMessage(form, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    form.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll just simulate a successful login
    if (email && password) {
        addSuccessMessage(loginForm, 'Login successful!');
        setTimeout(() => {
            hideModal(loginModal);
            // Update UI to show logged-in state
            loginBtn.textContent = 'My Account';
            signupBtn.style.display = 'none';
        }, 1500);
    } else {
        addErrorMessage(loginForm, 'Please fill in all fields');
    }
});

// Signup form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        addErrorMessage(signupForm, 'Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        addErrorMessage(signupForm, 'Passwords do not match');
        return;
    }

    if (password.length < 6) {
        addErrorMessage(signupForm, 'Password must be at least 6 characters long');
        return;
    }

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll just simulate a successful signup
    addSuccessMessage(signupForm, 'Account created successfully!');
    setTimeout(() => {
        hideModal(signupModal);
        // Update UI to show logged-in state
        loginBtn.textContent = 'My Account';
        signupBtn.style.display = 'none';
    }, 1500);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Basic form validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showError('Please fill in all fields');
            return;
        }

        if (!isValidEmail(formData.email)) {
            showError('Please enter a valid email address');
            return;
        }

        try {
            // Here you would typically send the form data to your backend
            // For now, we'll simulate a successful submission
            await simulateFormSubmission(formData);
            
            // Show success message
            showSuccess('Message sent successfully! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        } catch (error) {
            showError('Failed to send message. Please try again later.');
        }
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    const form = document.querySelector('.contact-form');
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Helper function to show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;
    
    const form = document.querySelector('.contact-form');
    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    form.insertBefore(successDiv, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', formData);
            resolve();
        }, 1000);
    });
}

// Booking Modal Functionality
const bookingForm = document.getElementById('bookingForm');
const creditCardDetails = document.getElementById('creditCardDetails');
const paypalDetails = document.getElementById('paypalDetails');
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');

// Package Calculator Functionality
const packageInputs = ['packageWeight', 'packageLength', 'packageWidth', 'packageHeight'];
let basePrice = 0;

// Update price when service is selected
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('book-now-btn')) {
        const serviceCard = e.target.closest('.service-card');
        const serviceName = serviceCard.querySelector('h3').textContent;
        const servicePrice = serviceCard.querySelector('.service-price').textContent;
        
        document.getElementById('selectedServiceName').textContent = serviceName;
        document.getElementById('selectedServicePrice').textContent = servicePrice;
        
        // Set base price
        basePrice = parseFloat(servicePrice.replace('$', ''));
        updatePriceSummary();
        
        showModal(bookingModal);
    }
});

// Calculate package volume and update price
packageInputs.forEach(inputId => {
    document.getElementById(inputId).addEventListener('input', calculatePackageDetails);
});

function calculatePackageDetails() {
    const weight = parseFloat(document.getElementById('packageWeight').value) || 0;
    const length = parseFloat(document.getElementById('packageLength').value) || 0;
    const width = parseFloat(document.getElementById('packageWidth').value) || 0;
    const height = parseFloat(document.getElementById('packageHeight').value) || 0;

    // Calculate volume
    const volume = length * width * height;
    document.getElementById('packageVolume').textContent = volume.toFixed(2);

    // Calculate additional charges based on weight and volume
    let additionalCharges = 0;
    
    // Weight-based charges
    if (weight > 10) {
        additionalCharges += (weight - 10) * 2; // $2 per kg over 10kg
    }
    
    // Volume-based charges
    if (volume > 10000) { // 10000 cm³ = 0.01 m³
        additionalCharges += (volume - 10000) * 0.0001; // $0.0001 per cm³ over 10000
    }

    document.getElementById('additionalCharges').textContent = `$${additionalCharges.toFixed(2)}`;
    updatePriceSummary(additionalCharges);
}

function updatePriceSummary(additionalCharges = 0) {
    document.getElementById('basePrice').textContent = `$${basePrice.toFixed(2)}`;
    document.getElementById('extraCharges').textContent = `$${additionalCharges.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `$${(basePrice + additionalCharges).toFixed(2)}`;
}

// Set minimum date for delivery to tomorrow
const deliveryDate = document.getElementById('deliveryDate');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
deliveryDate.min = tomorrow.toISOString().split('T')[0];

// Update booking form submission
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        service: document.getElementById('selectedServiceName').textContent,
        basePrice: basePrice,
        additionalCharges: parseFloat(document.getElementById('additionalCharges').textContent.replace('$', '')),
        totalPrice: parseFloat(document.getElementById('totalPrice').textContent.replace('$', '')),
        pickupLocation: document.getElementById('pickupLocation').value,
        deliveryLocation: document.getElementById('deliveryLocation').value,
        packageDetails: {
            weight: document.getElementById('packageWeight').value,
            dimensions: {
                length: document.getElementById('packageLength').value,
                width: document.getElementById('packageWidth').value,
                height: document.getElementById('packageHeight').value
            },
            volume: document.getElementById('packageVolume').textContent
        },
        deliverySchedule: {
            date: document.getElementById('deliveryDate').value,
            timeSlot: document.getElementById('deliveryTime').value
        },
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };

    if (formData.paymentMethod === 'creditCard') {
        formData.cardNumber = document.getElementById('cardNumber').value;
        formData.expiryDate = document.getElementById('expiryDate').value;
        formData.cvv = document.getElementById('cvv').value;
    }

    // Here you would typically send the form data to your backend
    console.log('Booking submitted:', formData);
    
    // Show success message
    addSuccessMessage(bookingForm, 'Booking confirmed! We will contact you shortly.');
    
    // Reset form and close modal after 2 seconds
    setTimeout(() => {
        bookingForm.reset();
        hideModal(bookingModal);
    }, 2000);
});

// Switch between payment methods
paymentMethods.forEach(method => {
    method.addEventListener('change', function() {
        if (this.value === 'creditCard') {
            creditCardDetails.style.display = 'block';
            paypalDetails.style.display = 'none';
        } else {
            creditCardDetails.style.display = 'none';
            paypalDetails.style.display = 'block';
        }
    });
});

// Tracking Modal Functionality
const trackingModal = document.getElementById('trackingModal');
const trackPackageBtn = document.getElementById('trackPackageBtn');
const trackingResult = document.querySelector('.tracking-result');
const trackingTimeline = document.getElementById('trackingTimeline');

// Sample tracking data (in a real application, this would come from a backend)
const trackingData = {
    'TRK123456': {
        trackingNumber: 'TRK123456',
        status: 'In Transit',
        serviceType: 'Express Delivery',
        estimatedDelivery: '2024-03-20',
        timeline: [
            {
                date: '2024-03-18 09:00',
                status: 'Package Picked Up',
                location: 'Nairobi Central Hub',
                statusClass: 'status-delivered'
            },
            {
                date: '2024-03-18 14:30',
                status: 'In Transit',
                location: 'Nairobi Sorting Facility',
                statusClass: 'status-active'
            },
            {
                date: '2024-03-19 08:15',
                status: 'Out for Delivery',
                location: 'Local Delivery Center',
                statusClass: 'status-pending'
            }
        ]
    },
    'TRK789012': {
        trackingNumber: 'TRK789012',
        status: 'Delivered',
        serviceType: 'Standard Delivery',
        estimatedDelivery: '2024-03-15',
        timeline: [
            {
                date: '2024-03-13 10:00',
                status: 'Package Picked Up',
                location: 'Nairobi Central Hub',
                statusClass: 'status-delivered'
            },
            {
                date: '2024-03-14 15:45',
                status: 'In Transit',
                location: 'Nairobi Sorting Facility',
                statusClass: 'status-delivered'
            },
            {
                date: '2024-03-15 09:30',
                status: 'Out for Delivery',
                location: 'Local Delivery Center',
                statusClass: 'status-delivered'
            },
            {
                date: '2024-03-15 14:20',
                status: 'Delivered',
                location: 'Recipient Address',
                statusClass: 'status-delivered'
            }
        ]
    }
};

// Track package button click handler
trackPackageBtn.addEventListener('click', trackPackage);

function trackPackage() {
    const trackingNumber = document.getElementById('trackingNumber').value.trim();
    
    if (!trackingNumber) {
        addErrorMessage(trackingModal.querySelector('.tracking-form'), 'Please enter a tracking number');
        return;
    }

    const packageData = trackingData[trackingNumber];
    
    if (packageData) {
        // Update package information
        document.getElementById('resultTrackingNumber').textContent = packageData.trackingNumber;
        document.getElementById('packageStatus').textContent = packageData.status;
        document.getElementById('serviceType').textContent = packageData.serviceType;
        document.getElementById('estimatedDelivery').textContent = packageData.estimatedDelivery;

        // Update timeline
        trackingTimeline.innerHTML = packageData.timeline.map(item => `
            <div class="timeline-item">
                <div class="date">${item.date}</div>
                <div class="status ${item.statusClass}">${item.status}</div>
                <div class="location">${item.location}</div>
            </div>
        `).join('');

        // Show tracking result
        trackingResult.style.display = 'block';
    } else {
        addErrorMessage(trackingModal.querySelector('.tracking-form'), 'Invalid tracking number');
        trackingResult.style.display = 'none';
    }
}

// Add tracking number validation
document.getElementById('trackingNumber').addEventListener('input', function(e) {
    const value = e.target.value.trim();
    if (value && !value.match(/^TRK\d{6}$/)) {
        e.target.setCustomValidity('Tracking number must be in format TRK123456');
    } else {
        e.target.setCustomValidity('');
    }
}); 