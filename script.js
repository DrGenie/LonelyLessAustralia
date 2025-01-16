/****************************************************************************
 * SCRIPT.JS
 * 1) Tab switching
 * 2) Range slider label updates
 * 3) Main DCE coefficients & cost-of-living multipliers
 * 4) WTP data for all features with error bars (p-values, SE)
 * 5) Programme Uptake Probability bar chart
 * 6) Scenario saving & PDF export
 * 7) Realistic cost & QALY-based benefit logic
 * 8) Selection constraints
 * Author: Mesfin Genie, Newcastle Business School, The University of Newcastle, Australia
 ****************************************************************************/

/** On page load, default to introduction tab */
window.onload = function() {
  openTab('introTab', document.querySelector('.tablink'));
};

/** Tab switching function */
function openTab(tabId, btn) {
  const allTabs = document.getElementsByClassName("tabcontent");
  for (let i=0; i<allTabs.length; i++){
    allTabs[i].style.display = "none";
  }
  const allBtns = document.getElementsByClassName("tablink");
  for (let j=0; j<allBtns.length; j++){
    allBtns[j].classList.remove("active");
  }
  document.getElementById(tabId).style.display = "block";
  btn.classList.add("active");

  // Render charts if navigating to respective tabs
  if (tabId === 'wtpTab') {
    renderWTPChart();
  }
  if (tabId === 'costsTab') {
    renderCostsBenefits();
  }
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
  dist_local: 0.059,   // e.g., local accessibility
  dist_signif: -0.509, // e.g., wider community
  cost_cont: -0.036    // cost coefficient
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
 * WTP DATA FOR ALL ATTRIBUTES
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

/***************************************************************************
 * BUILD SCENARIO FROM INPUTS
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

  // Enforce selection constraints
  const programmeTypesSelected = [commCheck, psychCheck, vrCheck].filter(Boolean).length;
  if (programmeTypesSelected > 1) {
    alert("Please select only one Type of Support Programme: Community Engagement, Psychological Counselling, or Virtual Reality.");
    return null;
  }

  const methodsSelected = [virtualCheck, hybridCheck].filter(Boolean).length;
  if (methodsSelected > 1) {
    alert("Please select only one Method of Interaction: Virtual or Hybrid.");
    return null;
  }

  // Basic validations
  if (localCheck && widerCheck) {
    alert("Cannot select both Local Area and Wider Community in one scenario.");
    return null;
  }
  if (weeklyCheck && monthlyCheck) {
    alert("Cannot select both Weekly and Monthly simultaneously.");
    return null;
  }
  if (twoHCheck && fourHCheck) {
    alert("Cannot select both 2-Hour and 4-Hour sessions simultaneously.");
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
 * COMPUTE PROGRAMME UPTAKE PROBABILITY
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
 * WTP CHART WITH ERROR BARS
 ***************************************************************************/
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
      borderWidth: 1,
      // Custom property to hold error values
      error: errors
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
          text: "Willingness to Pay (A$) for Programme Attributes",
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            afterBody: function(context) {
              const index = context[0].dataIndex;
              const se = dataConfig.datasets[0].error[index];
              const pVal = wtpDataMain[index].pVal;
              return `SE: ${se}, p-value: ${pVal}`;
            }
          }
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
 * SCENARIO SAVING & PDF EXPORT
 ***************************************************************************/
let savedScenarios = [];

function saveScenario() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;

  // Assign a name to the scenario
  const scenarioName = `Scenario ${savedScenarios.length + 1}`;
  scenario.name = scenarioName;

  // Save the scenario
  savedScenarios.push(scenario);

  // Update the table
  const tableBody = document.querySelector("#scenarioTable tbody");
  const row = document.createElement("tr");

  // Create table cells based on scenario properties
  const properties = [
    "name", "state", "adjustCosts", "cost_val",
    "localCheck", "widerCheck", "weeklyCheck", "monthlyCheck",
    "virtualCheck", "hybridCheck", "twoHCheck", "fourHCheck",
    "commCheck", "psychCheck", "vrCheck"
  ];

  properties.forEach(prop => {
    const cell = document.createElement("td");
    if (prop === "cost_val") {
      cell.textContent = `A$${scenario[prop].toFixed(2)}`;
    } else if (typeof scenario[prop] === 'boolean') {
      cell.textContent = scenario[prop] ? 'Yes' : 'No';
    } else {
      cell.textContent = scenario[prop] || 'N/A';
    }
    row.appendChild(cell);
  });

  tableBody.appendChild(row);
  alert(`Scenario "${scenarioName}" saved successfully.`);
}

