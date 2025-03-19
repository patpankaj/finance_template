
// ========================= SELF-EXECUTING FUNCTION =========================
const FinancialApp = (() => {
  // ========================= CONFIGURATION =========================
  const CONFIG = {
    STOCK_API: {
      KEY: "IRITU0DJ0BXK2F2X",
      SYMBOLS: [
        "NSE:RELIANCE", "NSE:TCS", "NSE:HDFCBANK", 
        "NSE:INFY", "NSE:ICICIBANK", "NSE:SBIN",
        "NSE:BAJFINANCE", "NSE:ASIANPAINT", "NSE:ITC", "NSE:KOTAKBANK"
      ],
      FALLBACK_DATA: [
        { symbol: "NIFTY 50", price: 21853.80, change: 0.95, positive: true },
        { symbol: "SENSEX", price: 72186.09, change: 1.10, positive: true },
        { symbol: "BANK NIFTY", price: 45923.45, change: 0.75, positive: true },
        { symbol: "USD/INR", price: 82.96, change: -0.12, positive: false },
        { symbol: "GOLD", price: 62580, change: 0.65, positive: true }
      ]
    },
    COMPONENT_PATHS: {
      header: "components/header.html",
      cta: "components/cta.html",
      footer: "components/footer.html"
    }
  };

  // ========================= CACHED ELEMENTS =========================
  const DOM = {
    preloader: document.querySelector('.preloader'),
    marketTicker: document.querySelector('.ticker-track'),
    scrollTopBtn: document.querySelector('.scroll-top'),
    calculatorForm: document.getElementById('allInOneCalculator'),
    calculatorResult: document.getElementById('calculatorResult'),
    retirementForm: document.getElementById('retirementForm'),
    retirementResult: document.getElementById('retirementResult')
  };

  // ========================= PRIVATE METHODS =========================
  const fetchStockData = async () => {
    try {
      const responses = await Promise.allSettled(
        CONFIG.STOCK_API.SYMBOLS.map(symbol => 
          fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${CONFIG.STOCK_API.KEY}`)
        )
      );

      const processedData = await Promise.all(
        responses
          .filter(res => res.status === "fulfilled" && res.value.ok)
          .map(async res => {
            const data = await res.value.json();
            const quote = data["Global Quote"] || {};
            
            if (!quote || Object.keys(quote).length === 0) {
              throw new Error("Invalid API response");
            }
            
            return {
              symbol: quote["01. symbol"]?.replace("NSE:", "") || "Unknown",
              price: parseFloat(quote["05. price"] || 0),
              change: parseFloat(quote["09. change"] || 0),
              changePercent: quote["10. change percent"] || "0.00%",
              positive: parseFloat(quote["09. change"] || 0) >= 0
            };
          })
      );

      return processedData.length > 0 ? processedData : CONFIG.STOCK_API.FALLBACK_DATA;
    } catch (error) {
      console.error("Stock data fetch failed:", error);
      return CONFIG.STOCK_API.FALLBACK_DATA;
    }
  };

  const parseFinancialValue = (value) => {
    return parseFloat((value || "0").replace(/[^0-9.-]/g, "")) || 0;
  };

  const createTickerItem = (data) => {
    return `
      <div class="ticker-item" aria-live="polite">
        <span class="stock">${data.symbol}</span>
        <span class="price ${data.positive ? "up" : "down"}">
          ₹${typeof data.price === 'number' ? data.price.toFixed(2) : data.price}
        </span>
        <span class="change ${data.positive ? "up" : "down"}">
          ${data.positive ? "+" : ""}${typeof data.change === 'number' ? data.change.toFixed(2) : data.change}
          ${data.changePercent ? `(${data.changePercent})` : ''}
        </span>
      </div>
    `;
  };

  const createFallbackTickers = () => {
    return CONFIG.STOCK_API.FALLBACK_DATA.map(item => `
      <div class="ticker-item">
        <span class="stock">${item.symbol}</span>
        <span class="price ${item.positive ? "up" : "down"}">
          ₹${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
        </span>
        <span class="change ${item.positive ? "up" : "down"}">
          ${item.positive ? "+" : ""}${typeof item.change === 'number' ? item.change.toFixed(2) : item.change}
        </span>
      </div>
    `).join("");
  };

  // ========================= PUBLIC METHODS =========================
  return {
    // Initialization
    async init() {
      try {
        this.initPreloader();
        await this.loadComponents();
        this.initializeComponents();
        this.initMarketTicker();
        this.initCalculators();
        this.initUIComponents();
        this.initImageGalleries();
        this.initMarketInsightsChart();
        
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
          AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
        }
        
        this.initGSAPAnimations();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    },

    // Component loading
    async loadComponents() {
      try {
        const components = await Promise.all(
          Object.entries(CONFIG.COMPONENT_PATHS).map(async ([name, path]) => {
            try {
              const response = await fetch(path);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              return { name, html: await response.text() };
            } catch (error) {
              console.error(`Failed to load ${name}:`, error);
              return { name, html: '' }; // Return empty content as fallback
            }
          })
        );

        components.forEach(({ name, html }) => {
          const container = document.getElementById(`${name}-container`);
          if (container) {
            container.innerHTML = html;
            // Dispatch custom event for component-loaded
            container.dispatchEvent(new CustomEvent('component-loaded', { 
              detail: { component: name }
            }));
          }
        });

        return true;
      } catch (error) {
        console.error("Component loading failed:", error);
        return false;
      }
    },

    // Component initialization
    initializeComponents() {
      // Initialize Owl Carousel
      const initializeOwlCarousel = () => {
        try {
          if (typeof $ !== 'undefined' && typeof $.fn?.owlCarousel !== 'undefined') {
            const carousels = $('.hero-carousel');
            if (carousels.length) {
              carousels.owlCarousel({
                items: 1,
                loop: true,
                margin: 20,
                nav: true,
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                responsive: {
                  0: { items: 1 },
                  768: { items: 2 },
                  1024: { items: 3 }
                }
              });
              
              // Resize handler with debounce
              let resizeTimer;
              window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                  carousels.trigger('refresh.owl.carousel');
                }, 250);
              });
            }
          }
        } catch (error) {
          console.error('Owl Carousel initialization failed:', error);
        }
      };

      // Initialize Bootstrap components
      const initializeBootstrap = () => {
        try {
          if (typeof bootstrap !== 'undefined') {
            const dropdowns = document.querySelectorAll('.dropdown-toggle');
            dropdowns.forEach(dropdown => {
              new bootstrap.Dropdown(dropdown);
            });
          }
        } catch (error) {
          console.error('Bootstrap initialization failed:', error);
        }
      };

      // Initialize smooth scrolling
      const initializeSmoothScroll = () => {
        try {
          document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
              const targetId = anchor.getAttribute("href");
              if (targetId === "#") return;

              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                  behavior: "smooth",
                  block: "start"  // Added for better alignment
                });
              }
            });
          });
        } catch (error) {
          console.error('Smooth scroll initialization failed:', error);
        }
      };

      // Initialize Swiper
      const initializeSwiper = () => {
        try {
          if (typeof Swiper !== 'undefined') {
            const swiperContainers = document.querySelectorAll('.swiper-container');
            if (swiperContainers.length > 0) {
              swiperContainers.forEach(container => {
                new Swiper(container, {
                  slidesPerView: 'auto',
                  spaceBetween: 20,
                  centeredSlides: true,
                  loop: true,
                  pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                  },
                  navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  },
                  breakpoints: {
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                  }
                });
              });
            }
          }
        } catch (error) {
          console.error('Swiper initialization failed:', error);
        }
      };

      // Update copyright year
      const updateCopyrightYear = () => {
        try {
          const yearElement = document.getElementById("current-year");
          if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
          }
        } catch (error) {
          console.error('Copyright year update failed:', error);
        }
      };

      // Initialize all components
      initializeOwlCarousel();
      initializeBootstrap();
      initializeSmoothScroll();
      initializeSwiper();
      updateCopyrightYear();
      this.initLazyLoading();
    },

    // Market Ticker
    async initMarketTicker() {
      if (!DOM.marketTicker) return;

      const updateTicker = async () => {
        try {
          const data = await fetchStockData();
          
          if (data && data.length > 0) {
            DOM.marketTicker.innerHTML = data.map(createTickerItem).join("");
          }
        } catch (error) {
          console.error("Ticker update failed:", error);
          
          // Use fallback data if update fails
          DOM.marketTicker.innerHTML = createFallbackTickers();
        }
      };

      await updateTicker();
      setInterval(updateTicker, 300000); // Update every 5 minutes
    },

    // Calculators
    initCalculators() {
      this.initFinancialCalculator();
      this.initRetirementCalculator();
    },

    // Financial Calculator
    initFinancialCalculator() {
      if (!DOM.calculatorForm || !DOM.calculatorResult) return;
      
      DOM.calculatorForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById("investment-amount").value);
        const rate = parseFloat(document.getElementById("expected-return").value) / 100;
        const years = parseInt(document.getElementById("investment-years").value);
        
        if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
          DOM.calculatorResult.innerHTML = "<p>Please enter valid numbers for all fields.</p>";
          return;
        }
        
        // Simple compound interest formula
        const futureValue = amount * Math.pow((1 + rate), years);
        DOM.calculatorResult.innerHTML = `
          <p>Estimated Future Value: ₹${futureValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
        `;
      });
    },

    // Retirement Calculator
    initRetirementCalculator() {
      if (!DOM.retirementForm || !DOM.retirementResult) return;
      
      DOM.retirementForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const currentAge = parseInt(document.getElementById("current-age").value);
        const retirementAge = parseInt(document.getElementById("retirement-age").value);
        const monthlySavings = parseFloat(document.getElementById("monthly-savings").value);
        const currentSavings = parseFloat(document.getElementById("current-savings")?.value || 0);
        const expectedReturn = parseFloat(document.getElementById("retirement-return")?.value || 8) / 100;
        
        if (isNaN(currentAge) || isNaN(retirementAge) || isNaN(monthlySavings)) {
          DOM.retirementResult.textContent = "Please enter valid numbers for all fields.";
          DOM.retirementResult.style.display = "block";
          return;
        }
        
        if (currentAge >= retirementAge) {
          DOM.retirementResult.textContent = "Retirement age must be greater than current age.";
          DOM.retirementResult.style.display = "block";
          return;
        }
        
        // Calculate retirement corpus
        const yearsToRetirement = retirementAge - currentAge;
        const monthlyRate = expectedReturn / 12;
        const months = yearsToRetirement * 12;
        
        // Calculate future value with compound interest
        let futureValue = currentSavings;
        futureValue += monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        
        // Format the result
        const formattedValue = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(futureValue);
        
        DOM.retirementResult.innerHTML = `
          <p>Based on your inputs, your estimated retirement corpus will be:</p>
          <h3>${formattedValue}</h3>
          <p>This calculation assumes an ${expectedReturn * 100}% annual return compounded monthly.</p>
        `;
        DOM.retirementResult.style.display = "block";
      });
    },

    // UI Components
    initUIComponents() {
      this.initScrollToTop();
      this.initServiceModals();
    },

    // Scroll to Top
    initScrollToTop() {
      if (!DOM.scrollTopBtn) return;

      const toggleVisibility = () => {
        DOM.scrollTopBtn.classList.toggle("active", window.scrollY > 300);
      };

      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      };

      window.addEventListener("scroll", toggleVisibility);
      DOM.scrollTopBtn.addEventListener("click", scrollToTop);
    },

    initServiceModals() {
      const serviceItems = document.querySelectorAll(".service-item");
      if (!serviceItems.length) return;
    
      // Create modal if it doesn't exist
      if (!document.getElementById("serviceModal")) {
        const modal = document.createElement("div");
        modal.id = "serviceModal";
        modal.className = "service-modal";
        modal.innerHTML = `
          <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h3 class="modal-title"></h3>
            <div class="modal-image-container">
              <img class="modal-image" src="/placeholder.svg" alt="Service Image">
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        
        // Close functionality
        const closeBtn = modal.querySelector(".modal-close");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
          });
        }
    
        // Close on outside click
        modal.addEventListener("click", (e) => {
          if (e.target === modal) modal.style.display = "none";
        });
      }
    
      // Add click event to service items
      serviceItems.forEach((item) => {
        item.addEventListener("click", function () {
          const modal = document.getElementById("serviceModal");
          if (!modal) return;
    
          const modalImg = modal.querySelector(".modal-image");
          const modalTitle = modal.querySelector(".modal-title");
          
          // Get service data with error handling
          const serviceImage = this.querySelector("img");
          const serviceTitle = this.querySelector(".service-title");
    
          if (!serviceImage || !serviceTitle) {
            console.error("Service item missing required elements", this);
            return;
          }
    
          // Update modal content
          modalImg.src = serviceImage.src;
          modalTitle.textContent = serviceTitle.textContent;
          
          // Show modal with smooth transition
          setTimeout(() => {
            modal.style.display = "flex";
            setTimeout(() => modal.classList.add("show"), 10); // Add class for transition
          }, 10);
        });
      });
    },
    // Form Validation
    validateForm(formId) {
      const form = document.getElementById(formId);
      if (!form) return false;

      const requiredFields = form.querySelectorAll("[required]");
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("is-invalid");

          // Add error message if not already present
          const errorMsg = field.nextElementSibling;
          if (!errorMsg || !errorMsg.classList.contains("invalid-feedback")) {
            const feedback = document.createElement("div");
            feedback.className = "invalid-feedback";
            feedback.textContent = "This field is required";
            field.parentNode.insertBefore(feedback, field.nextSibling);
          }
        } else {
          field.classList.remove("is-invalid");

          // Remove error message if present
          const errorMsg = field.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains("invalid-feedback")) {
            errorMsg.remove();
          }
        }
      });

      // Email validation
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          isValid = false;
          emailField.classList.add("is-invalid");

          // Add error message if not already present
          const errorMsg = emailField.nextElementSibling;
          if (!errorMsg || !errorMsg.classList.contains("invalid-feedback")) {
            const feedback = document.createElement("div");
            feedback.className = "invalid-feedback";
            feedback.textContent = "Please enter a valid email address";
            emailField.parentNode.insertBefore(feedback, emailField.nextSibling);
          }
        }
      }

      return isValid;
    },

    // Lazy Loading
    initLazyLoading() {
      const lazyImages = document.querySelectorAll("img.lazyload");
      
      if (!lazyImages.length) return;

      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const image = entry.target;
              image.src = image.dataset.src;
              image.classList.remove("lazyload");
              imageObserver.unobserve(image);
            }
          });
        });

        lazyImages.forEach((image) => {
          imageObserver.observe(image);
        });
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach((image) => {
          image.src = image.dataset.src;
        });
      }
    },

    // Market Insights Chart
    initMarketInsightsChart() {
      const ctx = document.getElementById('marketChart')?.getContext('2d');
      if (!ctx || typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded or canvas not found - disabling market insights chart');
        return;
      }

      const marketChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Market Trend',
            data: [120, 150, 170, 160, 180, 190, 200, 210, 205, 215, 220, 230],
            backgroundColor: 'rgba(26, 35, 126, 0.2)',
            borderColor: 'rgba(26, 35, 126, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Market Insights for 2023'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Market Value'
              }
            }
          }
        }
      });

      // Timeframe Update Functionality
      document.querySelectorAll('.btn-timeframe').forEach(btn => {
        btn.addEventListener('click', function() {
          document.querySelectorAll('.btn-timeframe').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          this.updateChartData(this.dataset.timeframe, marketChart);
        });
      });

      // Simulate Real-time Updates
      setInterval(() => {
        // Update summary cards
        document.querySelectorAll('.value').forEach(el => {
          const current = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
          const change = (Math.random() * 2 - 1) * 100;
          const newValue = current + change;
          el.textContent = newValue.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
          }).replace('₹', '₹ ');
        });
      }, 5000);
    },

    // Update Chart Data
    updateChartData(timeframe, chart) {
      if (!chart) return;
      
      // This is sample data - replace with real API calls
      const dataMap = {
        '1D': [120, 125, 130, 128, 135, 140, 142],
        '1W': [130, 135, 140, 138, 145, 150, 155],
        '1M': [140, 145, 150, 148, 155, 160, 165],
        '1Y': [150, 160, 170, 165, 175, 180, 185]
      };
      
      chart.data.datasets[0].data = dataMap[timeframe] || dataMap['1M'];
      chart.update();
    },

    // GSAP Animations
    initGSAPAnimations() {
      if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray(".service-card, .carousel-card, .product-card").forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.1
        });
      });
    },

    // Image Galleries & Carousels
    initImageGalleries() {
      this.initFinancialServicesCarousel();
      this.initGallerySlider();
      this.initDynamicFinancialCarousel();
    },

    // Financial Services Carousel
    initFinancialServicesCarousel() {
      if (typeof Swiper === 'undefined') return;
      
      const swiperContainer = document.querySelector('.swiper-container');
      const swiperWrapper = document.querySelector('.swiper-wrapper');
      
      if (!swiperContainer || !swiperWrapper) return;
      
      // Clear any existing slides
      swiperWrapper.innerHTML = '';
      
      // Sample images array
      const images = [
        {
          src: 'images/New Business Startup.jpg',
          alt: 'Business Startups',
          title: 'Business Startups',
          subtitle: 'Company registration, GST compliance, ROC returns, and tax filing services.'
        },
        {
          src: 'images/Professional Tax Registration _ Consultancy.jpg',  
          alt: 'Tax Services',
          title: 'Tax Services',
          subtitle: 'Professional tax registration, wealth tax planning, and property tax consultancy.'
        },
        {
          src: 'images/company formation.jpg',
          alt: 'Company Formation',
          title: 'Company Formation',
          subtitle: 'Registration services for companies, trusts, NGOs, and society formations.'
        },
        {
          src: 'images/Medical Insurance _ Med claim Advisory and Services.jpg',
          alt: 'Insurance Advisory',
          title: 'Insurance Advisory',
          subtitle: 'Comprehensive medical, life, and property insurance consultation services.'
        },
        {
          src: 'images/Income Tax Return.jpg',
          alt: 'Tax Filing',
          title: 'Tax Filing',
          subtitle: 'Income tax return preparation, assessment support, gst tax return filing and compliance services.'
        },
        {
          src: 'images/Inventory Management Services.jpg',
          alt: 'Inventory Solutions',
          title: 'Inventory Solutions',
          subtitle: 'Stock management, supply chain optimization, and inventory control systems.'
        },
        {
          src: 'images/Real Estate Big Deals_ _Land selling Deals.jpg',
          alt: 'Real Estate Deals',
          title: 'Real Estate Deals',
          subtitle: 'Commercial property transactions, land sales, and restaurant setup services.'
        },
        {
          src: 'images/Debt Recovery Tribunals Auctions and Deals.jpg',
          alt: 'Debt Recovery',
          title: 'Debt Recovery',
          subtitle: 'Tribunal representation, auction management, and franchise setup assistance.'
        },
        {
          src: 'images/Auto Loans.jpg',
          alt: 'Vehicle Finance',
          title: 'Vehicle Finance',
          subtitle: 'Competitive auto loan options and vehicle leasing solutions for all needs.'
        },
        {
          src: 'images/80.jpg',
          alt: 'Pension Plans',
          title: 'Pension Plans',
          subtitle: 'National pension system management and retirement planning strategies.'
        },
        {
          src: 'images/72.jpg',
          alt: 'Market Research',
          title: 'Market Research',
          subtitle: 'Comprehensive market analysis services for informed investment decisions.'
        },
        {
          src: 'images/95.jpg',
          alt: 'Property Loans',
          title: 'Property Loans',
          subtitle: 'Loan against property solutions with flexible repayment options.'
        },
        {
          src: 'images/94.jpg',
          alt: 'Personal Finance',
          title: 'Personal Finance',
          subtitle: 'Customized personal loan solutions for various financial requirements.'
        },
        {
          src: 'images/Gold Loan.jpg',
          alt: 'Gold Loans',
          title: 'Gold Loans',
          subtitle: 'Secure gold-backed financing solutions with competitive interest rates.'
        },
        {
          src: 'images/90.jpg',
          alt: 'Payroll Management',
          title: 'Payroll Management',
          subtitle: 'End-to-end payroll processing and compliance management services.'
        },
        {
          src: 'images/96.jpg', 
          alt: 'Union Services',
          title: 'Union Services',
          subtitle: 'Trade union registration and political party compliance solutions.'
        }
      ];
      
      // Create slides
      images.forEach(image => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
          <div class="carousel-card overlay-gradient">
            <div class="card-image">
              <img src="${image.src}" alt="${image.alt}" loading="lazy">
            </div>
            <div class="carousel-content">
              <h2 class="animated-title">${image.title}</h2>
              <p class="animated-subtitle">${image.subtitle}</p>
            </div>
          </div>
        `;
        swiperWrapper.appendChild(slide);
      });
      
      // Initialize Swiper
      try {
        new Swiper(swiperContainer, {
          loop: true,
          speed: 800,
          slidesPerView: 1,
          spaceBetween: 20,
          centeredSlides: true,
          autoplay: {
            delay: 3500,
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
          breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          },
          lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 3,
          },
          on: {
            init() {
              document.querySelectorAll('.swiper-slide-active').forEach(slide => {
                slide.style.opacity = 1;
              });
            }
          }
        });
      } catch (error) {
        console.error('Swiper initialization failed:', error);
      }
    },

    // Gallery Slider
    initGallerySlider() {
      const slider = document.querySelector('.gallery-slider');
      const slides = document.querySelectorAll('.slide');
      const prevArrow = document.querySelector('.prev-arrow');
      const nextArrow = document.querySelector('.next-arrow');
      
      if (!slider || !slides.length || !prevArrow || !nextArrow) return;
      
      let currentIndex = 0;
      let visibleSlides = 3; // Default number of visible slides
      
      function updateSlider() {
        const slideWidth = slides[0].offsetWidth + 20; // Adjust margin as needed
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }
    
      function handleResize() {
        if (window.innerWidth < 480) {
          visibleSlides = 1;
        } else if (window.innerWidth < 768) {
          visibleSlides = 2;
        } else {
          visibleSlides = 3;
        }
        updateSlider();
      }
      
      nextArrow.addEventListener('click', () => {
        if (currentIndex < slides.length - visibleSlides) {
          currentIndex++;
          updateSlider();
        }
      });
      
      prevArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });
      
      const autoSlideInterval = setInterval(() => {
        if (currentIndex < slides.length - visibleSlides) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateSlider();
      }, 5000);
      
      window.addEventListener('resize', handleResize);
      handleResize();
      
      // Return cleanup function for SPA if needed
      return () => {
        clearInterval(autoSlideInterval);
        window.removeEventListener('resize', handleResize);
      };
    },

    // Dynamic Financial Carousel
    initDynamicFinancialCarousel() {
      const carouselContainer = document.querySelector('.financial-carousel');
      const loadingOverlay = document.querySelector('.loading-overlay');
      
      if (!carouselContainer) return;
      
      try {
        // If loading overlay exists, show loading state
        if (loadingOverlay) {
          loadingOverlay.style.display = 'flex';
        }
        
        // Try to fetch from server, but use fallback data if fetch fails
        fetch('carousel-loader.php')
          .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
          })
          .then(services => {
            // Remove the loading overlay
            if (loadingOverlay) {
              loadingOverlay.remove();
            }
            
            this.renderFinancialCarousel(services);
          })
          .catch(error => {
            console.error('Error loading dynamic financial carousel:', error);
            
            // Use fallback data
            const fallbackServices = [
              {
                title: 'Investment Advisory',
                description: 'Expert guidance for your investment portfolio',
                src: 'images/investment.jpg'
              },
              {
                title: 'Tax Planning',
                description: 'Optimize your tax strategy with professional advice',
                src: 'images/tax-planning.jpg'
              },
              {
                title: 'Retirement Planning',
                description: 'Secure your future with our retirement solutions',
                src: 'images/retirement.jpg'
              },
              {
                title: 'Wealth Management',
                description: 'Comprehensive wealth management services',
                src: 'images/wealth.jpg'
              }
            ];
            
            if (loadingOverlay) {
              loadingOverlay.remove();
            }
            
            this.renderFinancialCarousel(fallbackServices);
          });
      } catch (error) {
        console.error('Dynamic carousel initialization failed:', error);
        
        if (loadingOverlay) {
          loadingOverlay.innerHTML = `
            <div class="error-message">
              Error loading financial services. 
              <button onclick="location.reload()">Try Again</button>
            </div>
          `;
        }
      }
    },
    
    // Render Financial Carousel
    renderFinancialCarousel(services) {
      const carousel = document.getElementById('dynamic-financial-carousel');
      if (!carousel) return;
      
      // Clear existing items
      carousel.innerHTML = '';
      
      services.forEach(service => {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
          <div class="carousel-card overlay-gradient">
            <div class="card-image">
              <img class="owl-lazy" data-src="${service.src}" alt="${service.title}" loading="lazy">
            </div>
            <div class="carousel-content">
              <h2 class="animated-title">${service.title}</h2>
              <p class="animated-subtitle">${service.description}</p>
            </div>
          </div>
        `;
        carousel.appendChild(item);
      });
      
      // Initialize Owl Carousel if available
      if (typeof $ !== 'undefined' && typeof $.fn.owlCarousel !== 'undefined') {
        $('#dynamic-financial-carousel').owlCarousel({
          items: 3,
          loop: services.length > 3,
          center: true,
          lazyLoad: true,
          margin: 25,
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
          },
          nav: true,
          navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
          ],
          dots: false,
          autoplay: true
        });
      }
    },

    // Preloader
    initPreloader() {
      if (!DOM.preloader) return;
      
      // Hide preloader when page is fully loaded
      if (document.readyState === 'complete') {
        DOM.preloader.style.opacity = '0';
        setTimeout(() => {
          if (DOM.preloader.parentNode) {
            DOM.preloader.parentNode.removeChild(DOM.preloader);
          }
        }, 300);
      } else {
        window.addEventListener('load', () => {
          DOM.preloader.style.opacity = '0';
          setTimeout(() => {
            if (DOM.preloader.parentNode) {
              DOM.preloader.parentNode.removeChild(DOM.preloader);
            }
          }, 300);
        });
      }
    }
  };
})();

