// ========== GALLERY PAGE - Loads gallery images from CMS ==========

document.addEventListener('DOMContentLoaded', function() {
    loadGalleryImages();
    loadFeaturedAlbum();
    loadVideos();
});

// ========== LOAD GALLERY IMAGES ==========
async function loadGalleryImages() {
    try {
        var response = await fetch('data/gallery.json');
        if (!response.ok) {
            console.log('No gallery data found');
            return;
        }
        
        var data = await response.json();
        
        // Update Hero
        if (data.hero_title) {
            var el = document.getElementById('gallery-hero-title');
            if (el) el.textContent = data.hero_title;
        }
        if (data.hero_subtitle) {
            var el = document.getElementById('gallery-hero-subtitle');
            if (el) el.textContent = data.hero_subtitle;
        }

        // Get all images from all categories
        var allImages = [];
        if (data.categories) {
            for (var category in data.categories) {
                if (data.categories[category].photos) {
                    allImages = allImages.concat(data.categories[category].photos);
                }
            }
        }
        
        // Display images in each category
        if (data.categories) {
            for (var cat in data.categories) {
                var categoryData = data.categories[cat];
                var gridEl = document.getElementById(cat + '-grid');
                if (gridEl && categoryData.photos) {
                    var html = '';
                    for (var i = 0; i < categoryData.photos.length; i++) {
                        var img = categoryData.photos[i];
                        html += `
                            <div class="gallery-item">
                                <img src="${img.src}" alt="${img.alt || img.caption || 'Gallery Image'}" loading="lazy" onerror="this.src='images/placeholder-gallery.jpg'">
                                <div class="gallery-caption">
                                    <p>${img.caption || ''}</p>
                                    ${img.description ? '<span>' + img.description + '</span>' : ''}
                                    ${img.photographer ? '<span>📸 ' + img.photographer + '</span>' : ''}
                                    ${img.date_taken ? '<span>📅 ' + img.date_taken + '</span>' : ''}
                                </div>
                            </div>
                        `;
                    }
                    gridEl.innerHTML = html;
                    
                    // Update count
                    var countEl = document.getElementById(cat + '-count');
                    if (countEl) {
                        countEl.textContent = '(' + categoryData.photos.length + ' Photos)';
                    }
                }
            }
        }
        
        console.log('Gallery loaded successfully');

    } catch (e) {
        console.log('Gallery: Using default content');
    }
}

// ========== LOAD FEATURED ALBUM ==========
async function loadFeaturedAlbum() {
    try {
        var response = await fetch('data/gallery.json');
        if (!response.ok) return;
        
        var data = await response.json();
        
        if (data.featured) {
            var featured = data.featured;
            
            if (featured.image) {
                var el = document.getElementById('featured-image');
                if (el) el.src = featured.image;
            }
            if (featured.title) {
                var el = document.getElementById('featured-title');
                if (el) el.textContent = featured.title;
            }
            if (featured.description) {
                var el = document.getElementById('featured-description');
                if (el) el.textContent = featured.description;
            }
            if (featured.meta) {
                var el = document.getElementById('featured-meta');
                if (el) el.textContent = featured.meta;
            }
            if (featured.link) {
                var el = document.getElementById('featured-link');
                if (el) el.href = featured.link;
            }
        }
        
    } catch (e) {
        console.log('Featured album: Using default content');
    }
}

// ========== LOAD VIDEOS ==========
async function loadVideos() {
    try {
        var response = await fetch('data/gallery.json');
        if (!response.ok) return;
        
        var data = await response.json();
        
        if (data.videos && data.videos.length > 0) {
            var el = document.getElementById('gallery-videos');
            if (el) {
                var html = '';
                for (var i = 0; i < data.videos.length; i++) {
                    var video = data.videos[i];
                    html += `
                        <div class="video-card">
                            <video controls poster="${video.poster || ''}">
                                <source src="${video.src}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <div class="video-caption"><p>${video.caption || ''}</p></div>
                        </div>
                    `;
                }
                el.innerHTML = html;
            }
        }
        
    } catch (e) {
        console.log('Videos: Using default content');
    }
}
