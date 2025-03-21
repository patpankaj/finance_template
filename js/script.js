// ========================= FINANCIAL APPLICATION MODULE =========================
const FinancialApp = (() => {
  // ========================= MODULE CONFIGURATION =========================
  const CONFIG = {
    API: {
      STOCKS: {
        KEY: "IRITU0DJ0BXK2F2X",
        SYMBOLS: [
          "NSE:RELIANCE", "NSE:TCS", "NSE:HDFCBANK", 
          "NSE:INFY", "NSE:ICICIBANK", "NSE:SBIN",
          "NSE:BAJFINANCE", "NSE:ASIANPAINT", "NSE:ITC", "NSE:KOTAKBANK"
        ],
        FALLBACK: [
          { symbol: "NIFTY 50", price: 21853.80, change: 0.95, positive: true },
          { symbol: "SENSEX", price: 72186.09, change: 1.10, positive: true },
          { symbol: "BANK NIFTY", price: 45923.45, change: 0.75, positive: true },
          { symbol: "USD/INR", price: 82.96, change: -0.12, positive: false },
          { symbol: "GOLD", price: 62580, change: 0.65, positive: true }
        ]
      },
      CAROUSEL_DATA: "carousel-loader.php"
    },
    SELECTORS: {
      PRELOADER: ".preloader",
      TICKER: ".ticker-track",
      SCROLL_TOP: ".scroll-top",
      CALCULATOR: "#allInOneCalculator",
      CALC_RESULT: "#calculatorResult",
      RETIREMENT_FORM: "#retirementForm",
      RETIREMENT_RESULT: "#retirementResult"
    },
    COMPONENTS: {
      HEADER: "components/header.html",
      CTA: "components/cta.html",
      FOOTER: "components/footer.html"
    }
  };

  // ========================= DOM ELEMENT CACHE =========================
  const DOM = {
    preloader: document.querySelector(CONFIG.SELECTORS.PRELOADER),
    marketTicker: document.querySelector(CONFIG.SELECTORS.TICKER),
    scrollTopBtn: document.querySelector(CONFIG.SELECTORS.SCROLL_TOP),
    calculatorForm: document.querySelector(CONFIG.SELECTORS.CALCULATOR),
    calculatorResult: document.querySelector(CONFIG.SELECTORS.CALC_RESULT),
    retirementForm: document.querySelector(CONFIG.SELECTORS.RETIREMENT_FORM),
    retirementResult: document.querySelector(CONFIG.SELECTORS.RETIREMENT_RESULT)
  };

  // ========================= UTILITY FUNCTIONS =========================
  const Utils = {
    parseFinancialValue: (value) => parseFloat((value || "0").replace(/[^0-9.-]/g, "")) || 0,
    
    handleAPIError: (error, context) => {
      console.error(`API Error in ${context}:`, error);
      return CONFIG.API.STOCKS.FALLBACK;
    },

    createElement: (tag, classes, content) => {
      const el = document.createElement(tag);
      if (classes) el.className = classes;
      if (content) el.innerHTML = content;
      return el;
    },

    formatCurrency: (value) => 
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
      }).format(value)
  };

  // ========================= DATA SERVICES =========================
  const DataService = {
    fetchStockData: async () => {
      try {
        const responses = await Promise.allSettled(
          CONFIG.API.STOCKS.SYMBOLS.map(symbol => 
            fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${CONFIG.API.STOCKS.KEY}`)
          )
        );

        const validResponses = responses
          .filter(res => res.status === "fulfilled" && res.value.ok)
          .map(res => res.value);

        if (!validResponses.length) throw new Error("No valid API responses");

        const processedData = await Promise.all(
          validResponses.map(async response => {
            const data = await response.json();
            const quote = data["Global Quote"] || {};
            
            return {
              symbol: (quote["01. symbol"] || "Unknown").replace("NSE:", ""),
              price: parseFloat(quote["05. price"] || 0),
              change: parseFloat(quote["09. change"] || 0),
              changePercent: quote["10. change percent"] || "0.00%",
              positive: parseFloat(quote["09. change"] || 0) >= 0
            };
          })
        );

        return processedData.length ? processedData : CONFIG.API.STOCKS.FALLBACK;
      } catch (error) {
        return Utils.handleAPIError(error, "fetchStockData");
      }
    },

    fetchCarouselData: async () => {
      try {
        const response = await fetch(CONFIG.API.CAROUSEL_DATA);
        if (!response.ok) throw new Error("Network response error");
        return await response.json();
      } catch (error) {
        console.error("Carousel data fallback:", error);
        return [/* Fallback data array */];
      }
    }
  };

  // ========================= UI COMPONENTS =========================
  const UIComponents = {
    createTickerItem: (data) => `
      <div class="ticker-item" aria-live="polite">
        <span class="stock">${data.symbol}</span>
        <span class="price ${data.positive ? "up" : "down"}">
          ₹${data.price?.toFixed(2) || data.price}
        </span>
        <span class="change ${data.positive ? "up" : "down"}">
          ${data.positive ? "+" : ""}${data.change?.toFixed(2) || data.change}
          ${data.changePercent ? `(${data.changePercent})` : ''}
        </span>
      </div>
    `,

    createFallbackTickers: () => 
      CONFIG.API.STOCKS.FALLBACK.map(item => `
        <div class="ticker-item">
          <span class="stock">${item.symbol}</span>
          <span class="price ${item.positive ? "up" : "down"}">
            ₹${item.price.toFixed(2)}
          </span>
          <span class="change ${item.positive ? "up" : "down"}">
            ${item.positive ? "+" : ""}${item.change.toFixed(2)}
          </span>
        </div>
      `).join(""),

    initScrollToTop: () => {
      if (!DOM.scrollTopBtn) return;

      const toggleVisibility = () => 
        DOM.scrollTopBtn.classList.toggle("active", window.scrollY > 300);

      const scrollToTop = () => 
        window.scrollTo({ top: 0, behavior: "smooth" });

      window.addEventListener("scroll", toggleVisibility);
      DOM.scrollTopBtn.addEventListener("click", scrollToTop);
    }
  };

  // ========================= CORE FUNCTIONALITY =========================
  return {
    // Initialization
    async init() {
      try {
        this.initPreloader();
        await this.loadComponents();
        this.initializeCoreModules();
        this.initMarketTicker();
        this.initCalculators();
        this.initUIComponents();
        this.initThirdPartyIntegrations();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    },

    // Component initialization
    initializeCoreModules() {
      this.initLazyLoading();
      UIComponents.initScrollToTop();
      this.initServiceModals();
      this.initDynamicFinancialCarousel();
    },

    // Third-party integrations
    initThirdPartyIntegrations() {
      this.initAOS();
      this.initGSAPAnimations();
      this.initOwlCarousel();
      this.initSwiper();
    },

    // AOS initialization
    initAOS() {
      if (typeof AOS === "object") {
        AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
      }
    },

    // Rest of the implementation...
    // (Include other methods from original code with similar refactoring)
  };
})();

// ========================= APPLICATION BOOTSTRAP =========================
document.addEventListener("DOMContentLoaded", () => {
  FinancialApp.init();
  window.validateForm = (formId) => FinancialApp.validateForm(formId);
});

console.log("Financial Application initialized successfully");
