/********************************************
 * Updated Coefficients from Final DCE
 ********************************************/
const finalCoefficients = {
    // Main model (Table 3)
    main: {
        ASC_mean: -0.112,
        ASC_sd: 1.161,
        ASC_optout: 0.131,
        type_comm: 0.527,       // Community engagement
        type_psych: 0.156,      // Psychological counselling
        type_vr: -0.349,        // Virtual reality
        mode_virtual: -0.426,   // Virtual
        mode_hybrid: -0.289,    // Hybrid
        freq_weekly: 0.617,     // Weekly
        freq_monthly: 0.336,    // Monthly
        dur_2hrs: 0.185,        // 2-hour
        dur_4hrs: 0.213,        // 4-hour
        dist_local: 0.059,      // Local area accessibility
        dist_signif: -0.509,    // Wider community accessibility
        cost_cont: -0.036       // Cost per session
    },
    // By loneliness category (Table 5)
    notLonely: {
        ASC_mean: -0.149,
        ASC_sd: 1.332,
        ASC_optout: 0.151,
        type_comm: 0.369,
        type_psych: -0.019,
        type_vr: -0.375,
        mode_virtual: -0.604,
        mode_hybrid: -0.289,
        freq_weekly: 0.759,
        freq_monthly: 0.540,
        dur_2hrs: 0.031,
        dur_4hrs: 0.243,
        dist_local: -0.041,
        dist_signif: -0.814,
        cost_cont: -0.034
    },
    moderatelyLonely: {
        ASC_mean: -0.145,
        ASC_sd: 1.191,
        ASC_optout: 0.074,
        type_comm: 0.532,
        type_psych: 0.178,
        type_vr: -0.204,
        mode_virtual: -0.320,
        mode_hybrid: -0.402,
        freq_weekly: 0.555,
        freq_monthly: 0.357,
        dur_2hrs: 0.322,
        dur_4hrs: 0.266,
        dist_local: 0.082,
        dist_signif: -0.467,
        cost_cont: -0.042
    },
    severelyLonely: {
        ASC_mean: -0.028,
        ASC_sd: 0.887,
        ASC_optout: 0.160,
        type_comm: 0.734,
        type_psych: 0.317,
        type_vr: -0.567,
        mode_virtual: -0.353,
        mode_hybrid: -0.151,
        freq_weekly: 0.540,
        freq_monthly: 0.042,
        dur_2hrs: 0.157,
        dur_4hrs: 0.060,
        dist_local: 0.211,
        dist_signif: -0.185,
        cost_cont: -0.033
    }
};

/******************************************************
 * Cost Data: same as original or adjusted as needed
 ******************************************************/
const costData = {
    /* (Unchanged from your original code, or update as needed) */
};

/********************************************
 * Benefit Parameters & Cost-of-Living
 ********************************************/
const benefitPerPercent = 10000; // WTP (AUD) per 1% uptake
const costOfLivingMultipliers = {
    // (Unchanged if desired)
    NSW: 1.10,
    VIC: 1.05,
    QLD: 1.00,
    WA: 1.08,
    SA: 1.02,
    TAS: 1.03,
    ACT: 1.15,
    NT: 1.07
};

/********************************************
 * Global Chart Instances
 ********************************************/
let probabilityChart; 
let cbaChart;
let chartNotLonely;
let chartModeratelyLonely;
let chartSeverelyLonely;

/********************************************
 * On Page Load, Initialise Charts
 ********************************************/
window.onload = function () {
    // Probability chart for main results
    let ctx = document.getElementById('probabilityChart').getContext('2d');
    probabilityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Uptake Probability', 'Remaining'],
            datasets: [{
                data: [0, 1],
                backgroundColor: ['rgba(39, 174, 96, 0.6)', 'rgba(236, 240, 241, 0.3)'],
                borderColor: ['rgba(39, 174, 96, 1)', 'rgba(236, 240, 241, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: 'Predicted Probability of Programme Uptake',
                    font: { size: 18 },
                    color: '#2c3e50'
                }
            }
        }
    });

    // CBA Chart
    let cbaCtx = document.getElementById('cbaChart').getContext('2d');
    cbaChart = new Chart(cbaCtx, {
        type: 'bar',
        data: {
            labels: ['Total Costs', 'Total Benefits'],
            datasets: [{
                label: 'Amount (AUD)',
                data: [0, 0],
                backgroundColor: [
                    'rgba(231, 76, 60, 0.6)',
                    'rgba(39, 174, 96, 0.6)'
                ],
                borderColor: [
                    'rgba(231, 76, 60, 1)',
                    'rgba(39, 174, 96, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Cost-Benefit Analysis',
                    font: { size: 18 },
                    color: '#2c3e50'
                }
            }
        }
    });

    // Initialise the three new Doughnut charts for loneliness categories
    chartNotLonely = new Chart(document.getElementById('probabilityChartNotLonely'), {...doughnutChartConfig('Not Lonely Uptake Probability')});
    chartModeratelyLonely = new Chart(document.getElementById('probabilityChartModeratelyLonely'), {...doughnutChartConfig('Moderately Lonely Uptake Probability')});
    chartSeverelyLonely = new Chart(document.getElementById('probabilityChartSeverelyLonely'), {...doughnutChartConfig('Severely Lonely Uptake Probability')});
};

