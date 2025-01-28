export function initForms() {
    initRegistrationForm();
    initContactForm();
}

function initRegistrationForm() {
    const form = document.getElementById('registration-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form data
        if (!validateFormData(data)) {
            showFormMessage(form, 'Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Simulate form submission
        showFormMessage(form, 'Registration successful! We will contact you soon.', 'success');
        form.reset();
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form data
        if (!validateFormData(data)) {
            showFormMessage(form, 'Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Simulate form submission
        showFormMessage(form, 'Message sent successfully! We will get back to you soon.', 'success');
        form.reset();
    });
}

function validateFormData(data) {
    // Check for empty fields
    for (let key in data) {
        if (!data[key].trim()) return false;
    }
    
    // Validate email if present
    if (data.email && !isValidEmail(data.email)) return false;
    
    // Validate phone if present
    if (data.phone && !isValidPhone(data.phone)) return false;
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function showFormMessage(form, message, type) {
    let messageElement = form.querySelector('.form-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        form.appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}
