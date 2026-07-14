// ========== STAFF PAGE - Loads staff from .md files ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD STAFF DATA ==========
    async function loadStaffData() {
        try {
            // Load staff.json for hero and stats
            const response = await fetch('data/staff.json');
            if (!response.ok) return;
            
            const data = await response.json();

            // Load settings.json for director info
            const settingsResponse = await fetch('data/settings.json');
            let settings = {};
            if (settingsResponse.ok) {
                settings = await settingsResponse.json();
            }

            // Hero
            if (data.hero_title) {
                const el = document.getElementById('staff-hero-title');
                if (el) el.textContent = data.hero_title;
            }
            if (data.hero_subtitle) {
                const el = document.getElementById('staff-hero-subtitle');
                if (el) el.textContent = data.hero_subtitle;
            }

            // ===== DIRECTOR INFO - FROM SETTINGS =====
            const director = settings.director || {};
            const directorName = settings.director_name || director.name || 'Shem Oyugi';
            const directorTitle = settings.director_title || director.title || 'School Director';
            const directorPhoto = settings.director_photo || director.photo || 'images/staff-director.jpg';
            const directorQualifications = settings.director_qualifications || director.qualifications || 'B.Ed, M.Ed';

            // ===== LOAD STAFF FROM .md FILES =====
            let staffFiles = [];
            try {
                const apiUrl = 'https://api.github.com/repos/Chaslyn89/shiners-precious-school/contents/data/staff';
                const apiResponse = await fetch(apiUrl);
                if (apiResponse.ok) {
                    const files = await apiResponse.json();
                    const mdFiles = files.filter(file => file.name.endsWith('.md'));
                    staffFiles = mdFiles.map(file => file.name.replace('.md', ''));
                    console.log('Found staff files:', staffFiles);
                }
            } catch (e) {
                console.log('Could not fetch staff list');
            }

            if (staffFiles.length === 0) {
                staffFiles = ['headteacher', 'deputy-headteacher', 'academic-coordinator'];
            }

            let leadership = [];
            let teachers = [];
            let support = [];

            for (const slug of staffFiles) {
                try {
                    const fileResponse = await fetch(`data/staff/${slug}.md`);
                    if (fileResponse.ok) {
                        const text = await fileResponse.text();
                        const parsed = parseStaffMarkdown(text);
                        if (parsed && parsed.name && parsed.name !== '[NAME]' && parsed.name.trim() !== '') {
                            if (parsed.type === 'leadership') {
                                leadership.push(parsed);
                            } else if (parsed.type === 'teacher') {
                                teachers.push(parsed);
                            } else if (parsed.type === 'support') {
                                support.push(parsed);
                            }
                        }
                    }
                } catch (e) {
                    // Skip if file not found
                }
            }

            // Sort by order
            leadership.sort((a, b) => (a.order || 0) - (b.order || 0));
            teachers.sort((a, b) => (a.order || 0) - (b.order || 0));
            support.sort((a, b) => (a.order || 0) - (b.order || 0));

            // ===== DISPLAY LEADERSHIP =====
            // First card is always Director from settings
            const leadershipEl = document.getElementById('staff-leadership');
            if (leadershipEl) {
                const leaderCards = leadershipEl.querySelectorAll('.leader-card');
                
                // Card 0: Director (from settings)
                if (leaderCards[0]) {
                    const img = leaderCards[0].querySelector('img');
                    if (img) {
                        img.src = directorPhoto;
                        img.alt = directorName || 'Director';
                    }
                    const nameEl = leaderCards[0].querySelector('.staff-name');
                    if (nameEl) nameEl.textContent = directorName || 'Shem Oyugi';
                    
                    const titleEl = leaderCards[0].querySelector('.staff-title');
                    if (titleEl) titleEl.textContent = directorTitle || 'School Director';
                    
                    const qualEl = leaderCards[0].querySelector('.staff-qualification');
                    if (qualEl) qualEl.textContent = directorQualifications || 'B.Ed, M.Ed';
                }

                // Cards 1+: Other leadership from .md files
                leadership.forEach((member, index) => {
                    const cardIndex = index + 1; // Skip card 0 (Director)
                    if (leaderCards[cardIndex]) {
                        const img = leaderCards[cardIndex].querySelector('img');
                        if (img && member.photo) {
                            img.src = member.photo;
                            img.alt = member.name || 'Leader';
                        }
                        const nameEl = leaderCards[cardIndex].querySelector('.staff-name');
                        if (nameEl) nameEl.textContent = member.name || '[NAME]';
                        
                        const titleEl = leaderCards[cardIndex].querySelector('.staff-title');
                        if (titleEl) titleEl.textContent = member.title || '';
                        
                        const qualEl = leaderCards[cardIndex].querySelector('.staff-qualification');
                        if (qualEl) qualEl.textContent = member.qualifications || '';
                    }
                });

                // If no leadership from .md files, use fallback from staff.json
                if (leadership.length === 0 && data.leadership) {
                    data.leadership.forEach((member, index) => {
                        const cardIndex = index + 1;
                        if (leaderCards[cardIndex]) {
                            const nameEl = leaderCards[cardIndex].querySelector('.staff-name');
                            if (nameEl) nameEl.textContent = member.name || '[NAME]';
                            
                            const titleEl = leaderCards[cardIndex].querySelector('.staff-title');
                            if (titleEl) titleEl.textContent = member.title || '';
                            
                            const img = leaderCards[cardIndex].querySelector('img');
                            if (img && member.photo) {
                                img.src = member.photo;
                            }
                        }
                    });
                }
            }

            // ===== DISPLAY TEACHERS =====
            const teachersEl = document.getElementById('staff-teachers');
            if (teachersEl) {
                if (teachers.length > 0) {
                    teachersEl.innerHTML = teachers.map(teacher => `
                        <div class="staff-card">
                            <img src="${teacher.photo || 'images/teacher-placeholder.jpg'}" alt="${teacher.name}" class="staff-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27250%27 viewBox=%270 0 300 250%27%3E%3Crect width=%27300%27 height=%27250%27 fill=%27%23800020%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27white%27%3ETeacher%3C/text%3E%3C/svg%3E'">
                            <div class="staff-info">
                                <h3 class="staff-name">${teacher.name}</h3>
                                <div class="staff-title">${teacher.title}</div>
                                ${teacher.qualifications ? `<div class="staff-qualification">${teacher.qualifications}</div>` : ''}
                                ${teacher.subjects ? `<div class="staff-subjects">Teaches: ${teacher.subjects}</div>` : ''}
                            </div>
                        </div>
                    `).join('');
                } else if (data.teachers && data.teachers.length > 0) {
                    // Fallback to staff.json
                    teachersEl.innerHTML = data.teachers.map(teacher => `
                        <div class="staff-card">
                            <img src="${teacher.photo || 'images/teacher-placeholder.jpg'}" alt="${teacher.name}" class="staff-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27250%27 viewBox=%270 0 300 250%27%3E%3Crect width=%27300%27 height=%27250%27 fill=%27%23800020%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27white%27%3ETeacher%3C/text%3E%3C/svg%3E'">
                            <div class="staff-info">
                                <h3 class="staff-name">${teacher.name}</h3>
                                <div class="staff-title">${teacher.title}</div>
                                ${teacher.qualifications ? `<div class="staff-qualification">${teacher.qualifications}</div>` : ''}
                                ${teacher.subjects ? `<div class="staff-subjects">Teaches: ${teacher.subjects}</div>` : ''}
                            </div>
                        </div>
                    `).join('');
                } else {
                    teachersEl.innerHTML = `<p style="text-align:center;padding:20px;color:#999;">Add teachers through the CMS (Staff Directory → Type: teacher).</p>`;
                }
            }

            // ===== DISPLAY SUPPORT STAFF =====
            const supportEl = document.getElementById('staff-support');
            if (supportEl) {
                if (support.length > 0) {
                    supportEl.innerHTML = support.map(staff => `
                        <div class="staff-card">
                            <img src="${staff.photo || 'images/support-placeholder.jpg'}" alt="${staff.name}" class="staff-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27250%27 viewBox=%270 0 300 250%27%3E%3Crect width=%27300%27 height=%27250%27 fill=%27%23800020%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27white%27%3ESupport%3C/text%3E%3C/svg%3E'">
                            <div class="staff-info">
                                <h3 class="staff-name">${staff.name}</h3>
                                <div class="staff-title">${staff.title}</div>
                            </div>
                        </div>
                    `).join('');
                } else if (data.support && data.support.length > 0) {
                    supportEl.innerHTML = data.support.map(staff => `
                        <div class="staff-card">
                            <img src="${staff.photo || 'images/support-placeholder.jpg'}" alt="${staff.name}" class="staff-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27250%27 viewBox=%270 0 300 250%27%3E%3Crect width=%27300%27 height=%27250%27 fill=%27%23800020%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27white%27%3ESupport%3C/text%3E%3C/svg%3E'">
                            <div class="staff-info">
                                <h3 class="staff-name">${staff.name}</h3>
                                <div class="staff-title">${staff.title}</div>
                            </div>
                        </div>
                    `).join('');
                } else {
                    supportEl.innerHTML = `<p style="text-align:center;padding:20px;color:#999;">Add support staff through the CMS (Staff Directory → Type: support).</p>`;
                }
            }

            // ===== STATS =====
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

    // ===== PARSE STAFF MARKDOWN =====
    function parseStaffMarkdown(text) {
        try {
            const match = text.match(/---\n([\s\S]*?)\n---/);
            if (!match) return null;
            
            const frontmatter = match[1];
            
            const nameMatch = frontmatter.match(/name:\s*"?([^"\n]*?)"?\s*$/m);
            const titleMatch = frontmatter.match(/title:\s*"?([^"\n]*?)"?\s*$/m);
            const photoMatch = frontmatter.match(/photo:\s*"?([^"\n]*?)"?\s*$/m);
            const typeMatch = frontmatter.match(/type:\s*"?([^"\n]*?)"?\s*$/m);
            const orderMatch = frontmatter.match(/order:\s*([\d.]+)/);
            const qualificationsMatch = frontmatter.match(/qualifications:\s*"?([^"\n]*?)"?\s*$/m);
            const subjectsMatch = frontmatter.match(/subjects:\s*"?([^"\n]*?)"?\s*$/m);
            
            return {
                name: nameMatch ? nameMatch[1].trim() : '',
                title: titleMatch ? titleMatch[1].trim() : '',
                photo: photoMatch ? photoMatch[1].trim() : '',
                type: typeMatch ? typeMatch[1].trim() : 'teacher',
                order: orderMatch ? parseInt(orderMatch[1]) : 0,
                qualifications: qualificationsMatch ? qualificationsMatch[1].trim() : '',
                subjects: subjectsMatch ? subjectsMatch[1].trim() : ''
            };
        } catch (e) {
            console.log('Error parsing staff markdown:', e);
            return null;
        }
    }

    // ========== INITIALIZE ==========
    loadStaffData();
});
