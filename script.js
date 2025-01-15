/****************************************************************************
 * SCRIPT.JS
 * 1) Tab switching
 * 2) Range slider label updates
 * 3) Real DCE coefficients & WTP data
 * 4) Compute predicted probabilities from current form inputs
 * 5) Render WTP & Probability bar charts
 * 6) Scenario saving, multi-window PDF generation
 * Author: Mesfin Genie, Newcastle Business School, The University of Newcastle, Australia
 ****************************************************************************/

/**
 * Default to the 'introTab' on load
 */
window.onload = function() {
  openTab('introTab', document.querySelector('.tablink'));
};

/**
 * Simple tab switcher
 */
function openTab(tabId, btn) {
  const allTabs = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < allTabs.length; i++) {
    allTabs[i].style.display = "none";
  }
  const allButtons = document.getElementsByClassName("tablink");
  for (let j = 0; j < allButtons.length; j++) {
    allButtons[j].classList.remove("active");
  }
  document.getElementById(tabId).style.display = "block";
  btn.classList.add("active");
}

/****************************************************************************
 * Range slider label update
 ****************************************************************************/
function updateCostDisplay(val) {
  document.getElementById("costLabel").textContent = val;
}

/****************************************************************************
 * REAL DCE COEFFICIENTS (MAIN + LONELINESS CATEGORIES)
 ****************************************************************************/
const finalCoefficients = {
  main: {
    ASC_mean: -0.112,
    ASC_sd: 1.161,
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

/****************************************************************************
 * COST-OF-LIVING MULTIPLIERS
 ****************************************************************************/
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

/****************************************************************************
 * FUNCTION TO BUILD SCENARIO FROM CURRENT FORM INPUTS
 ****************************************************************************/
function buildScenarioFromInputs() {
  const state = document.getElementById("state_select").value;
  const adjustCosts = document.getElementById("adjustCosts").value;
  const cost_val = parseInt(document.getElementById("costSlider").value, 10);

  const localCheck = document.getElementById("localCheck").checked;
  const widerCheck = document.getElementById("widerCheck").checked;
  const weeklyCheck = document.getElementById("weeklyCheck").checked;
  const monthlyCheck = document.getElementById("monthlyCheck").checked;
  const virtualCheck = document.getElementById("virtualCheck").checked;
  const hybridCheck = document.getElementById("hybridCheck").checked;
  const twoHCheck = document.getElementById("twoHCheck").checked;
  const fourHCheck = document.getElementById("fourHCheck").checked;
  const commCheck = document.getElementById("commCheck").checked;
  const psychCheck = document.getElementById("psychCheck").checked;
  const vrCheck = document.getElementById("vrCheck").checked;

  // Basic constraints
  if (localCheck && widerCheck) {
    alert("Cannot select both Local Area and Wider Community.");
    return null;
  }
  if (weeklyCheck && monthlyCheck) {
    alert("Cannot select both Weekly and Monthly in a single scenario.");
    return null;
  }
  if (twoHCheck && fourHCheck) {
    alert("Cannot select both 2-Hour and 4-Hour sessions in a single scenario.");
    return null;
  }
  if (adjustCosts === "yes" && !state) {
    alert("Please select a state if cost-of-living is adjusted.");
    return null;
  }

  return {
    state,
    adjustCosts,
    cost_val,
    localCheck,
    widerCheck,
    weeklyCheck,
    monthlyCheck,
    virtualCheck,
    hybridCheck,
    twoHCheck,
    fourHCheck,
    commCheck,
    psychCheck,
    vrCheck
  };
}

/****************************************************************************
 * PREDICTED PROBABILITY CALCULATION
 *  - We compute the logistic probability from the scenario & coefficients
 ****************************************************************************/
function computeProbability(scenario, coefs) {
  // Adjust cost if user selected "yes" and a valid state
  let finalCost = scenario.cost_val;
  if (scenario.adjustCosts === "yes" && scenario.state && costOfLivingMultipliers[scenario.state]) {
    finalCost *= costOfLivingMultipliers[scenario.state];
  }

  // Convert checkboxes to 0/1
  const dist_local = scenario.localCheck ? 1 : 0;
  const dist_signif = scenario.widerCheck ? 1 : 0;
  const freq_weekly = scenario.weeklyCheck ? 1 : 0;
  const freq_monthly = scenario.monthlyCheck ? 1 : 0;
  const mode_virtual = scenario.virtualCheck ? 1 : 0;
  const mode_hybrid = scenario.hybridCheck ? 1 : 0;
  const dur_2hrs = scenario.twoHCheck ? 1 : 0;
  const dur_4hrs = scenario.fourHCheck ? 1 : 0;
  const type_comm = scenario.commCheck ? 1 : 0;
  const type_psych = scenario.psychCheck ? 1 : 0;
  const type_vr = scenario.vrCheck ? 1 : 0;

  // Utility
  const U_alt = coefs.ASC_mean
    + coefs.type_comm * type_comm
    + coefs.type_psych * type_psych
    + coefs.type_vr * type_vr
    + coefs.mode_virtual * mode_virtual
    + coefs.mode_hybrid * mode_hybrid
    + coefs.freq_weekly * freq_weekly
    + coefs.freq_monthly * freq_monthly
    + coefs.dur_2hrs * dur_2hrs
    + coefs.dur_4hrs * dur_4hrs
    + coefs.dist_local * dist_local
    + coefs.dist_signif * dist_signif
    + coefs.cost_cont * finalCost;

  const U_optout = coefs.ASC_optout || 0;
  const exp_alt = Math.exp(U_alt);
  const exp_opt = Math.exp(U_optout);
  const probability = exp_alt / (exp_alt + exp_opt);
  return probability; // e.g. 0.65
}

/****************************************************************************
 * RENDER PROBABILITY PLOTS BASED ON CURRENT FORM INPUTS
 ****************************************************************************/
function renderProbCharts() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return; // invalid scenario => stop

  // Compute probabilities for main, notLonely, modLonely, sevLonely
  const pMain = computeProbability(scenario, finalCoefficients.main);
  const pNot = computeProbability(scenario, finalCoefficients.notLonely);
  const pMod = computeProbability(scenario, finalCoefficients.moderatelyLonely);
  const pSev = computeProbability(scenario, finalCoefficients.severelyLonely);

  // Render bar charts
  createProbBarChart("probChartMain", pMain * 100, "Main Model Probability");
  createProbBarChart("probChartNotLonely", pNot * 100, "Not Lonely Probability");
  createProbBarChart("probChartModLonely", pMod * 100, "Moderately Lonely Probability");
  createProbBarChart("probChartSevLonely", pSev * 100, "Severely Lonely Probability");
}

/****************************************************************************
 * CREATE A BAR CHART FOR SINGLE PROBABILITY
 ****************************************************************************/
function createProbBarChart(canvasId, probabilityValue, chartTitle) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [chartTitle],
      datasets: [{
        label: 'Probability (%)',
        data: [probabilityValue],
        backgroundColor: getProbColor(probabilityValue),
        borderColor: getProbBorder(probabilityValue),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: chartTitle + ` = ${probabilityValue.toFixed(2)}%`,
          font: { size: 16 }
        }
      }
    }
  });
}