// ========================= INITIALIZE APP =========================
document.addEventListener('DOMContentLoaded', () => FinancialApp.init());

// Make functions available globally
window.validateForm = (formId) => FinancialApp.validateForm(formId);
window.openModal = (element) => {
  const modal = document.getElementById("serviceModal");
  const modalImg = modal.querySelector(".modal-image");
  const modalTitle = modal.querySelector(".modal-title");

  modalImg.src = element.querySelector("img").src;
  modalTitle.textContent = element.querySelector(".service-title").textContent;
  modal.style.display = "flex";
};
window.closeModal = () => {
  const modal = document.getElementById("serviceModal");
  if (modal) {
    modal.style.display = "none";
  }
};

console.log("Financial App initialized successfully!");
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }

  // Lazy loading initialization
  document.querySelectorAll('.lazyload').forEach(img => {
    const src = img.getAttribute('data-src');
    if (src) {
      img.setAttribute('src', src);
      img.onload = () => img.removeAttribute('data-src');
    }
  });

  // Service card modals
  const initServiceModals = () => {
    const serviceCards = document.querySelectorAll('.service-card');
    if (!serviceCards.length) return;

    // Create modal if needed
    if (!document.getElementById('serviceModal')) {
      const modal = document.createElement('div');
      modal.id = 'serviceModal';
      modal.className = 'modal fade';
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <img class="img-fluid mb-3" src="" alt="Service Image">
              <div class="service-details"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Handle card clicks
    serviceCards.forEach(card => {
      card.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        const title = card.querySelector('h3').textContent;
        const image = card.querySelector('img').src;
        const features = Array.from(card.querySelectorAll('.service-features li'))
          .map(li => `<div class="d-flex align-items-center mb-2">
                        <i class="fas fa-check-circle me-2 text-primary"></i>
                        <span>${li.textContent}</span>
                      </div>`).join('');

        document.querySelector('.modal-title').textContent = title;
        document.querySelector('.modal-body img').src = image;
        document.querySelector('.service-details').innerHTML = features;
        modal.show();
      });
    });
  };

  // Initialize components
  initServiceModals();

  // Handle scroll animations
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.service-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
      }
    });
  });
});
// JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    easing: 'ease-in-out'
  });

  // Tax Calculator Logic
  const taxForm = document.getElementById('taxForm');
  const taxResult = document.getElementById('taxResult');
  const tabButtons = document.querySelectorAll('.tab-btn');
  let currentRegime = 'old';

  // Tab Switching
  tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentRegime = button.dataset.tab;
    });
  });

  // Tax Calculation
  taxForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const income = parseFloat(document.getElementById('annual-income').value);
    const investments = parseFloat(document.getElementById('investments').value);
    
    let tax = currentRegime === 'old' ? 
      calculateOldRegimeTax(income, investments) : 
      calculateNewRegimeTax(income);

    displayResults(tax, income);
  });

  function calculateOldRegimeTax(income, investments) {
    // Old regime slabs FY 2023-24 (with deductions)
    const deductions = Math.min(investments, 150000);
    let taxableIncome = income - deductions;
    if (taxableIncome < 0) taxableIncome = 0;

    const slabs = [
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 }
    ];

    let tax = 0;
    let remaining = taxableIncome;
    
    for (let i = 0; i < slabs.length; i++) {
      const prevLimit = i === 0 ? 0 : slabs[i-1].limit;
      const slabAmount = Math.min(remaining, slabs[i].limit - prevLimit);
      tax += slabAmount * slabs[i].rate;
      remaining -= slabAmount;
      if (remaining <= 0) break;
    }

    // Add 4% health and education cess
    tax += tax * 0.04;
    return tax;
  }

  function calculateNewRegimeTax(income) {
    // New regime slabs FY 2023-24 (no deductions)
    const slabs = [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 0.05 },
      { limit: 900000, rate: 0.1 },
      { limit: 1200000, rate: 0.15 },
      { limit: 1500000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 }
    ];

    let tax = 0;
    let remaining = income;
    
    for (let i = 0; i < slabs.length; i++) {
      const prevLimit = i === 0 ? 0 : slabs[i-1].limit;
      const slabAmount = Math.min(remaining, slabs[i].limit - prevLimit);
      tax += slabAmount * slabs[i].rate;
      remaining -= slabAmount;
      if (remaining <= 0) break;
    }

    // Rebate under Section 87A (for income <= ₹7 lakh)
    if (income <= 700000) {
      tax = Math.max(0, tax - 25000);
    }

    return tax;
  }


  function displayResults(tax, income) {
    const html = `
      <h3>Tax Calculation Results (${currentRegime.toUpperCase()} Regime)</h3>
      <div class="result-item">
        <span>Annual Income:</span>
        <span>₹${income.toLocaleString()}</span>
      </div>
      <div class="result-item">
        <span>Estimated Tax:</span>
        <span>₹${tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
      </div>
      <div class="result-item">
        <span>Effective Tax Rate:</span>
        <span>${((tax / income) * 100).toFixed(2)}%</span>
      </div>
    `;
    
    taxResult.innerHTML = html;
    taxResult.style.display = 'block';
    AOS.refresh();
  }
});
// Cache DOM elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeButton = document.getElementById('closeButton');

function openModal(serviceItem) {
  // Extract data from service item
  const imageSrc = serviceItem.querySelector('img').src;
  const titleText = serviceItem.querySelector('.service-title p').textContent;
  const description = serviceItem.dataset.description;

  // Update modal content
  modalImage.src = imageSrc;
  modalTitle.textContent = titleText;
  modalDescription.textContent = description || 'Detailed description coming soon.';

  // Show modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  closeButton.focus();

  // Add keyboard event listener
  document.addEventListener('keydown', handleKeyPress);
}

function closeModal() {
  modal.classList.remove('show');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleKeyPress);
}

function handleKeyPress(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeModal();
  }
}

// Event Listeners
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('click', () => openModal(item));
});

closeButton.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
// AOS Initialization
AOS.init({
  duration: 1000,
  once: true,
  easing: 'ease-in-out'
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Add hover effect to process steps
document.querySelectorAll('.process-step').forEach(step => {
  step.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px)';
  });
  step.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});