// ========== GALLERY PAGE - Gallery functionality ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== FILTER FUNCTIONALITY ==========
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categories = document.querySelectorAll('.gallery-category');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            categories.forEach(category => {
                if (filter === 'all') {
                    category.style.display = 'block';
                } else {
                    if (category.getAttribute('data-category') === filter) {
                        category.style.display = 'block';
                    } else {
                        category.style.display = 'none';
                    }
                }
            });
        });
    });

    // ========== LIGHTBOX FUNCTIONALITY ==========
    function setupLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-modal';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="Enlarged view">
            <span class="lightbox-prev">&#10094;</span>
            <span class="lightbox-next">&#10095;</span>
        `;
        document.body.appendChild(lightbox);

        const galleryImages = document.querySelectorAll('.gallery-item img');
        let currentIndex = 0;
        const allImages = Array.from(galleryImages);

        const showImage = (index) => {
            currentIndex = (index + allImages.length) % allImages.length;
            lightbox.querySelector('.lightbox-image').src = allImages[currentIndex].src;
        };

        const openLightbox = () => {
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        };

        lightbox.querySelector('.lightbox-close').onclick = closeLightbox;
        lightbox.querySelector('.lightbox-prev').onclick = (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
        };
        lightbox.querySelector('.lightbox-next').onclick = (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        };
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') closeLightbox();
            if (e.key === 'ArrowLeft' && lightbox.style.display === 'block') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight' && lightbox.style.display === 'block') showImage(currentIndex + 1);
        });

        galleryImages.forEach((img, idx) => {
            img.addEventListener('click', () => {
                showImage(idx);
                openLightbox();
            });
        });
    }

    // ========== LOAD GALLERY DATA ==========
    async function loadGalleryData() {
        try {
            const response = await fetch('data/gallery.json');
            if (!response.ok) return;

            const data = await response.json();

            // Update Hero
            if (data.hero_title) {
                const el = document.getElementById('gallery-hero-title');
                if (el) el.textContent = data.hero_title;
            }
            if (data.hero_subtitle) {
                const el = document.getElementById('gallery-hero-subtitle');
                if (el) el.textContent = data.hero_subtitle;
            }

            // Update Featured Album
            if (data.featured) {
                const featured = data.featured;
                if (featured.image) {
                    const el = document.getElementById('featured-image');
                    if (el) el.src = featured.image;
                }
                if (featured.title) {
                    const el = document.getElementById('featured-title');
                    if (el) el.textContent = featured.title;
                }
                if (featured.description) {
                    const el = document.getElementById('featured-description');
                    if (el) el.textContent = featured.description;
                }
                if (featured.meta) {
                    const el = document.getElementById('featured-meta');
                    if (el) el.innerHTML = `<strong>${featured.meta}</strong>`;
                }
                if (featured.link) {
                    const el = document.querySelector('#gallery-featured a');
                    if (el) el.href = featured.link;
                }
            }

            // Update Gallery Categories
            if (data.categories) {
                for (const [key, category] of Object.entries(data.categories)) {
                    // Update count
                    const countEl = document.getElementById(`${key}-count`);
                    if (countEl && category.photos) {
                        countEl.textContent = `(${category.photos.length} Photos)`;
                    }

                    // Update grid
                    const gridEl = document.getElementById(`${key}-grid`);
                    if (gridEl && category.photos) {
                        gridEl.innerHTML = category.photos.map(photo => `
                            <div class="gallery-item">
                                <img src="${photo.src}" alt="${photo.alt}" data-category="${key}" onerror="this.src='images/placeholder-gallery.jpg'">
                                <div class="gallery-caption"><p>${photo.caption}</p></div>
                            </div>
                        `).join('');

                        // Re-attach click events to new images
                        const newImages = gridEl.querySelectorAll('.gallery-item img');
                        newImages.forEach((img, idx) => {
                            img.addEventListener('click', function() {
                                // Lightbox will handle this
                            });
                        });
                    }
                }
            }

            // Update Videos
            if (data.videos && data.videos.length > 0) {
                const el = document.getElementById('gallery-videos');
                if (el) {
                    el.innerHTML = data.videos.map(video => `
                        <div class="video-card">
                            <video controls poster="${video.poster}">
                                <source src="${video.src}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <div class="video-caption"><p>${video.caption}</p></div>
                        </div>
                    `).join('');
                }
            }

            // Re-initialize lightbox for dynamic images
            // Wait a moment for DOM to update
            setTimeout(setupLightbox, 100);

            console.log('Gallery data loaded successfully');

        } catch (e) {
            console.log('Gallery page: Using default content');
            // Still set up lightbox for default images
            setupLightbox();
        }
    }

    // ========== INITIALIZE ==========
    loadGalleryData();

    // Also set up lightbox immediately for default images
    // (will be replaced by dynamic version if JSON loads)
    setTimeout(setupLightbox, 500);
});