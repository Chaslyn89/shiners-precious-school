// ========== FEES PAGE - Loads fees.json and handles calculator ==========

document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD FEES DATA ==========
    async function loadFeesData() {
        try {
            const response = await fetch('data/fees.json');
            if (!response.ok) return;
            
            const data = await response.json();

            // Update transport table
            if (data.transport) {
                const transportTable = document.getElementById('fees-transport-table');
                if (transportTable) {
                    // Update transport options in calculator too
                    const transportSelect = document.getElementById('transport-select');
                    if (transportSelect) {
                        // Keep the "None" option
                        const noneOption = transportSelect.querySelector('option[value="none"]');
                        transportSelect.innerHTML = '';
                        if (noneOption) transportSelect.appendChild(noneOption);
                        
                        // Add transport options from JSON
                        for (const [key, value] of Object.entries(data.transport)) {
                            const option = document.createElement('option');
                            option.value = key;
                            const routeNames = {
                                'imara': 'Imara Daima',
                                'aakobil': 'AA & KOBIL',
                                'pipeline': 'Pipeline',
                                'kwanjenga': 'Kwanjenga'
                            };
                            option.textContent = `${routeNames[key] || key} - KSh ${value.toLocaleString()}`;
                            transportSelect.appendChild(option);
                        }
                    }
                }
            }

            // Update meal fee in calculator
            if (data.meals) {
                const mealsLabel = document.querySelector('#meals-option')?.parentElement;
                if (mealsLabel) {
                    mealsLabel.innerHTML = `<input type="checkbox" id="meals-option"> Add Meals (KSh ${data.meals.toLocaleString()}/term)`;
                }
            }

            console.log('Fees data loaded successfully');

        } catch (e) {
            console.log('Fees page: Using default content');
        }
    }

    // ========== FEE CALCULATOR ==========
    function setupFeeCalculator() {
        const calculateBtn = document.getElementById('calculate-fees');
        if (!calculateBtn) return;

        calculateBtn.addEventListener('click', function() {
            const grade = document.getElementById('grade-select')?.value;
            const meals = document.getElementById('meals-option')?.checked;
            const transport = document.getElementById('transport-select')?.value;
            
            // Fetch latest fees
            fetch('data/fees.json')
                .then(response => response.json())
                .then(feesData => {
                    // Tuition fees mapping
                    const tuitionFees = {
                        'playgroup': feesData.playgroup || 6500,
                        'pp1': feesData.pp1 || 7000,
                        'pp2': feesData.pp2 || 7500,
                        'grade1-3': feesData['grade1-3'] || 7800,
                        'grade4-5': feesData['grade4-6'] || 8100,
                        'grade6': feesData['grade4-6'] || 8100,
                        'grade7-8': feesData['grade7-9'] || 9500,
                        'grade9': feesData['grade7-9'] || 9500
                    };
                    
                    const extraFees = {
                        'playgroup': 1400, 'pp1': 1400, 'pp2': 1400,
                        'grade1-3': 1400, 'grade4-5': 2000, 'grade6': 2000,
                        'grade7-8': 2200, 'grade9': 2200
                    };
                    
                    let total = 0;
                    if (grade && tuitionFees[grade]) {
                        total = tuitionFees[grade] + extraFees[grade];
                    }
                    
                    if (meals && feesData.meals) total += feesData.meals;
                    if (transport !== 'none' && feesData.transport && feesData.transport[transport]) {
                        total += feesData.transport[transport];
                    }
                    
                    const resultDiv = document.getElementById('fee-result');
                    if (resultDiv) {
                        resultDiv.style.display = 'block';
                        resultDiv.innerHTML = `<strong>Total Fees: KSh ${total.toLocaleString()}</strong><br><span style="font-size: 14px;">Includes tuition, assessment, activity, and other mandatory fees.</span>`;
                    }
                })
                .catch(() => {
                    // Fallback if fees.json fails to load
                    const tuitionFees = {
                        'playgroup': 6500, 'pp1': 7000, 'pp2': 7500,
                        'grade1-3': 7800, 'grade4-5': 8100, 'grade6': 8100,
                        'grade7-8': 9500, 'grade9': 9500
                    };
                    
                    const extraFees = {
                        'playgroup': 1400, 'pp1': 1400, 'pp2': 1400,
                        'grade1-3': 1400, 'grade4-5': 2000, 'grade6': 2000,
                        'grade7-8': 2200, 'grade9': 2200
                    };
                    
                    const transportFees = {
                        'imara': 7000, 'aakobil': 6000, 'pipeline': 6000, 'kwanjenga': 6000
                    };
                    
                    let total = 0;
                    if (grade && tuitionFees[grade]) {
                        total = tuitionFees[grade] + extraFees[grade];
                    }
                    
                    if (meals) total += 3900;
                    if (transport !== 'none' && transportFees[transport]) total += transportFees[transport];
                    
                    const resultDiv = document.getElementById('fee-result');
                    if (resultDiv) {
                        resultDiv.style.display = 'block';
                        resultDiv.innerHTML = `<strong>Total Fees: KSh ${total.toLocaleString()}</strong><br><span style="font-size: 14px;">Includes tuition, assessment, activity, and other mandatory fees.</span>`;
                    }
                });
        });
    }

    // ========== INITIALIZE ==========
    loadFeesData();
    setupFeeCalculator();
});