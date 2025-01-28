// Wait for all content to load
window.addEventListener('load', function() {
    // Hide preloader
    document.body.classList.add('loaded');
    
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.menu');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileMenuBtn && menu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    // Handle dropdowns on mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (window.innerWidth <= 991) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hide mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            menu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('.menu a');

    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

// Counter Animation
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.innerText);
        const count = 0;
        const speed = 200;
        const increment = target / speed;
        
        const updateCount = () => {
            const currentCount = parseInt(counter.innerText);
            if (currentCount < target) {
                counter.innerText = Math.ceil(currentCount + increment);
                setTimeout(updateCount, 1);
        } else {
                counter.innerText = target;
            }
        };
        
        updateCount();
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => animateCounter(counter));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stats-grid').forEach(grid => {
        counterObserver.observe(grid);
    });

    // Calculator Tabs
    const calculatorTabs = document.querySelectorAll('.tab-btn');
    const calculatorContents = document.querySelectorAll('.calculator-content');

    calculatorTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            calculatorTabs.forEach(t => t.classList.remove('active'));
            calculatorContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${target}-calculator`).classList.add('active');
        });
    });

    // Investment Calculator
    const investmentForm = document.getElementById('investmentForm');
    const resultDiv = document.getElementById('investmentResult');
    let calculatorType = 'sip'; // Default calculator type

    // Tab switching
    calculatorTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            calculatorTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            calculatorType = tab.dataset.tab;
            resultDiv.style.display = 'none';
        });
    });

    // Calculator form submission
    if (investmentForm) {
        investmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const amount = parseFloat(document.getElementById('investment-amount').value);
            const period = parseFloat(document.getElementById('investment-period').value);
            const returns = parseFloat(document.getElementById('expected-return').value);
            
            let result;
            if (calculatorType === 'sip') {
                result = calculateSIP(amount, period, returns);
            } else {
                result = calculateLumpsum(amount, period, returns);
            }
            
            displayResult(result);
        });
    }

    // SIP Calculator
    function calculateSIP(amount, period, returns) {
        const monthlyRate = returns / (12 * 100);
        const months = period * 12;
        const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalInvestment = amount * months;
        const totalReturns = futureValue - totalInvestment;
        
        return {
            futureValue: Math.round(futureValue),
            totalInvestment: Math.round(totalInvestment),
            totalReturns: Math.round(totalReturns)
        };
    }

    // Lumpsum Calculator
    function calculateLumpsum(amount, period, returns) {
        const futureValue = amount * Math.pow(1 + returns/100, period);
        const totalInvestment = amount;
        const totalReturns = futureValue - totalInvestment;
        
        return {
            futureValue: Math.round(futureValue),
            totalInvestment: Math.round(totalInvestment),
            totalReturns: Math.round(totalReturns)
        };
    }

    // Display calculator results
    function displayResult(result) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <h4>Future Value</h4>
                <p>₹${result.futureValue.toLocaleString()}</p>
            </div>
            <div class="result-item">
                <h4>Total Investment</h4>
                <p>₹${result.totalInvestment.toLocaleString()}</p>
            </div>
            <div class="result-item">
                <h4>Total Returns</h4>
                <p>₹${result.totalReturns.toLocaleString()}</p>
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    // GSAP Animations
    if (typeof gsap !== 'undefined') {
        // Hero Section Animation
        gsap.from('.hero-content', {
            duration: 1,
            y: 100,
            opacity: 0,
            ease: 'power3.out'
        });

        // Service Cards Animation
        gsap.utils.toArray('.service-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Features Animation
        gsap.utils.toArray('.feature-box').forEach(box => {
            gsap.from(box, {
                scrollTrigger: {
                    trigger: box,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    }

    // Stats Animation
    gsap.from('.stat-card', {
        scrollTrigger: {
            trigger: '.stats-section',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Market Ticker Animation
    const tickerTrack = document.querySelector('.ticker-track');
    if (tickerTrack) {
        tickerTrack.addEventListener('mouseenter', () => {
            tickerTrack.style.animationPlayState = 'paused';
        });

        tickerTrack.addEventListener('mouseleave', () => {
            tickerTrack.style.animationPlayState = 'running';
        });
    }
});

// Tax Calculator
document.addEventListener('DOMContentLoaded', function() {
    const taxForm = document.getElementById('taxForm');
    const resultDiv = document.getElementById('taxResult');
    const calculatorTabs = document.querySelectorAll('.tab-btn');
    let taxRegime = 'old'; // Default tax regime

    // Tab switching
    calculatorTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            calculatorTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            taxRegime = tab.dataset.tab;
            resultDiv.style.display = 'none';
        });
    });

    // Tax calculation form submission
    if (taxForm) {
        taxForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const income = parseFloat(document.getElementById('annual-income').value);
            const investments = parseFloat(document.getElementById('investments').value);
            
            let taxableIncome, tax;
            if (taxRegime === 'old') {
                taxableIncome = calculateTaxableIncomeOldRegime(income, investments);
                tax = calculateTaxOldRegime(taxableIncome);
            } else {
                taxableIncome = income; // No deductions in new regime
                tax = calculateTaxNewRegime(taxableIncome);
            }
            
            displayTaxResult(income, taxableIncome, tax);
        });
    }

    // Calculate taxable income for old regime
    function calculateTaxableIncomeOldRegime(income, investments) {
        const maxDeduction = 150000; // 80C limit
        const deduction = Math.min(investments, maxDeduction);
        return Math.max(income - deduction, 0);
    }

    // Calculate tax for old regime
    function calculateTaxOldRegime(income) {
        let tax = 0;
        
        if (income <= 250000) {
            tax = 0;
        } else if (income <= 500000) {
            tax = (income - 250000) * 0.05;
        } else if (income <= 1000000) {
            tax = 12500 + (income - 500000) * 0.2;
        } else {
            tax = 112500 + (income - 1000000) * 0.3;
        }
        
        // Add health and education cess
        tax = tax + (tax * 0.04);
        
        return tax;
    }

    // Calculate tax for new regime
    function calculateTaxNewRegime(income) {
        let tax = 0;
        
        if (income <= 300000) {
            tax = 0;
        } else if (income <= 600000) {
            tax = (income - 300000) * 0.05;
        } else if (income <= 900000) {
            tax = 15000 + (income - 600000) * 0.1;
        } else if (income <= 1200000) {
            tax = 45000 + (income - 900000) * 0.15;
        } else if (income <= 1500000) {
            tax = 90000 + (income - 1200000) * 0.2;
    } else {
            tax = 150000 + (income - 1500000) * 0.3;
        }
        
        // Add health and education cess
        tax = tax + (tax * 0.04);
        
        return tax;
    }

    // Display tax calculation results
    function displayTaxResult(income, taxableIncome, tax) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <h4>Gross Income</h4>
                <p>₹${income.toLocaleString()}</p>
            </div>
            <div class="result-item">
                <h4>Taxable Income</h4>
                <p>₹${taxableIncome.toLocaleString()}</p>
            </div>
            <div class="result-item">
                <h4>Total Tax</h4>
                <p>₹${Math.round(tax).toLocaleString()}</p>
            </div>
            <div class="result-item">
                <h4>Monthly Tax</h4>
                <p>₹${Math.round(tax/12).toLocaleString()}</p>
            </div>
        `;
        resultDiv.style.display = 'block';
    }
});

