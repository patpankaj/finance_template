// Self-executing function for FinancialApp
const FinancialApp = (() => {
  // Configuration
  const CONFIG = {
    STOCK_API: {
      KEY: "IRITU0DJ0BXK2F2X", // Replace with your Alpha Vantage API key
      SYMBOLS: [
        "RELIANCE.BSE",
        "TCS.BSE",
        "HDFCBANK.BSE",
        "INFY.BSE",
        "ICICIBANK.BSE",
        "SBIN.BSE",
        "BAJFINANCE.BSE",
        "ASIANPAINT.BSE",
        "ITC.BSE",
        "KOTAKBANK.BSE"
      ],
      FALLBACK_DATA: [
        { symbol: "NIFTY 50", price: 21853.8, change: 0.95, positive: true },
        { symbol: "SENSEX", price: 72186.09, change: 1.1, positive: true },
        { symbol: "BANK NIFTY", price: 45923.45, change: 0.75, positive: true },
        { symbol: "USD/INR", price: 82.96, change: -0.12, positive: false },
        { symbol: "GOLD", price: 62580, change: 0.65, positive: true }
      ],
      FALLBACK_DATA: [
        { symbol: "NIFTY 50", price: 21853.8, change: 0.95, positive: true },
        { symbol: "SENSEX", price: 72186.09, change: 1.1, positive: true },
        { symbol: "BANK NIFTY", price: 45923.45, change: 0.75, positive: true },
        { symbol: "USD/INR", price: 82.96, change: -0.12, positive: false },
        { symbol: "GOLD", price: 62580, change: 0.65, positive: true }
      ]
    },
    COMPONENT_PATHS: {
      header: "/components/header.html",
      cta: "/components/cta.html",
      footer: "/components/footer.html"
    },
    BREAKPOINTS: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1400
    }
  };

  // DOM Elements - Using a function to ensure elements are found after DOM is loaded
  const getDOM = () => ({
    preloader: document.querySelector(".preloader"),
    marketTicker: document.querySelector(".ticker-track"),
    scrollTopBtn: document.querySelector(".scroll-top"),
    calculatorForm: document.getElementById("allInOneCalculator"),
    calculatorResult: document.getElementById("calculatorResult"),
    retirementForm: document.getElementById("retirementForm"),
    retirementResult: document.getElementById("retirementResult"),
    mobileMenuToggle: document.querySelector(".mobile-menu-toggle"),
    mobileMenu: document.querySelector(".mobile-menu"),
    navLinks: document.querySelectorAll(".nav-link"),
    marketChartCanvas: document.getElementById("marketChart")
  });

  // Private methods
  const fetchStockData = async () => {
    try {
      // Use fallback data if API key is not set
      if (CONFIG.STOCK_API.KEY === "YOUR_API_KEY_HERE") {
        console.warn("Using fallback stock data. Please set your API key.");
        return CONFIG.STOCK_API.FALLBACK_DATA;
      }

      const responses = await Promise.allSettled(
        CONFIG.STOCK_API.SYMBOLS.map((symbol) =>
          fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${CONFIG.STOCK_API.KEY}`
          )
        )
      );

      const processedData = await Promise.all(
        responses.map(async (res) => {
          if (res.status === "fulfilled" && res.value.ok) {
            try {
              const data = await res.value.json();
              const quote = data["Global Quote"];
              if (quote && Object.keys(quote).length > 0) {
                return {
                  symbol: quote["01. symbol"].split(".")[0],
                  price: Number.parseFloat(quote["05. price"] || 0),
                  change: Number.parseFloat(quote["09. change"] || 0),
                  changePercent: quote["10. change percent"] || "0.00%",
                  positive: Number.parseFloat(quote["09. change"] || 0) >= 0
                };
              } else {
                console.warn(`Invalid API response for ${res.value.url}`);
                return null;
              }
            } catch (error) {
              console.error(`Error processing response for ${res.value.url}:`, error);
              return null;
            }
          } else {
            console.warn(`Request failed for ${res.reason || 'unknown reason'}`);
            return null;
          }
        })
      );

      const validData = processedData.filter((data) => data !== null);
      return validData.length > 0 ? validData : CONFIG.STOCK_API.FALLBACK_DATA;
    } catch (error) {
      console.error("Stock data fetch failed:", error);
      return CONFIG.STOCK_API.FALLBACK_DATA;
    }
  };

  const createTickerItem = (data) => {
    return `
      <div class="ticker-item" aria-live="polite">
        <span class="stock">${data.symbol}</span>
        <span class="price ${data.positive ? "up" : "down"}">
          ₹${data.price.toFixed(2)}
        </span>
        <span class="change ${data.positive ? "up" : "down"}">
          ${data.positive ? "+" : ""}${data.change.toFixed(2)} (${data.changePercent})
        </span>
      </div>
    `;
  };

  const debounce = (func, wait = 100) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Public methods
  return {
    async init() {
      try {
        // Get DOM elements after document is ready
        const DOM = getDOM();
        
        this.initPreloader(DOM);
        await this.loadComponents();
        this.initMarketTicker(DOM);
        this.initCalculators(DOM);
        this.initScrollToTop(DOM);
        this.initMobileMenu(DOM);
        this.initImageGalleries();
        this.initMarketInsightsChart(DOM);
        this.initResponsiveHandlers();

        // Initialize AOS if available
        if (typeof AOS !== "undefined") {
          AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
            disable: "mobile"
          });
        }

        // Initialize GSAP animations if available
        if (typeof gsap !== "undefined") {
          this.initGSAPAnimations();
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    },

    async loadComponents() {
      try {
        const components = await Promise.all(
          Object.entries(CONFIG.COMPONENT_PATHS).map(async ([name, path]) => {
            try {
              const container = document.getElementById(`${name}-container`);
              if (!container) {
                console.warn(`Container for ${name} not found`);
                return { name, success: false };
              }
              
              const response = await fetch(path);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              container.innerHTML = await response.text();
              return { name, success: true };
            } catch (error) {
              console.error(`Failed to load ${name}:`, error);
              return { name, success: false };
            }
          })
        );

        // Log component loading results
        components.forEach(({ name, success }) => {
          console.log(`Component ${name} loading ${success ? 'successful' : 'failed'}`);
        });
      } catch (error) {
        console.error("Component loading failed:", error);
      }
    },

    async initMarketTicker(DOM) {
      if (!DOM.marketTicker) return;

      const updateTicker = async () => {
        try {
          const data = await fetchStockData();
          DOM.marketTicker.innerHTML = data.map(createTickerItem).join("");
        } catch (error) {
          console.error("Ticker update failed:", error);
          DOM.marketTicker.innerHTML = CONFIG.STOCK_API.FALLBACK_DATA.map(createTickerItem).join("");
        }
      };

      await updateTicker();
      // Update ticker every 5 minutes
      setInterval(updateTicker, 300000);
    },

    initCalculators(DOM) {
      // Initialize all-in-one calculator
      if (DOM.calculatorForm && DOM.calculatorResult) {
        DOM.calculatorForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const amount = Number.parseFloat(document.getElementById("investment-amount")?.value || "0");
          const rate = Number.parseFloat(document.getElementById("expected-return")?.value || "0") / 100;
          const years = Number.parseInt(document.getElementById("investment-years")?.value || "0");

          if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
            DOM.calculatorResult.innerHTML = "<p>Please enter valid numbers.</p>";
            DOM.calculatorResult.style.display = "block";
            return;
          }

          const futureValue = amount * Math.pow(1 + rate, years);
          DOM.calculatorResult.innerHTML = `
            <p>Estimated Future Value: ₹${futureValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
          `;
          DOM.calculatorResult.style.display = "block";
        });
      }

      // Initialize retirement calculator
      if (DOM.retirementForm && DOM.retirementResult) {
        DOM.retirementForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const currentAge = Number.parseInt(document.getElementById("current-age")?.value || "0");
          const retirementAge = Number.parseInt(document.getElementById("retirement-age")?.value || "0");
          const monthlySavings = Number.parseFloat(document.getElementById("monthly-savings")?.value || "0");
          const expectedReturn = Number.parseFloat(document.getElementById("retirement-return")?.value || "0") / 100;

          if (isNaN(currentAge) || isNaN(retirementAge) || isNaN(monthlySavings) || isNaN(expectedReturn)) {
            DOM.retirementResult.innerHTML = "<p>Please enter valid numbers.</p>";
            DOM.retirementResult.style.display = "block";
            return;
          }

          const years = retirementAge - currentAge;
          const monthlyRate = expectedReturn / 12;
          const months = years * 12;
          
          // Calculate future value of monthly savings
          const futureValue = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
          
          DOM.retirementResult.innerHTML = `
            <p>Estimated Retirement Corpus: ₹${futureValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
          `;
          DOM.retirementResult.style.display = "block";
        });
      }
    },

    initScrollToTop(DOM) {
      if (!DOM.scrollTopBtn) return;
      
      const toggleScrollButton = () => {
        if (window.pageYOffset > 300) {
          DOM.scrollTopBtn.classList.add("active");
        } else {
          DOM.scrollTopBtn.classList.remove("active");
        }
      };

      window.addEventListener("scroll", debounce(toggleScrollButton, 100));
      
      DOM.scrollTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    },

    initMobileMenu(DOM) {
      if (!DOM.mobileMenuToggle || !DOM.mobileMenu) return;
      
      DOM.mobileMenuToggle.addEventListener("click", () => {
        DOM.mobileMenu.classList.toggle("active");
        DOM.mobileMenuToggle.classList.toggle("active");
        document.body.classList.toggle("menu-open");
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          DOM.mobileMenu.classList.contains("active") &&
          !DOM.mobileMenu.contains(e.target) &&
          !DOM.mobileMenuToggle.contains(e.target)
        ) {
          DOM.mobileMenu.classList.remove("active");
          DOM.mobileMenuToggle.classList.remove("active");
          document.body.classList.remove("menu-open");
        }
      });

      // Close menu when clicking on nav links
      DOM.navLinks.forEach(link => {
        link.addEventListener("click", () => {
          DOM.mobileMenu.classList.remove("active");
          DOM.mobileMenuToggle.classList.remove("active");
          document.body.classList.remove("menu-open");
        });
      });
    },

    initImageGalleries() {
      this.initFinancialServicesCarousel();
      this.initGallerySlider();
    },

    initFinancialServicesCarousel() {
      if (typeof Swiper === "undefined") {
        console.warn("Swiper is not loaded");
        return;
      }

      const swiperContainer = document.querySelector(".swiper-container");
      const swiperWrapper = document.querySelector(".swiper-wrapper");
      if (!swiperContainer || !swiperWrapper) {
        console.warn("Swiper container or wrapper not found");
        return;
      }

      // Clear existing slides
      swiperWrapper.innerHTML = "";

      // Fallback data
      const images = [
        { src: "images/New Business Startup.jpg", alt: "Business Startups", title: "Business Startups", subtitle: "Company registration and tax filing" },
        { src: "images/Professional Tax Registration _ Consultancy.jpg", alt: "Tax Services", title: "Tax Services", subtitle: "Tax registration and planning" },
        { src: "images/company formation.jpg", alt: "Company Formation", title: "Company Formation", subtitle: "Registration for companies and NGOs" },
        { src: "images/Medical Insurance _ Med claim Advisory and Services.jpg", alt: "Insurance Advisory", title: "Insurance Advisory", subtitle: "Medical and life insurance consultation" },
        { src: "images/Income Tax Return.jpg", alt: "Tax Filing", title: "Tax Filing", subtitle: "Income tax return preparation" },
        { src: "images/Inventory Management Services.jpg", alt: "Inventory Solutions", title: "Inventory Solutions", subtitle: "Stock management and optimization" }
      ];

      // Create slides
      images.forEach((image) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
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
        const Swiper = window.Swiper;
        new Swiper(swiperContainer, {
          loop: true,
          speed: 800,
          slidesPerView: 1,
          spaceBetween: 20,
          centeredSlides: true,
          autoplay: { delay: 3500, disableOnInteraction: false },
          pagination: { el: ".swiper-pagination", clickable: true },
          navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
          breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          },
          lazy: { loadPrevNext: true, loadPrevNextAmount: 3 }
        });
      } catch (error) {
        console.error("Error initializing Swiper:", error);
      }
    },

    initGallerySlider() {
      const slider = document.querySelector(".gallery-slider");
      const slides = document.querySelectorAll(".slide");
      const prevArrow = document.querySelector(".prev-arrow");
      const nextArrow = document.querySelector(".next-arrow");

      if (!slider || !slides.length || !prevArrow || !nextArrow) {
        console.warn("Gallery slider elements not found");
        return;
      }

      let currentIndex = 0;
      let visibleSlides = 3;
      let autoSlideInterval;

      function updateSlider() {
        const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }

      function handleResize() {
        if (window.innerWidth < 480) visibleSlides = 1;
        else if (window.innerWidth < 768) visibleSlides = 2;
        else visibleSlides = 3;
        
        // Reset to first slide if current index is out of bounds after resize
        if (currentIndex > slides.length - visibleSlides) {
          currentIndex = 0;
        }
        
        updateSlider();
      }

      nextArrow.addEventListener("click", () => {
        if (currentIndex < slides.length - visibleSlides) {
          currentIndex++;
        } else {
          currentIndex = 0; // Loop back to start
        }
        updateSlider();
      });

      prevArrow.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = slides.length - visibleSlides; // Loop to end
        }
        updateSlider();
      });

      // Auto slide functionality
      function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
          if (currentIndex < slides.length - visibleSlides) {
            currentIndex++;
          } else {
            currentIndex = 0;
          }
          updateSlider();
        }, 5000);
      }

      function stopAutoSlide() {
        clearInterval(autoSlideInterval);
      }

      // Pause auto slide on hover
      slider.addEventListener("mouseenter", stopAutoSlide);
      slider.addEventListener("mouseleave", startAutoSlide);

      // Handle window resize
      window.addEventListener("resize", debounce(handleResize, 250));
      
      // Initialize
      handleResize();
      startAutoSlide();
    },

    initMarketInsightsChart(DOM) {
      if (!DOM.marketChartCanvas) {
        console.warn("Market chart canvas not found");
        return;
      }
      
      if (typeof Chart === "undefined") {
        console.warn("Chart.js is not loaded");
        return;
      }

      try {
        const ctx = DOM.marketChartCanvas.getContext("2d");
        if (!ctx) {
          console.warn("Failed to get 2D context for canvas");
          return;
        }

        const marketChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
              label: "Market Trend",
              data: [120, 150, 170, 160, 180, 190, 200, 210, 205, 215, 220, 230],
              backgroundColor: "rgba(26, 35, 126, 0.2)",
              borderColor: "rgba(26, 35, 126, 1)",
              borderWidth: 2,
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'easeOutQuart'
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Market Insights for 2023" }
            },
            scales: {
              y: { beginAtZero: true, title: { display: true, text: "Market Value" } }
            }
          }
        });

        // Add timeframe buttons functionality
        document.querySelectorAll(".btn-timeframe").forEach((btn) => {
          btn.addEventListener("click", function () {
            document.querySelectorAll(".btn-timeframe").forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
            
            const timeframe = this.dataset.timeframe;
            const dataMap = {
              "1D": [120, 125, 130, 128, 135, 140, 142],
              "1W": [130, 135, 140, 138, 145, 150, 155],
              "1M": [140, 145, 150, 148, 155, 160, 165],
              "1Y": [150, 160, 170, 165, 175, 180, 185]
            };
            
            marketChart.data.datasets[0].data = dataMap[timeframe] || dataMap["1M"];
            marketChart.update();
          });
        });
      } catch (error) {
        console.error("Error initializing market chart:", error);
      }
    },

    initResponsiveHandlers() {
      const handleResize = () => {
        // Add any responsive adjustments here
        const width = window.innerWidth;
        document.documentElement.style.setProperty('--viewport-width', `${width}px`);
      };

      window.addEventListener("resize", debounce(handleResize, 250));
      handleResize(); // Initialize on load
    },

    initGSAPAnimations() {
      if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.warn("GSAP or ScrollTrigger not loaded");
        return;
      }

      try {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;

        // Animate cards
        gsap.utils.toArray(".insurance-card, .tax-service").forEach((card, index) => {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 80%"
            }
          });
        });

        // Animate headings
        gsap.utils.toArray("h1, h2.section-title").forEach((heading) => {
          gsap.from(heading, {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%"
            }
          });
        });
      } catch (error) {
        console.error("Error initializing GSAP animations:", error);
      }
    },

    initPreloader(DOM) {
      if (!DOM.preloader) return;
      
      // Hide preloader when page is fully loaded
      window.addEventListener("load", () => {
        DOM.preloader.style.opacity = "0";
        setTimeout(() => {
          if (DOM.preloader.parentNode) {
            DOM.preloader.parentNode.removeChild(DOM.preloader);
          }
        }, 300);
      });
      
      // Fallback to hide preloader if load event doesn't fire
      setTimeout(() => {
        if (DOM.preloader && DOM.preloader.style.opacity !== "0") {
          DOM.preloader.style.opacity = "0";
          setTimeout(() => {
            if (DOM.preloader.parentNode) {
              DOM.preloader.parentNode.removeChild(DOM.preloader);
            }
          }, 300);
        }
      }, 5000);
    }
  };
})();

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, initializing FinancialApp");
  FinancialApp.init();
});
document.addEventListener('DOMContentLoaded', function() {
  // Chart.js Initialization
  const ctx = document.getElementById('marketChart').getContext('2d');
  let marketChart;

  // Timeframe Data Generator
  function generateData(timeframe) {
      const dataPoints = {
          '1D': 24,
          '1W': 7,
          '1M': 30,
          '1Y': 12
      }[timeframe] || 24;

      return Array.from({length: dataPoints}, (_, i) => 
          Math.floor(Math.random() * 500 + 21000)
      );
  }

  // Chart Configuration
  function initChart(timeframe = '1D') {
      if (marketChart) marketChart.destroy();
      
      marketChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: generateData(timeframe).map((_, i) => i + 1),
              datasets: [{
                  label: 'NIFTY 50',
                  data: generateData(timeframe),
                  borderColor: '#2962ff',
                  tension: 0.4,
                  fill: false
              }]
          },
          options: {
              responsive: true,
              plugins: {
                  legend: { display: false }
              },
              scales: {
                  y: {
                      beginAtZero: false,
                      grid: { color: 'rgba(0,0,0,0.05)' }
                  }
              }
          }
      });
  }

  // Timeframe Controls
  document.querySelectorAll('.btn-timeframe').forEach(button => {
      button.addEventListener('click', function() {
          document.querySelector('.btn-timeframe.active').classList.remove('active');
          this.classList.add('active');
          initChart(this.dataset.timeframe);
      });
  });

  // Initialize default chart
  initChart();

  // Real-time Value Updates
  function updateValues() {
      document.querySelectorAll('.summary-card').forEach(card => {
          const valueElement = card.querySelector('.value');
          const changeElement = card.querySelector('.change');
          let currentValue = parseFloat(valueElement.textContent.replace(/[^0-9.]/g, ''));
          
          // Generate random change (-2% to +2%)
          const change = (Math.random() * 4 - 2).toFixed(2);
          const newValue = currentValue * (1 + change/100);
          
          // Update elements
          valueElement.textContent = `${card.querySelector('h5').textContent.includes('Gold') ? '₹' : ''}${newValue.toFixed(2)}`;
          changeElement.textContent = `${change >= 0 ? '+' : ''}${change}%`;
          changeElement.className = `change ${change >= 0 ? 'positive' : 'negative'}`;
      });
  }

  
  setInterval(updateValues, 5000);
  updateValues()
});
// Log for demonstration purposes
console.log("Script loaded successfully");
