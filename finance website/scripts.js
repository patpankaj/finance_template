document.addEventListener('DOMContentLoaded', function () {
    // Navigation Menu Toggle
    const menuToggle = document.createElement('div');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '<div></div><div></div><div></div>';
    document.querySelector('nav').appendChild(menuToggle);

    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });

    // Expandable Service Categories
    const serviceCategories = document.querySelectorAll('.service-category');

    serviceCategories.forEach(category => {
        const heading = category.querySelector('h2');
        if (heading) {
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', () => {
                category.classList.toggle('expanded');
                const list = category.querySelector('ul');
                if (list) {
                    list.style.display = (list.style.display === 'block') ? 'none' : 'block';
                }
            });
            const list = category.querySelector('ul');
            if (list) {
                list.style.display = 'none';
            }
        }
    });

    // Initialize charts if elements exist
    if (document.getElementById('investmentChart')) {
        renderCharts();
    }

    // Initialize testimonials if they exist
    const testimonials = document.querySelectorAll(".testimonial");
    if (testimonials.length > 0) {
        showTestimonial(currentTestimonial);
    }

    // Initialize GSAP animations
    initializeAnimations();
});

// Enhanced Animations with GSAP
function initializeAnimations() {
    const heroTitle = document.querySelector(".hero-content h1");
    const heroDesc = document.querySelector(".hero-content p");
    const heroButton = document.querySelector(".hero-button");

    if (heroTitle) {
        gsap.from(heroTitle, { duration: 1.5, opacity: 0, scale: 0.8, ease: "back" });
    }
    if (heroDesc) {
        gsap.from(heroDesc, { duration: 1.5, opacity: 0, y: 50, delay: 0.5, ease: "power2.out" });
    }
    if (heroButton) {
        gsap.from(heroButton, { duration: 1.5, opacity: 0, y: 20, delay: 1, ease: "elastic.out" });
    }

    // Scroll-triggered animations
    const metrics = gsap.utils.toArray(".metric");
    metrics.forEach((metric, index) => {
        gsap.from(metric, {
            scrollTrigger: { trigger: metric, start: "top 80%" },
            duration: 1,
            opacity: 0,
            y: 50,
            delay: index * 0.2,
            ease: "power2.out"
        });
    });

    const insights = gsap.utils.toArray(".insight");
    insights.forEach((insight, index) => {
        gsap.from(insight, {
            scrollTrigger: { trigger: insight, start: "top 90%" },
            duration: 1,
            opacity: 0,
            y: 50,
            delay: index * 0.2,
            ease: "power3.out"
        });
    });
}

// Function to render charts
function renderCharts() {
    const investmentCtx = document.getElementById('investmentChart');
    if (investmentCtx) {
        new Chart(investmentCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                    label: 'Investment Growth ($)',
                    data: [100, 200, 300, 450, 600],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    borderWidth: 2
                }]
            },
            options: { maintainAspectRatio: false, responsive: true }
        });
    }

    const retirementCtx = document.getElementById('retirementChart');
    if (retirementCtx) {
        new Chart(retirementCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Savings', 'Investments', 'Expenses'],
                datasets: [{ data: [40, 35, 25], backgroundColor: ['#e67e22', '#3498db', '#e74c3c'] }]
            },
            options: { maintainAspectRatio: false, responsive: true }
        });
    }

    const taxCtx = document.getElementById('taxChart');
    if (taxCtx) {
        new Chart(taxCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Income Tax', 'GST', 'Property Tax', 'Capital Gains'],
                datasets: [{
                    label: 'Taxes Paid ($)',
                    data: [200, 150, 50, 100],
                    backgroundColor: ['#1abc9c', '#16a085', '#f39c12', '#e74c3c']
                }]
            },
            options: { maintainAspectRatio: false, responsive: true }
        });
    }
}

// Testimonials Slider
let currentTestimonial = 0;
function showTestimonial(index) {
    const testimonials = document.querySelectorAll(".testimonial");
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? "block" : "none";
    });
}

// Start testimonial rotation if testimonials exist
if (document.querySelector(".testimonial")) {
    setInterval(() => {
        const testimonials = document.querySelectorAll(".testimonial");
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 4000);
}

// Finance Calculator Logic
const calculateBtn = document.getElementById('calculate-btn');
if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('amount').value);
        const rate = parseFloat(document.getElementById('rate').value) / 100;
        const years = parseInt(document.getElementById('years').value);
        const result = (amount * Math.pow(1 + rate, years)).toFixed(2);

        const resultElement = document.getElementById('calculator-result');
        if (resultElement) {
            resultElement.innerText = isNaN(result) ? 'Please enter valid values.' : `Future Value: ₹${result}`;
        }
    });
}

// Registration Form Handler
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for registering!');
    });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
    });
}

// Market Ticker Animation
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
    // Clone the ticker items for seamless scrolling
    tickerTrack.innerHTML += tickerTrack.innerHTML;
}