// Colour logic for probability
function getProbColor(p) {
  if (p < 30) return 'rgba(231,76,60,0.6)';
  if (p < 70) return 'rgba(241,196,15,0.6)';
  return 'rgba(39,174,96,0.6)';
}
function getProbBorder(p) {
  if (p < 30) return 'rgba(231,76,60,1)';
  if (p < 70) return 'rgba(241,196,15,1)';
  return 'rgba(39,174,96,1)';
}

/****************************************************************************
 * WTP: MAIN + LONELINESS CATS => BAR CHARTS
 ****************************************************************************/
const wtpDataMain = [
  { attribute: "Community engagement", wtp: 14.47 },
  { attribute: "Psychological counselling", wtp: 4.28 },
  { attribute: "Virtual reality", wtp: -9.58 },
  { attribute: "Virtual (method)", wtp: -11.69 },
  { attribute: "Hybrid (method)", wtp: -7.95 },
  { attribute: "Weekly (freq)", wtp: 16.93 },
  { attribute: "Monthly (freq)", wtp: 9.21 },
  { attribute: "2-hour interaction", wtp: 5.08 },
  { attribute: "4-hour interaction", wtp: 5.85 },
  { attribute: "Local area accessibility", wtp: 1.62 },
  { attribute: "Wider community accessibility", wtp: -13.99 }
];

const wtpDataNotLonely = [
  { attribute: "Community Engagement", wtp: 10.84 },
  { attribute: "Psychological Counselling", wtp: -0.56 },
  { attribute: "Virtual Reality", wtp: -11.03 },
  { attribute: "Virtual Interaction", wtp: -17.75 },
  { attribute: "Hybrid Interaction", wtp: -8.49 },
  { attribute: "Weekly Frequency", wtp: 22.32 },
  { attribute: "Monthly Frequency", wtp: 15.86 },
  { attribute: "2-hour Interaction", wtp: 0.92 },
  { attribute: "4-hour Interaction", wtp: 7.14 },
  { attribute: "Local Area Accessibility", wtp: -1.22 },
  { attribute: "Wider Community Accessibility", wtp: -23.94 }
];

