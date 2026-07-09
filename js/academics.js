// ========== ACADEMICS PAGE - Loads academics.json ==========

async function loadAcademicsData() {
    try {
        const response = await fetch('data/academics.json');
        if (!response.ok) return;
        
        const data = await response.json();

        // Hero
        if (data.hero_title) {
            const el = document.getElementById('academics-hero-title');
            if (el) el.textContent = data.hero_title;
        }
        if (data.hero_subtitle) {
            const el = document.getElementById('academics-hero-subtitle');
            if (el) el.textContent = data.hero_subtitle;
        }

        // Pathway Description
        if (data.pathway_description) {
            const el = document.getElementById('academics-pathway-desc');
            if (el) el.textContent = data.pathway_description;
        }

        // Curriculum Overview
        if (data.curriculum_overview) {
            const el = document.getElementById('academics-curriculum-overview');
            if (el) el.innerHTML = data.curriculum_overview;
        }

        // Achievements
        if (data.achievements && data.achievements.length > 0) {
            const el = document.getElementById('academics-achievements');
            if (el) {
                el.innerHTML = data.achievements.map(item => `
                    <div class="achievement-card">
                        <div class="achievement-number">${item.number}</div>
                        <p>${item.label}</p>
                    </div>
                `).join('');
            }
        }

        // Special Programs
        if (data.special_programs && data.special_programs.length > 0) {
            const el = document.getElementById('academics-programs');
            if (el) {
                el.innerHTML = data.special_programs.map(program => `
                    <div class="program-card">
                        <div class="program-icon">${program.icon}</div>
                        <h3>${program.title}</h3>
                        <p>${program.description}</p>
                        <div class="program-detail">
                            ${program.detail}
                        </div>
                    </div>
                `).join('');
            }
        }

        // Assessment Table
        if (data.assessment && data.assessment.length > 0) {
            const el = document.getElementById('academics-assessment-body');
            if (el) {
                el.innerHTML = data.assessment.map(item => `
                    <tr>
                        <td>${item.type}</td>
                        <td>${item.frequency}</td>
                        <td>${item.purpose}</td>
                    </tr>
                `).join('');
            }
        }

        // Academic Calendar
        if (data.calendar && data.calendar.length > 0) {
            const el = document.getElementById('academics-calendar-body');
            if (el) {
                el.innerHTML = data.calendar.map(item => `
                    <tr>
                        <td>${item.term}</td>
                        <td>${item.opening}</td>
                        <td>${item.closing}</td>
                        <td>${item.half_term}</td>
                    </tr>
                `).join('');
            }
        }

        // Downloads
        if (data.downloads && data.downloads.length > 0) {
            const el = document.getElementById('academics-downloads');
            if (el) {
                el.innerHTML = data.downloads.map(item => `
                    <a href="${item.link}" class="btn-secondary" download>${item.name}</a>
                `).join('');
            }
        }

        console.log('Academics page data loaded successfully');

    } catch (e) {
        console.log('Academics page: Using default content');
    }
}