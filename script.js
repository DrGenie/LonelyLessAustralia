/****************************************************************************
 * SCRIPT.JS
 * 1) Tab navigation
 * 2) Range slider label updates
 * 3) Main DCE coefficients & cost-of-living multipliers
 * 4) Single WTP data with error bars (p-values, SE)
 * 5) Probability & WTP bar charts (destroy & recreate each time)
 * 6) Scenario saving & multi-window PDF
 * Author: Mesfin Genie, Newcastle Business School, The University of Newcastle, Australia
 ****************************************************************************/

/** On page load, default to introduction tab */
window.onload = function() {
  openTab('introTab', document.querySelector('.tablink'));
};

/** Tab switching function */
function openTab(tabId, btn) {
  const allTabs = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < allTabs.length; i++) {
    allTabs[i].style.display = "none";
  }
  const allBtns = document.getElementsByClassName("tablink");
  for (let j = 0; j < allBtns.length; j++) {
    allBtns[j].classList.remove("active");
  }
  document.getElementById(tabId).style.display = "block";
  btn.classList.add("active");
}

/** Range slider label updates */
function updateCostDisplay(val) {
  document.getElementById("costLabel").textContent = val;
}

/***************************************************************************
 * MAIN DCE COEFFICIENTS
 ***************************************************************************/
const mainCoefficients = {
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
  dist_local: 0.59,  // user can adjust
  dist_signif: -0.509,
  cost_cont: -0.036
};

/***************************************************************************
 * COST-OF-LIVING MULTIPLIERS
 ***************************************************************************/
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

/***************************************************************************
 * SCENARIO BUILDER
 ***************************************************************************/
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

  if (localCheck && widerCheck) {
    alert("Cannot select both Local Area and Wider Community in one scenario.");
    return null;
  }
  if (weeklyCheck && monthlyCheck) {
    alert("Cannot select both Weekly and Monthly simultaneously.");
    return null;
  }
  if (twoHCheck && fourHCheck) {
    alert("Cannot select both 2-Hour and 4-Hour simultaneously.");
    return null;
  }
  if (adjustCosts === 'yes' && !state) {
    alert("Please select a state if adjusting cost-of-living.");
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

/***************************************************************************
 * COMPUTE PROBABILITY
 ***************************************************************************/
function computeProbability(sc, coefs) {
  let finalCost = sc.cost_val;
  if (sc.adjustCosts === 'yes' && sc.state && costOfLivingMultipliers[sc.state]) {
    finalCost *= costOfLivingMultipliers[sc.state];
  }

  const dist_local = sc.localCheck ? 1 : 0;
  const dist_signif = sc.widerCheck ? 1 : 0;
  const freq_weekly = sc.weeklyCheck ? 1 : 0;
  const freq_monthly = sc.monthlyCheck ? 1 : 0;
  const mode_virtual = sc.virtualCheck ? 1 : 0;
  const mode_hybrid = sc.hybridCheck ? 1 : 0;
  const dur_2hrs = sc.twoHCheck ? 1 : 0;
  const dur_4hrs = sc.fourHCheck ? 1 : 0;
  const type_comm = sc.commCheck ? 1 : 0;
  const type_psych = sc.psychCheck ? 1 : 0;
  const type_vr = sc.vrCheck ? 1 : 0;

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

  const U_optout = coefs.ASC_optout;
  const exp_alt = Math.exp(U_alt);
  const exp_opt = Math.exp(U_optout);
  return exp_alt / (exp_alt + exp_opt);
}

/***************************************************************************
 * RENDER PROBABILITY CHART
 ***************************************************************************/
let probChartInstance = null;
function renderProbChart() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;

  const pVal = computeProbability(scenario, mainCoefficients)*100;
  const ctx = document.getElementById("probChartMain").getContext("2d");

  if (probChartInstance) {
    probChartInstance.destroy();
  }

  probChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Program Uptake Probability"],
      datasets: [{
        label: 'Programme Uptake (%)',
        data: [pVal],
        backgroundColor: pVal < 30 ? 'rgba(231,76,60,0.6)'
                       : pVal < 70 ? 'rgba(241,196,15,0.6)'
                                   : 'rgba(39,174,96,0.6)',
        borderColor: pVal < 30 ? 'rgba(231,76,60,1)'
                     : pVal < 70 ? 'rgba(241,196,15,1)'
                                 : 'rgba(39,174,96,1)',
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
          text: `Program Uptake Probability = ${pVal.toFixed(2)}%`,
          font: { size: 16 }
        }
      }
    }
  });

  // Provide dynamic suggestions
  let interpretation = "";
  if (pVal < 30) {
    interpretation = "Uptake is relatively low. Consider lowering cost or increasing accessibility/frequency.";
  } else if (pVal < 70) {
    interpretation = "Uptake is moderate. Additional improvements may further boost participation.";
  } else {
    interpretation = "Uptake is high. Maintaining these attributes is recommended.";
  }
  alert(`Predicted probability: ${pVal.toFixed(2)}%. ${interpretation}`);
}

/***************************************************************************
 * WTP CHART WITH ERROR BARS
 ***************************************************************************/
