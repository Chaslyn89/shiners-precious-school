// ========== HOMEPAGE - Auto-detect uploaded image ==========

document.addEventListener('DOMContentLoaded', function() {
    loadHomepageData();
});

async function loadHomepageData() {
    try {
        // First, try to load from homepage.json
        var response = await fetch('data/homepage.json');
        if (response.ok) {
            var data = await response.json();
            
            // Hero Title
            if (data.hero_title) {
                var el = document.getElementById('hero-title');
                if (el) el.textContent = data.hero_title;
            }

            // Hero Subtitle
            if (data.hero_subtitle) {
                var el = document.getElementById('hero-subtitle');
                if (el) el.textContent = data.hero_subtitle;
            }

            // Hero Image - Use what's in the JSON
            if (data.hero_image) {
                setHeroBackground(data.hero_image);
            } else {
                // If no image in JSON, try to auto-detect
                autoDetectHeroImage();
            }

            // CTA Button
            if (data.cta_button) {
                var el = document.querySelector('.hero-buttons .btn-primary');
                if (el) el.textContent = data.cta_button;
            }

            // Welcome Section
            if (data.welcome_title) {
                var el = document.getElementById('welcome-title');
                if (el) el.textContent = data.welcome_title;
            }
            if (data.welcome_content) {
                var el = document.getElementById('welcome-content');
                if (el) el.innerHTML = data.welcome_content;
            }

            // Statistics
            if (data.statistics && data.statistics.length > 0) {
                var el = document.getElementById('homepage-stats');
                if (el) {
                    var html = '';
                    for (var i = 0; i < data.statistics.length; i++) {
                        var stat = data.statistics[i];
                        html += '<div class="stat-card"><div class="stat-number">' + stat.number + '</div><div class="stat-label">' + stat.label + '</div></div>';
                    }
                    el.innerHTML = html;
                }
            }

            console.log('Homepage data loaded successfully');
        } else {
            console.log('homepage.json not found, using auto-detect');
            autoDetectHeroImage();
        }

    } catch (e) {
        console.log('Homepage: Using default content');
        autoDetectHeroImage();
    }
}

// ========== SET HERO BACKGROUND ==========
function setHeroBackground(imagePath) {
    var heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.backgroundImage = 'linear-gradient(rgba(128, 0, 32, 0.75), rgba(128, 0, 32, 0.75)), url("' + imagePath + '")';
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        heroSection.style.backgroundRepeat = 'no-repeat';
    }
}

// ========== AUTO-DETECT HERO IMAGE ==========
async function autoDetectHeroImage() {
    // Try common image names
    var commonImages = [
        '/images/uploads/hero.jpg',
        '/images/uploads/hero.png',
        '/images/uploads/hero-banner.jpg',
        '/images/uploads/banner.jpg',
        '/images/uploads/header.jpg'
    ];
    
    for (var i = 0; i < commonImages.length; i++) {
        try {
            var imgCheck = await fetch(commonImages[i], { method: 'HEAD' });
            if (imgCheck.ok) {
                setHeroBackground(commonImages[i]);
                console.log('Auto-detected hero image:', commonImages[i]);
                return;
            }
        } catch (e) {
            // Continue checking
        }
    }
    
    // If no image found, use the default from homepage.json or fallback
    console.log('No hero image auto-detected');
}
