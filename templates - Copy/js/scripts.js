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

    // Currency Converter
    async function initCurrencyConverter() {
        const fromCurrency = document.getElementById('from-currency');
        const toCurrency = document.getElementById('to-currency');
        const amount = document.getElementById('currency-amount');
        const result = document.getElementById('conversion-result');
        
        // Example API key - replace with your actual API key
        const API_KEY = 'YOUR_API_KEY';
        
        document.getElementById('convert-btn').addEventListener('click', async () => {
            try {
                const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`);
                const data = await response.json();
                const rate = data.rates[toCurrency.value];
                const convertedAmount = (amount.value * rate).toFixed(2);
                result.textContent = `${amount.value} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
            } catch (error) {
                result.textContent = 'Error fetching exchange rates';
            }
        });
    }

    // Enhanced Calculator
    function initEnhancedCalculator() {
        const calculatorType = document.getElementById('calculator-type');
        const calculatorForm = document.getElementById('calculator-form');
        const result = document.getElementById('calculator-result');

        calculatorType.addEventListener('change', () => {
            switch(calculatorType.value) {
                case 'compound':
                    calculatorForm.innerHTML = `
                        <input type="number" id="principal" placeholder="Principal Amount">
                        <input type="number" id="rate" placeholder="Interest Rate (%)">
                        <input type="number" id="years" placeholder="Time (Years)">
                        <input type="number" id="frequency" placeholder="Compounds per Year">
                        <button type="button" onclick="calculateCompoundInterest()">Calculate</button>
                    `;
                    break;
                case 'loan':
                    calculatorForm.innerHTML = `
                        <input type="number" id="loan-amount" placeholder="Loan Amount">
                        <input type="number" id="loan-rate" placeholder="Interest Rate (%)">
                        <input type="number" id="loan-term" placeholder="Loan Term (Years)">
                        <button type="button" onclick="calculateLoanEMI()">Calculate EMI</button>
                    `;
                    break;
                case 'sip':
                    calculatorForm.innerHTML = `
                        <input type="number" id="sip-amount" placeholder="Monthly Investment">
                        <input type="number" id="sip-rate" placeholder="Expected Return Rate (%)">
                        <input type="number" id="sip-years" placeholder="Investment Period (Years)">
                        <button type="button" onclick="calculateSIP()">Calculate Returns</button>
                    `;
                    break;
            }
        });
    }

    function calculateCompoundInterest() {
        const principal = parseFloat(document.getElementById('principal').value);
        const rate = parseFloat(document.getElementById('rate').value) / 100;
        const years = parseInt(document.getElementById('years').value);
        const frequency = parseInt(document.getElementById('frequency').value);
        
        const amount = principal * Math.pow(1 + rate/frequency, frequency * years);
        document.getElementById('calculator-result').innerHTML = `
            Future Value: ₹${amount.toFixed(2)}<br>
            Interest Earned: ₹${(amount - principal).toFixed(2)}
        `;
    }

    function calculateLoanEMI() {
        const principal = parseFloat(document.getElementById('loan-amount').value);
        const rate = parseFloat(document.getElementById('loan-rate').value) / 1200; // monthly rate
        const time = parseInt(document.getElementById('loan-term').value) * 12; // months
        
        const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
        document.getElementById('calculator-result').innerHTML = `
            Monthly EMI: ₹${emi.toFixed(2)}<br>
            Total Payment: ₹${(emi * time).toFixed(2)}<br>
            Total Interest: ₹${(emi * time - principal).toFixed(2)}
        `;
    }

    function calculateSIP() {
        const investment = parseFloat(document.getElementById('sip-amount').value);
        const rate = parseFloat(document.getElementById('sip-rate').value) / 1200; // monthly rate
        const months = parseInt(document.getElementById('sip-years').value) * 12;
        
        const futureValue = investment * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
        document.getElementById('calculator-result').innerHTML = `
            Future Value: ₹${futureValue.toFixed(2)}<br>
            Total Investment: ₹${(investment * months).toFixed(2)}<br>
            Wealth Gained: ₹${(futureValue - investment * months).toFixed(2)}
        `;
    }

    // News Feed
    async function initNewsFeed() {
        const newsContainer = document.getElementById('news-feed');
        // Example API key - replace with your actual API key
        const NEWS_API_KEY = 'YOUR_API_KEY';
        
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${NEWS_API_KEY}`);
            const data = await response.json();
            
            newsContainer.innerHTML = data.articles.slice(0, 5).map(article => `
                <div class="news-item">
                    <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}">
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read More</a>
                </div>
            `).join('');
        } catch (error) {
            newsContainer.innerHTML = '<p>Error loading news feed</p>';
        }
    }

    // Initialize all features
    initCurrencyConverter();
    initEnhancedCalculator();
    initNewsFeed();
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
