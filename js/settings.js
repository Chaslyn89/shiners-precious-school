// ========================================
// SETTINGS - Loads settings.json
// ========================================

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

// ========================================
// LOAD TESTIMONIALS - Auto-detect all files
// ========================================
async function loadTestimonials() {
    try {
        const container = document.getElementById('testimonials-container');
        if (!container) return;

        // Use GitHub API to list all files in the testimonials folder
        const apiUrl = 'https://api.github.com/repos/Chaslyn89/shiners-precious-school/contents/data/testimonials';
        
        let testimonialFiles = [];
        
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const files = await response.json();
                const mdFiles = files.filter(file => file.name.endsWith('.md'));
                testimonialFiles = mdFiles.map(file => file.name.replace('.md', ''));
                console.log('Found testimonial files:', testimonialFiles);
            } else {
                console.log('GitHub API not available');
                testimonialFiles = [];
            }
        } catch (e) {
            console.log('Error fetching file list');
            testimonialFiles = [];
        }

        let testimonialHTML = '';
        let found = false;

        for (const file of testimonialFiles) {
            try {
                const response = await fetch(`data/testimonials/${file}.md`);
                if (response.ok) {
                    const text = await response.text();
                    const parsed = parseTestimonial(text);
                    if (parsed) {
                        found = true;
                        const stars = '⭐'.repeat(parsed.rating || 5);
                        testimonialHTML += `
                            <div class="card">
                                <div class="card-content">
                                    <p>${stars}</p>
                                    <p>"${parsed.review}"</p>
                                    <p><strong>— ${parsed.name}, Parent of ${parsed.grade} Learner</strong></p>
                                    <p style="font-size: 0.8rem; color: #666;">📅 ${parsed.date}</p>
                                </div>
                            </div>
                        `;
                    }
                }
            } catch (e) {
                // Skip if file not found
            }
        }

        if (found) {
            container.innerHTML = testimonialHTML;
        } else {
            container.innerHTML = `
                <div class="card">
                    <div class="card-content">
                        <p>No testimonials yet.</p>
                    </div>
                </div>
            `;
        }

        console.log('Testimonials loaded successfully');
    } catch (e) {
        console.log('Testimonials: Using default content');
    }
}

// ========================================
// PARSE TESTIMONIAL MARKDOWN
// ========================================
function parseTestimonial(text) {
    try {
        const match = text.match(/---\n([\s\S]*?)\n---\n([\s\S]*)/);
        if (!match) return null;
        
        const frontmatter = match[1];
        
        const nameMatch = frontmatter.match(/name:\s*"([^"]*)"/);
        const gradeMatch = frontmatter.match(/grade:\s*"([^"]*)"/);
        const reviewMatch = frontmatter.match(/review:\s*"([^"]*)"/);
        const ratingMatch = frontmatter.match(/rating:\s*([\d.]+)/);
        const dateMatch = frontmatter.match(/date:\s*([\d-]+)/);
        
        let formattedDate = dateMatch ? dateMatch[1] : '';
        if (formattedDate) {
            const parts = formattedDate.split('-');
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            formattedDate = `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}, ${parts[0]}`;
        }
        
        return {
            name: nameMatch ? nameMatch[1] : 'Parent',
            grade: gradeMatch ? gradeMatch[1] : '',
            review: reviewMatch ? reviewMatch[1] : '',
            rating: ratingMatch ? parseInt(ratingMatch[1]) : 5,
            date: formattedDate
        };
    } catch (e) {
        return null;
    }
}

// ========================================
// LOAD ALL DATA ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadTestimonials();
});
