
// ==================== Global Constants ====================
const COMPONENT_PATHS = {
    header: 'header.html',
    cta: 'cta.html',
    footer: 'footer.html'
};

const PAGE_TITLES = {
    "index.html": { 
        title: "Transform Your Financial Future", 
        subtitle: "Your trusted partner in wealth creation and financial freedom.",
        emphasis: "With Expert Guidance"
    },
    "about.html": { 
        title: "About IndianMoney Master", 
        subtitle: "Learn more about our journey and mission.",
        emphasis: "Discover Our Story"
    },
    "services.html": { 
        title: "Our Financial Services", 
        subtitle: "Comprehensive solutions for your financial needs.",
        emphasis: "Tailored Just for You"
    },
    "contact.html": { 
        title: "Get in Touch", 
        subtitle: "We're here to help. Contact us today!",
        emphasis: "Let's Connect"
    },
    "business-services.html": { 
        title: "Business Services", 
        subtitle: "Empowering Your Business Growth",
        emphasis: "Comprehensive Solutions"
    },
    "tax-planning.html": { 
        title: "Tax Planning Services", 
        subtitle: "Strategic Tax Planning Solutions",
        emphasis: "Optimize your tax savings with our expert guidance and strategies"
    },
    "business-setup.html": { 
        title: "Business Setup Services", 
        subtitle: "Complete Business Setup Solutions",
        emphasis: "Start your business journey with expert guidance and comprehensive support"
    },
    "insights.html": { 
        title: "Financial Insights", 
        subtitle: "Stay Ahead with Our Expert Insights",
        emphasis: "Stay informed with our expert financial insights and analysis"
    },
    "investment.html": { 
        title: "Investment Planning", 
        subtitle: "Investment Planning Services",
        emphasis: "Smart investment strategies for your financial goals"
    },
    "insurance.html": { 
        title: "Insurance Services", 
        subtitle: "Insurance Planning Services",
        emphasis: "Protect your future with our comprehensive insurance solutions"
    },
    "retirement.html": { 
        title: "Retirement Planning", 
        subtitle: "Retirement Planning Services",
        emphasis: "Secure your future with our expert retirement planning strategies"
    },
    "compliances.html": { 
        title: "Compliances Services", 
        subtitle: "Regulatory Compliance Services",
        emphasis: "Ensure your business stays compliant with our expert guidance"
    },
    "tax-services.html": { 
        title: "Tax Services",
        subtitle: "Strategic Tax Planning Solutions",
        emphasis: "Optimize your tax savings with our expert guidance and strategies"
    },
    "wealth-services.html": {
        title: "Wealth Management Services",
        subtitle: "Expert Wealth Management Services",
        emphasis: "Your Trusted Wealth Management Partner"
    }
};

// ==================== Component Loader ====================
class ComponentLoader {
    static async load() {
        try {
            // Load header
            await this._loadHeader();
            
            // Load CTA and Footer
            await this._loadCTA();
            await this._loadFooter();

            // Initialize page
            this._initializePage();
        } catch (error) {
            console.error('Component loading failed:', error);
        }
    }

    static async _loadHeader() {
        const content = await this._fetchComponent(COMPONENT_PATHS.header);
        document.body.insertAdjacentHTML('afterbegin', content);
        Header.initialize();
    }

    static async _loadCTA() {
        try {
            const content = await this._fetchComponent(COMPONENT_PATHS.cta);
            const ctaContainer = document.querySelector('.cta-container');
            
            if (ctaContainer) {
                ctaContainer.insertAdjacentHTML('beforeend', content);

                // Initialize particles if present
                if (document.getElementById('particles-js')) {
                    ParticlesManager.initialize();
                }
            } else {
                console.error('CTA container not found!');
            }
        } catch (error) {
            console.error('CTA loading failed:', error);
        }
    }

    static async _loadFooter() {
        try {
            const content = await this._fetchComponent(COMPONENT_PATHS.footer);
            const footerContainer = document.querySelector('.footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = content;
                this._initializeFooter();
            }
        } catch (error) {
            console.error('Footer loading failed:', error);
        }
    }

    static async _fetchComponent(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        return await response.text();
    }

    static _initializePage() {
        AOS.init({ duration: 1000, once: true });
        Header.setPageTitle();
        Header.setActiveNavigation();
        CalculatorManager.initialize();
    }

    static _initializeFooter() {
        // Initialize footer animations and interactions
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
}

// ==================== Header Management ====================
class Header {
    static initialize() {
        this._setupMobileMenu();
        this._initializeMarketTicker();
    }

    static _setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const menu = document.querySelector('.menu');

        menuBtn?.addEventListener('click', () => {
            menu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    }

    static _initializeMarketTicker() {
        if (document.querySelector('.ticker')) {
            new MarketTicker().init();
        }
    }

    static setPageTitle() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const pageInfo = PAGE_TITLES[currentPage];

        if (!pageInfo) return;

        requestAnimationFrame(() => {
            document.querySelector(".hero-content .main-heading span.gradient-text").textContent = pageInfo.title;
            document.querySelector(".hero-content .main-heading span.emphasis-text").textContent = pageInfo.emphasis;
            document.querySelector(".hero-content .hero-tagline").textContent = pageInfo.subtitle;
        });
    }

    static setActiveNavigation() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        document.querySelectorAll('.menu a').forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active');
                link.closest('.dropdown')?.querySelector('a').classList.add('active');
            }
        });
    }
}

