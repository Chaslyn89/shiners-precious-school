// ========== HOMEPAGE - Loads homepage.json ==========

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

        // Hero Image - Maintains color overlay
        if (data.hero_image) {
            var heroSection = document.querySelector('.hero');
            if (heroSection) {
                // Set background image while keeping the CSS overlay
                heroSection.style.backgroundImage = 'url("' + data.hero_image + '")';
                heroSection.style.backgroundSize = 'cover';
                heroSection.style.backgroundPosition = 'center';
                heroSection.style.backgroundRepeat = 'no-repeat';
                
                // Add a pseudo-element overlay for the maroon color
                heroSection.style.position = 'relative';
                
                // Check if overlay already exists
                var overlay = heroSection.querySelector('.hero-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'hero-overlay';
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(128, 0, 32, 0.75)';
                    overlay.style.zIndex = '1';
                    heroSection.style.position = 'relative';
                    heroSection.insertBefore(overlay, heroSection.firstChild);
                }
                
                // Make sure container is above overlay
                var container = heroSection.querySelector('.container');
                if (container) {
                    container.style.position = 'relative';
                    container.style.zIndex = '2';
                }
            }
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
    }
}
