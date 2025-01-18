export function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.menu');
    
    if (mobileMenuBtn && menu) {
        mobileMenuBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
            const isExpanded = menu.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                menu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', false);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && menu.classList.contains('active')) {
                menu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', false);
            }
        });
    }

    // Add scroll effect to navigation
    const nav = document.querySelector('.nav-wrapper');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 60) {
            nav.style.transform = 'translateX(-50%)';
            return;
        }

        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            nav.style.transform = 'translate(-50%, -100%)';
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            nav.style.transform = 'translateX(-50%)';
        }

        lastScroll = currentScroll;
    });
}
