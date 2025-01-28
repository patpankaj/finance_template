export function initAnimations() {
    // Initialize GSAP animations
    initHeroAnimations();
    initScrollAnimations();
}

function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    gsap.from(heroContent.querySelector('h1'), {
        duration: 1.5,
        opacity: 0,
        y: 50,
        ease: 'power3.out'
    });

    gsap.from(heroContent.querySelector('p'), {
        duration: 1.5,
        opacity: 0,
        y: 30,
        delay: 0.5,
        ease: 'power3.out'
    });

    gsap.from(heroContent.querySelector('.cta-button'), {
        duration: 1.5,
        opacity: 0,
        y: 20,
        delay: 1,
        ease: 'power3.out'
    });
}

function initScrollAnimations() {
    // Animate services cards
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            opacity: 0,
            y: 50,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });

    // Animate insights
    gsap.utils.toArray('.insight').forEach((insight, i) => {
        gsap.from(insight, {
            scrollTrigger: {
                trigger: insight,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            opacity: 0,
            y: 30,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });

    // Animate calculator section
    const calculator = document.querySelector('.finance-calculator');
    if (calculator) {
        gsap.from(calculator, {
            scrollTrigger: {
                trigger: calculator,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 1.5,
            opacity: 0,
            y: 50,
            ease: 'power3.out'
        });
    }

    // Animate insurance cards
    gsap.utils.toArray('.insurance-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            opacity: 0,
            y: 30,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });

    // Animate testimonials
    const testimonials = document.querySelector('.testimonials');
    if (testimonials) {
        gsap.from(testimonials, {
            scrollTrigger: {
                trigger: testimonials,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 1.5,
            opacity: 0,
            y: 50,
            ease: 'power3.out'
        });
    }
}
