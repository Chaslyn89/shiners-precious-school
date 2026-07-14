// ========== ABOUT PAGE - Loads about.json ==========

async function loadAboutData() {
    try {
        // Load about.json
        const aboutResponse = await fetch('data/about.json');
        if (!aboutResponse.ok) return;
        const data = await aboutResponse.json();

        // Load settings.json for director info
        const settingsResponse = await fetch('data/settings.json');
        let settings = {};
        if (settingsResponse.ok) {
            settings = await settingsResponse.json();
        }

        // Hero
        if (data.hero_title) {
            const el = document.getElementById('about-hero-title');
            if (el) el.textContent = data.hero_title;
        }
        if (data.hero_subtitle) {
            const el = document.getElementById('about-hero-subtitle');
            if (el) el.textContent = data.hero_subtitle;
        }

        // Welcome
        if (data.welcome_text) {
            const el = document.getElementById('about-welcome');
            if (el) el.innerHTML = data.welcome_text;
        }

        // Mission, Vision, Motto
        if (data.mission) {
            const el = document.getElementById('about-mission');
            if (el) el.textContent = data.mission;
        }
        if (data.vision) {
            const el = document.getElementById('about-vision');
            if (el) el.textContent = data.vision;
        }
        if (data.motto) {
            const el = document.getElementById('about-motto');
            if (el) el.textContent = data.motto;
        }
        if (data.motto_description) {
            const el = document.getElementById('about-motto-desc');
            if (el) el.textContent = data.motto_description;
        }

        // Curriculum Badges
        if (data.curriculum_badges && data.curriculum_badges.length > 0) {
            const el = document.getElementById('about-curriculum-badges');
            if (el) {
                el.innerHTML = data.curriculum_badges.map(badge => 
                    `<span class="curriculum-badge">${badge}</span>`
                ).join('');
            }
        }
        if (data.curriculum_text) {
            const el = document.getElementById('about-curriculum-text');
            if (el) el.textContent = data.curriculum_text;
        }

        // History
        if (data.history && data.history.length > 0) {
            const el = document.getElementById('about-history');
            if (el) {
                el.innerHTML = data.history.map(item => `
                    <div style="position: relative; margin-bottom: 25px; padding-left: 0;">
                        <div style="position: absolute; left: -38px; color: var(--maroon); font-size: 20px;">●</div>
                        <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--gold);"></div>
                        <div class="timeline-year" style="font-weight: bold; color: var(--maroon);">${item.year}</div>
                        <p>${item.description}</p>
                    </div>
                `).join('');
            }
        }

        // Values
        if (data.values && data.values.length > 0) {
            const el = document.getElementById('about-values');
            if (el) {
                el.innerHTML = data.values.map(value => `
                    <div class="value-card" style="text-align: center; padding: 20px; background: var(--white); border-radius: 10px; box-shadow: var(--shadow);">
                        <div class="value-icon" style="font-size: 40px;">${value.icon}</div>
                        <h3>${value.name}</h3>
                        <p>${value.description}</p>
                    </div>
                `).join('');
            }
        }

        // ===== DIRECTOR INFO - FROM SETTINGS =====
        const director = settings.director || {};
        const directorName = settings.director_name || director.name || data.director_name || 'Shem Oyugi';
        const directorTitle = settings.director_title || director.title || data.director_title || 'School Director';
        const directorPhoto = settings.director_photo || director.photo || data.director_photo || 'images/director-placeholder.jpg';
        const directorMessage = settings.welcome_message || director.message || data.director_message || '';
        const directorSignature = settings.director_signature || director.signature || data.director_signature || '';

        // Director Name
        const nameEl = document.getElementById('about-director-name');
        if (nameEl) nameEl.textContent = directorName;

        // Director Title
        const titleEl = document.getElementById('about-director-title');
        if (titleEl) titleEl.textContent = directorTitle;

        // Director Photo
        const photoEl = document.getElementById('about-director-photo');
        if (photoEl && directorPhoto) {
            photoEl.src = directorPhoto;
            photoEl.alt = directorName || 'School Director';
        }

        // Director Message
        const messageEl = document.getElementById('about-director-message');
        if (messageEl && directorMessage) {
            const paragraphs = directorMessage.split('\n').filter(p => p.trim());
            messageEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        }

        // Director Signature
        const sigEl = document.getElementById('about-director-signature');
        if (sigEl && directorSignature) {
            const paragraphs = directorSignature.split('\n').filter(p => p.trim());
            sigEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        }

        // Leadership
        if (data.leadership && data.leadership.length > 0) {
            const el = document.getElementById('about-leadership');
            if (el) {
                const leaderCards = el.querySelectorAll('.leader-card');
                data.leadership.forEach((leader, index) => {
                    if (leaderCards[index]) {
                        const nameEl = leaderCards[index].querySelector('h3');
                        if (nameEl) nameEl.textContent = leader.name || '[NAME]';
                        
                        const titleEl = leaderCards[index].querySelector('.leader-title');
                        if (titleEl) titleEl.textContent = leader.title || '';
                        
                        const imgEl = leaderCards[index].querySelector('img');
                        if (imgEl && leader.photo) {
                            imgEl.src = leader.photo;
                            imgEl.alt = leader.name || 'Leader';
                        }
                    }
                });
            }
        }

        // Facilities
        if (data.facilities && data.facilities.length > 0) {
            const el = document.getElementById('about-facilities');
            if (el) {
                el.innerHTML = data.facilities.map(facility => `
                    <div class="facility-card" style="background: var(--white); padding: 20px; border-radius: 10px; text-align: center;">
                        <div class="facility-icon" style="font-size: 40px;">${facility.icon}</div>
                        <h3>${facility.name}</h3>
                        <p>${facility.description}</p>
                    </div>
                `).join('');
            }
        }

        // Why Choose Us
        if (data.why_choose && data.why_choose.length > 0) {
            const el = document.getElementById('about-why-choose');
            if (el) {
                el.innerHTML = data.why_choose.map(item => `
                    <div class="card">
                        <div class="card-content">
                            <p>${item}</p>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Stats
        if (data.stats && data.stats.length > 0) {
            const el = document.getElementById('about-stats');
            if (el) {
                el.innerHTML = data.stats.map(stat => `
                    <div class="stat-card">
                        <div class="stat-number">${stat.number}</div>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                `).join('');
            }
        }

        // Brochure Link
        if (data.brochure_link) {
            const el = document.getElementById('about-brochure-link');
            if (el) el.href = data.brochure_link;
        }

        console.log('About page data loaded successfully');

    } catch (e) {
        console.log('About page: Using default content');
    }
}