// Stats Counter Animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let count = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps

        const counter = setInterval(() => {
            count += increment;
            if (count >= target) {
                stat.textContent = target;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(count);
            }
        }, 16);
    });
}

// Initialize stats animation when they come into view
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
                animateStats();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Initialize Swiper for Featured Articles
const featuredSwiper = new Swiper('.featured-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// Parallax effect for newsletter section
if (document.querySelector('.newsletter-section')) {
    gsap.to('.newsletter-section', {
        backgroundPosition: '50% 100%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.newsletter-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

// Animate articles on scroll
const animateArticles = () => {
    const articles = document.querySelectorAll('.article-card');
    articles.forEach((article, index) => {
        gsap.from(article, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: article,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            }
        });
    });
};

// Animate dashboard cards
const animateDashboard = () => {
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            }
        });
    });
};

// Initialize animations when on insights page
if (document.querySelector('.insights-page')) {
    animateArticles();
    animateDashboard();
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Add your newsletter subscription logic here
        console.log('Newsletter subscription for:', email);
        
        // Show success message
        const button = newsletterForm.querySelector('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        button.style.background = '#4caf50';
        button.style.color = '#fff';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.color = '';
            newsletterForm.reset();
        }, 3000);
    });
}

// Market updates live ticker simulation
const updateMarketData = () => {
    const updates = document.querySelectorAll('.market-updates li');
    updates.forEach(item => {
        const change = (Math.random() * 2 - 1).toFixed(2);
        const arrow = change > 0 ? '↑' : '↓';
        const className = change > 0 ? 'up' : 'down';
        
        item.className = className;
        const valueSpan = item.querySelector('.value');
        if (valueSpan) {
            valueSpan.textContent = `${arrow} ${Math.abs(change)}%`;
        }
    });
};

// Update market data every 5 seconds if on insights page
if (document.querySelector('.insights-page')) {
    setInterval(updateMarketData, 5000);
}

// Insights Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const articleCards = document.querySelectorAll('.article-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        articleCards.forEach(card => {
            // Show all cards if 'all' is selected
            if (filterValue === 'all') {
                card.style.display = 'block';
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            } else {
                // Show/hide cards based on category
                if (card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        y: 20,
                        duration: 0.4,
                        ease: 'power2.in',
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            }
        });
    });
});

// Load More Articles Functionality
const loadMoreBtn = document.querySelector('.load-more-btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // Add loading state
        loadMoreBtn.classList.add('loading');
        loadMoreBtn.querySelector('i').classList.add('fa-spin');
        
        // Simulate loading delay
        setTimeout(() => {
            // Remove loading state
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.querySelector('i').classList.remove('fa-spin');
            
            // Show success message
            const originalText = loadMoreBtn.innerHTML;
            loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> Articles Loaded';
            
            // Reset button after delay
            setTimeout(() => {
                loadMoreBtn.innerHTML = originalText;
            }, 2000);
        }, 1500);
    });
}

// Bookmark and Share Functionality
const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add animation effect
        btn.classList.add('clicked');
        
        // If it's a bookmark button
        if (btn.querySelector('.fa-bookmark')) {
            const icon = btn.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        }
        
        // Remove animation class after animation completes
        setTimeout(() => {
            btn.classList.remove('clicked');
        }, 300);
    });
});
