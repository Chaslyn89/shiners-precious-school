// ========== UNIFORM PAGE - Loads uniform.json ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD UNIFORM DATA ==========
    async function loadUniformData() {
        try {
            const response = await fetch('data/uniform.json');
            if (!response.ok) return;
            
            const data = await response.json();

            // Hero
            if (data.hero_title) {
                const el = document.getElementById('uniform-hero-title');
                if (el) el.textContent = data.hero_title;
            }
            if (data.hero_subtitle) {
                const el = document.getElementById('uniform-hero-subtitle');
                if (el) el.textContent = data.hero_subtitle;
            }

            // Uniform Gallery
            if (data.gallery && data.gallery.length > 0) {
                const el = document.getElementById('uniform-gallery');
                if (el) {
                    el.innerHTML = data.gallery.map(item => `
                        <div class="uniform-gallery-item">
                            <img src="${item.image}" alt="${item.alt}" onerror="this.src='https://placehold.co/200x200/${item.color || '800020'}/white?text=${item.label}'">
                            <p><strong>${item.label}</strong><br>${item.description}</p>
                        </div>
                    `).join('');
                }
            }

            // Uniform Comparison (Maroon & Navy)
            if (data.comparison) {
                // Maroon section
                const maroonSection = document.querySelector('.uniform-maroon');
                if (maroonSection && data.comparison.maroon) {
                    const maroon = data.comparison.maroon;
                    // Update boys list
                    const boysList = maroonSection.querySelector('ul.uniform-list');
                    if (boysList && maroon.boys) {
                        boysList.innerHTML = maroon.boys.map(item => `<li>${item}</li>`).join('');
                    }
                    // Update girls list
                    const girlsList = maroonSection.querySelectorAll('ul.uniform-list')[1];
                    if (girlsList && maroon.girls) {
                        girlsList.innerHTML = maroon.girls.map(item => `<li>${item}</li>`).join('');
                    }
                }

                // Navy section
                const navySection = document.querySelector('.uniform-navy');
                if (navySection && data.comparison.navy) {
                    const navy = data.comparison.navy;
                    const boysList = navySection.querySelector('ul.uniform-list');
                    if (boysList && navy.boys) {
                        boysList.innerHTML = navy.boys.map(item => `<li>${item}</li>`).join('');
                    }
                    const girlsList = navySection.querySelectorAll('ul.uniform-list')[1];
                    if (girlsList && navy.girls) {
                        girlsList.innerHTML = navy.girls.map(item => `<li>${item}</li>`).join('');
                    }
                }
            }

            // Price Table
            if (data.prices && data.prices.length > 0) {
                const el = document.getElementById('uniform-price-table');
                if (el) {
                    const tbody = el.querySelector('tbody');
                    if (tbody) {
                        tbody.innerHTML = data.prices.map(item => `
                            <tr><td>${item.item}</td><td>${item.price}</td><td>${item.notes || ''}</td></tr>
                        `).join('');
                    }
                }
            }

            // Comparison Table
            if (data.comparison_table && data.comparison_table.length > 0) {
                const el = document.getElementById('uniform-comparison-table');
                if (el) {
                    const tbody = el.querySelector('tbody');
                    if (tbody) {
                        tbody.innerHTML = data.comparison_table.map(row => `
                            <tr>
                                <td>${row.item}</td>
                                <td>${row.level1}</td>
                                <td>${row.level2}</td>
                            </tr>
                        `).join('');
                    }
                }
            }

            // Recommended Package
            if (data.recommended_package && data.recommended_package.length > 0) {
                const el = document.querySelector('#uniform-package .card:first-child .package-list');
                if (el) {
                    el.innerHTML = data.recommended_package.map(item => `<li>${item}</li>`).join('');
                }
            }

            // Replacement Schedule
            if (data.replacement_schedule && data.replacement_schedule.length > 0) {
                const el = document.querySelector('#uniform-package .card:nth-child(2) .package-list');
                if (el) {
                    el.innerHTML = data.replacement_schedule.map(item => `<li>${item}</li>`).join('');
                }
            }

            // Important Note
            if (data.important_note) {
                const el = document.querySelector('#uniform-package .card:last-child .card-content p');
                if (el) el.textContent = data.important_note;
            }

            // Care Instructions
            if (data.care_instructions) {
                const cards = document.querySelectorAll('#uniform-care .card .card-content p');
                if (cards.length > 0 && data.care_instructions.washing) {
                    cards[0].innerHTML = data.care_instructions.washing.replace(/\n/g, '<br>');
                }
                if (cards.length > 1 && data.care_instructions.labelling) {
                    cards[1].innerHTML = data.care_instructions.labelling.replace(/\n/g, '<br>');
                }
                if (cards.length > 2 && data.care_instructions.shoe_care) {
                    cards[2].innerHTML = data.care_instructions.shoe_care.replace(/\n/g, '<br>');
                }
            }

            // Where to Buy
            if (data.where_to_buy) {
                // Phone numbers are handled by settings.js
                if (data.where_to_buy.whatsapp) {
                    const el = document.getElementById('uniform-whatsapp');
                    if (el) el.textContent = data.where_to_buy.whatsapp;
                }
            }

            // Download Link
            if (data.download_link) {
                const el = document.getElementById('uniform-download-link');
                if (el) el.href = data.download_link;
            }

            console.log('Uniform page data loaded successfully');

        } catch (e) {
            console.log('Uniform page: Using default content');
        }
    }

    // ========== INITIALIZE ==========
    loadUniformData();
});