/**************************************************************
 * Final DCE Results (Table 3) - Coefficients and Significance
 * p-values => significance used for table display (asterisks)
 **************************************************************/
const finalModel = [
  {
    attribute: "Community engagement",
    coef: 0.527,
    pValue: 0.000,
    significance: "***"
  },
  {
    attribute: "Psychological counselling",
    coef: 0.156,
    pValue: 0.245,
    significance: ""
  },
  {
    attribute: "Virtual reality",
    coef: -0.349,
    pValue: 0.009,
    significance: "**"
  },
  {
    attribute: "Virtual (method)",
    coef: -0.426,
    pValue: 0.019,
    significance: "**"
  },
  {
    attribute: "Hybrid (method)",
    coef: -0.289,
    pValue: 0.001,
    significance: "***"
  },
  {
    attribute: "Weekly frequency",
    coef: 0.617,
    pValue: 0.000,
    significance: "***"
  },
  {
    attribute: "Monthly frequency",
    coef: 0.336,
    pValue: 0.005,
    significance: "**"
  },
  {
    attribute: "2-hour duration",
    coef: 0.185,
    pValue: 0.059,
    significance: ""
  },
  {
    attribute: "4-hour duration",
    coef: 0.213,
    pValue: 0.037,
    significance: "*"
  },
  {
    attribute: "Local area (12 km)",
    coef: 0.059,
    pValue: 0.712,
    significance: ""
  },
  {
    attribute: "Wider community (50+ km)",
    coef: -0.509,
    pValue: 0.000,
    significance: "***"
  }
];

// Cost coefficient for main model
const costCoefMain = {
  attribute: "Cost per session",
  coef: -0.036,
  pValue: 0.000,
  significance: "***"
};

/**************************************************************
 * By Loneliness Category (Table 5) - Coefficients
 **************************************************************/
const notLonelyModel = [
  {
    attribute: "Community engagement",
    coef: 0.369,
    pValue: 0.064,
    significance: ""
  },
  {
    attribute: "Psychological counselling",
    coef: -0.019,
    pValue: 0.940,
    significance: ""
  },
  {
    attribute: "Virtual reality",
    coef: -0.375,
    pValue: 0.082,
    significance: ""
  },
  {
    attribute: "Virtual (method)",
    coef: -0.604,
    pValue: 0.067,
    significance: ""
  },
  {
    attribute: "Hybrid (method)",
    coef: -0.289,
    pValue: 0.066,
    significance: ""
  },
  {
    attribute: "Weekly frequency",
    coef: 0.759,
    pValue: 0.000,
    significance: "***"
  },
  {
    attribute: "Monthly frequency",
    coef: 0.540,
    pValue: 0.012,
    significance: "*"
  },
  {
    attribute: "2-hour duration",
    coef: 0.031,
    pValue: 0.854,
    significance: ""
  },
  {
    attribute: "4-hour duration",
    coef: 0.243,
    pValue: 0.164,
    significance: ""
  },
  {
    attribute: "Local area (12 km)",
    coef: -0.041,
    pValue: 0.887,
    significance: ""
  },
  {
    attribute: "Wider community (50+ km)",
    coef: -0.814,
    pValue: 0.002,
    significance: "**"
  }
];
const costCoefNotLonely = {
  attribute: "Cost per session",
  coef: -0.034,
  pValue: 0.000,
  significance: "***"
};

const moderatelyLonelyModel = [
  {
    attribute: "Community engagement",
    coef: 0.532,
    pValue: 0.008,
    significance: "**"
  },
  {
    attribute: "Psychological counselling",
    coef: 0.178,
    pValue: 0.406,
    significance: ""
  },
  {
    attribute: "Virtual reality",
    coef: -0.204,
    pValue: 0.352,
    significance: ""
  },
  {
    attribute: "Virtual (method)",
    coef: -0.320,
    pValue: 0.266,
    significance: ""
  },
  {
    attribute: "Hybrid (method)",
    coef: -0.402,
    pValue: 0.005,
    significance: "**"
  },
  {
    attribute: "Weekly frequency",
    coef: 0.555,
    pValue: 0.000,
    significance: "***"
  },
  {
    attribute: "Monthly frequency",
    coef: 0.357,
    pValue: 0.067,
    significance: ""
  },
  {
    attribute: "2-hour duration",
    coef: 0.322,
    pValue: 0.039,
    significance: "*"
  },
  {
    attribute: "4-hour duration",
    coef: 0.266,
    pValue: 0.131,
    significance: ""
  },
  {
    attribute: "Local area (12 km)",
    coef: 0.082,
    pValue: 0.750,
    significance: ""
  },
  {
    attribute: "Wider community (50+ km)",
    coef: -0.467,
    pValue: 0.043,
    significance: "*"
  }
];
const costCoefModLonely = {
  attribute: "Cost per session",
  coef: -0.042,
  pValue: 0.000,
  significance: "***"
};

