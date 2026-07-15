// ========== SCHOOL LIFE PAGE - Loads school-life from .md files ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD SCHOOL LIFE DATA ==========
    async function loadSchoolLifeData() {
        try {
            // Load school-life.json for hero, intro, events, gallery, cta
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

            // ===== LOAD SPORTS FROM .md FILES =====
            let sports = [];
            try {
                const apiUrl = 'https://api.github.com/repos/Chaslyn89/shiners-precious-school/contents/data/school-life';
                const apiResponse = await fetch(apiUrl);
                if (apiResponse.ok) {
                    const files = await apiResponse.json();
                    const mdFiles = files.filter(file => file.name.endsWith('.md'));
                    const sportFiles = mdFiles.map(file => file.name.replace('.md', ''));
                    
                    for (const slug of sportFiles) {
                        try {
                            const fileResponse = await fetch(`data/school-life/${slug}.md`);
                            if (fileResponse.ok) {
                                const text = await fileResponse.text();
                                const parsed = parseSchoolLifeMarkdown(text);
                                if (parsed) {
                                    sports.push(parsed);
                                }
                            }
                        } catch (e) {
                            // Skip if file not found
                        }
                    }
                }
            } catch (e) {
                console.log('Could not fetch school-life list');
            }

            // Sort sports by order
            sports.sort((a, b) => (a.order || 0) - (b.order || 0));

            // If no sports from .md files, fallback to JSON
            if (sports.length === 0 && data.sports) {
                sports = data.sports;
            }

            // ===== DISPLAY SPORTS =====
            const sportsEl = document.getElementById('school-life-sports');
            if (sportsEl) {
                if (sports.length > 0) {
                    sportsEl.innerHTML = sports.map(sport => `
                        <div class="sport-item">
                            <div class="sport-icon" aria-label="${sport.name}">${sport.icon || '⚽'}</div>
                            <h3>${sport.name}</h3>
                            <p>${sport.description || ''}</p>
                            ${sport.details && sport.details.length > 0 ? `
                                <div class="sport-details">
                                    ${sport.details.map(detail => `<p><strong>${detail.label}:</strong> ${detail.value}</p>`).join('')}
                                </div>
                            ` : ''}
                            ${sport.image ? `<img src="${sport.image}" alt="${sport.name}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-top:10px;">` : ''}
                        </div>
                    `).join('');
                } else {
                    sportsEl.innerHTML = `<p style="text-align:center;padding:20px;color:#999;">No sports added yet. Add through the CMS.</p>`;
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

            // Gallery Images
            if (data.gallery && data.gallery.length > 0) {
                const el = document.getElementById('school-life-gallery');
                if (el) {
                    el.innerHTML = data.gallery.map(img => `
                        <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.src='images/placeholder-gallery.jpg'">
                    `).join('');
                }
            }

            // CTA Section
            if (data.cta_title) {
                const el = document.getElementById('school-life-cta-title');
                if (el) el.textContent = data.cta_title;
            }
            if (data.cta_text) {
                const el = document.getElementById('school-life-cta-text');
                if (el) el.textContent = data.cta_text;
            }

            console.log('School Life page data loaded successfully');

        } catch (e) {
            console.log('School Life page: Using default content');
        }
    }

    // ===== PARSE SCHOOL LIFE MARKDOWN =====
    function parseSchoolLifeMarkdown(text) {
        try {
            const match = text.match(/---\n([\s\S]*?)\n---/);
            if (!match) return null;
            
            const frontmatter = match[1];
            
            const titleMatch = frontmatter.match(/title:\s*"?([^"\n]*?)"?\s*$/m);
            const descriptionMatch = frontmatter.match(/description:\s*"?([^"\n]*?)"?\s*$/m);
            const imageMatch = frontmatter.match(/image:\s*"?([^"\n]*?)"?\s*$/m);
            const categoryMatch = frontmatter.match(/category:\s*"?([^"\n]*?)"?\s*$/m);
            const orderMatch = frontmatter.match(/order:\s*([\d.]+)/);
            
            // Extract details from description if it contains structured data
            let details = [];
            let cleanDescription = descriptionMatch ? descriptionMatch[1].trim() : '';
            
            // Try to parse details from description (if it has Training, Competitions, Grades)
            const trainingMatch = cleanDescription.match(/Training:?\s*([^\n]+)/i);
            const competitionsMatch = cleanDescription.match(/Competitions:?\s*([^\n]+)/i);
            const gradesMatch = cleanDescription.match(/Grades:?\s*([^\n]+)/i);
            
            if (trainingMatch) {
                details.push({ label: 'Training', value: trainingMatch[1].trim() });
            }
            if (competitionsMatch) {
                details.push({ label: 'Competitions', value: competitionsMatch[1].trim() });
            }
            if (gradesMatch) {
                details.push({ label: 'Grades', value: gradesMatch[1].trim() });
            }
            
            return {
                name: titleMatch ? titleMatch[1].trim() : 'Untitled',
                description: cleanDescription,
                icon: categoryMatch ? categoryMatch[1].trim() === 'sports' ? '⚽' : '🎯' : '⚽',
                image: imageMatch ? imageMatch[1].trim() : '',
                category: categoryMatch ? categoryMatch[1].trim() : 'sports',
                order: orderMatch ? parseInt(orderMatch[1]) : 0,
                details: details
            };
        } catch (e) {
            console.log('Error parsing school-life markdown:', e);
            return null;
        }
    }

    // ========== INITIALIZE ==========
    loadSchoolLifeData();
});
