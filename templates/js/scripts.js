document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.animate-up');
    animateElements.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top bottom-=100",
                toggleClass: "active"
            }
        });
    });

    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Market Ticker Animation
    const tickerTrack = document.querySelector('.ticker-track');
    if (tickerTrack) {
        const clone = tickerTrack.cloneNode(true);
        tickerTrack.parentElement.appendChild(clone);
    }

    // Performance Chart
    const ctx = document.getElementById('performanceChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023'],
                datasets: [{
                    label: 'Portfolio Performance',
                    data: [100, 115, 135, 160, 185],
                    borderColor: '#1a3b6e',
                    tension: 0.4
                },
                {
                    label: 'Market Benchmark',
                    data: [100, 108, 120, 135, 150],
                    borderColor: '#64748b',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Animate Statistics
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const value = parseInt(element.dataset.value);
                animateValue(element, 0, value, 2000);
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });

    // Testimonials Slider
    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');

    function updateSlider() {
        testimonials.forEach((testimonial, index) => {
            testimonial.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
        });
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            currentSlide = Math.max(currentSlide - 1, 0);
            updateSlider();
        });

        nextButton.addEventListener('click', () => {
            currentSlide = Math.min(currentSlide + 1, testimonials.length - 1);
            updateSlider();
        });
    }

    // Initialize slider
    updateSlider();

    // Form Validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    showError(field, 'This field is required');
                } else {
                    field.classList.remove('error');
                    removeError(field);
                }

                if (field.type === 'email' && field.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        showError(field, 'Please enter a valid email address');
                    }
                }
            });

            if (isValid) {
                showSuccess(form);
            }
        });
    });

    function showError(field, message) {
        removeError(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function removeError(field) {
        const error = field.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    function showSuccess(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Form submitted successfully!';
        form.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
            form.reset();
        }, 3000);
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});