function openComparison() {
  if (savedScenarios.length < 2) {
    alert("Please save at least two scenarios to compare.");
    return;
  }

  // Create a new window for comparison
  const comparisonWindow = window.open("", "Comparison", "width=1400,height=1000");
  comparisonWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <title>Scenarios Comparison</title>
      <link rel="stylesheet" href="styles.css"/>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <div class="container">
        <h2>Scenarios Comparison</h2>
        <div class="chart-grid">
          <div class="chart-box">
            <h3>Programme Uptake Probability</h3>
            <canvas id="compProbChart"></canvas>
          </div>
          <div class="chart-box">
            <h3>Monetised QALY Benefits</h3>
            <canvas id="compBenefitChart"></canvas>
          </div>
        </div>
      </div>
      <script>
        const savedScenarios = ${JSON.stringify(savedScenarios)};

        const labels = savedScenarios.map(s => s.name);
        const uptakeData = savedScenarios.map(s => {
          let finalCost = s.cost_val;
          if (s.adjustCosts === 'yes' && s.state && ${JSON.stringify(costOfLivingMultipliers)}[s.state]) {
            finalCost *= ${JSON.stringify(costOfLivingMultipliers)}[s.state];
          }

          const dist_local = s.localCheck ? 1 : 0;
          const dist_signif = s.widerCheck ? 1 : 0;
          const freq_weekly = s.weeklyCheck ? 1 : 0;
          const freq_monthly = s.monthlyCheck ? 1 : 0;
          const mode_virtual = s.virtualCheck ? 1 : 0;
          const mode_hybrid = s.hybridCheck ? 1 : 0;
          const dur_2hrs = s.twoHCheck ? 1 : 0;
          const dur_4hrs = s.fourHCheck ? 1 : 0;
          const type_comm = s.commCheck ? 1 : 0;
          const type_psych = s.psychCheck ? 1 : 0;
          const type_vr = s.vrCheck ? 1 : 0;

          const U_alt = ${mainCoefficients.ASC_mean}
            + ${mainCoefficients.type_comm} * type_comm
            + ${mainCoefficients.type_psych} * type_psych
            + ${mainCoefficients.type_vr} * type_vr
            + ${mainCoefficients.mode_virtual} * mode_virtual
            + ${mainCoefficients.mode_hybrid} * mode_hybrid
            + ${mainCoefficients.freq_weekly} * freq_weekly
            + ${mainCoefficients.freq_monthly} * freq_monthly
            + ${mainCoefficients.dur_2hrs} * dur_2hrs
            + ${mainCoefficients.dur_4hrs} * dur_4hrs
            + ${mainCoefficients.dist_local} * dist_local
            + ${mainCoefficients.dist_signif} * dist_signif
            + ${mainCoefficients.cost_cont} * finalCost;

          const U_optout = ${mainCoefficients.ASC_optout};
          const exp_alt = Math.exp(U_alt);
          const exp_opt = Math.exp(U_optout);
          return (exp_alt / (exp_alt + exp_opt)) * 100;
        });

        const benefitData = savedScenarios.map(s => {
          let finalCost = s.cost_val;
          if (s.adjustCosts === 'yes' && s.state && ${JSON.stringify(costOfLivingMultipliers)}[s.state]) {
            finalCost *= ${JSON.stringify(costOfLivingMultipliers)}[s.state];
          }

          const dist_local = s.localCheck ? 1 : 0;
          const dist_signif = s.widerCheck ? 1 : 0;
          const freq_weekly = s.weeklyCheck ? 1 : 0;
          const freq_monthly = s.monthlyCheck ? 1 : 0;
          const mode_virtual = s.virtualCheck ? 1 : 0;
          const mode_hybrid = s.hybridCheck ? 1 : 0;
          const dur_2hrs = s.twoHCheck ? 1 : 0;
          const dur_4hrs = s.fourHCheck ? 1 : 0;
          const type_comm = s.commCheck ? 1 : 0;
          const type_psych = s.psychCheck ? 1 : 0;
          const type_vr = s.vrCheck ? 1 : 0;

          const U_alt = ${mainCoefficients.ASC_mean}
            + ${mainCoefficients.type_comm} * type_comm
            + ${mainCoefficients.type_psych} * type_psych
            + ${mainCoefficients.type_vr} * type_vr
            + ${mainCoefficients.mode_virtual} * mode_virtual
            + ${mainCoefficients.mode_hybrid} * mode_hybrid
            + ${mainCoefficients.freq_weekly} * freq_weekly
            + ${mainCoefficients.freq_monthly} * freq_monthly
            + ${mainCoefficients.dur_2hrs} * dur_2hrs
            + ${mainCoefficients.dur_4hrs} * dur_4hrs
            + ${mainCoefficients.dist_local} * dist_local
            + ${mainCoefficients.dist_signif} * dist_signif
            + ${mainCoefficients.cost_cont} * finalCost;

          const uptakeProbability = Math.exp(U_alt) / (Math.exp(U_alt) + Math.exp(${mainCoefficients.ASC_optout}));

          const qalyScenario = "moderate"; // Assuming moderate for comparison
          const qalyPerParticipant = 0.05; // Replace with actual value if dynamic
          const numberOfParticipants = 250 * uptakeProbability;
          const totalQALY = numberOfParticipants * qalyPerParticipant;
          const monetizedBenefits = totalQALY * 50000; // A$50,000 per QALY

          return monetizedBenefits;
        });

        // Programme Uptake Probability Chart
        const ctxProb = document.getElementById("compProbChart").getContext("2d");
        new Chart(ctxProb, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Programme Uptake (%)',
              data: uptakeData,
              backgroundColor: uptakeData.map(p => p < 30 ? 'rgba(231,76,60,0.6)'
                                     : p < 70 ? 'rgba(241,196,15,0.6)'
                                             : 'rgba(39,174,96,0.6)'),
              borderColor: uptakeData.map(p => p < 30 ? 'rgba(231,76,60,1)'
                                     : p < 70 ? 'rgba(241,196,15,1)'
                                             : 'rgba(39,174,96,1)'),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Programme Uptake Probability',
                font: { size: 16 }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }
        });

        // Monetised QALY Benefits Chart
        const ctxBenefit = document.getElementById("compBenefitChart").getContext("2d");
        new Chart(ctxBenefit, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Monetised Benefits (A$)',
              data: benefitData,
              backgroundColor: 'rgba(39,174,96,0.6)',
              borderColor: 'rgba(27, 163, 156,1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Monetised QALY Benefits',
                font: { size: 16 }
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      </script>
    </body>
    </html>
  `);
  comparisonWindow.document.close();
}

/***************************************************************************
 * PDF EXPORT FUNCTIONALITY USING jsPDF
 ***************************************************************************/
function exportToPDF() {
  if (savedScenarios.length < 1) {
    alert("No scenarios saved to export.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = margin;

  doc.setFontSize(16);
  doc.text("LonelyLessAustralia - Scenarios Comparison", pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  savedScenarios.forEach((scenario, index) => {
    // Check if adding this scenario exceeds the page height
    if (currentY + 80 > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }

    doc.setFontSize(14);
    doc.text(`Scenario ${index + 1}: ${scenario.name}`, margin, currentY);
    currentY += 7;

    doc.setFontSize(12);
    doc.text(`State: ${scenario.state || 'None'}`, margin, currentY);
    currentY += 5;
    doc.text(`Adjust for Cost of Living: ${scenario.adjustCosts === 'yes' ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Cost per Session: A$${scenario.cost_val.toFixed(2)}`, margin, currentY);
    currentY += 5;
    doc.text(`Local Area (12 km): ${scenario.localCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Wider Community (50+ km): ${scenario.widerCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Weekly: ${scenario.weeklyCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Monthly: ${scenario.monthlyCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Virtual: ${scenario.virtualCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Hybrid: ${scenario.hybridCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`2-Hour Interaction: ${scenario.twoHCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`4-Hour Interaction: ${scenario.fourHCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Community Engagement: ${scenario.commCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Psychological Counselling: ${scenario.psychCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Virtual Reality: ${scenario.vrCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 10;
  });

  doc.save("Scenarios_Comparison.pdf");
}

/***************************************************************************
 * REALISTIC COST & QALY-BASED BENEFIT LOGIC
 ***************************************************************************/
const QALY_SCENARIOS_VALUES = {
  low: 0.02,
  moderate: 0.05,
  high: 0.1
};

const VALUE_PER_QALY = 50000; // A$50,000

/** Constants for Cost Calculations */
const FIXED_COSTS = {
  advertisement: 8127.60,
  training: 26863.00
};

const VARIABLE_COSTS = {
  delivery: 18000.00,
  participantTimeTravel: 7500.00
};

const TOTAL_FIXED_COST = FIXED_COSTS.advertisement + FIXED_COSTS.training; // 34,990.60
const TOTAL_VARIABLE_COST = VARIABLE_COSTS.delivery + VARIABLE_COSTS.participantTimeTravel; // 25,500.00

let costsChartInstance = null;
let benefitsChartInstance = null;

/** Render Costs & Benefits */
function renderCostsBenefits() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;

  // Get Uptake Probability
  const pVal = computeProbability(scenario, mainCoefficients); // between 0 and 1
  const uptakePercentage = pVal * 100;

  // Number of participants
  const baseParticipants = 250;
  const numberOfParticipants = baseParticipants * pVal;

  // Get QALY Scenario
  const qalyScenario = document.getElementById("qalySelect").value;
  const qalyPerParticipant = QALY_SCENARIOS_VALUES[qalyScenario];

  // Total QALY Gains
  const totalQALY = numberOfParticipants * qalyPerParticipant;

  // Monetised Benefits
  const monetizedBenefits = totalQALY * VALUE_PER_QALY;

  // Total Intervention Cost
  const totalInterventionCost = TOTAL_FIXED_COST + (TOTAL_VARIABLE_COST * pVal);

  // Cost per Person
  const costPerPerson = totalInterventionCost / numberOfParticipants;

  // Net Benefit
  const netBenefit = monetizedBenefits - totalInterventionCost;

  // Prepare Cost Components Table
  const costComponents = [
    {
      item: "Advertisements in Local Press",
      value: 2978.80,
      quantity: 2,
      unitCost: 2978.80 / 2,
      totalCost: 2978.80
    },
    {
      item: "Printing of Leaflets",
      value: 0.12,
      quantity: 10000,
      unitCost: 0.12,
      totalCost: 1200.00
    },
    {
      item: "Parcel and Postage of Leaflets",
      value: 0.147,
      quantity: 10000,
      unitCost: 0.147,
      totalCost: 1470.00
    },
    {
      item: "Administrative Personnel",
      value: 49.99,
      quantity: 10,
      unitCost: 49.99,
      totalCost: 499.90
    },
    {
      item: "Trainer Cost for 5-hour Training Sessions",
      value: 223.86,
      quantity: 100,
      unitCost: 223.86,
      totalCost: 22386.00
    },
    {
      item: "On-Costs (30%)",
      value: 44.77,
      quantity: 100,
      unitCost: 44.77,
      totalCost: 4477.00
    },
    {
      item: "Facilitator Salaries (12 sessions x 2 h)",
      value: 100.00,
      quantity: 100,
      unitCost: 100.00,
      totalCost: 10000.00
    },
    {
      item: "Material Costs",
      value: 50.00,
      quantity: 100,
      unitCost: 50.00,
      totalCost: 5000.00
    },
    {
      item: "Venue Hire",
      value: 15.00,
      quantity: 100,
      unitCost: 15.00,
      totalCost: 3000.00
    },
    {
      item: "Time Cost for Sessions",
      value: 20.00,
      quantity: 250,
      unitCost: 20.00,
      totalCost: 5000.00
    },
    {
      item: "Travel Costs",
      value: 10.00,
      quantity: 250,
      unitCost: 10.00,
      totalCost: 2500.00
    }
  ];

  // Display in Costs & Benefits Tab
  const costsTab = document.getElementById("costsBenefitsResults");

  // Clear previous results if any
  costsTab.innerHTML = '';

  // Create Cost Components Table
  const table = document.createElement("table");
  table.id = "costComponentsTable";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Cost Item</th>
        <th>Value (A$)</th>
        <th>Quantity</th>
        <th>Unit Cost (A$)</th>
        <th>Total Cost (A$)</th>
      </tr>
    </thead>
    <tbody>
      ${costComponents.map(c => `
        <tr>
          <td>${c.item}</td>
          <td>A$${c.value.toFixed(2)}</td>
          <td>${c.quantity}</td>
          <td>A$${c.unitCost.toFixed(2)}</td>
          <td>A$${c.totalCost.toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  costsTab.appendChild(table);

  // Add Summary Calculations
  const summaryDiv = document.createElement("div");
  summaryDiv.id = "summaryCalculations";
  summaryDiv.innerHTML = `
    <h3>Cost &amp; Benefits Analysis</h3>
    <p><strong>Programme Uptake Probability:</strong> ${uptakePercentage.toFixed(2)}%</p>
    <p><strong>Number of Participants:</strong> ${numberOfParticipants.toFixed(0)}</p>
    <p><strong>Total Intervention Cost:</strong> A$${totalInterventionCost.toFixed(2)}</p>
    <p><strong>Cost per Participant:</strong> A$${costPerPerson.toFixed(2)}</p>
    <p><strong>Total QALY Gains:</strong> ${totalQALY.toFixed(2)} QALYs</p>
    <p><strong>Monetised Benefits:</strong> A$${monetizedBenefits.toLocaleString()}</p>
    <p><strong>Net Benefit:</strong> A$${netBenefit.toLocaleString()}</p>
  `;
  costsTab.appendChild(summaryDiv);

  // Render Cost & Benefit Charts Side by Side
  const chartsDiv = document.createElement("div");
  chartsDiv.className = "chart-grid";

  // Total Intervention Cost Chart
  const costChartBox = document.createElement("div");
  costChartBox.className = "chart-box";
  costChartBox.innerHTML = `<h3>Total Intervention Cost</h3><canvas id="costChart"></canvas>`;
  chartsDiv.appendChild(costChartBox);

  // Monetised Benefits Chart
  const benefitChartBox = document.createElement("div");
  benefitChartBox.className = "chart-box";
  benefitChartBox.innerHTML = `<h3>Monetised QALY Benefits</h3><canvas id="benefitChart"></canvas>`;
  chartsDiv.appendChild(benefitChartBox);

  costsTab.appendChild(chartsDiv);

  // Render Cost Chart
  const ctxCost = document.getElementById("costChart").getContext("2d");
  if (costsChartInstance) {
    costsChartInstance.destroy();
  }
  costsChartInstance = new Chart(ctxCost, {
    type: 'bar',
    data: {
      labels: ["Total Intervention Cost"],
      datasets: [{
        label: 'A$',
        data: [totalInterventionCost],
        backgroundColor: 'rgba(231,76,60,0.6)',
        borderColor: 'rgba(192,57,43,1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Total Intervention Cost',
          font: { size: 16 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: totalInterventionCost * 1.2
        }
      }
    }
  });

  // Render Benefit Chart
  const ctxBenefit = document.getElementById("benefitChart").getContext("2d");
  if (benefitsChartInstance) {
    benefitsChartInstance.destroy();
  }
  benefitsChartInstance = new Chart(ctxBenefit, {
    type: 'bar',
    data: {
      labels: ["Monetised QALY Benefits"],
      datasets: [{
        label: 'A$',
        data: [monetizedBenefits],
        backgroundColor: 'rgba(39,174,96,0.6)',
        borderColor: 'rgba(27, 163, 156,1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Monetised QALY Benefits',
          font: { size: 16 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: monetizedBenefits * 1.2
        }
      }
    }
  });
}

/***************************************************************************
 * PDF EXPORT FUNCTIONALITY USING jsPDF
 ***************************************************************************/
function exportToPDF() {
  if (savedScenarios.length < 1) {
    alert("No scenarios saved to export.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = margin;

  doc.setFontSize(16);
  doc.text("LonelyLessAustralia - Scenarios Comparison", pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  savedScenarios.forEach((scenario, index) => {
    // Check if adding this scenario exceeds the page height
    if (currentY + 80 > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }

    doc.setFontSize(14);
    doc.text(`Scenario ${index + 1}: ${scenario.name}`, margin, currentY);
    currentY += 7;

    doc.setFontSize(12);
    doc.text(`State: ${scenario.state || 'None'}`, margin, currentY);
    currentY += 5;
    doc.text(`Adjust for Cost of Living: ${scenario.adjustCosts === 'yes' ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Cost per Session: A$${scenario.cost_val.toFixed(2)}`, margin, currentY);
    currentY += 5;
    doc.text(`Local Area (12 km): ${scenario.localCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Wider Community (50+ km): ${scenario.widerCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Weekly: ${scenario.weeklyCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Monthly: ${scenario.monthlyCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Virtual: ${scenario.virtualCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Hybrid: ${scenario.hybridCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`2-Hour Interaction: ${scenario.twoHCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`4-Hour Interaction: ${scenario.fourHCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Community Engagement: ${scenario.commCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Psychological Counselling: ${scenario.psychCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 5;
    doc.text(`Virtual Reality: ${scenario.vrCheck ? 'Yes' : 'No'}`, margin, currentY);
    currentY += 10;
  });

  doc.save("Scenarios_Comparison.pdf");
}

/***************************************************************************
 * PROGRAMME UPTAKE PROBABILITY AND COSTS & BENEFITS INTEGRATION
 ***************************************************************************/

/** Link "Calculate & View Results" button to trigger calculations */
function openSingleScenario() {
  renderProbChart();
  renderCostsBenefits();
}

/***************************************************************************
 * PROGRAMME UPTAKE PROBABILITY CHART
 ***************************************************************************/
let probChartInstance = null;
function renderProbChart() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;

  const pVal = computeProbability(scenario, mainCoefficients)*100;
  const ctx = document.getElementById("probChartMain").getContext("2d");

  // Destroy old chart if exists
  if (probChartInstance) {
    probChartInstance.destroy();
  }

  probChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Programme Uptake Probability"],
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
          text: `Programme Uptake Probability = ${pVal.toFixed(2)}%`,
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
