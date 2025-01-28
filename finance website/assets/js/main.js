// Import modules
import { initNavigation } from './modules/navigation.js';
import { initMarketTicker } from './modules/marketTicker.js';
import { initCalculator } from './modules/calculator.js';
import { initCharts } from './modules/charts.js';
import { initForms } from './modules/forms.js';
import { initAnimations } from './modules/animations.js';
import { initTestimonials } from './modules/testimonials.js';

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    try {
        initNavigation();
        console.log('Navigation initialized');
        
        initMarketTicker();
        console.log('Market ticker initialized');
        
        initCalculator();
        console.log('Calculator initialized');
        
        initCharts();
        console.log('Charts initialized');
        
        initForms();
        console.log('Forms initialized');
        
        initAnimations();
        console.log('Animations initialized');
        
        initTestimonials();
        console.log('Testimonials initialized');
    } catch (error) {
        console.error('Error initializing modules:', error);
    }
});
