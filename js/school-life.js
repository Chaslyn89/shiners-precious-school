// ========== SCHOOL LIFE PAGE - Loads school-life.json ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD SCHOOL LIFE DATA ==========
    async function loadSchoolLifeData() {
        try {
            const response = await fetch('data/school-life.json');
            if (!response.ok) return;
            
            const data = await response.json();

            // Hero
            if (data.hero_title) {
                const el = document.getElementById('school-life-hero-title');
                if (el) el.textContent = data.hero_title;
            }
            if (data.hero_subtitle) {
                const el = document.getElementById('school-life-hero-subtitle');
                if (el) el.textContent = data.hero_subtitle;
            }

            // Sports Intro
            if (data.sports_intro) {
                const el = document.getElementById('school-life-sports-intro');
                if (el) el.textContent = data.sports_intro;
            }

            // Sports
            if (data.sports && data.sports.length > 0) {
                const el = document.getElementById('school-life-sports');
                if (el) {
                    el.innerHTML = data.sports.map(sport => `
                        <div class="sport-item">
                            <div class="sport-icon" aria-label="${sport.name}">${sport.icon}</div>
                            <h3>${sport.name}</h3>
                            <p>${sport.description}</p>
                            <div class="sport-details">
                                ${sport.details.map(d => `<p><strong>${d.label}:</strong> ${d.value}</p>`).join('')}
                            </div>
                        </div>
                    `).join('');
                }
            }

            // Clubs
            if (data.clubs && data.clubs.length > 0) {
                const el = document.getElementById('school-life-clubs');
                if (el) {
                    el.innerHTML = data.clubs.map(club => `
                        <div class="activity-card">
                            <div class="activity-icon" aria-label="${club.name}">${club.icon}</div>
                            <div class="activity-content">
                                <h3>${club.name}</h3>
                                <ul class="activity-list">
                                    ${club.items.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('');
                }
            }

            // Events
            if (data.events && data.events.length > 0) {
                const el = document.getElementById('school-life-events');
                if (el) {
                    el.innerHTML = data.events.map(event => `
                        <div class="activity-card">
                            <div class="activity-content">
                                <h3>${event.icon} ${event.title}</h3>
                                <p>${event.description}</p>
                            </div>
                        </div>
                    `).join('');
                }
            }

            // Gallery
            if (data.gallery && data.gallery.length > 0) {
                const el = document.getElementById('school-life-gallery');
                if (el) {
                    el.innerHTML = data.gallery.map(img => `
                        <img src="${img.src}" alt="${img.alt}" loading="lazy">
                    `).join('');
                }
            }

            // Testimonials
            if (data.testimonials && data.testimonials.length > 0) {
                const el = document.getElementById('school-life-testimonials');
                if (el) {
                    el.innerHTML = data.testimonials.map(t => `
                        <div class="testimonial-item">
                            <div class="testimonial-text">⭐ ⭐ ⭐ ⭐ ⭐</div>
                            <div class="testimonial-text">"${t.text}"</div>
                            <div class="testimonial-author">— ${t.author}</div>
                            <div class="testimonial-grade">${t.grade}</div>
                        </div>
                    `).join('');
                }
            }

            console.log('School Life page data loaded successfully');

        } catch (e) {
            console.log('School Life page: Using default content');
        }
    }

    // ========== INITIALIZE ==========
    loadSchoolLifeData();
});