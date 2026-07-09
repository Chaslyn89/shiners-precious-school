/* ========================================
   SHINNERS PRECIOUS SCHOOL
   Main JavaScript - Core Functions Only
   Version 3.1 (Modular)
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD PAGE-SPECIFIC DATA ==========
    // Each page loads its own data via separate script files
    // This file only contains core website functions

    // Load settings (phone numbers, etc.) - used on ALL pages
    if (typeof loadSettings === 'function') {
        loadSettings();
    }

    // Load page-specific data
    // About page
    if (document.getElementById('about-hero-title') && typeof loadAboutData === 'function') {
        loadAboutData();
    }

    // Academics page
    if (document.getElementById('academics-hero-title') && typeof loadAcademicsData === 'function') {
        loadAcademicsData();
    }

    // Admissions page
    if (document.getElementById('admissions-hero-title') && typeof loadAdmissionsData === 'function') {
        loadAdmissionsData();
    }

    // ========== 1. MOBILE HAMBURGER MENU ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('open');
            }
        });

        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            }
        });

        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (link.id === 'moreLink' && window.innerWidth <= 768) return;
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }

    // ========== 2. MORE DROPDOWN ==========
    const moreLink = document.getElementById('moreLink');
    const moreDropdown = document.getElementById('moreDropdown');

    if (moreLink && moreDropdown) {
        moreLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                moreDropdown.classList.toggle('active');
            }
        });

        moreDropdown.querySelectorAll('.dropdown-content a').forEach(function(link) {
            link.addEventListener('click', function() {
                moreDropdown.classList.remove('active');
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
                if (hamburger) {
                    hamburger.classList.remove('open');
                }
            });
        });
    }

    // ========== 3. SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== 4. ANIMATE STATISTICS ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateNumbers() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (!target) return;

            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 40);
        });
    }

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) animateNumbers();
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // ========== 5. GALLERY LIGHTBOX ==========
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let modal = null;

    if (galleryItems.length > 0) {
        modal = document.createElement('div');
        modal.className = 'lightbox-modal';
        modal.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="Enlarged view">
            <span class="lightbox-prev">&#10094;</span>
            <span class="lightbox-next">&#10095;</span>
        `;
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.textContent = `
            .lightbox-modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:2000; }
            .lightbox-image { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); max-width:90%; max-height:90%; object-fit:contain; }
            .lightbox-close { position:absolute; top:20px; right:35px; color:white; font-size:40px; font-weight:bold; cursor:pointer; }
            .lightbox-prev, .lightbox-next { position:absolute; top:50%; transform:translateY(-50%); color:white; font-size:40px; font-weight:bold; cursor:pointer; padding:20px; }
            .lightbox-prev { left:20px; }
            .lightbox-next { right:20px; }
            .lightbox-prev:hover, .lightbox-next:hover, .lightbox-close:hover { color:#D4AF37; }
        `;
        document.head.appendChild(style);

        let currentIndex = 0;
        const allImages = Array.from(galleryItems);

        const showImage = (index) => {
            currentIndex = (index + allImages.length) % allImages.length;
            modal.querySelector('.lightbox-image').src = allImages[currentIndex].src;
        };

        modal.querySelector('.lightbox-close').onclick = () => modal.style.display = 'none';
        modal.querySelector('.lightbox-prev').onclick = (e) => { e.stopPropagation(); showImage(currentIndex - 1); };
        modal.querySelector('.lightbox-next').onclick = (e) => { e.stopPropagation(); showImage(currentIndex + 1); };
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

        document.addEventListener('keydown', (e) => {
            if (!modal || modal.style.display !== 'block') return;
            if (e.key === 'Escape') modal.style.display = 'none';
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });

        galleryItems.forEach((img, idx) => {
            img.addEventListener('click', () => { showImage(idx); modal.style.display = 'block'; });
        });
    }

    // ========== 6. LOAD FEES FROM JSON (for fees page) ==========
    async function loadFees() {
        try {
            const response = await fetch('data/fees.json');
            if (response.ok) return await response.json();
        } catch (e) {
            console.log('Using default fees');
        }
        return {
            'playgroup': 6500, 'pp1': 7000, 'pp2': 7500,
            'grade1-3': 7800, 'grade4-6': 8100, 'grade7-9': 9500,
            'meals': 3900,
            'transport': { 'imara': 7000, 'aakobil': 6000, 'pipeline': 6000, 'kwanjenga': 6000 }
        };
    }

    const calculateBtn = document.getElementById('calculate-fees');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', async () => {
            const feesData = await loadFees();
            const grade = document.getElementById('grade-select')?.value;
            const meals = document.getElementById('meals-option')?.checked;
            const transport = document.getElementById('transport-select')?.value;

            let total = 0;
            if (grade && feesData[grade]) total += feesData[grade];
            if (meals) total += feesData.meals;
            if (transport && feesData.transport[transport]) total += feesData.transport[transport];

            const resultDiv = document.getElementById('fee-result');
            if (resultDiv) resultDiv.innerHTML = `<strong>Total Fees: KSh ${total.toLocaleString()}</strong>`;
        });
    }

    // ========== 7. CONTACT FORM ==========
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,12}$/;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const message = document.getElementById('message')?.value.trim();

            if (!name || !email || !message) { showFormMessage('Please fill in all required fields', 'error'); return; }
            if (!emailRegex.test(email)) { showFormMessage('Please enter a valid email address', 'error'); return; }
            if (phone && !phoneRegex.test(phone)) { showFormMessage('Please enter a valid phone number (10-12 digits)', 'error'); return; }

            try {
                const response = await fetch('https://formspree.io/f/YOUR_ENDPOINT_HERE', {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    showFormMessage('Message sent! We will contact you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('Something went wrong. Please call 0720 994 337.', 'error');
                }
            } catch (err) {
                showFormMessage('Network error. Please try again.', 'error');
            }
        });
    }

    function showFormMessage(msg, type) {
        let msgDiv = document.getElementById('form-message');
        if (!msgDiv && contactForm) {
            msgDiv = document.createElement('div');
            msgDiv.id = 'form-message';
            contactForm.appendChild(msgDiv);
        }
        if (!msgDiv) return;
        msgDiv.textContent = msg;
        msgDiv.style.display = 'block';
        msgDiv.style.padding = '10px';
        msgDiv.style.marginTop = '10px';
        msgDiv.style.borderRadius = '5px';
        msgDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        msgDiv.style.color = type === 'success' ? '#155724' : '#721c24';
        msgDiv.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
        setTimeout(() => { msgDiv.style.display = 'none'; }, 5000);
    }

    // ========== 8. WHATSAPP INQUIRY ==========
    const whatsappInquiry = document.getElementById('whatsapp-inquiry');
    if (whatsappInquiry) {
        whatsappInquiry.addEventListener('click', () => {
            window.open('https://wa.me/254720994337?text=' + encodeURIComponent('Hello, I would like to inquire about admission at Shinners Precious School.'), '_blank');
        });
    }

    // ========== 9. DOWNLOAD BUTTONS ==========
    const downloadAdmission = document.getElementById('download-admission');
    if (downloadAdmission) downloadAdmission.addEventListener('click', () => window.open('assets/Admission-Form-2026.pdf', '_blank'));

    const downloadCalendar = document.getElementById('download-calendar');
    if (downloadCalendar) downloadCalendar.addEventListener('click', () => window.open('assets/School-Calendar-2026.pdf', '_blank'));

    // ========== 10. BACK TO TOP ==========
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ========== 11. FOOTER YEAR ==========
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ========== 12. WRAP TABLES FOR RESPONSIVE ==========
    document.querySelectorAll('.fee-table').forEach(table => {
        if (!table.parentElement.classList.contains('table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            wrapper.style.overflowX = 'auto';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });

    // ========== 13. ANNOUNCEMENT BAR ==========
    const announcementBar = document.getElementById('announcement-bar');
    const closeAnnouncement = document.getElementById('close-announcement');
    const oneDay = 24 * 60 * 60 * 1000;

    if (announcementBar) {
        announcementBar.style.display = 'none';
        
        const closedTime = localStorage.getItem('announcementClosedTime');
        if (closedTime && (Date.now() - parseInt(closedTime)) < oneDay) {
            announcementBar.style.display = 'none';
        } else {
            localStorage.removeItem('announcementClosed');
            localStorage.removeItem('announcementClosedTime');
            announcementBar.style.display = 'flex';
        }
    }

    if (closeAnnouncement) {
        closeAnnouncement.addEventListener('click', function() {
            if (announcementBar) announcementBar.style.display = 'none';
            localStorage.setItem('announcementClosed', 'true');
            localStorage.setItem('announcementClosedTime', Date.now().toString());
        });
    }

    console.log('Shinners Precious School - Website Loaded v3.1 (Modular)');
});