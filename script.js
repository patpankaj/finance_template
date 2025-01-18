// Initialize GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Hero Section Animations
gsap.from(".hero-content h1", {
    duration: 1.5,
    opacity: 0,
    scale: 0.8,
    ease: "back",
});

gsap.from(".hero-content p", {
    duration: 1.5,
    opacity: 0,
    y: 50,
    delay: 0.5,
    ease: "power2.out",
});

gsap.from(".hero-button", {
    duration: 1.5,
    opacity: 0,
    y: 20,
    delay: 1,
    ease: "elastic.out",
});

// Scroll-triggered Animations
function setupScrollAnimations() {
    // Metrics Section
    gsap.utils.toArray(".metric").forEach((metric, index) => {
        gsap.from(metric, {
            scrollTrigger: {
                trigger: metric,
                start: "top 80%",
            },
            duration: 1,
            opacity: 0,
            y: 50,
            delay: index * 0.2,
            ease: "power2.out",
        });
    });

    // Insights Section
    gsap.utils.toArray(".insight").forEach((insight, index) => {
        gsap.from(insight, {
            scrollTrigger: {
                trigger: insight,
                start: "top 90%",
            },
            duration: 1,
            opacity: 0,
            y: 50,
            delay: index * 0.2,
            ease: "power3.out",
        });
    });
}

// Chart Initialization
function initializeCharts() {
    // Investment Growth Chart
    new Chart(document.getElementById('investmentChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Investment Growth ($)',
                data: [100, 200, 300, 450, 600],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: '#3498db',
                borderWidth: 2,
                pointBackgroundColor: '#3498db',
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    grid: { display: false },
                    title: { display: true, text: 'Months' },
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Value ($)' },
                },
            },
        }
    });

    // Retirement Planning Chart
    new Chart(document.getElementById('retirementChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Savings', 'Investments', 'Expenses'],
            datasets: [{
                data: [40, 35, 25],
                backgroundColor: ['#e67e22', '#3498db', '#e74c3c'],
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
            }
        }
    });

    // Tax Analysis Chart
    new Chart(document.getElementById('taxChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Income Tax', 'GST', 'Property Tax', 'Capital Gains'],
            datasets: [{
                label: 'Taxes Paid ($)',
                data: [200, 150, 50, 100],
                backgroundColor: ['#1abc9c', '#16a085', '#f39c12', '#e74c3c'],
                borderWidth: 1,
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    grid: { display: false },
                    title: { display: true, text: 'Tax Types' },
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Amount ($)' },
                },
            },
        }
    });
}

// Testimonials Slider
function setupTestimonialSlider() {
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll(".testimonial");

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? "block" : "none";
            testimonial.style.opacity = i === index ? "1" : "0";
        });
    }

    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 4000);

    showTestimonial(currentTestimonial);
}

// Finance Calculator
function setupFinanceCalculator() {
    document.getElementById('calculate-btn').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('amount').value);
        const rate = parseFloat(document.getElementById('rate').value) / 100;
        const years = parseInt(document.getElementById('years').value);
        const result = (amount * Math.pow(1 + rate, years)).toFixed(2);

        document.getElementById('calculator-result').innerText = 
            !isNaN(result) ? `Future Value: ₹${result}` : 'Please enter valid values.';
    });
}

// Form Submission
function setupFormSubmission() {
    document.getElementById('registration-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for registering!');
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    initializeCharts();
    setupTestimonialSlider();
    setupFinanceCalculator();
    setupFormSubmission();
});