/********************************************
 * Reusable function for Doughnut chart config
 ********************************************/
function doughnutChartConfig(titleText) {
    return {
        type: 'doughnut',
        data: {
            labels: ['Uptake Probability', 'Remaining'],
            datasets: [{
                data: [0, 1],
                backgroundColor: ['rgba(39, 174, 96, 0.6)', 'rgba(236, 240, 241, 0.3)'],
                borderColor: ['rgba(39, 174, 96, 1)', 'rgba(236, 240, 241, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: titleText,
                    font: { size: 16 },
                    color: '#2c3e50'
                }
            }
        }
    };
}

/********************************************
 * Calculate Probability (Main)
 ********************************************/
function calculateProbability() {
    const state = document.getElementById('state_select').value;
    const adjustCosts = document.getElementById('adjust_costs').value;
    // (Get other form data as before)
    const cost_cont = parseFloat(document.getElementById('cost_cont').value);
    const dist_signif = parseFloat(document.getElementById('dist_signif').value);
    const dist_local = parseFloat(document.getElementById('dist_local').value);
    const freq_monthly = parseFloat(document.getElementById('freq_monthly').value);
    const freq_weekly = parseFloat(document.getElementById('freq_weekly').value);
    const mode_virtual = parseFloat(document.getElementById('mode_virtual').value);
    const mode_hybrid = parseFloat(document.getElementById('mode_hybrid').value);
    const dur_2hrs = parseFloat(document.getElementById('dur_2hrs').value);
    const dur_4hrs = parseFloat(document.getElementById('dur_4hrs').value);
    const type_comm = parseFloat(document.getElementById('type_comm').value);
    const type_psych = parseFloat(document.getElementById('type_psych').value);
    const type_vr = parseFloat(document.getElementById('type_vr').value);
    
    // (Validate form selections if needed)

    // Adjust cost if needed
    let adjustedCost = cost_cont;
    if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
        adjustedCost = cost_cont * costOfLivingMultipliers[state];
    }

    // Main model predicted probability
    const pMain = computeLogit(finalCoefficients.main, adjustedCost, dist_signif, dist_local, freq_monthly, freq_weekly, mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs, type_comm, type_psych, type_vr);
    document.getElementById('probability').innerText = (pMain * 100).toFixed(2) + '%';
    updateDoughnutChart(probabilityChart, pMain);

    // Interpretations
    document.getElementById('interpretations').innerHTML = generateInterpretations(pMain);

    // Display package info, costs, benefits, etc.
    const packageList = document.getElementById('packageList');
    packageList.innerHTML = generateProgramPackage();
    handleDownloadButtons(packageList);

    // Calculate cost & benefits, update displays
    const costResults = calculateTotalCost(state, adjustCosts);
    displayCosts(costResults);
    const benefits = calculateBenefits(pMain);
    displayBenefits(benefits);
    displayCBA(costResults.grandTotal, benefits);
    updateCBACChart(costResults.grandTotal, benefits);

    // Now compute & update for each loneliness category
    const pNotLonely = computeLogit(finalCoefficients.notLonely, adjustedCost, dist_signif, dist_local, freq_monthly, freq_weekly, mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs, type_comm, type_psych, type_vr);
    updateDoughnutChart(chartNotLonely, pNotLonely);

    const pModLonely = computeLogit(finalCoefficients.moderatelyLonely, adjustedCost, dist_signif, dist_local, freq_monthly, freq_weekly, mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs, type_comm, type_psych, type_vr);
    updateDoughnutChart(chartModeratelyLonely, pModLonely);

    const pSevLonely = computeLogit(finalCoefficients.severelyLonely, adjustedCost, dist_signif, dist_local, freq_monthly, freq_weekly, mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs, type_comm, type_psych, type_vr);
    updateDoughnutChart(chartSeverelyLonely, pSevLonely);
}

/********************************************
 * Compute Logit Function
 ********************************************/
