// ========================================
// FEES PAGE - Fully dynamic, driven by data/fees.json
// Structure: { page_content, levels: [...], annual_summary: [...], ... }
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    async function loadFeesData() {
        try {
            const response = await fetch('data/fees.json');
            if (!response.ok) return;
            const data = await response.json();

            // ===== TUITION TABLES =====
            // Renders all 6 tables from the levels[] array, matching the papers
            renderAllLevels(data.levels);

            // ===== OTHER SECTIONS =====
            updatePageContent(data.page_content);
            updateAnnualSummary(data.annual_summary);
            updateOptionalServices(data.optional_services);
            updateAdmissionFee(data.admission_fee);
            updateNewAdmissionExample(data.new_admission_example);
            updatePaymentMethods(data.payment_methods);
            updatePaymentSchedule(data.payment_schedule);
            updateFAQs(data.faqs);
            updateImportantNotes(data.important_notes);
            updateDownloadLink(data.download_link);
            setupFeeCalculator(data);

            console.log('Fees data loaded successfully');
        } catch (e) {
            console.log('Fees page: Using default content', e);
        }
    }

    // ====== RENDER ALL 6 LEVEL TABLES ======
    function renderAllLevels(levels) {
        if (!levels) return;

        // Map level id → table ID in fees.html
        const tableMap = {
            'pre_primary':         'fees-table-pg',
            'lower_primary_g1_3':  'fees-table-g1-3',
            'upper_primary_g4_5':  'fees-table-g4-5',
            'upper_primary_g6':    'fees-table-g6',
            'junior_g7_8':         'fees-table-g7-8',
            'junior_g9':           'fees-table-g9'
        };

        // Map level id → title element ID in fees.html
        const titleMap = {
            'pre_primary':         'fees-title-pg',
            'lower_primary_g1_3':  'fees-title-g1-3',
            'upper_primary_g4_5':  'fees-title-g4-5',
            'upper_primary_g6':    'fees-title-g6',
            'junior_g7_8':         'fees-title-g7-8',
            'junior_g9':           'fees-title-g9'
        };

        levels.forEach(level => {
            const tableId = tableMap[level.id];
            if (tableId) renderLevelTable(tableId, level);

            const titleId = titleMap[level.id];
            if (titleId && level.name) {
                const titleEl = document.getElementById(titleId);
                if (titleEl) titleEl.textContent = level.name;
            }
        });
    }

    // ====== RENDER ONE LEVEL TABLE ======
    function renderLevelTable(tableId, level) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        let rows = '';

        // Item rows
        (level.items || []).forEach(item => {
            const fmt = (val) => (val && val > 0) ? `KSh ${val.toLocaleString()}` : '-';
            rows += `<tr>
                <td>${item.label}</td>
                <td>${fmt(item.term1)}</td>
                <td>${fmt(item.term2)}</td>
                <td>${fmt(item.term3)}</td>
            </tr>`;
        });

        // Total row
        if (level.total) {
            rows += `<tr style="background: var(--gray-light); font-weight: bold;">
                <td>TOTAL</td>
                <td>KSh ${level.total.term1.toLocaleString()}</td>
                <td>KSh ${level.total.term2.toLocaleString()}</td>
                <td>KSh ${level.total.term3.toLocaleString()}</td>
            </tr>`;
        }

        tbody.innerHTML = rows;
    }

    // ====== PAGE CONTENT (announcement, hero, contact line) ======
    function updatePageContent(content) {
        if (!content) return;

        if (content.announcement_text) {
            const el = document.getElementById('announcement-text');
            if (el) el.textContent = content.announcement_text;
        }
        if (content.hero_title) {
            const el = document.getElementById('fees-hero-title');
            if (el) el.textContent = content.hero_title;
        }
        if (content.hero_subtitle) {
            const el = document.getElementById('fees-hero-subtitle');
            if (el) el.textContent = content.hero_subtitle;
        }
        if (content.contact_line) {
            const el = document.getElementById('fees-last-updated');
            if (el) el.textContent = content.contact_line;
        }
    }

    // ====== ANNUAL SUMMARY ======
    function updateAnnualSummary(annualSummary) {
        const table = document.getElementById('fees-annual-summary');
        if (!table || !annualSummary) return;
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        let rows = '';
        annualSummary.forEach(item => {
            rows += `<tr><td>${item.label}</td><td>KSh ${item.amount.toLocaleString()}</td></tr>`;
        });
        tbody.innerHTML = rows;
    }

    // ====== OPTIONAL SERVICES ======
    function updateOptionalServices(services) {
        if (!services) return;

        // Meals
        if (services.meals) {
            const mealsCard = document.getElementById('meals-service');
            if (mealsCard) {
                mealsCard.innerHTML = `
                    <h3>🍎 Meals Program</h3>
                    <p><strong>KSh ${services.meals.toLocaleString()} per term</strong></p>
                    <p>${services.meals_description || 'Nutritious lunch served daily.'}</p>
                `;
            }
        }

        // Transport
        if (services.transport && Array.isArray(services.transport)) {
            const transportTable = document.getElementById('fees-transport-table');
            if (transportTable) {
                const tbody = transportTable.querySelector('tbody') || transportTable;
                let rows = '';
                services.transport.forEach(route => {
                    rows += `<tr><td>${route.label}</td><td>KSh ${route.amount.toLocaleString()}</td></tr>`;
                });
                if (tbody.tagName === 'TBODY') {
                    tbody.innerHTML = rows;
                } else {
                    transportTable.innerHTML = `<tr><th>Route</th><th>Fee/Term</th></tr>${rows}`;
                }
            }
        }
    }

    // ====== ADMISSION FEE ======
    function updateAdmissionFee(admissionFee) {
        if (!admissionFee) return;
        const card = document.getElementById('admission-fee-container');
        if (!card) return;

        let html = `<h3>💰 Admission Fee</h3>`;
        if (admissionFee.playgroup_grade6) {
            html += `<p><strong>KSh ${admissionFee.playgroup_grade6.toLocaleString()} (once)</strong></p>`;
            html += `<p>${admissionFee.playgroup_grade6_label || 'For Playgroup - Grade 6'}</p>`;
        }
        if (admissionFee.grade7_9) {
            html += `<p><strong>KSh ${admissionFee.grade7_9.toLocaleString()} (once)</strong></p>`;
            html += `<p>${admissionFee.grade7_9_label || 'For Grade 7 - Grade 9'}</p>`;
        }
        card.innerHTML = html;
    }

    // ====== NEW ADMISSION EXAMPLE ======
    function updateNewAdmissionExample(example) {
        const table = document.getElementById('fees-admission-example');
        if (!table || !example) return;

        // Column headers
        const thead = table.querySelector('thead');
        if (thead && example.columns) {
            thead.innerHTML = `<tr><th>Item</th>${example.columns.map(c => `<th>${c}</th>`).join('')}</tr>`;
        }

        // Rows
        const tbody = table.querySelector('tbody');
        if (!tbody || !example.rows) return;

        let rows = '';
        example.rows.forEach(row => {
            const style = row.bold ? ' style="background: var(--gray-light); font-weight: bold;"' : '';
            rows += `<tr${style}><td>${row.label}</td>${row.values.map(v => `<td>${v}</td>`).join('')}</tr>`;
        });
        tbody.innerHTML = rows;
    }

    // ====== PAYMENT METHODS ======
    function updatePaymentMethods(paymentMethods) {
        if (!paymentMethods) return;
        const methods = document.querySelectorAll('.payment-method');
        if (methods.length < 3) return;

        if (paymentMethods.bank) {
            methods[0].innerHTML = `
                <h3>🏦 Bank Deposit</h3>
                <p><strong>${paymentMethods.bank.name}</strong></p>
                <p>${paymentMethods.bank.branch}</p>
                <p><strong>A/C Name:</strong> ${paymentMethods.bank.account_name}</p>
                <p><strong>A/C Number:</strong> ${paymentMethods.bank.account_number}</p>
            `;
        }
        if (paymentMethods.mpesa) {
            methods[1].innerHTML = `
                <h3>📱 Lipa Na Mpesa</h3>
                <p><strong>Paybill Number:</strong> ${paymentMethods.mpesa.paybill}</p>
                <p><strong>Account Number:</strong></p>
                <p><code>${paymentMethods.mpesa.account_format}</code></p>
                <p style="font-size: 12px; margin-top: 10px;">Example: ${paymentMethods.mpesa.example}</p>
            `;
        }
        if (paymentMethods.note) {
            methods[2].innerHTML = `
                <h3>⚠️ Important</h3>
                <p style="color: var(--maroon); font-weight: bold;">❌ ${paymentMethods.note}</p>
                <p>${paymentMethods.receipt_note || 'Keep your payment receipt for reference'}</p>
            `;
        }
    }

    // ====== PAYMENT SCHEDULE ======
    function updatePaymentSchedule(schedule) {
        if (!schedule) return;
        const cards = document.querySelectorAll('#payment-schedule .card .card-content');
        if (cards.length < 3) return;

        const terms = ['term1', 'term2', 'term3'];
        const labels = ['📅 Term 1', '📅 Term 2', '📅 Term 3'];

        cards.forEach((card, index) => {
            const key = terms[index];
            if (schedule[key]) {
                card.innerHTML = `<h3>${labels[index]}</h3><p>${schedule[key]}</p>`;
            }
        });
    }

    // ====== FAQS ======
    function updateFAQs(faqs) {
        const container = document.getElementById('fees-faqs');
        if (!container || !faqs) return;

        container.innerHTML = faqs.map(faq => `
            <div class="faq-item">
                <div class="faq-question">❓ ${faq.question}</div>
                <div class="faq-answer">${faq.answer}</div>
            </div>
        `).join('');
    }

    // ====== IMPORTANT NOTES ======
    function updateImportantNotes(notes) {
        const container = document.getElementById('fees-notes');
        if (!container || !notes) return;
        const ul = container.querySelector('ul');
        if (!ul) return;
        ul.innerHTML = notes.map(note => `<li>${note}</li>`).join('');
    }

    // ====== DOWNLOAD LINK ======
    function updateDownloadLink(downloadLink) {
        const link = document.querySelector('a[download]');
        if (link && downloadLink) {
            link.href = downloadLink;
        }
    }

    // ====== FEE CALCULATOR ======
    function setupFeeCalculator(feesData) {
        const calculateBtn = document.getElementById('calculate-fees');
        if (!calculateBtn) return;

        const gradeMap = {
            'playgroup': 'pre_primary',
            'pp1':       'pre_primary',
            'pp2':       'pre_primary',
            'grade1-3':  'lower_primary_g1_3',
            'grade4-5':  'upper_primary_g4_5',
            'grade6':    'upper_primary_g6',
            'grade7-8':  'junior_g7_8',
            'grade9':    'junior_g9'
        };

        calculateBtn.addEventListener('click', function() {
            const grade = document.getElementById('grade-select')?.value;
            const meals = document.getElementById('meals-option')?.checked;
            const transport = document.getElementById('transport-select')?.value;

            const levelId = gradeMap[grade];
            const level = (feesData.levels || []).find(l => l.id === levelId);

            if (!level || !level.total) {
                alert('Please select a valid grade level.');
                return;
            }

            let total = level.total.term1;

            if (meals && feesData.optional_services?.meals) {
                total += feesData.optional_services.meals;
            }

            if (transport !== 'none' && Array.isArray(feesData.optional_services?.transport)) {
                const transportKeyMap = {
                    'imara':    'Imara Daima',
                    'aakobil':  'AA & KOBIL',
                    'pipeline': 'Pipeline',
                    'kwanjenga':'Kwanjenga'
                };
                const targetLabel = transportKeyMap[transport];
                const route = feesData.optional_services.transport.find(r => r.label === targetLabel);
                if (route) total += route.amount;
            }

            const resultDiv = document.getElementById('fee-result');
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `<strong>Term 1 Total: KSh ${total.toLocaleString()}</strong><br><span style="font-size: 14px;">Includes tuition, assessment, activity, and other mandatory fees.</span>`;
            }
        });
    }

    // ========== INITIALIZE ==========
    loadFeesData();
});
