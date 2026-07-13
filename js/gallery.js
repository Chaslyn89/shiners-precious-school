// ========== GALLERY PAGE - Loads gallery images from CMS ==========

document.addEventListener('DOMContentLoaded', function() {
    loadGalleryImages();
});

async function loadGalleryImages() {
    try {
        var response = await fetch('data/gallery.json');
        if (!response.ok) {
            console.log('No gallery data found');
            return;
        }
        
        var data = await response.json();
        var container = document.getElementById('gallery-container');
        if (!container) return;
        
        // Get all images from all categories
        var allImages = [];
        if (data.categories) {
            for (var category in data.categories) {
                if (data.categories[category].photos) {
                    allImages = allImages.concat(data.categories[category].photos);
                }
            }
        }
        
        if (allImages.length > 0) {
            var html = '';
            for (var i = 0; i < allImages.length; i++) {
                var img = allImages[i];
                html += `
                    <div class="gallery-item">
                        <img src="${img.src}" alt="${img.alt || 'Gallery Image'}" loading="lazy" onerror="this.src='images/placeholder-gallery.jpg'">
                        <div class="gallery-caption">
                            <p>${img.caption || ''}</p>
                        </div>
                    </div>
                `;
            }
            container.innerHTML = html;
        } else {
            container.innerHTML = '<div class="empty-gallery"><h3>📸 No Gallery Images Yet</h3><p>Add images through the CMS at /admin</p></div>';
        }
        
        console.log('Gallery loaded successfully:', allImages.length + ' images');

    } catch (e) {
        console.log('Gallery: Using default content');
        var container = document.getElementById('gallery-container');
        if (container) {
            container.innerHTML = '<div class="empty-gallery"><h3>📸 Gallery Coming Soon</h3><p>Images will appear here once added through the CMS.</p></div>';
        }
    }
}
