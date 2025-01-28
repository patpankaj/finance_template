// Navigation Component
document.addEventListener('DOMContentLoaded', function() {
    const nav = `
        <!-- START: Navigation Bar -->
        <nav class="navbar">
            <div class="logo">
                <a href="index.html">IndianMoneyMaster</a>
            </div>
            <div class="nav-links">
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li class="dropdown">
                        <a href="services.html">Services</a>
                        <ul class="dropdown-content">
                            <li><a href="tax-services.html">Tax Services</a></li>
                            <li><a href="business-services.html">Business Services</a></li>
                            <li><a href="wealth-services.html">Wealth Services</a></li>
                            <li><a href="compliance.html">Compliance Services</a></li>
                        </ul>
                    </li>
                    <li><a href="about.html">About Us</a></li>
                    <li class="dropdown">
                        <a href="#">Solutions</a>
                        <ul class="dropdown-content">
                            <li><a href="investment.html">Investment Planning</a></li>
                            <li><a href="retirement.html">Retirement Planning</a></li>
                            <li><a href="tax-planning.html">Tax Planning</a></li>
                            <li><a href="business-setup.html">Business Setup</a></li>
                        </ul>
                    </li>
                    <li><a href="insights.html">Insights</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
        </nav>
        <!-- END: Navigation Bar -->
    `;
    
    // Insert navigation after body tag
    const bodyElement = document.querySelector('body');
    if (bodyElement) {
        const navElement = document.createElement('div');
        navElement.id = 'navbar-placeholder';
        navElement.innerHTML = nav;
        bodyElement.insertBefore(navElement, bodyElement.firstChild);
    }
}); 