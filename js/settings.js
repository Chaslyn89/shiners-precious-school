// ========== SETTINGS - Loads settings.json ==========

async function loadSettings() {
    try {
        const response = await fetch('data/settings.json');
        if (!response.ok) return;
        
        const settings = await response.json();

        // Phone numbers
        if (settings.phone) {
            document.querySelectorAll('#header-phone, #hero-phone, #footer-phone').forEach(el => {
                if (el) el.textContent = settings.phone;
            });
        }
        if (settings.phone2) {
            const el = document.getElementById('footer-phone2');
            if (el) el.textContent = settings.phone2;
        }
        if (settings.email) {
            const el = document.getElementById('footer-email');
            if (el) el.textContent = settings.email;
        }

        // Director info (for homepage)
        if (settings.director_name) {
            const el = document.getElementById('director-name');
            if (el) el.textContent = settings.director_name;
        }
        if (settings.director_title) {
            const el = document.getElementById('director-title');
            if (el) el.textContent = settings.director_title;
        }
        if (settings.director_photo) {
            const el = document.getElementById('director-photo');
            if (el) el.src = settings.director_photo;
        }
        if (settings.welcome_message) {
            const el = document.getElementById('welcome-message');
            if (el) {
                const paragraphs = settings.welcome_message.split('\n').filter(p => p.trim());
                el.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
            }
        }

        // Mission, Vision, Core Values (for homepage)
        if (settings.mission) {
            const el = document.getElementById('mission-text');
            if (el) el.textContent = settings.mission;
        }
        if (settings.vision) {
            const el = document.getElementById('vision-text');
            if (el) el.textContent = settings.vision;
        }
        if (settings.core_values) {
            const el = document.getElementById('core-values-text');
            if (el) el.textContent = settings.core_values;
        }

        // Fees
        if (settings.admission_fee) {
            const el = document.getElementById('admission-fee');
            if (el) el.textContent = settings.admission_fee;
        }
        if (settings.meals_fee) {
            const el = document.getElementById('meals-fee');
            if (el) el.textContent = settings.meals_fee;
        }

        console.log('Settings loaded successfully');

    } catch (e) {
        console.log('Settings: Using default content');
    }
}