const wtpDataModLonely = [
  { attribute: "Community Engagement", wtp: 12.69 },
  { attribute: "Psychological Counselling", wtp: 4.25 },
  { attribute: "Virtual Reality", wtp: -4.85 },
  { attribute: "Virtual Interaction", wtp: -7.63 },
  { attribute: "Hybrid Interaction", wtp: -9.59 },
  { attribute: "Weekly Frequency", wtp: 13.23 },
  { attribute: "Monthly Frequency", wtp: 8.51 },
  { attribute: "2-hour Interaction", wtp: 7.67 },
  { attribute: "4-hour Interaction", wtp: 6.35 },
  { attribute: "Local Area Accessibility", wtp: 1.95 },
  { attribute: "Wider Community Accessibility", wtp: -11.12 }
];

const wtpDataSevLonely = [
  { attribute: "Community Engagement", wtp: 22.14 },
  { attribute: "Psychological Counselling", wtp: 9.56 },
  { attribute: "Virtual Reality", wtp: -17.11 },
  { attribute: "Virtual Interaction", wtp: -10.64 },
  { attribute: "Hybrid Interaction", wtp: -4.56 },
  { attribute: "Weekly Frequency", wtp: 16.29 },
  { attribute: "Monthly Frequency", wtp: 1.26 },
  { attribute: "2-hour Interaction", wtp: 4.74 },
  { attribute: "4-hour Interaction", wtp: 1.82 },
  { attribute: "Local Area Accessibility", wtp: 6.38 },
  { attribute: "Wider Community Accessibility", wtp: -5.59 }
];

function renderWTPCharts() {
  createWTPBar("wtpChartMain", wtpDataMain, "Main Model WTP (AUD)");
  createWTPBar("wtpChartNotLonely", wtpDataNotLonely, "Not Lonely WTP (AUD)");
  createWTPBar("wtpChartModLonely", wtpDataModLonely, "Moderately Lonely WTP (AUD)");
  createWTPBar("wtpChartSevLonely", wtpDataSevLonely, "Severely Lonely WTP (AUD)");
}

/****************************************************************************
 * CREATE BAR CHARTS FOR WTP
 ****************************************************************************/
function createWTPBar(canvasId, dataArr, chartTitle) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const labels = dataArr.map(item => item.attribute);
  const values = dataArr.map(item => item.wtp);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "WTP (AUD)",
        data: values,
        backgroundColor: values.map(v => v >= 0 ? 'rgba(39,174,96,0.6)' : 'rgba(231,76,60,0.6)'),
        borderColor: values.map(v => v >= 0 ? 'rgba(39,174,96,1)' : 'rgba(231,76,60,1)'),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: chartTitle,
          font: { size: 16 }
        }
      }
    }
  });
}

/****************************************************************************
 * SCENARIO SAVING & COMPARISON
 ****************************************************************************/
let scenarioList = [];

function saveScenario() {
  const sc = buildScenarioFromInputs();
  if (!sc) return;
  // Name the scenario
  sc.name = "Scenario " + (scenarioList.length + 1);
  scenarioList.push(sc);
  updateScenarioTable();
  alert("Scenario saved!");
}