function computeLogit(coef, cost_cont, dist_signif, dist_local, freq_monthly, freq_weekly, mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs, type_comm, type_psych, type_vr) {
    // Utility for 'chosen alternative' vs. opt-out
    let U_alt = coef.ASC_mean
               + coef.type_comm * type_comm
               + coef.type_psych * type_psych
               + coef.type_vr * type_vr
               + coef.mode_virtual * mode_virtual
               + coef.mode_hybrid * mode_hybrid
               + coef.freq_weekly * freq_weekly
               + coef.freq_monthly * freq_monthly
               + coef.dur_2hrs * dur_2hrs
               + coef.dur_4hrs * dur_4hrs
               + coef.dist_local * dist_local
               + coef.dist_signif * dist_signif
               + coef.cost_cont * cost_cont;

    let U_optout = coef.ASC_optout;
    let exp_alt = Math.exp(U_alt);
    let exp_optout = Math.exp(U_optout);

    return exp_alt / (exp_alt + exp_optout);
}

/********************************************
 * Update Doughnut Chart
 ********************************************/
function updateDoughnutChart(chartInstance, probability) {
    const p = Math.min(Math.max(probability, 0), 1);
    chartInstance.data.datasets[0].data = [p, 1 - p];

    if (p < 0.3) {
        chartInstance.data.datasets[0].backgroundColor = ['rgba(231, 76, 60, 0.6)', 'rgba(236, 240, 241, 0.3)'];
        chartInstance.data.datasets[0].borderColor = ['rgba(231, 76, 60, 1)', 'rgba(236, 240, 241, 1)'];
    } else if (p < 0.7) {
        chartInstance.data.datasets[0].backgroundColor = ['rgba(241, 196, 15, 0.6)', 'rgba(236, 240, 241, 0.3)'];
        chartInstance.data.datasets[0].borderColor = ['rgba(241, 196, 15, 1)', 'rgba(236, 240, 241, 1)'];
    } else {
        chartInstance.data.datasets[0].backgroundColor = ['rgba(39, 174, 96, 0.6)', 'rgba(236, 240, 241, 0.3)'];
        chartInstance.data.datasets[0].borderColor = ['rgba(39, 174, 96, 1)', 'rgba(236, 240, 241, 1)'];
    }

    chartInstance.update();
}

/********************************************
 * Generate Interpretations
 ********************************************/
function generateInterpretations(probability) {
    let msg = '';
    if (probability < 0.3) {
        msg = '<p>This configuration indicates a low probability of uptake (&lt;30%). You may wish to adjust certain attributes to make the programme more appealing to older adults.</p>';
    } else if (probability < 0.7) {
        msg = '<p>This configuration shows a moderate probability of uptake (30%–70%). Some features appear attractive, but there is scope for improvement.</p>';
    } else {
        msg = '<p>This configuration yields a high probability of uptake (&gt;70%). Older adults are likely to find these programme features appealing.</p>';
    }
    return msg + `<p><em>Loneliness categories used here are based on the De Jong Gierveld Loneliness Scale [de Jong Gierveld & Kamphuis, 1985].</em></p>`;
}

/********************************************
 * Generate Program Package
 ********************************************/
function generateProgramPackage() {
    // (Same logic as before)
    const packageList = [];
    const form = document.getElementById('decisionForm');
    const selects = form.getElementsByTagName('select');
    for (let select of selects) {
        if (select.id === 'state_select' || select.id === 'adjust_costs') {
            continue;
        }
        if (select.value === "1") {
            let label = select.previousElementSibling.innerText;
            label = label.replace(':', '').trim();
            const value = select.options[select.selectedIndex].innerText;
            packageList.push(`${label}: ${value}`);
        }
    }
    return packageList.map(item => `<li>${item}</li>`).join('');
}

/********************************************
 * Handle Download Buttons
 ********************************************/
function handleDownloadButtons(packageList) {
    const downloadPackageBtn = document.getElementById('downloadPackageBtn');
    const downloadChartBtn = document.getElementById('downloadChartBtn');
    if (packageList.children.length > 0) {
        downloadPackageBtn.style.display = 'inline-block';
        downloadChartBtn.style.display = 'inline-block';
    } else {
        downloadPackageBtn.style.display = 'none';
        downloadChartBtn.style.display = 'none';
    }
}

/********************************************
 * Calculate Total Cost
 ********************************************/
function calculateTotalCost(state, adjustCosts) {
    // (Same approach as before, using costData)
    // Return { totalCost, grandTotal }
    // ...
    // For brevity, re-use your prior logic
    const selectedAttributes = getSelectedAttributes();
    let totalCost = {
        personnel: 0,
        materials: 0,
        technology: 0,
        facility: 0,
        marketing: 0,
        training: 0,
        miscellaneous: 0
    };
    selectedAttributes.forEach(attr => {
        const costs = costData[attr] || {};
        for (let key in totalCost) {
            if (costs[key]) {
                totalCost[key] += costs[key];
            }
        }
    });

    let grandTotal = Object.values(totalCost).reduce((a, b) => a + b, 0);
    if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
        grandTotal *= costOfLivingMultipliers[state];
    }
    return { totalCost, grandTotal };
}

