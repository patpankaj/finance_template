export function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length === 0) return;

    let currentTestimonial = 0;
    showTestimonial(currentTestimonial);

    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Add navigation dots
    createNavigationDots(testimonials.length);
}

function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');

    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
        testimonial.style.opacity = i === index ? '1' : '0';
    });

    if (dots.length > 0) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
}

function createNavigationDots(count) {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot';
        dot.addEventListener('click', () => showTestimonial(i));
        dotsContainer.appendChild(dot);
    }

    testimonialSlider.appendChild(dotsContainer);
}