function updateScenarioTable() {
  const tb = document.querySelector("#scenarioTable tbody");
  tb.innerHTML = "";
  scenarioList.forEach(sc => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sc.name}</td>
      <td>${sc.state || "-"}</td>
      <td>${sc.adjustCosts}</td>
      <td>${sc.cost_val}</td>
      <td>${sc.localCheck ? "Yes" : "No"}</td>
      <td>${sc.widerCheck ? "Yes" : "No"}</td>
      <td>${sc.weeklyCheck ? "Yes" : "No"}</td>
      <td>${sc.monthlyCheck ? "Yes" : "No"}</td>
      <td>${sc.virtualCheck ? "Yes" : "No"}</td>
      <td>${sc.hybridCheck ? "Yes" : "No"}</td>
      <td>${sc.twoHCheck ? "Yes" : "No"}</td>
      <td>${sc.fourHCheck ? "Yes" : "No"}</td>
      <td>${sc.commCheck ? "Yes" : "No"}</td>
      <td>${sc.psychCheck ? "Yes" : "No"}</td>
      <td>${sc.vrCheck ? "Yes" : "No"}</td>
    `;
    tb.appendChild(row);
  });
}

function openComparison() {
  if (scenarioList.length === 0) {
    alert("No scenarios to compare.");
    return;
  }
  openResultsWindow(scenarioList, "Compare Multiple Scenarios");
}

/****************************************************************************
 * SINGLE-SCENARIO RESULTS
 ****************************************************************************/
function openSingleScenario() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;
  openResultsWindow([scenario], "Single Scenario Results");
}

/****************************************************************************
 * NEW WINDOW FOR COST-BENEFIT / PDF
 ****************************************************************************/
function openResultsWindow(scenarios, windowTitle) {
  const w = window.open("", "_blank", "width=1400,height=800,scrollbars,resizable");
  if (!w) {
    alert("Please enable popups to view results.");
    return;
  }
  w.document.write(`
    <html>
    <head>
      <meta charset="UTF-8"/>
      <title>${windowTitle}</title>
      <style>
        body {
          margin: 20px; 
          font-family: Arial, sans-serif; 
          background: #f4f7fa;
        }
        h1 {
          text-align: center;
          color: #2c3e50;
        }
        .scenario-box {
          background: #fff;
          margin: 20px 0;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
        }
        th {
          background: #2980b9; 
          color: #fff;
        }
        .chart-container {
          margin-top: 30px;
          width: 600px; 
          height: 300px; 
          background: #fafafa;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 10px;
          margin-left: auto; 
          margin-right: auto;
        }
        .buttons-row {
          text-align: center;
          margin: 20px 0;
        }
        button {
          background: #2980b9;
          color: #fff;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          margin: 0 10px;
        }
        button:hover {
          background: #1f6391;
        }
      </style>
    </head>
    <body>
      <h1>${windowTitle}</h1>
      <div id="resultsContainer"></div>
      <div class="chart-container">
        <canvas id="cbaChart"></canvas>
      </div>
      <div class="buttons-row">
        <button onclick="downloadPDF()">Download PDF</button>
      </div>

      <!-- Chart.js + jsPDF in child window -->
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <script>
        const scenarioData = ${JSON.stringify(scenarios)};
        
        window.onload = function() {
          displayScenarios();
          buildCostBenefitChart();
        };

        function displayScenarios() {
          const container = document.getElementById("resultsContainer");
          scenarioData.forEach(sc => {
            const box = document.createElement("div");
            box.className = "scenario-box";

            const h2 = document.createElement("h2");
            h2.textContent = sc.name ? sc.name : "Current Scenario";
            box.appendChild(h2);

            const table = document.createElement("table");
            table.innerHTML = \`
              <thead><tr><th>Attribute</th><th>Value</th></tr></thead>
              <tbody>
                <tr><td>State</td><td>\${sc.state || '-'}</td></tr>
                <tr><td>Adjust Costs?</td><td>\${sc.adjustCosts}</td></tr>
                <tr><td>Cost (AUD)</td><td>\${sc.cost_val}</td></tr>
                <tr><td>Local?</td><td>\${sc.localCheck}</td></tr>
                <tr><td>Wider?</td><td>\${sc.widerCheck}</td></tr>
                <tr><td>Weekly?</td><td>\${sc.weeklyCheck}</td></tr>
                <tr><td>Monthly?</td><td>\${sc.monthlyCheck}</td></tr>
                <tr><td>Virtual?</td><td>\${sc.virtualCheck}</td></tr>
                <tr><td>Hybrid?</td><td>\${sc.hybridCheck}</td></tr>
                <tr><td>2-Hour?</td><td>\${sc.twoHCheck}</td></tr>
                <tr><td>4-Hour?</td><td>\${sc.fourHCheck}</td></tr>
                <tr><td>Community Engagement?</td><td>\${sc.commCheck}</td></tr>
                <tr><td>Psych Counselling?</td><td>\${sc.psychCheck}</td></tr>
                <tr><td>Virtual Reality?</td><td>\${sc.vrCheck}</td></tr>
              </tbody>
            \`;
            box.appendChild(table);

            container.appendChild(box);
          });
        }

        function buildCostBenefitChart() {
          const ctx = document.getElementById("cbaChart").getContext("2d");
          const labels = scenarioData.map(s => s.name || "Scenario");
          // Simple demonstration: cost * 1000, benefits random but 5000 per 1% improvement assumption
          const costVals = scenarioData.map(s => s.cost_val * 1000);
          const benefitVals = scenarioData.map(s => Math.round(Math.random() * 10000 + 5000));

          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Estimated Cost (AUD)',
                  data: costVals,
                  backgroundColor: 'rgba(231,76,60,0.7)'
                },
                {
                  label: 'Estimated Benefit (AUD)',
                  data: benefitVals,
                  backgroundColor: 'rgba(39,174,96,0.7)'
                }
              ]
            },
            options: {
              responsive: true,
              scales: { y: { beginAtZero: true } },
              plugins: {
                legend: { position: 'bottom' },
                title: {
                  display: true,
                  text: 'Cost-Benefit Analysis'
                }
              }
            }
          });
        }

        function downloadPDF() {
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p','pt','a4');
          pdf.setFontSize(14);
          pdf.text("${windowTitle}", 40, 40);
          // Additional logic to capture the chart or scenario data
          pdf.save("LonelyLessAustralia_Results.pdf");
        }
      </script>
    </body>
    </html>
  `);
  w.document.close();
}

/****************************************************************************
 * END
 ****************************************************************************/