// ==================== Market Ticker ====================
class MarketTicker {
    constructor() {
        this.symbols = ['NIFTY 50', 'SENSEX', 'USD/INR'];
        this.tickerElement = document.querySelector('.ticker');
        this.updateInterval = 3000;
    }

    init() {
        if (!this.tickerElement) return;
        this._updateTicker();
        setInterval(() => this._updateTicker(), this.updateInterval);
    }

    _updateTicker() {
        this.tickerElement.innerHTML = '';
        this._generateData().forEach(data => {
            this.tickerElement.appendChild(this._createItem(data));
        });
    }

    _generateData() {
        return this.symbols.map(symbol => {
            const basePrice = this._getBasePrice(symbol);
            const change = (Math.random() * 2 - 1) * basePrice * 0.02;
            return {
                symbol,
                price: (basePrice + change).toFixed(2),
                change: change.toFixed(2),
                changePercent: ((change / basePrice) * 100).toFixed(2)
            };
        });
    }

    _createItem(data) {
        const item = document.createElement('div');
        item.className = 'ticker-item';
        item.innerHTML = `
            <span class="label">${data.symbol}</span>
            <span class="value">₹${data.price}</span>
            <span class="change ${data.change >= 0 ? 'positive' : 'negative'}">
                ${data.change >= 0 ? '+' : ''}${data.change} (${data.change >= 0 ? '+' : ''}${data.changePercent}%)
            </span>
        `;
        return item;
    }

    _getBasePrice(symbol) {
        const prices = { 'NIFTY 50': 19500, 'SENSEX': 65000, 'USD/INR': 83 };
        return prices[symbol] || 1000;
    }
}

// ==================== Particles Manager ====================
class ParticlesManager {
    static initialize() {
        if (document.getElementById('particles-js')) {
            particlesJS('particles-js', {
                /* particles.js configuration */
            });
        }
    }
}

// ==================== Calculator Manager ====================
class CalculatorManager {
    static initialize() {
        initCalculators();
    }
}

// ==================== Initialization ====================
window.addEventListener("load", () => {
    ComponentLoader.load();

});

// ==================== Calculator Functions ====================
function initCalculators() {
    // Wait for DOM to be fully loaded
    if (!document.getElementById('sipCalculator')) {
        return; // Exit if calculator elements aren't loaded yet
    }

    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculatorCards = document.querySelectorAll('.calculator-card');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            calculatorCards.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabId}Calculator`).classList.add('active');
            calculateResults(); // Calculate when switching tabs
        });
    });

    // Initialize calculator inputs
    initializeCalculatorInputs();
    // Initial calculation
    calculateResults();
}

function calculateResults() {
    const activeCalculator = document.querySelector('.calculator-card.active');
    if (!activeCalculator) return;

    if (activeCalculator.id === 'sipCalculator') {
        calculateSIP();
    } else if (activeCalculator.id === 'emiCalculator') {
        calculateEMI();
    }
}

function calculateSIP() {
    const amount = parseFloat(document.getElementById('sipAmount').value) || 0;
    const years = parseFloat(document.getElementById('sipYears').value) || 0;
    const rate = parseFloat(document.getElementById('sipReturn').value) || 0;
    
    if (amount && years && rate) {
        const monthlyRate = rate / 12 / 100;
        const months = years * 12;
        const invested = amount * months;
        
        const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        const returns = futureValue - invested;
        
        updateResults('sip', {
            invested: invested.toFixed(0),
            returns: returns.toFixed(0),
            total: futureValue.toFixed(0)
        });
    }
}

function calculateEMI() {
    const principal = parseFloat(document.getElementById('loanAmount').value) || 0;
    const years = parseFloat(document.getElementById('loanTerm').value) || 0;
    const rate = parseFloat(document.getElementById('loanInterest').value) || 0;
    
    if (principal && years && rate) {
        const monthlyRate = rate / 12 / 100;
        const months = years * 12;
        
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        
        updateResults('emi', {
            emi: emi.toFixed(0),
            interest: totalInterest.toFixed(0),
            total: totalPayment.toFixed(0)
        });
    }
}

function updateResults(type, values) {
    const container = document.querySelector(`#${type}Calculator .result-container`);
    if (!container) return;
    
    const resultValues = container.querySelectorAll('.result-value');
    Object.values(values).forEach((value, index) => {
        if (resultValues[index]) {
            resultValues[index].textContent = `₹${formatNumber(value)}`;
        }
    });
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

function initializeCalculatorInputs() {
    // Input fields
    const calculatorInputs = document.querySelectorAll('.calculator-form input[type="number"]');
    calculatorInputs.forEach(input => {
        input.addEventListener('input', calculateResults);
        input.addEventListener('change', calculateResults);
    });

    // Range sliders
    const rangeInputs = document.querySelectorAll('.range-slider input[type="range"]');
    rangeInputs.forEach(range => {
        range.addEventListener('input', function() {
            const targetInput = this.parentElement.previousElementSibling.querySelector('input');
            if (targetInput) {
                targetInput.value = this.value;
                calculateResults();
            }
        });
    });
}


// Initialize calculators after DOM content is loaded
    document.addEventListener('DOMContentLoaded', function() {
    // Initial setup
    initCalculators();
    
    // Also initialize after any dynamic content loads
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                initCalculators();
            }
        });
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const menu = document.querySelector(".menu");

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", function () {
            menu.classList.toggle("active");
        });
    }

    // Dropdown Toggle for Mobile
    document.querySelectorAll(".menu .dropdown > a").forEach(dropdownLink => {
        dropdownLink.addEventListener("click", function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentLi = this.parentElement;
                parentLi.classList.toggle("active");
            }
        });
    });
});
