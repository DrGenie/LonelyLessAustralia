/****************************************************************************
 * SCRIPT.JS
 * A comprehensive script for the LonelyLessAustralia Decision Aid Tool.
 * Includes:
 * 1) Tab navigation
 * 2) Real DCE coefficients for each loneliness category
 * 3) WTP data for main model & categories
 * 4) Advanced charting for cost-benefit analyses
 * 5) Multi-window PDF generation
 * 6) Scenario saving & comparison
 * Author: Mesfin Genie, Newcastle Business School, The University of Newcastle, Australia
 ****************************************************************************/

/**
 * On page load, default to the 'introTab'.
 */
window.onload = function() {
  openTab('introTab', document.querySelector('.tablink'));
};

/**
 * TAB SWITCHING FUNCTION
 * Hides all .tabcontent sections, removes .active from all .tablink buttons,
 * then shows the requested tab and sets its button as active.
 */
function openTab(tabId, element) {
  const allTabs = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < allTabs.length; i++) {
    allTabs[i].style.display = "none";
  }
  const allLinks = document.getElementsByClassName("tablink");
  for (let j = 0; j < allLinks.length; j++) {
    allLinks[j].classList.remove("active");
  }
  document.getElementById(tabId).style.display = "block";
  element.classList.add("active");

  // Load WTP data if user clicks the WTP Results tab
  if (tabId === 'wtpTab') {
    loadWTPResults();
  }
}

/****************************************************************************
 * UPDATE COST LABEL (range slider for "Inputs" tab)
 ****************************************************************************/
function updateCostDisplay(value) {
  document.getElementById("costLabel").textContent = value;
}

/****************************************************************************
 * REAL DCE COEFFICIENTS (Table 3) + By Loneliness Category (Table 5)
 ****************************************************************************/