const wtpDataMain = [
  { attribute: "Community engagement", wtp: 14.47, pVal: 0.000, se: 3.31 },
  { attribute: "Psychological counselling", wtp: 4.28, pVal: 0.245, se: 3.76 },
  { attribute: "Virtual reality", wtp: -9.58, pVal: 0.009, se: 3.72 },
  { attribute: "Virtual (method)", wtp: -11.69, pVal: 0.019, se: 5.02 },
  { attribute: "Hybrid (method)", wtp: -7.95, pVal: 0.001, se: 2.51 },
  { attribute: "Weekly (freq)", wtp: 16.93, pVal: 0.000, se: 2.73 },
  { attribute: "Monthly (freq)", wtp: 9.21, pVal: 0.005, se: 3.26 },
  { attribute: "2-hour interaction", wtp: 5.08, pVal: 0.059, se: 2.69 },
  { attribute: "4-hour interaction", wtp: 5.85, pVal: 0.037, se: 2.79 },
  { attribute: "Local area accessibility", wtp: 1.62, pVal: 0.712, se: 4.41 },
  { attribute: "Wider community accessibility", wtp: -13.99, pVal: 0.000, se: 3.98 }
];

let wtpChartInstance = null;
function renderWTPChart() {
  const ctx = document.getElementById("wtpChartMain").getContext("2d");

  if (wtpChartInstance) {
    wtpChartInstance.destroy();
  }

  const labels = wtpDataMain.map(item => item.attribute);
  const values = wtpDataMain.map(item => item.wtp);
  const errors = wtpDataMain.map(item => item.se); // standard errors

  const dataConfig = {
    labels: labels,
    datasets: [{
      label: "WTP (A$)",
      data: values,
      backgroundColor: values.map(v => v >= 0 ? 'rgba(39,174,96,0.6)' : 'rgba(231,76,60,0.6)'),
      borderColor: values.map(v => v >= 0 ? 'rgba(39,174,96,1)' : 'rgba(231,76,60,1)'),
      borderWidth: 1
    }]
  };

  wtpChartInstance = new Chart(ctx, {
    type: 'bar',
    data: dataConfig,
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "WTP (A$)",
          font: { size: 16 }
        }
      }
    },
    plugins: [{
      // Draw vertical error bars
      id: 'errorbars',
      afterDraw: chart => {
        const {
          ctx,
          scales: { x, y }
        } = chart;

        chart.getDatasetMeta(0).data.forEach((bar, i) => {
          const centerX = bar.x;
          const value = values[i];
          const se = errors[i];
          if (se && typeof se === 'number') {
            const baseY = y.getPixelForValue(value);
            const topY = y.getPixelForValue(value + se);
            const bottomY = y.getPixelForValue(value - se);

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            // main line
            ctx.moveTo(centerX, topY);
            ctx.lineTo(centerX, bottomY);
            // top cap
            ctx.moveTo(centerX - 5, topY);
            ctx.lineTo(centerX + 5, topY);
            // bottom cap
            ctx.moveTo(centerX - 5, bottomY);
            ctx.lineTo(centerX + 5, bottomY);
            ctx.stroke();
            ctx.restore();
          }
        });
      }
    }]
  });
}

/***************************************************************************
 * SCENARIO SAVING & COMPARISON
 ***************************************************************************/
let scenarioList = [];

function saveScenario() {
  const sc = buildScenarioFromInputs();
  if (!sc) return;
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

/***************************************************************************
 * SINGLE SCENARIO COST-BENEFIT
 ***************************************************************************/
function openSingleScenario() {
  const sc = buildScenarioFromInputs();
  if (!sc) return;
  openResultsWindow([sc], "Single Scenario Results");
}

/***************************************************************************
 * MULTI-WINDOW PDF
 ***************************************************************************/
function openResultsWindow(scenarios, windowTitle) {
  const w = window.open("", "_blank", "width=1400,height=800,resizable,scrollbars");
  if (!w) {
    alert("Please allow popups for results window.");
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
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <script>
        const scenarioData = ${JSON.stringify(scenarios)};

        window.onload = function(){
          displayScenarios();
          buildCostBenefitChart();
        };

        function displayScenarios(){
          const container = document.getElementById("resultsContainer");
          scenarioData.forEach(sc => {
            const box = document.createElement("div");
            box.className = "scenario-box";
            const h2 = document.createElement("h2");
            h2.textContent = sc.name || "Current Scenario";
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

        function buildCostBenefitChart(){
          const ctx = document.getElementById("cbaChart").getContext("2d");
          const labels = scenarioData.map(s => s.name || "Scenario");

          // Example cost & benefit approach (no random logic, user can adapt):
          const costVals = scenarioData.map(s => s.cost_val * 1000);
          const benefitVals = scenarioData.map(s => {
            // e.g. predicted uptake * 100 * 5000 if user has real function
            return 20000; // A placeholder, can be replaced with real calculations
          });

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

        function downloadPDF(){
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p','pt','a4');
          pdf.setFontSize(14);
          pdf.text("${windowTitle}", 40, 40);
          pdf.save("LonelyLessAustralia_Results.pdf");
        }
      </script>
    </body>
    </html>
  `);
  w.document.close();
}

/****************************************************************************
 * SUGGESTIONS FOR FURTHER IMPROVEMENT
 * 1) Include confidence intervals or error bars for WTP data (p-values, SE).
 * 2) Implement more advanced cost-benefit logic with real cost inputs (no placeholders).
 * 3) Provide direct PDF exports capturing scenario data & probability charts from main pages.
 * 4) Link to real usage data or user feedback to refine cost & benefit assumptions.
 ****************************************************************************/
