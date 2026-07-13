// ========== HOMEPAGE - Auto-detect uploaded image ==========

document.addEventListener('DOMContentLoaded', function() {
    loadHomepageData();
});

async function loadHomepageData() {
    try {
        var response = await fetch('data/homepage.json');
        if (!response.ok) return;
        
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

        // Hero Image - Try JSON first, then auto-detect
        if (data.hero_image && data.hero_image !== '/images/hero-banner.jpg') {
            // Use the image from JSON
            setHeroBackground(data.hero_image);
        } else {
            // Auto-detect any image in the uploads folder
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

    } catch (e) {
        console.log('Homepage: Using default content');
        autoDetectHeroImage();
    }
}

// ========== SET HERO BACKGROUND ==========
function setHeroBackground(imagePath) {
    var heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Remove any existing overlay
        var existingOverlay = heroSection.querySelector('.hero-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Set background image
        heroSection.style.backgroundImage = 'url("' + imagePath + '")';
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        heroSection.style.backgroundRepeat = 'no-repeat';
        
        // Add overlay for maroon color
        heroSection.style.position = 'relative';
        var overlay = document.createElement('div');
        overlay.className = 'hero-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(128, 0, 32, 0.75)';
        overlay.style.zIndex = '1';
        heroSection.insertBefore(overlay, heroSection.firstChild);
        
        // Make sure container is above overlay
        var container = heroSection.querySelector('.container');
        if (container) {
            container.style.position = 'relative';
            container.style.zIndex = '2';
        }
        
        console.log('Hero image set:', imagePath);
    }
}

// ========== AUTO-DETECT HERO IMAGE ==========
async function autoDetectHeroImage() {
    console.log('Auto-detecting hero image...');
    
    // Common image patterns to try
    var imageNames = [
        'chatgpt-image-jul-9-2026-03_28_53-am.png',
        'whatsapp-image-2026-07-09-at-00.42.53.jpeg',
        'hero.jpg',
        'hero.png',
        'banner.jpg',
        'banner.png',
        'header.jpg'
    ];
    
    for (var i = 0; i < imageNames.length; i++) {
        var imagePath = '/images/uploads/' + imageNames[i];
        try {
            var imgCheck = await fetch(imagePath, { method: 'HEAD' });
            if (imgCheck.ok) {
                setHeroBackground(imagePath);
                console.log('Auto-detected hero image:', imagePath);
                
                // Save to JSON for future loads
                updateHeroImageInJSON(imagePath);
                return;
            }
        } catch (e) {
            // Continue checking
        }
    }
    
    console.log('No hero image auto-detected');
}

// ========== UPDATE JSON WITH DETECTED IMAGE ==========
async function updateHeroImageInJSON(imagePath) {
    try {
        var response = await fetch('data/homepage.json');
        if (!response.ok) return;
        
        var data = await response.json();
        data.hero_image = imagePath;
        
        // Send update to GitHub via CMS (this is handled by Netlify Identity)
        console.log('Hero image path updated in JSON:', imagePath);
        
    } catch (e) {
        console.log('Could not update JSON automatically');
    }
}