const finalCoefficients = {
  main: {
    ASC_mean: -0.112,
    ASC_sd: 1.161,
    ASC_optout: 0.131,
    // Type of Support (Ref: Peer Support)
    type_comm: 0.527,     // Community Engagement
    type_psych: 0.156,    // Psychological Counselling
    type_vr: -0.349,      // Virtual Reality
    // Method of Interaction (Ref: In-person)
    mode_virtual: -0.426,
    mode_hybrid: -0.289,
    // Frequency of Interaction (Ref: Daily)
    freq_weekly: 0.617,
    freq_monthly: 0.336,
    // Duration of Interaction (Ref: 30 minutes)
    dur_2hrs: 0.185,
    dur_4hrs: 0.213,
    // Accessibility (Ref: At home)
    dist_local: 0.059,
    dist_signif: -0.509,
    // Cost per session
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
 * WTP DATA (Table 4) - Main Model + Table 6 - By Loneliness Category
 ****************************************************************************/
const wtpDataMain = [
  {
    attribute: "Community engagement",
    coef: 0.527,
    pVal: 0.000,
    sig: "***",
    wtp: 14.47
  },
  {
    attribute: "Psychological counselling",
    coef: 0.156,
    pVal: 0.245,
    sig: "",
    wtp: 4.28
  },
  {
    attribute: "Virtual reality",
    coef: -0.349,
    pVal: 0.009,
    sig: "**",
    wtp: -9.58
  },
  {
    attribute: "Virtual",
    coef: -0.426,
    pVal: 0.019,
    sig: "**",
    wtp: -11.69
  },
  {
    attribute: "Hybrid",
    coef: -0.289,
    pVal: 0.001,
    sig: "***",
    wtp: -7.95
  },
  {
    attribute: "Weekly",
    coef: 0.617,
    pVal: 0.000,
    sig: "***",
    wtp: 16.93
  },
  {
    attribute: "Monthly",
    coef: 0.336,
    pVal: 0.005,
    sig: "**",
    wtp: 9.21
  },
  {
    attribute: "2-hour interaction",
    coef: 0.185,
    pVal: 0.059,
    sig: "",
    wtp: 5.08
  },
  {
    attribute: "4-hour interaction",
    coef: 0.213,
    pVal: 0.037,
    sig: "*",
    wtp: 5.85
  },
  {
    attribute: "Local area accessibility",
    coef: 0.059,
    pVal: 0.712,
    sig: "",
    wtp: 1.62
  },
  {
    attribute: "Wider community accessibility",
    coef: -0.509,
    pVal: 0.000,
    sig: "***",
    wtp: -13.99
  }
];

// Not Lonely WTP (Table 6)
const wtpDataNotLonely = [
  {
    attribute: "Community Engagement",
    coef: 0.369,
    pVal: 0.064,
    sig: "",
    wtp: 10.84
  },
  {
    attribute: "Psychological Counselling",
    coef: -0.019,
    pVal: 0.940,
    sig: "",
    wtp: -0.56
  },
  {
    attribute: "Virtual Reality",
    coef: -0.375,
    pVal: 0.082,
    sig: "",
    wtp: -11.03
  },
  {
    attribute: "Virtual Interaction",
    coef: -0.604,
    pVal: 0.067,
    sig: "",
    wtp: -17.75
  },
  {
    attribute: "Hybrid Interaction",
    coef: -0.289,
    pVal: 0.069,
    sig: "",
    wtp: -8.49
  },
  {
    attribute: "Weekly",
    coef: 0.759,
    pVal: 0.000,
    sig: "***",
    wtp: 22.32
  },
  {
    attribute: "Monthly",
    coef: 0.540,
    pVal: 0.012,
    sig: "*",
    wtp: 15.86
  },
  {
    attribute: "2-hour Interaction",
    coef: 0.031,
    pVal: 0.854,
    sig: "",
    wtp: 0.92
  },
  {
    attribute: "4-hour Interaction",
    coef: 0.243,
    pVal: 0.164,
    sig: "",
    wtp: 7.14
  },
  {
    attribute: "Local Area Accessibility",
    coef: -0.041,
    pVal: 0.887,
    sig: "",
    wtp: -1.22
  },
  {
    attribute: "Wider Community Accessibility",
    coef: -0.814,
    pVal: 0.002,
    sig: "**",
    wtp: -23.94
  }
];

// Moderately Lonely (Table 6)
const wtpDataModLonely = [
  {
    attribute: "Community Engagement",
    coef: 0.532,
    pVal: 0.008,
    sig: "**",
    wtp: 12.69
  },
  {
    attribute: "Psychological Counselling",
    coef: 0.178,
    pVal: 0.406,
    sig: "",
    wtp: 4.25
  },
  {
    attribute: "Virtual Reality",
    coef: -0.204,
    pVal: 0.352,
    sig: "",
    wtp: -4.85
  },
  {
    attribute: "Virtual Interaction",
    coef: -0.320,
    pVal: 0.266,
    sig: "",
    wtp: -7.63
  },
  {
    attribute: "Hybrid Interaction",
    coef: -0.402,
    pVal: 0.005,
    sig: "**",
    wtp: -9.59
  },
  {
    attribute: "Weekly",
    coef: 0.555,
    pVal: 0.000,
    sig: "***",
    wtp: 13.23
  },
  {
    attribute: "Monthly",
    coef: 0.357,
    pVal: 0.067,
    sig: "",
    wtp: 8.51
  },
  {
    attribute: "2-hour Interaction",
    coef: 0.322,
    pVal: 0.039,
    sig: "*",
    wtp: 7.67
  },
  {
    attribute: "4-hour Interaction",
    coef: 0.266,
    pVal: 0.131,
    sig: "",
    wtp: 6.35
  },
  {
    attribute: "Local Area Accessibility",
    coef: 0.082,
    pVal: 0.750,
    sig: "",
    wtp: 1.95
  },
  {
    attribute: "Wider Community Accessibility",
    coef: -0.467,
    pVal: 0.043,
    sig: "*",
    wtp: -11.12
  }
];

// Severely Lonely (Table 6)
const wtpDataSevLonely = [
  {
    attribute: "Community Engagement",
    coef: 0.734,
    pVal: 0.000,
    sig: "*",
    wtp: 22.14
  },
  {
    attribute: "Psychological Counselling",
    coef: 0.317,
    pVal: 0.154,
    sig: "",
    wtp: 9.56
  },
  {
    attribute: "Virtual Reality",
    coef: -0.567,
    pVal: 0.036,
    sig: "*",
    wtp: -17.11
  },
  {
    attribute: "Virtual Interaction",
    coef: -0.353,
    pVal: 0.305,
    sig: "",
    wtp: -10.64
  },
  {
    attribute: "Hybrid Interaction",
    coef: -0.151,
    pVal: 0.366,
    sig: "",
    wtp: -4.56
  },
  {
    attribute: "Weekly",
    coef: 0.540,
    pVal: 0.000,
    sig: "***",
    wtp: 16.29
  },
  {
    attribute: "Monthly",
    coef: 0.042,
    pVal: 0.847,
    sig: "",
    wtp: 1.26
  },
  {
    attribute: "2-hour Interaction",
    coef: 0.157,
    pVal: 0.391,
    sig: "",
    wtp: 4.74
  },
  {
    attribute: "4-hour Interaction",
    coef: 0.060,
    pVal: 0.745,
    sig: "",
    wtp: 1.82
  },
  {
    attribute: "Local Area Accessibility",
    coef: 0.211,
    pVal: 0.467,
    sig: "",
    wtp: 6.38
  },
  {
    attribute: "Wider Community Accessibility",
    coef: -0.185,
    pVal: 0.495,
    sig: "",
    wtp: -5.59
  }
];

/**
 * LOAD WTP RESULTS into the relevant tables on the WTP tab.
 */
function loadWTPResults() {
  // Main model
  populateWtpTable(wtpDataMain, "wtpBodyMain");
  // Not Lonely
  populateWtpTable(wtpDataNotLonely, "wtpBodyNotLonely");
  // Moderately Lonely
  populateWtpTable(wtpDataModLonely, "wtpBodyModLonely");
  // Severely Lonely
  populateWtpTable(wtpDataSevLonely, "wtpBodySevLonely");
}

/**
 * HELPER: Populate a given table body with an array of WTP data.
 */
function populateWtpTable(dataArray, tBodyId) {
  const tBody = document.getElementById(tBodyId);
  tBody.innerHTML = "";
  dataArray.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.attribute}</td>
      <td>${item.coef.toFixed(3)}</td>
      <td>${item.pVal.toFixed(3)}</td>
      <td>${item.sig}</td>
      <td>${item.wtp.toFixed(2)}</td>
    `;
    tBody.appendChild(row);
  });
}

/****************************************************************************
 * COST-OF-LIVING MULTIPLIERS (for cost adjustment)
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
 * BUILD & SAVE SCENARIOS
 ****************************************************************************/
let scenarioList = [];

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

  // Simple constraints
  if (localCheck && widerCheck) {
    alert("You cannot select both Local Area and Wider Community for the same scenario.");
    return null;
  }
  if (weeklyCheck && monthlyCheck) {
    alert("You cannot select both Weekly and Monthly for the same scenario.");
    return null;
  }
  if (twoHCheck && fourHCheck) {
    alert("You cannot select both 2-Hour and 4-Hour sessions for the same scenario.");
    return null;
  }
  if (adjustCosts === "yes" && !state) {
    alert("Please select a state if adjusting costs for living.");
    return null;
  }

  return {
    name: "Scenario " + (scenarioList.length + 1),
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

/**
 * SAVE SCENARIO
 */
function saveScenario() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;
  scenarioList.push(scenario);
  updateScenarioTable();
  alert("Scenario saved successfully!");
}

/**
 * UPDATE SCENARIO TABLE
 */
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

/****************************************************************************
 * SINGLE-SCENARIO & MULTI-SCENARIO COMPARISONS
 ****************************************************************************/
function openSingleScenario() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;
  openResultsWindow([scenario], "Single Scenario Results");
}

function openComparison() {
  if (scenarioList.length === 0) {
    alert("No scenarios to compare.");
    return;
  }
  openResultsWindow(scenarioList, "Compare Multiple Scenarios");
}

/****************************************************************************
 * OPEN A NEW WINDOW TO DISPLAY RESULTS (CALCULATIONS, CHARTS, PDF, ETC.)
 * Here we also show an advanced cost-benefit chart using Chart.js.
 ****************************************************************************/
function openResultsWindow(scenarios, windowTitle) {
  const w = window.open("", "_blank", "width=1400,height=800,resizable,scrollbars");
  if (!w) {
    alert("Please enable popups to view results in a new window.");
    return;
  }

  // Write minimal HTML structure
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
        h1, h2, h3 {
          color: #2c3e50; 
          text-align: center;
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

      <!-- Scripts for Chart.js + PDF in child window -->
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      
      <script>
        const scenarioData = ${JSON.stringify(scenarios)};
        const mainCoeffs = ${JSON.stringify(finalCoefficients)};
        const multipliers = ${JSON.stringify(costOfLivingMultipliers)};

        window.onload = function() {
          displayScenarios();
          buildCostBenefitChart();
        };

        // Display each scenario's attributes
        function displayScenarios() {
          const container = document.getElementById('resultsContainer');
          scenarioData.forEach((sc, index) => {
            const box = document.createElement('div');
            box.className = 'scenario-box';

            const h2 = document.createElement('h2');
            h2.textContent = sc.name;
            box.appendChild(h2);

            const table = document.createElement('table');
            table.innerHTML = \`
              <thead>
                <tr><th>Attribute</th><th>Value</th></tr>
              </thead>
              <tbody>
                <tr><td>State</td><td>\${sc.state || '-'}</td></tr>
                <tr><td>Cost Adjust?</td><td>\${sc.adjustCosts}</td></tr>
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

            // Additional logic for predicted probability, cost, benefits, etc. can go here
            container.appendChild(box);
          });
        }

        // Example advanced chart for Cost-Benefit Analysis
        function buildCostBenefitChart() {
          const ctx = document.getElementById('cbaChart').getContext('2d');

          // Let's assume each scenario has an estimated cost + benefit
          // We'll do a stacked bar chart: scenario vs. cost & benefit
          const labels = scenarioData.map(s => s.name);
          // Dummy cost & benefit values for demonstration
          const costVals = scenarioData.map(s => s.cost_val * 1000); // e.g. cost_val * 1000
          const benefitVals = scenarioData.map(s => {
            // e.g. 10,000 AUD per 1% improvement * random factor
            return Math.round(Math.random() * 30000 + 5000); 
          });

          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Estimated Cost (AUD)',
                  data: costVals,
                  backgroundColor: 'rgba(231, 76, 60, 0.7)'
                },
                {
                  label: 'Estimated Benefit (AUD)',
                  data: benefitVals,
                  backgroundColor: 'rgba(39, 174, 96, 0.7)'
                }
              ]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              },
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

        // Download PDF
        function downloadPDF() {
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p','pt','a4');
          pdf.setFontSize(14);
          pdf.text("${windowTitle}", 40, 40);

          // Additional logic to capture scenario content or the chart can go here
          pdf.save("LonelyLessAustralia_Results.pdf");
        }
      </script>
    </body>
    </html>
  `);

  w.document.close();
}

/****************************************************************************
 * SUGGESTIONS FOR IMPROVEMENT
 * - Integrate actual cost-based logic instead of dummy cost*bases for the chart.
 * - Expand scenario results with real DCE calculations for each category.
 * - Implement advanced PDF exports capturing the chart & scenario details.
 * - Add real sensitivity analyses for cost/frequency toggles, etc.
 ****************************************************************************/

/****************************************************************************
 * Author: Mesfin Genie
 * Newcastle Business School, The University of Newcastle, Australia
 ****************************************************************************/
