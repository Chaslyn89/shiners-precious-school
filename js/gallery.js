// ========== GALLERY PAGE - Loads gallery images from CMS ==========

document.addEventListener('DOMContentLoaded', function() {
    loadGalleryData();
});

async function loadGalleryData() {
    try {
        var response = await fetch('data/gallery.json');
        if (!response.ok) {
            console.log('No gallery data found');
            return;
        }
        
        var data = await response.json();
        console.log('Gallery data loaded:', data);
        
        // Get the container
        var container = document.getElementById('gallery-container');
        if (!container) {
            console.log('Gallery container not found');
            return;
        }
        
        // Check if data has categories with photos
        var allImages = [];
        if (data.categories) {
            for (var category in data.categories) {
                if (data.categories[category].photos) {
                    allImages = allImages.concat(data.categories[category].photos);
                }
            }
        }
        
        // Also check for direct images array (alternative structure)
        if (data.images && data.images.length > 0) {
            allImages = allImages.concat(data.images);
        }
        
        console.log('Total images found:', allImages.length);
        
        if (allImages.length > 0) {
            var html = '';
            for (var i = 0; i < allImages.length; i++) {
                var img = allImages[i];
                var imgSrc = img.image || img.src || '';
                var imgTitle = img.title || img.caption || 'Gallery Image';
                var imgCaption = img.caption || img.description || '';
                var imgPhotographer = img.photographer || '';
                var imgDate = img.date_taken || '';
                
                html += `
                    <div class="gallery-item">
                        <img src="${imgSrc}" alt="${imgTitle}" loading="lazy" onerror="this.src='images/placeholder-gallery.jpg'">
                        <div class="gallery-caption">
                            <p>${imgTitle}</p>
                            ${imgCaption ? '<span class="description">' + imgCaption + '</span>' : ''}
                            ${imgPhotographer ? '<span class="meta">📸 ' + imgPhotographer + '</span>' : ''}
                            ${imgDate ? '<span class="meta">📅 ' + imgDate + '</span>' : ''}
                        </div>
                    </div>
                `;
            }
            container.innerHTML = html;
            console.log('Gallery displayed:', allImages.length + ' images');
        } else {
            container.innerHTML = '<div class="empty-gallery"><h3>📸 No Gallery Images Yet</h3><p>Add images through the CMS at /admin</p></div>';
        }
        
    } catch (e) {
        console.log('Gallery error:', e);
        var container = document.getElementById('gallery-container');
        if (container) {
            container.innerHTML = '<div class="empty-gallery"><h3>📸 Gallery Coming Soon</h3><p>Images will appear here once added through the CMS.</p></div>';
        }
    }
}
