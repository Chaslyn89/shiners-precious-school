// ========================================
// FEES PAGE - Loads all fees data dynamically
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD ALL FEES DATA ==========
    async function loadFeesData() {
        try {
            const response = await fetch('data/fees.json');
            if (!response.ok) return;
            
            const data = await response.json();

            // ====== 1. TUITION TABLES ======
            // Playgroup - Grade 3
            updateTuitionTable('fees-table-pg-g3', data.tuition, 'playgroup', data.extra_fees.playgroup);
            
            // Grade 4 - 6 (uses grade4_5 and grade6)
            updateTuitionTable('fees-table-g4-g6', data.tuition, 'grade4_5', data.extra_fees.grade4_6);
            
            // Grade 7 - 9
            updateTuitionTable('fees-table-g7-g9', data.tuition, 'grade7_8', data.extra_fees.grade7_9);

            // ====== 2. GRADE NOTES ======
            updateGradeNotes(data);

            // ====== 3. ANNUAL SUMMARY ======
            updateAnnualSummary(data.annual_summary);

            // ====== 4. OPTIONAL SERVICES ======
            updateOptionalServices(data.optional_services);

            // ====== 5. ADMISSION FEE ======
            updateAdmissionFee(data.admission_fee);

            // ====== 6. NEW ADMISSION EXAMPLE ======
            updateNewAdmissionExample(data.new_admission_example);

            // ====== 7. PAYMENT METHODS ======
            updatePaymentMethods(data.payment_methods);

            // ====== 8. PAYMENT SCHEDULE ======
            updatePaymentSchedule(data.payment_schedule);

            // ====== 9. FAQS ======
            updateFAQs(data.faqs);

            // ====== 10. IMPORTANT NOTES ======
            updateImportantNotes(data.important_notes);

            // ====== 11. LAST UPDATED ======
            updateLastUpdated(data.last_updated);

            // ====== 12. DOWNLOAD LINK ======
            updateDownloadLink(data.download_link);

            // ====== 13. CALCULATOR ======
            setupFeeCalculator(data);

            console.log('Fees data loaded successfully');

        } catch (e) {
            console.log('Fees page: Using default content');
        }
    }

    // ====== UPDATE TUITION TABLE ======
    function updateTuitionTable(tableId, tuition, gradeKey, extraFees) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const tuitionData = tuition[gradeKey];
        if (!tuitionData) return;

        // Build rows dynamically
        let rows = '';

        // Tuition row
        rows += `<tr><td>Tuition Fees</td><td>KSh ${tuitionData.term1.toLocaleString()}</td><td>KSh ${tuitionData.term2.toLocaleString()}</td><td>KSh ${tuitionData.term3.toLocaleString()}</td></tr>`;

        // Extra fees
        if (extraFees) {
            const feeLabels = {
                'assessment': 'Assessment',
                'activity': 'Activity',
                'diary': 'Diary',
                'pta': 'PTA',
                'assessment_book': 'Assessment Book',
                'digital_literacy': 'Digital Literacy & French'
            };

            for (const [key, value] of Object.entries(extraFees)) {
                const label = feeLabels[key] || key;
                const term2 = (key === 'diary' || key === 'pta' || key === 'assessment_book') ? '-' : value;
                const term3 = (key === 'activity') ? '-' : (key === 'diary' || key === 'pta' || key === 'assessment_book') ? '-' : value;
                rows += `<tr><td>${label}</td><td>KSh ${value.toLocaleString()}</td><td>${term2 !== '-' ? 'KSh ' + term2.toLocaleString() : '-'}</td><td>${term3 !== '-' ? 'KSh ' + term3.toLocaleString() : '-'}</td></tr>`;
            }
        }

        // Total row
        const totals = {
            'playgroup': { term1: 8800, term2: 7900, term3: 7700 },
            'grade1_3': { term1: 8800, term2: 7900, term3: 7700 },
            'grade4_5': { term1: 11400, term2: 10500, term3: 10300 },
            'grade6': { term1: 11400, term2: 10500, term3: 10300 },
            'grade7_8': { term1: 16400, term2: 15400, term3: 15100 },
            'grade9': { term1: 16400, term2: 15400, term3: 15100 }
        };

        const total = totals[gradeKey];
        if (total) {
            rows += `<tr style="background: var(--gray-light); font-weight: bold;"><td>TOTAL</td><td>KSh ${total.term1.toLocaleString()}</td><td>KSh ${total.term2.toLocaleString()}</td><td>KSh ${total.term3.toLocaleString()}</td></tr>`;
        }

        tbody.innerHTML = rows;
    }

    // ====== UPDATE GRADE NOTES ======
    function updateGradeNotes(data) {
        if (data.grade6_note) {
            const note = document.querySelector('#fees-table-g4-g6 + p');
            if (note) note.textContent = `* ${data.grade6_note}`;
        }
        if (data.grade9_note) {
            const note = document.querySelector('#fees-table-g7-g9 + p');
            if (note) note.textContent = `* ${data.grade9_note}`;
        }
    }

    // ====== UPDATE ANNUAL SUMMARY ======
    function updateAnnualSummary(annualSummary) {
        const table = document.getElementById('fees-annual-summary');
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const mapping = {
            'playgroup_grade3': 'Playgroup - Grade 3',
            'grade4_5': 'Grade 4 - Grade 5',
            'grade6': 'Grade 6',
            'grade7_8': 'Grade 7 - Grade 8',
            'grade9': 'Grade 9'
        };

        let rows = '';
        for (const [key, value] of Object.entries(annualSummary)) {
            const label = mapping[key] || key;
            rows += `<tr><td>${label}</td><td>KSh ${value.toLocaleString()}</td></tr>`;
        }

        tbody.innerHTML = rows;
    }

    // ====== UPDATE OPTIONAL SERVICES ======
    function updateOptionalServices(services) {
        // Meals
        if (services.meals) {
            const mealsCard = document.querySelector('.card:first-child .card-content p:first-child strong');
            if (mealsCard) mealsCard.textContent = `KSh ${services.meals.toLocaleString()} per term`;
            const mealsDesc = document.querySelector('.card:first-child .card-content p:last-child');
            if (mealsDesc && services.meals_description) mealsDesc.textContent = services.meals_description;
        }

        // Transport
        if (services.transport) {
            const transportTable = document.getElementById('fees-transport-table');
            if (transportTable) {
                const tbody = transportTable.querySelector('tbody') || transportTable;
                let rows = '';
                const routeNames = {
                    'imara_daima': 'Imara Daima',
                    'pipeline': 'Pipeline',
                    'aa_kobil': 'AA & KOBIL',
                    'kwanjenga': 'Kwanjenga'
                };
                for (const [key, value] of Object.entries(services.transport)) {
                    const label = routeNames[key] || key;
                    rows += `<tr><td>${label}</td><td>KSh ${value.toLocaleString()}</td></tr>`;
                }
                if (tbody.tagName === 'TBODY') {
                    tbody.innerHTML = rows;
                } else {
                    // If it's not a table, just update the content
                    transportTable.innerHTML = `<tr><th>Route</th><th>Fee/Term</th></tr>${rows}`;
                }
            }
        }
    }

    // ====== UPDATE ADMISSION FEE ======
    function updateAdmissionFee(admissionFee) {
        if (!admissionFee) return;

        const card = document.querySelector('.card:last-child .card-content');
        if (!card) return;

        let html = `<h3>💰 Admission Fee</h3>`;
        if (admissionFee.playgroup_grade6) {
            html += `<p><strong>KSh ${admissionFee.playgroup_grade6.toLocaleString()} (once)</strong></p>`;
            html += `<p>${admissionFee.playgroup_grade6_label || 'For Playgroup - Grade 6'}</p>`;
        }
        if (admissionFee.grade7_9) {
            html += `<p><strong>KSh ${admissionFee.grade7_9.toLocaleString()} (once)</strong></p>`;
            html += `<p>${admissionFee.grade7_9_label || 'For Grade 7 - Grade 9 (Junior Secondary)'}</p>`;
        }
        card.innerHTML = html;
    }

    // ====== UPDATE NEW ADMISSION EXAMPLE ======
    function updateNewAdmissionExample(example) {
        const table = document.getElementById('fees-admission-example');
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const grade1 = example.grade1;
        const grade7 = example.grade7;

        if (grade1 && grade7) {
            tbody.innerHTML = `
                <tr><td>Term 1 Fees</td><td>KSh ${grade1.term1_fees.toLocaleString()}</td><td>KSh ${grade7.term1_fees.toLocaleString()}</td></tr>
                <tr><td>Admission Fee</td><td>KSh ${grade1.admission_fee.toLocaleString()}</td><td>KSh ${grade7.admission_fee.toLocaleString()}</td></tr>
                <tr><td>Uniform (Approx.)</td><td>${grade1.uniform || 'Contact School'}</td><td>${grade7.uniform || 'Contact School'}</td></tr>
                <tr><td>Meals (Optional)</td><td>KSh ${grade1.meals.toLocaleString()}</td><td>KSh ${grade7.meals.toLocaleString()}</td></tr>
                <tr style="background: var(--gray-light); font-weight: bold;"><td>Estimated Total</td><td>KSh ${grade1.total.toLocaleString()}+</td><td>KSh ${grade7.total.toLocaleString()}+</td></tr>
            `;
        }
    }

    // ====== UPDATE PAYMENT METHODS ======
    function updatePaymentMethods(paymentMethods) {
        if (!paymentMethods) return;

        const methods = document.querySelectorAll('.payment-method');
        if (methods.length < 3) return;

        // Bank
        if (paymentMethods.bank) {
            const bank = methods[0];
            bank.innerHTML = `
                <h3>🏦 Bank Deposit</h3>
                <p><strong>${paymentMethods.bank.name}</strong></p>
                <p>${paymentMethods.bank.branch}</p>
                <p><strong>A/C Name:</strong> ${paymentMethods.bank.account_name}</p>
                <p><strong>A/C Number:</strong> ${paymentMethods.bank.account_number}</p>
            `;
        }

        // Mpesa
        if (paymentMethods.mpesa) {
            const mpesa = methods[1];
            mpesa.innerHTML = `
                <h3>📱 Lipa Na Mpesa</h3>
                <p><strong>Paybill Number:</strong> ${paymentMethods.mpesa.paybill}</p>
                <p><strong>Account Number:</strong></p>
                <p><code>${paymentMethods.mpesa.account_format}</code></p>
                <p style="font-size: 12px; margin-top: 10px;">Example: ${paymentMethods.mpesa.example || '82747K-JOHNDOE-G4'}</p>
            `;
        }

        // Note
        if (paymentMethods.note) {
            const important = methods[2];
            important.innerHTML = `
                <h3>⚠️ Important</h3>
                <p style="color: var(--maroon); font-weight: bold;">❌ ${paymentMethods.note}</p>
                <p>${paymentMethods.receipt_note || 'Keep your payment receipt for reference'}</p>
            `;
        }
    }

    // ====== UPDATE PAYMENT SCHEDULE ======
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

    // ====== UPDATE FAQS ======
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

    // ====== UPDATE IMPORTANT NOTES ======
    function updateImportantNotes(notes) {
        const container = document.getElementById('fees-notes');
        if (!container || !notes) return;

        const ul = container.querySelector('ul');
        if (!ul) return;

        ul.innerHTML = notes.map(note => `<li>${note}</li>`).join('');
    }

    // ====== UPDATE LAST UPDATED ======
    function updateLastUpdated(lastUpdated) {
        const el = document.getElementById('fees-last-updated');
        if (el && lastUpdated) {
            el.textContent = `Last Updated: ${lastUpdated} | For questions, call 0720 994 337`;
        }
    }

    // ====== UPDATE DOWNLOAD LINK ======
    function updateDownloadLink(downloadLink) {
        const link = document.querySelector('a[download]');
        if (link && downloadLink) {
            link.href = downloadLink;
        }
    }

    // ====== SETUP FEE CALCULATOR ======
    function setupFeeCalculator(feesData) {
        const calculateBtn = document.getElementById('calculate-fees');
        if (!calculateBtn) return;

        calculateBtn.addEventListener('click', function() {
            const grade = document.getElementById('grade-select')?.value;
            const meals = document.getElementById('meals-option')?.checked;
            const transport = document.getElementById('transport-select')?.value;

            // Tuition fees from data
            const tuitionFees = {
                'playgroup': feesData.tuition?.playgroup?.term1 || 6500,
                'pp1': feesData.tuition?.pp1?.term1 || 7000,
                'pp2': feesData.tuition?.pp2?.term1 || 7500,
                'grade1-3': feesData.tuition?.grade1_3?.term1 || 7800,
                'grade4-5': feesData.tuition?.grade4_5?.term1 || 8100,
                'grade6': feesData.tuition?.grade6?.term1 || 8100,
                'grade7-8': feesData.tuition?.grade7_8?.term1 || 9500,
                'grade9': feesData.tuition?.grade9?.term1 || 9500
            };

            // Extra fees
            const extraFees = {
                'playgroup': 1400, 'pp1': 1400, 'pp2': 1400,
                'grade1-3': 1400, 'grade4-5': 2000, 'grade6': 2000,
                'grade7-8': 2200, 'grade9': 2200
            };

            let total = 0;
            if (grade && tuitionFees[grade]) {
                total = tuitionFees[grade] + extraFees[grade];
            }

            if (meals && feesData.optional_services?.meals) {
                total += feesData.optional_services.meals;
            }
            if (transport !== 'none' && feesData.optional_services?.transport) {
                const transportKey = {
                    'imara': 'imara_daima',
                    'aakobil': 'aa_kobil',
                    'pipeline': 'pipeline',
                    'kwanjenga': 'kwanjenga'
                };
                const key = transportKey[transport];
                if (key && feesData.optional_services.transport[key]) {
                    total += feesData.optional_services.transport[key];
                }
            }

            const resultDiv = document.getElementById('fee-result');
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `<strong>Total Fees: KSh ${total.toLocaleString()}</strong><br><span style="font-size: 14px;">Includes tuition, assessment, activity, and other mandatory fees.</span>`;
            }
        });
    }

    // ========== INITIALIZE ==========
    loadFeesData();
});
