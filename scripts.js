// Enhanced Animations
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

// Scroll-triggered animations
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

// Enhanced Testimonials Slider
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

// Initial setup for testimonials
showTestimonial(currentTestimonial);

// Finance Calculator Logic
document.getElementById('calculate-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const years = parseInt(document.getElementById('years').value);
    const result = (amount * Math.pow(1 + rate, years)).toFixed(2);

    if (!isNaN(result)) {
        document.getElementById('calculator-result').innerText = `Future Value: ₹${result}`;
    } else {
        document.getElementById('calculator-result').innerText = 'Please enter valid values.';
    }
});

// Registration Form Submit
document.getElementById('registration-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for registering!');
});

// Fetch Market Trends Data
const marketData = [
    { symbol: "RELIANCE", price: 2625.50, change: "+1.45%" },
    { symbol: "TCS", price: 3515.80, change: "+0.90%" },
    { symbol: "HDFCBANK", price: 1605.25, change: "-0.35%" },
    { symbol: "INFY", price: 1468.60, change: "+1.10%" },
    { symbol: "ICICIBANK", price: 937.50, change: "+0.85%" },
];

const marketContainer = document.getElementById('market-data');
marketData.forEach(stock => {
    const stockElement = document.createElement('div');
    stockElement.innerHTML = `<strong>${stock.symbol}</strong>: ₹${stock.price} (${stock.change})`;
    marketContainer.appendChild(stockElement);
});
