// ========== NEWS PAGE - Loads news from markdown files ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD ALL NEWS AUTOMATICALLY ==========
    async function loadNews() {
        const container = document.getElementById('news-container');
        if (!container) return;

        try {
            // Use GitHub API to list all files in the news folder
            const apiUrl = 'https://api.github.com/repos/Chaslyn89/shiners-precious-school/contents/data/news';
            
            let newsFiles = [];
            let foundArticles = false;
            
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const files = await response.json();
                    const mdFiles = files.filter(file => file.name.endsWith('.md'));
                    newsFiles = mdFiles.map(file => file.name.replace('.md', ''));
                    console.log('Found news files:', newsFiles);
                } else {
                    console.log('GitHub API not available, using fallback list');
                    newsFiles = [
                        'another-test-news',
                        'test-news',
                        'shinners-precious-academy-parents-meeting'
                    ];
                }
            } catch (e) {
                console.log('Error fetching file list, using fallback list');
                newsFiles = [
                    'another-test-news',
                    'test-news',
                    'shinners-precious-academy-parents-meeting'
                ];
            }

            let newsHTML = '';
            let counts = { academic: 0, 'school-news': 0, 'co-curricular': 0, admissions: 0, achievement: 0 };

            const sortedFiles = newsFiles.sort().reverse();

            for (const file of sortedFiles) {
                try {
                    const response = await fetch(`data/news/${file}.md`);
                    if (response.ok) {
                        const text = await response.text();
                        const parsed = parseMarkdown(text);
                        if (parsed && parsed.title) {
                            foundArticles = true;
                            
                            let categoryClass = 'school-news';
                            const categoryMap = {
                                'Academic': 'academic',
                                'Co-Curricular': 'co-curricular',
                                'School News': 'school-news',
                                'Admissions': 'admissions',
                                'Achievement': 'achievement'
                            };
                            if (parsed.category && categoryMap[parsed.category]) {
                                categoryClass = categoryMap[parsed.category];
                                counts[categoryClass] = (counts[categoryClass] || 0) + 1;
                            }

                            // Determine content: use frontmatter content OR body content
                            let contentText = parsed.content || parsed.frontmatter_content || '';

                            newsHTML += `
                                <div class="news-card">
                                    <div class="news-content">
                                        <span class="news-category ${categoryClass}">${parsed.category || 'School News'}</span>
                                        <div class="news-date">📅 ${parsed.date || 'Date not set'}</div>
                                        <h2 class="news-title">${parsed.title}</h2>
                                        <p class="news-excerpt">${contentText}</p>
                                        ${parsed.author ? `<p style="font-size: 12px; color: #999; margin-top: 10px;">✍️ ${parsed.author}</p>` : ''}
                                    </div>
                                </div>
                            `;
                        }
                    }
                } catch (e) {
                    // Skip if file not found
                }
            }

            document.getElementById('cat-academic').textContent = counts.academic || 0;
            document.getElementById('cat-school').textContent = counts['school-news'] || 0;
            document.getElementById('cat-co').textContent = counts['co-curricular'] || 0;
            document.getElementById('cat-admissions').textContent = counts.admissions || 0;
            document.getElementById('cat-achievement').textContent = counts.achievement || 0;

            if (foundArticles) {
                container.innerHTML = newsHTML;
            } else {
                container.innerHTML = `
                    <div class="empty-text">
                        📭 No news articles yet. Check back soon!
                    </div>
                `;
            }
            
        } catch (e) {
            console.error('Error loading news:', e);
            container.innerHTML = `
                <div class="error-text">
                    ❌ Could not load news articles. Please try again later.
                </div>
            `;
        }
    }

    // ========== PARSE MARKDOWN FRONTMATTER ==========
    function parseMarkdown(text) {
        try {
            // Check if the file has frontmatter
            const match = text.match(/---\n([\s\S]*?)\n---\n([\s\S]*)/);
            if (!match) {
                // If no frontmatter, treat the whole text as content
                return {
                    title: 'Untitled',
                    date: 'Date not set',
                    category: 'School News',
                    author: '',
                    content: text.trim(),
                    frontmatter_content: ''
                };
            }

            const frontmatter = match[1];
            const bodyContent = match[2].trim();

            // Extract fields with or without quotes
            const titleMatch = frontmatter.match(/title:\s*"?([^"\n]*?)"?\s*$/m);
            const dateMatch = frontmatter.match(/date:\s*"?([^"\n]*?)"?\s*$/m);
            const categoryMatch = frontmatter.match(/category:\s*"?([^"\n]*?)"?\s*$/m);
            const authorMatch = frontmatter.match(/author:\s*"?([^"\n]*?)"?\s*$/m);
            const contentMatch = frontmatter.match(/content:\s*"?([^"\n]*?)"?\s*$/m);

            let title = titleMatch ? titleMatch[1].trim() : 'Untitled';
            
            // Format date
            let formattedDate = dateMatch ? dateMatch[1].trim() : '';
            if (formattedDate && formattedDate.match(/\d{4}-\d{2}-\d{2}/)) {
                const parts = formattedDate.split('-');
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                formattedDate = `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}, ${parts[0]}`;
            }

            // Get content from body OR from frontmatter
            let content = bodyContent || '';
            let frontmatterContent = contentMatch ? contentMatch[1].trim() : '';

            // If there's content in frontmatter and no body content, use frontmatter content
            if (!content && frontmatterContent) {
                content = frontmatterContent;
            }

            return {
                title: title,
                date: formattedDate || 'Date not set',
                category: categoryMatch ? categoryMatch[1].trim() : 'School News',
                author: authorMatch ? authorMatch[1].trim() : '',
                content: content,
                frontmatter_content: frontmatterContent
            };
        } catch (e) {
            console.error('Error parsing markdown:', e);
            return null;
        }
    }

    // ========== LOAD TERM DATES ==========
    async function loadTermDates() {
        try {
            const response = await fetch('data/term-dates.json');
            if (!response.ok) return;
            
            const data = await response.json();
            
            const termContainer = document.querySelector('.term-card .term-dates');
            if (termContainer && data) {
                termContainer.innerHTML = `
                    <p><strong>Opening Date:</strong> ${data.opening_date || 'To be announced'}</p>
                    <p><strong>Mid-Term Break:</strong> ${data.mid_term_break || 'To be announced'}</p>
                    <p><strong>Closing Date:</strong> ${data.closing_date || 'To be announced'}</p>
                    <p><strong>Next Holiday:</strong> ${data.next_holiday || 'To be announced'}</p>
                `;
            }
            
            const termTitle = document.querySelector('.term-card h3');
            if (termTitle && data.term_name) {
                termTitle.textContent = `📅 ${data.term_name}`;
            }
            
            console.log('Term dates loaded successfully');
        } catch (e) {
            console.log('Term dates: Using default content');
        }
    }

    // ========== LOAD UPCOMING EVENTS ==========
    async function loadUpcomingEvents() {
        try {
            const apiUrl = 'https://api.github.com/repos/Chaslyn89/shiners-precious-school/contents/data/upcoming-events';
            
            let eventFiles = [];
            
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const files = await response.json();
                    const mdFiles = files.filter(file => file.name.endsWith('.md'));
                    eventFiles = mdFiles.map(file => file.name.replace('.md', ''));
                } else {
                    eventFiles = [];
                }
            } catch (e) {
                eventFiles = [];
            }
            
            let eventsHTML = '';
            let foundEvents = false;
            
            for (const file of eventFiles) {
                try {
                    const response = await fetch(`data/upcoming-events/${file}.md`);
                    if (response.ok) {
                        const text = await response.text();
                        const parsed = parseEventMarkdown(text);
                        if (parsed) {
                            foundEvents = true;
                            eventsHTML += `
                                <div class="upcoming-event">
                                    <div class="event-date">
                                        <div class="event-day">${parsed.day}</div>
                                        <div class="event-month">${parsed.month}</div>
                                    </div>
                                    <div class="event-info">
                                        <h4>${parsed.title}</h4>
                                        <p>${parsed.description}</p>
                                    </div>
                                </div>
                            `;
                        }
                    }
                } catch (e) {
                    // Skip if file not found
                }
            }
            
            const eventsContainer = document.getElementById('news-upcoming-events');
            if (eventsContainer) {
                if (foundEvents) {
                    eventsContainer.innerHTML = eventsHTML;
                } else {
                    eventsContainer.innerHTML = `
                        <div style="padding: 10px 0; text-align: center; color: #999;">
                            No upcoming events
                        </div>
                    `;
                }
            }
            
            console.log('Upcoming events loaded successfully');
        } catch (e) {
            console.log('Upcoming events: Using default content');
        }
    }

    // ========== PARSE EVENT MARKDOWN ==========
    function parseEventMarkdown(text) {
        try {
            const match = text.match(/---\n([\s\S]*?)\n---\n([\s\S]*)/);
            if (!match) return null;

            const frontmatter = match[1];

            const titleMatch = frontmatter.match(/title:\s*"?([^"\n]*?)"?\s*$/m);
            const dayMatch = frontmatter.match(/day:\s*(\d+)/);
            const monthMatch = frontmatter.match(/month:\s*"?([^"\n]*?)"?\s*$/m);
            const descriptionMatch = frontmatter.match(/description:\s*"?([^"\n]*?)"?\s*$/m);

            return {
                title: titleMatch ? titleMatch[1].trim() : 'Untitled',
                day: dayMatch ? dayMatch[1] : '',
                month: monthMatch ? monthMatch[1].trim() : '',
                description: descriptionMatch ? descriptionMatch[1].trim() : ''
            };
        } catch (e) {
            return null;
        }
    }

    // ========== LOAD ALL DATA ==========
    async function loadAllData() {
        await loadNews();
        await loadTermDates();
        await loadUpcomingEvents();
    }

    loadAllData();
});