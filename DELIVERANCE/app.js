import userDB from './userDatabase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Here you would typically send this data to a server
            console.log('Contact form submitted:', data);
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Handle navigation active state
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Check if user is logged in
    const currentUser = userDB.getCurrentUser();
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser) {
        authButtons.innerHTML = `
            <span class="user-welcome">Welcome, ${currentUser.name}</span>
            <button onclick="window.location.href='profile.html'" class="btn-secondary">Profile</button>
            <button onclick="logout()" class="btn-primary">Logout</button>
        `;
    }

    // Logout function
    window.logout = () => {
        userDB.logout();
        window.location.reload();
    };

    // Handle section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle mobile navigation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksMobile = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksMobile) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksMobile.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinksMobile && navLinksMobile.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-btn')) {
            navLinksMobile.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking
                if (navLinksMobile && navLinksMobile.classList.contains('active')) {
                    navLinksMobile.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });

    // Add active class to current navigation item
    const currentLocation = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });

    // Intersection Observer for animations
    const observerOptionsAnimations = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerAnimations = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptionsAnimations);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease-out';
        observerAnimations.observe(el);
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            let isValid = true;
            const errorMessages = [];

            form.querySelectorAll('input, textarea').forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    errorMessages.push(`${input.name || 'Field'} is required`);
                } else {
                    input.classList.remove('error');
                }

                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        isValid = false;
                        input.classList.add('error');
                        errorMessages.push('Please enter a valid email address');
                    }
                }

                // Phone validation
                if (input.type === 'tel' && input.value.trim()) {
                    const phoneRegex = /^\+?[\d\s-]{10,}$/;
                    if (!phoneRegex.test(input.value.trim())) {
                        isValid = false;
                        input.classList.add('error');
                        errorMessages.push('Please enter a valid phone number');
                    }
                }
            });

            // Show error messages
            const existingError = form.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            if (!isValid) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.innerHTML = errorMessages.map(msg => `<p>${msg}</p>`).join('');
                form.insertBefore(errorDiv, form.firstChild);
                return;
            }

            // Here you would typically send the data to your server
            console.log('Form data:', data);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Form submitted successfully!';
            form.insertBefore(successMessage, form.firstChild);
            
            // Reset form
            form.reset();
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    });

    // Add styles for form validation
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #dc3545 !important;
        }
        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-bottom: 1rem;
            padding: 0.5rem;
            background: rgba(220, 53, 69, 0.1);
            border-radius: 4px;
        }
        .success-message {
            color: #28a745;
            font-size: 0.875rem;
            margin-bottom: 1rem;
            padding: 0.5rem;
            background: rgba(40, 167, 69, 0.1);
            border-radius: 4px;
        }
        .menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Handle image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add hover effect to cards
    const cards = document.querySelectorAll('.service-card, .team-member, .value-card, .info-card, .faq-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        });
    });

    // Handle FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');

        if (question && answer) {
            answer.style.display = 'none';
            question.style.cursor = 'pointer';

            question.addEventListener('click', () => {
                const isOpen = answer.style.display === 'block';
                answer.style.display = isOpen ? 'none' : 'block';
                question.style.color = isOpen ? '#333' : '#0066cc';
            });
        }
    });

    // Add scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add styles for scroll to top button
    const scrollTopStyle = document.createElement('style');
    scrollTopStyle.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #0066cc;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        .scroll-top-btn.visible {
            opacity: 1;
            visibility: visible;
        }
        .scroll-top-btn:hover {
            background: #0052a3;
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(scrollTopStyle);

    // Add loading state to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });

    // Add loading state styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        .loading {
            position: relative;
            pointer-events: none;
        }
        .loading::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            top: 50%;
            left: 50%;
            margin: -10px 0 0 -10px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: loading 0.8s infinite linear;
        }
        @keyframes loading {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(loadingStyle);

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }

    // Add hover effect to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add testimonial slider
    const testimonials = document.querySelector('.testimonials-grid');
    if (testimonials) {
        let currentSlide = 0;
        const slides = testimonials.querySelectorAll('.testimonial-card');
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.transform = `translateX(${100 * (i - index)}%)`;
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        // Add navigation buttons
        const navButtons = document.createElement('div');
        navButtons.className = 'testimonial-nav';
        navButtons.innerHTML = `
            <button class="prev-btn"><i class="fas fa-chevron-left"></i></button>
            <button class="next-btn"><i class="fas fa-chevron-right"></i></button>
        `;
        testimonials.parentNode.insertBefore(navButtons, testimonials.nextSibling);

        // Add event listeners
        navButtons.querySelector('.prev-btn').addEventListener('click', prevSlide);
        navButtons.querySelector('.next-btn').addEventListener('click', nextSlide);

        // Auto-advance slides
        setInterval(nextSlide, 5000);

        // Add styles for testimonial slider
        const sliderStyle = document.createElement('style');
        sliderStyle.textContent = `
            .testimonials-grid {
                position: relative;
                overflow: hidden;
            }
            .testimonial-card {
                position: absolute;
                width: 100%;
                transition: transform 0.5s ease;
            }
            .testimonial-nav {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-top: 2rem;
            }
            .testimonial-nav button {
                background: #0066cc;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .testimonial-nav button:hover {
                background: #0052a3;
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(sliderStyle);

        // Initialize first slide
        showSlide(0);
    }
}); 