const severelyLonelyModel = [
  {
    attribute: "Community engagement",
    coef: 0.734,
    pValue: 0.000,
    significance: "***"
  },
  {
    attribute: "Psychological counselling",
    coef: 0.317,
    pValue: 0.154,
    significance: ""
  },
  {
    attribute: "Virtual reality",
    coef: -0.567,
    pValue: 0.036,
    significance: "*"
  },
  {
    attribute: "Virtual (method)",
    coef: -0.353,
    pValue: 0.305,
    significance: ""
  },
  {
    attribute: "Hybrid (method)",
    coef: -0.151,
    pValue: 0.366,
    significance: ""
  },
  {
    attribute: "Weekly frequency",
    coef: 0.540,
    pValue: 0.000,
    significance: "***"
  },
  {
    attribute: "Monthly frequency",
    coef: 0.042,
    pValue: 0.847,
    significance: ""
  },
  {
    attribute: "2-hour duration",
    coef: 0.157,
    pValue: 0.391,
    significance: ""
  },
  {
    attribute: "4-hour duration",
    coef: 0.060,
    pValue: 0.745,
    significance: ""
  },
  {
    attribute: "Local area (12 km)",
    coef: 0.211,
    pValue: 0.467,
    significance: ""
  },
  {
    attribute: "Wider community (50+ km)",
    coef: -0.185,
    pValue: 0.495,
    significance: ""
  }
];
const costCoefSevLonely = {
  attribute: "Cost per session",
  coef: -0.033,
  pValue: 0.000,
  significance: "***"
};

/************************************************************
 * Combined objects to use in computing predicted probability
 ************************************************************/
const finalCoefficients = {
  main: {
    ASC_mean: -0.112,  // Not used directly in WTP table but used in utility
    ASC_sd: 1.161,     // For model random effect
    ASC_optout: 0.131,
    type_comm: 0.527,
    type_psych: 0.156,
    type_vr: -0.349,
    mode_virtual: -0.426,
    mode_hybrid: -0.289,
    freq_weekly: 0.617,
    freq_monthly: 0.336,
    dur_2hrs: 0.185,
    dur_4hrs: 0.213,
    dist_local: 0.059,
    dist_signif: -0.509,
    cost_cont: -0.036
  },
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

/************************************************
 * Cost Data (example data from original version)
 ************************************************/
const costData = {
  type_comm: {
    personnel: 20000,
    materials: 2000,
    technology: 3000,
    facility: 5000,
    marketing: 5000,
    training: 1000,
    miscellaneous: 1000
  },
  type_psych: {
    personnel: 25000,
    materials: 1500,
    technology: 2000,
    facility: 4000,
    marketing: 4000,
    training: 800,
    miscellaneous: 1200
  },
  type_vr: {
    personnel: 18000,
    materials: 1000,
    technology: 5000,
    facility: 3000,
    marketing: 3000,
    training: 700,
    miscellaneous: 800
  },
  mode_virtual: {
    personnel: 5000,
    materials: 500,
    technology: 4000,
    facility: 0,
    marketing: 1000,
    training: 300,
    miscellaneous: 500
  },
  mode_hybrid: {
    personnel: 7000,
    materials: 800,
    technology: 4500,
    facility: 2000,
    marketing: 1200,
    training: 400,
    miscellaneous: 600
  },
  freq_weekly: {
    personnel: 10000,
    materials: 1200,
    technology: 1500,
    facility: 3000,
    marketing: 1500,
    training: 500,
    miscellaneous: 700
  },
  freq_monthly: {
    personnel: 8000,
    materials: 1000,
    technology: 1200,
    facility: 2500,
    marketing: 1300,
    training: 400,
    miscellaneous: 600
  },
  dur_2hrs: {
    personnel: 3000,
    materials: 500,
    technology: 800,
    facility: 1000,
    marketing: 700,
    training: 200,
    miscellaneous: 300
  },
  dur_4hrs: {
    personnel: 4000,
    materials: 700,
    technology: 1000,
    facility: 1500,
    marketing: 900,
    training: 300,
    miscellaneous: 400
  },
  dist_local: {
    personnel: 5000,
    materials: 800,
    technology: 1000,
    facility: 2000,
    marketing: 1000,
    training: 300,
    miscellaneous: 500
  },
  dist_signif: {
    personnel: 6000,
    materials: 900,
    technology: 1100,
    facility: 2200,
    marketing: 1100,
    training: 350,
    miscellaneous: 550
  }
  // Add more if needed
};

/********************************************
 * Benefit Parameter
 ********************************************/
const benefitPerPercent = 10000; // $10,000 per 1% uptake

/********************************************
 * Cost-of-Living Multipliers
 ********************************************/
const costOfLivingMultipliers = {
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
 * Chart.js Instances
 ********************************************/
let probabilityChart;
let cbaChart;
let chartNotLonely;
let chartModeratelyLonely;
let chartSeverelyLonely;
let wtpChartMain;
let wtpChartNotLonely;
let wtpChartModLonely;
let wtpChartSevLonely;

/********************************************
 * On Page Load, initialise everything
 ********************************************/
window.onload = function () {
  // 1. Probability chart for main results
  createProbabilityChart();
  // 2. CBA chart
  createCBAChart();
  // 3. Probability charts for the three loneliness categories
  createCategoryCharts();
  // 4. Build WTP tables and charts
  populateWtpTables();
  createWtpCharts();

  // 5. Add event listener to feedback form
  document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fb = document.getElementById('feedback').value.trim();
    if (fb) {
      alert("Thank you for your feedback!");
      this.reset();
    } else {
      alert("Please enter your feedback before submitting.");
    }
  });
};

