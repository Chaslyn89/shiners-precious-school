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

        // Director info (for homepage) - Supports both flat and nested structure
        const director = settings.director || {};
        const directorName = settings.director_name || director.name;
        const directorTitle = settings.director_title || director.title;
        const directorPhoto = settings.director_photo || director.photo;
        const welcomeMessage = settings.welcome_message || director.message;

        if (directorName) {
            const el = document.getElementById('director-name');
            if (el) el.textContent = directorName;
        }
        if (directorTitle) {
            const el = document.getElementById('director-title');
            if (el) el.textContent = directorTitle;
        }
        if (directorPhoto) {
            const el = document.getElementById('director-photo');
            if (el) el.src = directorPhoto;
        }
        if (welcomeMessage) {
            const el = document.getElementById('welcome-message');
            if (el) {
                const paragraphs = welcomeMessage.split('\n').filter(p => p.trim());
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
                    if (parsed && parsed.name) {
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
// PARSE TESTIMONIAL MARKDOWN - Handles values with or without quotes
// ========================================
function parseTestimonial(text) {
    try {
        const match = text.match(/---\n([\s\S]*?)\n---\n([\s\S]*)/);
        if (!match) return null;
        
        const frontmatter = match[1];
        
        // Match values with or without quotes
        const nameMatch = frontmatter.match(/name:\s*"?([^"\n]*?)"?\s*$/m);
        const gradeMatch = frontmatter.match(/grade:\s*"?([^"\n]*?)"?\s*$/m);
        const reviewMatch = frontmatter.match(/review:\s*"?([^"\n]*?)"?\s*$/m);
        const ratingMatch = frontmatter.match(/rating:\s*([\d.]+)/);
        const dateMatch = frontmatter.match(/date:\s*"?([^"\n]*?)"?\s*$/m);
        
        let formattedDate = dateMatch ? dateMatch[1].trim() : '';
        if (formattedDate && formattedDate.match(/\d{4}-\d{2}-\d{2}/)) {
            const parts = formattedDate.split('-');
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            formattedDate = `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}, ${parts[0]}`;
        }
        
        return {
            name: nameMatch ? nameMatch[1].trim() : 'Parent',
            grade: gradeMatch ? gradeMatch[1].trim() : '',
            review: reviewMatch ? reviewMatch[1].trim() : '',
            rating: ratingMatch ? parseInt(ratingMatch[1]) : 5,
            date: formattedDate || 'Date not set'
        };
    } catch (e) {
        console.log('Error parsing testimonial:', e);
        return null;
    }
}

// ========================================
// LOAD HOMEPAGE GALLERY IMAGES
// ========================================
async function loadHomepageGallery() {
    try {
        const response = await fetch('data/gallery.json');
        if (!response.ok) return;
        
        const data = await response.json();
        const container = document.querySelector('.gallery-grid');
        if (!container) return;
        
        // Get all images from all categories
        let allImages = [];
        if (data.categories) {
            for (let category in data.categories) {
                if (data.categories[category].photos) {
                    allImages = allImages.concat(data.categories[category].photos);
                }
            }
        }
        
        // Also check for direct images array
        if (data.images && data.images.length > 0) {
            allImages = allImages.concat(data.images);
        }
        
        // Filter only featured images for homepage
        let featuredImages = allImages.filter(img => img.featured === true);
        
        // If no featured images, use first 4 images
        if (featuredImages.length === 0) {
            featuredImages = allImages.slice(0, 4);
        }
        
        if (featuredImages.length > 0) {
            let html = '';
            for (let i = 0; i < featuredImages.length; i++) {
                let img = featuredImages[i];
                let imgSrc = img.image || img.src || 'images/placeholder-gallery.jpg';
                let imgTitle = img.title || img.caption || 'School Life';
                
                html += `
                    <div class="gallery-item">
                        <img src="${imgSrc}" alt="${imgTitle}" loading="lazy" onerror="this.src='images/placeholder-gallery.jpg'">
                        <div class="gallery-caption"><p>${imgTitle}</p></div>
                    </div>
                `;
            }
            container.innerHTML = html;
            console.log('Homepage gallery loaded successfully');
        } else {
            console.log('No gallery images found for homepage');
        }

    } catch (e) {
        console.log('Homepage gallery: Using default content');
    }
}

// ========================================
// LOAD ALL DATA ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadTestimonials();
    loadHomepageGallery();
});
