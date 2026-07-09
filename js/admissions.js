// ========== ADMISSIONS PAGE - Loads admissions.json ==========

async function loadAdmissionsData() {
    try {
        const response = await fetch('data/admissions.json');
        if (!response.ok) return;
        
        const data = await response.json();

        // Hero
        if (data.hero_title) {
            const el = document.getElementById('admissions-hero-title');
            if (el) el.textContent = data.hero_title;
        }
        if (data.hero_subtitle) {
            const el = document.getElementById('admissions-hero-subtitle');
            if (el) el.textContent = data.hero_subtitle;
        }

        // Vacancy Status
        if (data.vacancy_status && data.vacancy_status.length > 0) {
            const el = document.getElementById('admissions-vacancy');
            if (el) {
                el.innerHTML = data.vacancy_status.map(item => `
                    <span class="vacancy-badge ${item.class}">${item.level} - ${item.status}</span>
                `).join('');
            }
        }

        // Why Enroll
        if (data.why_enroll && data.why_enroll.length > 0) {
            const el = document.getElementById('admissions-why-enroll');
            if (el) {
                el.innerHTML = data.why_enroll.map(item => `
                    <div class="card">
                        <div class="card-content">
                            <h3>${item.icon} ${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Testimonials
        if (data.testimonials && data.testimonials.length > 0) {
            const el = document.getElementById('admissions-testimonials');
            if (el) {
                el.innerHTML = data.testimonials.map(item => `
                    <div class="testimonial-card">
                        <div class="quote">${item.rating}</div>
                        <div class="quote">"${item.quote}"</div>
                        <div class="author">— ${item.author}</div>
                    </div>
                `).join('');
            }
        }

        // Age Requirements
        if (data.age_requirements && data.age_requirements.length > 0) {
            const el = document.getElementById('admissions-age-body');
            if (el) {
                el.innerHTML = data.age_requirements.map(item => `
                    <tr><td>${item.level}</td><td>${item.age}</td></tr>
                `).join('');
            }
        }

        // Visit Message
        if (data.visit_message) {
            const el = document.getElementById('admissions-visit-message');
            if (el) el.textContent = data.visit_message;
        }
        if (data.visit_hours) {
            const el = document.getElementById('admissions-visit-hours');
            if (el) el.innerHTML = `<strong>Available:</strong> ${data.visit_hours}`;
        }
        if (data.visit_whatsapp) {
            const el = document.getElementById('admissions-visit-link');
            if (el) el.href = data.visit_whatsapp;
        }

        // Steps
        if (data.steps && data.steps.length > 0) {
            const el = document.getElementById('admissions-steps');
            if (el) {
                el.innerHTML = data.steps.map(step => `
                    <div class="step">
                        <div class="step-number">${step.number}</div>
                        <h3>${step.title}</h3>
                        <p>${step.description}</p>
                    </div>
                `).join('');
            }
        }

        // Documents
        if (data.documents && data.documents.length > 0) {
            const el = document.getElementById('admissions-documents');
            if (el) {
                el.innerHTML = data.documents.map(doc => `
                    <div class="card">
                        <div class="card-content">
                            <h3>${doc.title}</h3>
                            <ul class="requirements-list">
                                ${doc.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('');
            }
        }

        // FAQs
        if (data.faqs && data.faqs.length > 0) {
            const el = document.getElementById('admissions-faqs');
            if (el) {
                el.innerHTML = data.faqs.map((faq, index) => `
                    <div class="faq-item">
                        <div class="faq-question">❓ ${faq.question} <span>+</span></div>
                        <div class="faq-answer">${faq.answer}</div>
                    </div>
                `).join('');
                
                // Re-initialize FAQ accordion
                document.querySelectorAll('.faq-question').forEach(question => {
                    question.addEventListener('click', function() {
                        const answer = this.nextElementSibling;
                        const span = this.querySelector('span');
                        answer.classList.toggle('show');
                        span.textContent = answer.classList.contains('show') ? '−' : '+';
                    });
                });
            }
        }

        // Form Endpoint
        if (data.form_endpoint) {
            const form = document.getElementById('admission-inquiry-form');
            if (form) form.action = data.form_endpoint;
        }

        // Fee Details
        if (data.admission_fee) {
            const el = document.getElementById('admissions-fee');
            if (el) el.textContent = data.admission_fee;
        }
        if (data.payment_info) {
            const el = document.getElementById('admissions-payment-info');
            if (el) el.textContent = data.payment_info;
        }
        if (data.bank_details) {
            const el = document.getElementById('admissions-bank-details');
            if (el) el.innerHTML = `<strong>KCB Utawala:</strong> ${data.bank_details}`;
        }
        if (data.mpesa_details) {
            const el = document.getElementById('admissions-mpesa-details');
            if (el) el.innerHTML = `<strong>Lipa Na Mpesa:</strong> ${data.mpesa_details}`;
        }

        console.log('Admissions page data loaded successfully');

    } catch (e) {
        console.log('Admissions page: Using default content');
    }
}