/********************************************
 * Create Probability Chart
 ********************************************/
function createProbabilityChart() {
  const ctx = document.createElement('canvas');
  ctx.id = 'probabilityChart';
  const resultDiv = document.getElementById('result');
  resultDiv.insertBefore(ctx, resultDiv.children[2]); // Insert just before interpretations
  
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
}

/********************************************
 * Create CBA Chart
 ********************************************/
function createCBAChart() {
  const cbaCtx = document.getElementById('cbaChart').getContext('2d');
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
}

/********************************************
 * Create Category Charts
 ********************************************/
function createCategoryCharts() {
  chartNotLonely = new Chart(
    document.getElementById('probabilityChartNotLonely'),
    doughnutChartConfig('Not Lonely Uptake Probability')
  );
  chartModeratelyLonely = new Chart(
    document.getElementById('probabilityChartModeratelyLonely'),
    doughnutChartConfig('Moderately Lonely Uptake Probability')
  );
  chartSeverelyLonely = new Chart(
    document.getElementById('probabilityChartSeverelyLonely'),
    doughnutChartConfig('Severely Lonely Uptake Probability')
  );
}

/********************************************
 * Generic Doughnut Chart Config
 ********************************************/
function doughnutChartConfig(title) {
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
          text: title,
          font: { size: 16 },
          color: '#2c3e50'
        }
      }
    }
  };
}

/********************************************
 * Populate WTP Tables
 ********************************************/
function populateWtpTables() {
  fillWtpTable(finalModel, costCoefMain, document.getElementById('wtpTableMain').querySelector('tbody'));
  fillWtpTable(notLonelyModel, costCoefNotLonely, document.getElementById('wtpTableNotLonely').querySelector('tbody'));
  fillWtpTable(moderatelyLonelyModel, costCoefModLonely, document.getElementById('wtpTableModLonely').querySelector('tbody'));
  fillWtpTable(severelyLonelyModel, costCoefSevLonely, document.getElementById('wtpTableSevLonely').querySelector('tbody'));
}

