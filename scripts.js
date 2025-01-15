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
        heading.style.cursor = 'pointer';
        heading.addEventListener('click', () => {
            category.classList.toggle('expanded');
            const list = category.querySelector('ul');
            list.style.display = (list.style.display === 'block') ? 'none' : 'block';
        });
        category.querySelector('ul').style.display = 'none';
    });

    renderCharts();
    showTestimonial(currentTestimonial);
});

// Enhanced Animations
gsap.from(".hero-content h1", { duration: 1.5, opacity: 0, scale: 0.8, ease: "back" });
gsap.from(".hero-content p", { duration: 1.5, opacity: 0, y: 50, delay: 0.5, ease: "power2.out" });
gsap.from(".hero-button", { duration: 1.5, opacity: 0, y: 20, delay: 1, ease: "elastic.out" });

// Scroll-triggered animations
gsap.utils.toArray(".metric").forEach((metric, index) => {
    gsap.from(metric, {
        scrollTrigger: { trigger: metric, start: "top 80%" },
        duration: 1,
        opacity: 0,
        y: 50,
        delay: index * 0.2,
        ease: "power2.out"
    });
});

gsap.utils.toArray(".insight").forEach((insight, index) => {
    gsap.from(insight, {
        scrollTrigger: { trigger: insight, start: "top 90%" },
        duration: 1,
        opacity: 0,
        y: 50,
        delay: index * 0.2,
        ease: "power3.out"
    });
});

// Function to render charts
function renderCharts() {
    const investmentCtx = document.getElementById('investmentChart').getContext('2d');
    new Chart(investmentCtx, {
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

    const retirementCtx = document.getElementById('retirementChart').getContext('2d');
    new Chart(retirementCtx, {
        type: 'doughnut',
        data: {
            labels: ['Savings', 'Investments', 'Expenses'],
            datasets: [{ data: [40, 35, 25], backgroundColor: ['#e67e22', '#3498db', '#e74c3c'] }]
        },
        options: { maintainAspectRatio: false, responsive: true }
    });

    const taxCtx = document.getElementById('taxChart').getContext('2d');
    new Chart(taxCtx, {
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

// Testimonials Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll(".testimonial");
function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? "block" : "none";
    });
}
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 4000);

// Finance Calculator Logic
document.getElementById('calculate-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const years = parseInt(document.getElementById('years').value);
    const result = (amount * Math.pow(1 + rate, years)).toFixed(2);

    document.getElementById('calculator-result').innerText = isNaN(result) ? 'Please enter valid values.' : `Future Value: ₹${result}`;
});

document.getElementById('registration-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for registering!');
});
