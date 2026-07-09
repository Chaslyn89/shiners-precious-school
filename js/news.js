// ========== NEWS PAGE - Loads news from markdown files ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD NEWS ==========
    async function loadNews() {
        const container = document.getElementById('news-container');
        if (!container) return;

        // List of news files in order (newest first)
        const newsFiles = [
            '2026-06-15-term-3-opens',
            '2026-05-20-new-uniform'
        ];

        // Additional files can be added here as they are created

        let newsHTML = '';
        let counts = { academic: 0, 'school-news': 0, 'co-curricular': 0, admissions: 0, achievement: 0 };

        for (const file of newsFiles) {
            try {
                const response = await fetch(`data/news/${file}.md`);
                if (response.ok) {
                    const text = await response.text();
                    const parsed = parseMarkdown(text);
                    if (parsed) {
                        // Determine category class
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

                        newsHTML += `
                            <div class="news-card">
                                <div class="news-content">
                                    <span class="news-category ${categoryClass}">${parsed.category || 'School News'}</span>
                                    <div class="news-date">📅 ${parsed.date}</div>
                                    <h2 class="news-title">${parsed.title}</h2>
                                    <p class="news-excerpt">${parsed.content}</p>
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

        // Update category counts
        document.getElementById('cat-academic').textContent = counts.academic || 0;
        document.getElementById('cat-school').textContent = counts['school-news'] || 0;
        document.getElementById('cat-co').textContent = counts['co-curricular'] || 0;
        document.getElementById('cat-admissions').textContent = counts.admissions || 0;
        document.getElementById('cat-achievement').textContent = counts.achievement || 0;

        if (newsHTML) {
            container.innerHTML = newsHTML;
        } else {
            container.innerHTML = `
                <div class="empty-text">
                    📭 No news articles yet. Check back soon!
                </div>
            `;
        }
    }

    // ========== PARSE MARKDOWN FRONTMATTER ==========
    function parseMarkdown(text) {
        try {
            const match = text.match(/---\n([\s\S]*?)\n---\n([\s\S]*)/);
            if (!match) return null;

            const frontmatter = match[1];
            const content = match[2].trim();

            const titleMatch = frontmatter.match(/title:\s*"([^"]*)"/);
            const dateMatch = frontmatter.match(/date:\s*([\d-]+)/);
            const categoryMatch = frontmatter.match(/category:\s*"([^"]*)"/);
            const authorMatch = frontmatter.match(/author:\s*"([^"]*)"/);
            const imageMatch = frontmatter.match(/image:\s*"([^"]*)"/);

            // Format date
            let formattedDate = dateMatch ? dateMatch[1] : '';
            if (formattedDate) {
                const parts = formattedDate.split('-');
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                formattedDate = `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}, ${parts[0]}`;
            }

            return {
                title: titleMatch ? titleMatch[1] : 'Untitled',
                date: formattedDate,
                category: categoryMatch ? categoryMatch[1] : 'School News',
                author: authorMatch ? authorMatch[1] : '',
                content: content,
                image: imageMatch ? imageMatch[1] : null
            };
        } catch (e) {
            return null;
        }
    }

    // ========== LOAD NEWS ON PAGE LOAD ==========
    loadNews();
});