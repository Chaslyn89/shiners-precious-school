// ========== STAFF PAGE - Loads staff.json ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD STAFF DATA ==========
    async function loadStaffData() {
        try {
            const response = await fetch('data/staff.json');
            if (!response.ok) return;
            
            const data = await response.json();

            // Hero
            if (data.hero_title) {
                const el = document.getElementById('staff-hero-title');
                if (el) el.textContent = data.hero_title;
            }
            if (data.hero_subtitle) {
                const el = document.getElementById('staff-hero-subtitle');
                if (el) el.textContent = data.hero_subtitle;
            }

            // Leadership
            if (data.leadership && data.leadership.length > 0) {
                const el = document.getElementById('staff-leadership');
                if (el) {
                    const leaderCards = el.querySelectorAll('.leader-card');
                    data.leadership.forEach((leader, index) => {
                        if (leaderCards[index]) {
                            const img = leaderCards[index].querySelector('img');
                            if (img && leader.photo) {
                                img.src = leader.photo;
                                img.alt = leader.name || 'Leader';
                            }
                            const nameEl = leaderCards[index].querySelector('.staff-name');
                            if (nameEl) nameEl.textContent = leader.name || '[NAME]';
                            
                            const titleEl = leaderCards[index].querySelector('.staff-title');
                            if (titleEl) titleEl.textContent = leader.title || '';
                            
                            const qualEl = leaderCards[index].querySelector('.staff-qualification');
                            if (qualEl) qualEl.textContent = leader.qualifications || '';
                        }
                    });
                }
            }

            // Teachers
            if (data.teachers && data.teachers.length > 0) {
                const el = document.getElementById('staff-teachers');
                if (el) {
                    el.innerHTML = data.teachers.map(teacher => `
                        <div class="staff-card">
                            <img src="${teacher.photo || 'images/teacher-placeholder.jpg'}" alt="${teacher.name}" class="staff-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27250%27 viewBox=%270 0 300 250%27%3E%3Crect width=%27300%27 height=%27250%27 fill=%27%23800020%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27white%27%3ETeacher%3C/text%3E%3C/svg%3E'">
                            <div class="staff-info">
                                <h3 class="staff-name">${teacher.name}</h3>
                                <div class="staff-title">${teacher.title}</div>
                                <div class="staff-qualification">${teacher.qualifications || ''}</div>
                                <div class="staff-subjects">Teaches: ${teacher.subjects || ''}</div>
                            </div>
                        </div>
                    `).join('');
                }
            }

            // Support Staff
            if (data.support && data.support.length > 0) {
                const el = document.getElementById('staff-support');
                if (el) {
                    el.innerHTML = data.support.map(staff => `
                        <div class="staff-card">
                            <img src="${staff.photo || 'images/support-placeholder.jpg'}" alt="${staff.name}" class="staff-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27250%27 viewBox=%270 0 300 250%27%3E%3Crect width=%27300%27 height=%27250%27 fill=%27%23800020%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27white%27%3ESupport%3C/text%3E%3C/svg%3E'">
                            <div class="staff-info">
                                <h3 class="staff-name">${staff.name}</h3>
                                <div class="staff-title">${staff.title}</div>
                            </div>
                        </div>
                    `).join('');
                }
            }

            // Stats
            if (data.stats && data.stats.length > 0) {
                const el = document.getElementById('staff-stats');
                if (el) {
                    el.innerHTML = data.stats.map(stat => `
                        <div class="stat-card">
                            <div class="stat-number">${stat.number}</div>
                            <div class="stat-label">${stat.label}</div>
                        </div>
                    `).join('');
                }
            }

            console.log('Staff page data loaded successfully');

        } catch (e) {
            console.log('Staff page: Using default content');
        }
    }

    // ========== INITIALIZE ==========
    loadStaffData();
});