function getSelectedAttributes() {
    const form = document.getElementById('decisionForm');
    const selects = form.getElementsByTagName('select');
    const attributes = [];
    for (let select of selects) {
        if (select.id === 'state_select' || select.id === 'adjust_costs') continue;
        if (select.value === "1") attributes.push(select.id);
    }
    return attributes;
}

/********************************************
 * Calculate Benefits
 ********************************************/
function calculateBenefits(probability) {
    return probability * 100 * benefitPerPercent;
}

/********************************************
 * Display Costs & Benefits
 ********************************************/
function displayCosts(costResults) {
    const { totalCost, grandTotal } = costResults;
    const costList = document.getElementById('costList');
    const totalCostDisplay = document.getElementById('totalCost');
    costList.innerHTML = '';
    for (let key in totalCost) {
        if (totalCost[key] > 0) {
            const li = document.createElement('li');
            li.innerText = `${capitalise(key)}: $${totalCost[key].toLocaleString()}`;
            costList.appendChild(li);
        }
    }
    totalCostDisplay.innerText = grandTotal.toLocaleString();
}

function displayBenefits(benefits) {
    document.getElementById('totalBenefits').innerText = benefits.toLocaleString();
}

/********************************************
 * Display CBA
 ********************************************/
function displayCBA(totalCost, benefits) {
    const netBenefit = benefits - totalCost;
    const bcr = (totalCost === 0) ? 0 : (benefits / totalCost);
    document.getElementById('netBenefit').innerText = netBenefit.toLocaleString();
    document.getElementById('bcr').innerText = bcr.toFixed(2);
}

/********************************************
 * Update CBA Chart
 ********************************************/
function updateCBACChart(totalCost, benefits) {
    cbaChart.data.datasets[0].data = [totalCost, benefits];
    cbaChart.update();
}

/********************************************
 * Capitalise First Letter
 ********************************************/
function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/********************************************
 * Download Package
 ********************************************/
function downloadPackage() {
    const packageList = document.getElementById('packageList');
    if (packageList.children.length === 0) {
        alert("No programme package selected to download.");
        return;
    }
    let text = 'Selected Programme Package:\n';
    for (let li of packageList.children) {
        text += li.innerText + '\n';
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Programme_Package.txt';
    a.click();
    URL.revokeObjectURL(url);
    alert("Programme Package downloaded successfully!");
}

/********************************************
 * Download Probability Chart
 ********************************************/
function downloadChart() {
    const canvas = document.getElementById('probabilityChart');
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'Uptake_Probability_Chart.png';
    link.click();
    alert("Uptake Probability chart downloaded successfully!");
}

/********************************************
 * Download CBA Report (Advanced PDF)
 ********************************************/
function downloadCBAPDF() {
    const state = document.getElementById('state_select').value;
    const adjustCosts = document.getElementById('adjust_costs').value;
    const { grandTotal } = calculateTotalCost(state, adjustCosts);
    const pText = document.getElementById('probability').innerText;
    const pMain = parseFloat(pText.replace('%', '')) / 100;
    const benefits = calculateBenefits(pMain);
    const netBenefit = benefits - grandTotal;
    const bcr = (grandTotal === 0) ? 0 : (benefits / grandTotal);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("LonelyLessAustralia – Cost-Benefit Analysis Report", 10, 20);

    // Basic info
    doc.setFontSize(12);
    doc.text(`State selected: ${state || 'N/A'}`, 10, 30);
    doc.text(`Adjust Costs: ${adjustCosts === 'yes' ? 'Yes' : 'No'}`, 10, 40);

    // CBA data
    doc.text(`Predicted Uptake Probability: ${(pMain * 100).toFixed(2)}%`, 10, 50);
    doc.text(`Total Estimated Cost: $${grandTotal.toLocaleString()} AUD`, 10, 60);
    doc.text(`Total Estimated Benefits: $${benefits.toLocaleString()} AUD`, 10, 70);
    doc.text(`Net Benefit: $${netBenefit.toLocaleString()} AUD`, 10, 80);
    doc.text(`Benefit-Cost Ratio: ${bcr.toFixed(2)}`, 10, 90);

    // (Optional) Add chart images
    // For brevity, just mention code snippet:
    // let chartImg = probabilityChart.toBase64Image();
    // doc.addImage(chartImg, 'PNG', 10, 100, 80, 80);

    // Final
    doc.save('CBA_Report.pdf');
    alert("Cost-Benefit Analysis report downloaded successfully!");
}

/********************************************
 * Feedback Form Submission
 ********************************************/
document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const feedback = document.getElementById('feedback').value.trim();
    if (feedback) {
        alert("Thank you for your feedback!");
        document.getElementById('feedbackForm').reset();
    } else {
        alert("Please enter your feedback before submitting.");
    }
});
