// ========== CONTACT PAGE - Loads contact.json ==========

async function loadContactData() {
    try {
        const response = await fetch('data/contact.json');
        if (!response.ok) return;
        
        const data = await response.json();

        // Hero
        if (data.hero_title) {
            const el = document.getElementById('contact-hero-title');
            if (el) el.textContent = data.hero_title;
        }
        if (data.hero_subtitle) {
            const el = document.getElementById('contact-hero-subtitle');
            if (el) el.textContent = data.hero_subtitle;
        }

        // Phone numbers (already handled by settings.js)
        // But we can also set contact-specific phone displays
        if (data.phone) {
            const el = document.getElementById('contact-phone');
            if (el) el.textContent = data.phone;
        }
        if (data.phone2) {
            const el = document.getElementById('contact-phone2');
            if (el) el.textContent = data.phone2;
        }
        if (data.email) {
            const els = document.querySelectorAll('#contact-email');
            els.forEach(el => {
                if (el) el.textContent = data.email;
            });
        }

        // Admissions Contact
        if (data.admissions_person) {
            const el = document.getElementById('contact-admissions-person');
            if (el) el.textContent = data.admissions_person;
        }
        if (data.admissions_phone) {
            const el = document.getElementById('contact-admissions-phone');
            if (el) el.textContent = data.admissions_phone;
        }

        // School Hours
        if (data.hours && data.hours.length > 0) {
            const el = document.getElementById('contact-hours');
            if (el) {
                el.innerHTML = data.hours.map(hour => `
                    <li><span class="day">${hour.day}</span><span>${hour.time}</span></li>
                `).join('');
            }
        }

        // FAQs
        if (data.faqs && data.faqs.length > 0) {
            const el = document.getElementById('contact-faqs');
            if (el) {
                el.innerHTML = data.faqs.map((faq, index) => `
                    <div class="faq-item">
                        <div class="faq-question">❓ ${faq.question} <span class="faq-toggle">+</span></div>
                        <div class="faq-answer">${faq.answer}</div>
                    </div>
                `).join('');
                
                // Re-initialize FAQ accordion
                document.querySelectorAll('.faq-question').forEach(question => {
                    question.addEventListener('click', function() {
                        const parentItem = this.parentElement;
                        const isActive = parentItem.classList.contains('active');
                        
                        document.querySelectorAll('.faq-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        
                        if (!isActive) {
                            parentItem.classList.add('active');
                        }
                    });
                });
            }
        }

        // Emergency Contact
        if (data.emergency_contact) {
            const el = document.querySelector('.emergency-note strong');
            if (el) {
                el.textContent = `⚠️ Emergency Contact`;
                const textEl = el.parentElement;
                if (textEl) {
                    textEl.innerHTML = `<strong>⚠️ Emergency Contact</strong><br>For urgent matters outside school hours: <strong>${data.emergency_contact}</strong>`;
                }
            }
        }

        // Contact Form Endpoint
        if (data.form_endpoint) {
            const form = document.getElementById('contact-form');
            if (form) form.action = data.form_endpoint;
        }

        console.log('Contact page data loaded successfully');

    } catch (e) {
        console.log('Contact page: Using default content');
    }
}

// ========== CONTACT FORM SUBMISSION ==========
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    formMessage.innerHTML = '<span style="color: #28a745; background: #d4edda; padding: 10px; border-radius: 5px; display: block;">✅ Thank you! Your message has been sent. We will respond within 24 hours.</span>';
                    contactForm.reset();
                    setTimeout(() => { formMessage.innerHTML = ''; }, 5000);
                } else {
                    formMessage.innerHTML = '<span style="color: #dc3545;">❌ Something went wrong. Please call us directly at 0720 994 337.</span>';
                }
            } catch (error) {
                formMessage.innerHTML = '<span style="color: #dc3545;">❌ Network error. Please call us directly at 0720 994 337.</span>';
            }
        });
    }
});