function fillWtpTable(modelArr, costObj, tableBody) {
  tableBody.innerHTML = '';
  // Add all attributes
  modelArr.forEach(item => {
    const wtp = computeWTP(item.coef, costObj.coef);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.attribute}</td>
      <td>${item.coef.toFixed(3)}</td>
      <td>${item.pValue.toFixed(3)}</td>
      <td>${item.significance}</td>
      <td>${wtp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    `;
    tableBody.appendChild(row);
  });

  // Add cost coefficient row itself (optional to display)
  const rowCost = document.createElement('tr');
  rowCost.innerHTML = `
    <td>${costObj.attribute}</td>
    <td>${costObj.coef.toFixed(3)}</td>
    <td>${costObj.pValue.toFixed(3)}</td>
    <td>${costObj.significance}</td>
    <td>Ref.</td>
  `;
  tableBody.appendChild(rowCost);
}

/********************************************
 * Create WTP Bar Charts
 ********************************************/
function createWtpCharts() {
  wtpChartMain = createWtpBarChart('wtpChartMain', finalModel, costCoefMain, "Main Model WTP (AUD)");
  wtpChartNotLonely = createWtpBarChart('wtpChartNotLonely', notLonelyModel, costCoefNotLonely, "Not Lonely WTP (AUD)");
  wtpChartModLonely = createWtpBarChart('wtpChartModLonely', moderatelyLonelyModel, costCoefModLonely, "Moderately Lonely WTP (AUD)");
  wtpChartSevLonely = createWtpBarChart('wtpChartSevLonely', severelyLonelyModel, costCoefSevLonely, "Severely Lonely WTP (AUD)");
}

function createWtpBarChart(chartId, modelArr, costObj, chartTitle) {
  const ctx = document.getElementById(chartId).getContext('2d');
  const labels = modelArr.map(m => m.attribute);
  const wtpData = modelArr.map(m => computeWTP(m.coef, costObj.coef));

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'WTP (AUD)',
        data: wtpData,
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: chartTitle,
          font: { size: 18 },
          color: '#2c3e50'
        }
      }
    }
  });
}

/********************************************
 * Compute WTP (attribute_coef / -cost_coef)
 ********************************************/
function computeWTP(attributeCoef, costCoef) {
  if (costCoef === 0) return 0;
  return attributeCoef / (-(costCoef));
}

/********************************************
 * Calculate Probability of Uptake
 ********************************************/
function calculateProbability() {
  const state = document.getElementById('state_select').value;
  const adjustCosts = document.getElementById('adjust_costs').value;
  const cost_cont = parseFloat(document.getElementById('cost_cont').value);
  const dist_local = parseFloat(document.getElementById('dist_local').value);
  const dist_signif = parseFloat(document.getElementById('dist_signif').value);
  const freq_weekly = parseFloat(document.getElementById('freq_weekly').value);
  const freq_monthly = parseFloat(document.getElementById('freq_monthly').value);
  const mode_virtual = parseFloat(document.getElementById('mode_virtual').value);
  const mode_hybrid = parseFloat(document.getElementById('mode_hybrid').value);
  const dur_2hrs = parseFloat(document.getElementById('dur_2hrs').value);
  const dur_4hrs = parseFloat(document.getElementById('dur_4hrs').value);
  const type_comm = parseFloat(document.getElementById('type_comm').value);
  const type_psych = parseFloat(document.getElementById('type_psych').value);
  const type_vr = parseFloat(document.getElementById('type_vr').value);

  // Validation checks:
  if (freq_weekly === 1 && freq_monthly === 1) {
    alert("You cannot select both Weekly and Monthly simultaneously.");
    return;
  }
  if (dur_2hrs === 1 && dur_4hrs === 1) {
    alert("You cannot select both 2-Hour and 4-Hour sessions simultaneously.");
    return;
  }
  if (dist_local === 1 && dist_signif === 1) {
    alert("You cannot select both Local Area and Wider Community simultaneously.");
    return;
  }
  if (adjustCosts === 'yes' && !state) {
    alert("Please select a state if you choose to adjust costs for living expenses.");
    return;
  }

  // Adjust cost with cost-of-living multiplier if needed
  let adjustedCost = cost_cont;
  if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
    adjustedCost = cost_cont * costOfLivingMultipliers[state];
  }

  // 1. Compute main probability
  const pMain = computeLogit(finalCoefficients.main, adjustedCost, dist_local, dist_signif, freq_weekly, freq_monthly, mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs, type_comm, type_psych, type_vr);
  document.getElementById('probability').innerText = (pMain * 100).toFixed(2) + '%';
  updateDoughnutChart(probabilityChart, pMain);

  // 2. Provide interpretation
  document.getElementById('interpretations').innerHTML = generateInterpretations(pMain);

  // 3. Programme package listing
  const packageListEl = document.getElementById('packageList');
  packageListEl.innerHTML = generateProgramPackage();
  toggleDownloadButtons(packageListEl);

  // 4. Calculate cost & benefit, update CBA
  const costResults = calculateTotalCost(state, adjustCosts);
  displayCosts(costResults);
  const benefits = calculateBenefits(pMain);
  displayBenefits(benefits);
  displayCBA(costResults.grandTotal, benefits);
  updateCBACChart(costResults.grandTotal, benefits);

  // 5. Compute & update category-based probabilities
  const pNotLonely = computeLogit(finalCoefficients.notLonely, adjustedCost, dist_local, dist_signif, freq_weekly, freq_monthly, mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs, type_comm, type_psych, type_vr);
  updateDoughnutChart(chartNotLonely, pNotLonely);

  const pModLonely = computeLogit(finalCoefficients.moderatelyLonely, adjustedCost, dist_local, dist_signif, freq_weekly, freq_monthly, mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs, type_comm, type_psych, type_vr);
  updateDoughnutChart(chartModeratelyLonely, pModLonely);

  const pSevLonely = computeLogit(finalCoefficients.severelyLonely, adjustedCost, dist_local, dist_signif, freq_weekly, freq_monthly, mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs, type_comm, type_psych, type_vr);
  updateDoughnutChart(chartSeverelyLonely, pSevLonely);
}

/********************************************
 * Compute Logit Utility -> Probability
 ********************************************/
function computeLogit(coef, cost_cont, dist_local, dist_signif, freq_weekly, freq_monthly,
                      mode_virtual, mode_hybrid, dur_2hrs, dur_4hrs,
                      type_comm, type_psych, type_vr) {
  const U_alt = coef.ASC_mean
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

  const U_optout = coef.ASC_optout;
  const exp_alt = Math.exp(U_alt);
  const exp_optout = Math.exp(U_optout);
  return exp_alt / (exp_alt + exp_optout);
}

/********************************************
 * Update Probability Doughnut Chart
 ********************************************/
function updateDoughnutChart(chartInstance, pVal) {
  const p = Math.min(Math.max(pVal, 0), 1);
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
  let msg = "";
  if (probability < 0.3) {
    msg = "<p>This configuration indicates a low probability of uptake (<30%). Consider adjusting attributes to enhance attractiveness.</p>";
  } else if (probability < 0.7) {
    msg = "<p>A moderate probability of uptake (30–70%). Some features are appealing, but there is room for improvement.</p>";
  } else {
    msg = "<p>A high probability of uptake (>70%). The selected features strongly appeal to older adults.</p>";
  }
  msg += `<p><em>Loneliness categories follow the De Jong Gierveld Loneliness Scale.</em></p>`;
  return msg;
}

/********************************************
 * Generate Programme Package
 ********************************************/
function generateProgramPackage() {
  const form = document.getElementById('decisionForm');
  const selects = form.getElementsByTagName('select');
  const chosen = [];
  for (let s of selects) {
    if (s.id === 'state_select' || s.id === 'adjust_costs') continue;
    if (s.value === "1") {
      let label = s.previousElementSibling.innerText;
      label = label.replace(':','').trim();
      chosen.push(label);
    }
  }
  return chosen.map(item => `<li>${item}</li>`).join('');
}

/********************************************
 * Toggle Download Buttons
 ********************************************/
function toggleDownloadButtons(packageListEl) {
  const dlPackage = document.getElementById('downloadPackageBtn');
  const dlChart = document.getElementById('downloadChartBtn');
  if (packageListEl.children.length > 0) {
    dlPackage.style.display = 'inline-block';
    dlChart.style.display = 'inline-block';
  } else {
    dlPackage.style.display = 'none';
    dlChart.style.display = 'none';
  }
}

/********************************************
 * Calculate Total Cost
 ********************************************/
function calculateTotalCost(state, adjustCosts) {
  const selectedAttrs = getSelectedAttributes();
  let totals = {
    personnel: 0,
    materials: 0,
    technology: 0,
    facility: 0,
    marketing: 0,
    training: 0,
    miscellaneous: 0
  };
  selectedAttrs.forEach(attr => {
    const c = costData[attr] || {};
    for (let key in totals) {
      if (c[key]) totals[key] += c[key];
    }
  });
  let grandTotal = Object.values(totals).reduce((a,b) => a+b, 0);
  if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
    grandTotal *= costOfLivingMultipliers[state];
  }
  return { totalCost: totals, grandTotal };
}

function getSelectedAttributes() {
  const form = document.getElementById('decisionForm');
  const selects = form.getElementsByTagName('select');
  const arr = [];
  for (let s of selects) {
    if (s.id === 'state_select' || s.id === 'adjust_costs') continue;
    if (s.value === "1") arr.push(s.id);
  }
  return arr;
}

/********************************************
 * Display Costs
 ********************************************/
function displayCosts(costResults) {
  const list = document.getElementById('costList');
  list.innerHTML = '';
  for (let key in costResults.totalCost) {
    if (costResults.totalCost[key] > 0) {
      const li = document.createElement('li');
      li.innerText = `${capitalise(key)}: $${costResults.totalCost[key].toLocaleString()}`;
      list.appendChild(li);
    }
  }
  document.getElementById('totalCost').innerText = costResults.grandTotal.toLocaleString();
}

/********************************************
 * Capitalise first letter
 ********************************************/
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/********************************************
 * Calculate Benefits
 ********************************************/
function calculateBenefits(probability) {
  return probability * 100 * benefitPerPercent;
}

/********************************************
 * Display Benefits
 ********************************************/
function displayBenefits(benefits) {
  document.getElementById('totalBenefits').innerText = benefits.toLocaleString();
}

/********************************************
 * Display CBA
 ********************************************/
function displayCBA(totalCost, benefits) {
  const netBenefit = benefits - totalCost;
  const ratio = (totalCost === 0) ? 0 : (benefits / totalCost);
  document.getElementById('netBenefit').innerText = netBenefit.toLocaleString();
  document.getElementById('bcr').innerText = ratio.toFixed(2);
}

/********************************************
 * Update CBA Chart
 ********************************************/
function updateCBACChart(totalCost, benefits) {
  cbaChart.data.datasets[0].data = [totalCost, benefits];
  cbaChart.update();
}

/********************************************
 * Download Programme Package
 ********************************************/
function downloadPackage() {
  const pkgList = document.getElementById('packageList');
  if (pkgList.children.length === 0) {
    alert("No programme package selected to download.");
    return;
  }
  let text = "Selected Programme Package:\n";
  for (let li of pkgList.children) {
    text += li.innerText + "\n";
  }
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "Programme_Package.txt";
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
  link.href = canvas.toDataURL("image/png");
  link.download = "Uptake_Probability_Chart.png";
  link.click();
  alert("Uptake Probability chart downloaded successfully!");
}

/********************************************
 * Download CBA Report as PDF
 ********************************************/
function downloadCBAPDF() {
  const state = document.getElementById('state_select').value;
  const adjustCosts = document.getElementById('adjust_costs').value;
  const { grandTotal } = calculateTotalCost(state, adjustCosts);
  const pText = document.getElementById('probability').innerText;
  const pVal = parseFloat(pText.replace('%','')) / 100;
  const benefits = calculateBenefits(pVal);
  const netBenefit = benefits - grandTotal;
  const bcr = (grandTotal === 0) ? 0 : (benefits / grandTotal);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("LonelyLessAustralia – Cost-Benefit Analysis Report", 10, 20);
  doc.setFontSize(12);
  doc.text(`Selected State: ${state || 'N/A'}`, 10, 30);
  doc.text(`Adjust Costs for Living Expenses: ${adjustCosts === 'yes' ? 'Yes' : 'No'}`, 10, 40);
  doc.text(`Predicted Uptake Probability: ${(pVal*100).toFixed(2)}%`, 10, 50);
  doc.text(`Total Estimated Cost: $${grandTotal.toLocaleString()} AUD`, 10, 60);
  doc.text(`Total Estimated Benefits: $${benefits.toLocaleString()} AUD`, 10, 70);
  doc.text(`Net Benefit: $${netBenefit.toLocaleString()} AUD`, 10, 80);
  doc.text(`Benefit-Cost Ratio: ${bcr.toFixed(2)}`, 10, 90);

  doc.save("CBA_Report.pdf");
  alert("Cost-Benefit Analysis report downloaded successfully!");
}
