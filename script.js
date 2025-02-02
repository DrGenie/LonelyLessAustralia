
/****************************************************************************
 * SCRIPT.JS
 * Enhanced tabs with event listenerss, improved Inputts layouts,
 * interactive cost–benefit analysis, dynamic doughnut chart for predicted uptake with refined recommendationss,
 * and export to PDF functionality.
 ****************************************************************************/

/* Attach event listeners when DOM is loaded */
document.addEventListener("DOMContentLoaded", function() {
  const tabButtons = document.querySelectorAll(".tablink");
  tabButtons.forEach(button => {
    button.addEventListener("click", function() {
      openTab(this.getAttribute("data-tab"), this);
    });
  });
  // Set default tab
  openTab("introTab", document.querySelector(".tablink"));
});

/** Tab Switching Function */
function openTab(tabId, btn) {
  const tabs = document.querySelectorAll(".tabcontent");
  tabs.forEach(tab => tab.style.display = "none");
  const tabButtons = document.querySelectorAll(".tablink");
  tabButtons.forEach(button => {
    button.classList.remove("active");
    button.setAttribute("aria-selected", "false");
  });
  document.getElementById(tabId).style.display = "block";
  btn.classList.add("active");
  btn.setAttribute("aria-selected", "true");

  if (tabId === 'wtpTab') renderWTPChart();
  if (tabId === 'costsTab') renderCostsBenefits();
  if (tabId === 'probTab') renderProbChart();
}

/** Update Range Slider Display */
function updateCostDisplay(val) {
  document.getElementById("costLabel").textContent = val;
}

/***************************************************************************
 * Main DCE Coefficients & Cost Multipliers
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
  dist_local: 0.059,
  dist_signif: -0.509,
  cost_cont: -0.036
};

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
 * WTP Data
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
 * Build Scenario From Inputs & Validations
 ***************************************************************************/
function buildScenarioFromInputs() {
  const state = document.getElementById("state_select").value;
  const adjustCosts = document.getElementById("adjustCosts").value;
  const cost_val = parseInt(document.getElementById("costSlider").value, 10);
  
  // Required radio selections
  const support = document.querySelector('input[name="support"]:checked');
  const frequency = document.querySelector('input[name="frequency"]:checked');
  const duration = document.querySelector('input[name="duration"]:checked');
  const accessibility = document.querySelector('input[name="accessibility"]:checked');
  
  // Method is optional; if not selected, assume in-person.
  const method = document.querySelector('input[name="method"]:checked');
  let virtualCheck = false, hybridCheck = false;
  if (method) {
    virtualCheck = method.value === "virtual";
    hybridCheck = method.value === "hybrid";
  }
  
  if (!support || !frequency || !duration || !accessibility) {
    alert("Please select a level for all required input cards (Support, Frequency, Duration, Accessibility).");
    return null;
  }
  
  const commCheck = support.value === "community";
  const psychCheck = support.value === "counselling";
  const vrCheck = support.value === "vr";
  
  const weeklyCheck = frequency.value === "weekly";
  const monthlyCheck = frequency.value === "monthly";
  
  const twoHCheck = duration.value === "2hr";
  const fourHCheck = duration.value === "4hr";
  
  const localCheck = accessibility.value === "local";
  const widerCheck = accessibility.value === "wider";
  
  const uptake = computeProbability({ state, adjustCosts, cost_val, localCheck, widerCheck, weeklyCheck, monthlyCheck, virtualCheck, hybridCheck, twoHCheck, fourHCheck, commCheck, psychCheck, vrCheck }, mainCoefficients) * 100;
  const baseParticipants = 250;
  const probForParticipants = computeProbability({ state, adjustCosts, cost_val, localCheck, widerCheck, weeklyCheck, monthlyCheck, virtualCheck, hybridCheck, twoHCheck, fourHCheck, commCheck, psychCheck, vrCheck }, mainCoefficients);
  const numberOfParticipants = baseParticipants * probForParticipants;
  const QALY_SCENARIO_VALUES = { low: 0.02, moderate: 0.05, high: 0.1 };
  const qalyScenario = document.getElementById("qalySelect") ? document.getElementById("qalySelect").value : "moderate";
  const qalyPerParticipant = QALY_SCENARIO_VALUES[qalyScenario];
  const totalQALY = numberOfParticipants * qalyPerParticipant;
  const VALUE_PER_QALY = 50000;
  const FIXED_TOTAL = 2978.80 + 26863.00;
  const VARIABLE_TOTAL = (0.12 * 10000) + (0.15 * 10000) + (49.99 * 10) + (223.86 * 100) +
                         (44.77 * 100) + (100.00 * 100) + (50.00 * 100) + (15.00 * 100) +
                         (20.00 * 250) + (10.00 * 250);
  const totalCost = FIXED_TOTAL + (VARIABLE_TOTAL * probForParticipants);
  const monetizedBenefits = totalQALY * VALUE_PER_QALY;
  const netBenefit = monetizedBenefits - totalCost;
  
  return { state, adjustCosts, cost_val, localCheck, widerCheck, weeklyCheck, monthlyCheck, virtualCheck, hybridCheck, twoHCheck, fourHCheck, commCheck, psychCheck, vrCheck, predictedUptake: uptake.toFixed(2), netBenefit: netBenefit.toFixed(2) };
}

/***************************************************************************
 * Compute Programme Uptake Probability
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
  return Math.exp(U_alt) / (Math.exp(U_alt) + Math.exp(U_optout));
}

/***************************************************************************
 * Render WTP Chart with Error Bars
 ***************************************************************************/
let wtpChartInstance = null;
function renderWTPChart() {
  const ctx = document.getElementById("wtpChartMain").getContext("2d");
  if (wtpChartInstance) wtpChartInstance.destroy();
  const labels = wtpDataMain.map(item => item.attribute);
  const values = wtpDataMain.map(item => item.wtp);
  const errors = wtpDataMain.map(item => item.se);
  const dataConfig = {
    labels,
    datasets: [{
      label: "WTP (A$)",
      data: values,
      backgroundColor: values.map(v => v >= 0 ? 'rgba(0,123,255,0.6)' : 'rgba(220,53,69,0.6)'),
      borderColor: values.map(v => v >= 0 ? 'rgba(0,123,255,1)' : 'rgba(220,53,69,1)'),
      borderWidth: 1,
      error: errors
    }]
  };
  wtpChartInstance = new Chart(ctx, {
    type: 'bar',
    data: dataConfig,
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: { display: false },
        title: { display: true, text: "WTP (A$) for Attributes", font: { size: 16 } },
        tooltip: {
          callbacks: {
            afterBody: function(context) {
              const idx = context[0].dataIndex;
              return `SE: ${dataConfig.datasets[0].error[idx]}, p-value: ${wtpDataMain[idx].pVal}`;
            }
          }
        }
      }
    },
    plugins: [{
      id: 'errorbars',
      afterDraw: chart => {
        const { ctx, scales: { y } } = chart;
        chart.getDatasetMeta(0).data.forEach((bar, i) => {
          const centerX = bar.x;
          const value = values[i];
          const se = errors[i];
          if (typeof se === 'number') {
            const topY = y.getPixelForValue(value + se);
            const bottomY = y.getPixelForValue(value - se);
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.moveTo(centerX, topY);
            ctx.lineTo(centerX, bottomY);
            ctx.moveTo(centerX - 5, topY);
            ctx.lineTo(centerX + 5, topY);
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
 * Toggle Detailed Cost Breakdown and Benefits Analysis
 ***************************************************************************/
function toggleCostBreakdown() {
  const breakdown = document.getElementById("detailedCostBreakdown");
  breakdown.style.display = (breakdown.style.display === "none" || breakdown.style.display === "") ? "flex" : "none";
}
function toggleBenefitsAnalysis() {
  const benefits = document.getElementById("detailedBenefitsAnalysis");
  benefits.style.display = (benefits.style.display === "none" || benefits.style.display === "") ? "flex" : "none";
}

/***************************************************************************
 * Scenario Saving & PDF Export
 ***************************************************************************/
let savedScenarios = [];
function saveScenario() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;
  scenario.name = `Scenario ${savedScenarios.length + 1}`;
  savedScenarios.push(scenario);
  const tableBody = document.querySelector("#scenarioTable tbody");
  const row = document.createElement("tr");
  const props = ["name", "state", "adjustCosts", "cost_val", "localCheck", "widerCheck", "weeklyCheck", "monthlyCheck", "virtualCheck", "hybridCheck", "twoHCheck", "fourHCheck", "commCheck", "psychCheck", "vrCheck", "predictedUptake", "netBenefit"];
  props.forEach(prop => {
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
  alert(`Scenario "${scenario.name}" saved successfully.`);
}

function openComparison() {
  if (savedScenarios.length < 2) {
    alert("Save at least two scenarios to compare.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 15;
  doc.setFontSize(16);
  doc.text("LonelyLessAustralia - Scenarios Comparison", pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;
  savedScenarios.forEach((scenario, index) => {
    if (currentY > 260) {
      doc.addPage();
      currentY = 15;
    }
    doc.setFontSize(14);
    doc.text(`Scenario ${index + 1}: ${scenario.name}`, 15, currentY);
    currentY += 7;
    doc.setFontSize(12);
    doc.text(`State: ${scenario.state || 'None'}`, 15, currentY);
    currentY += 5;
    doc.text(`Cost Adjust: ${scenario.adjustCosts === 'yes' ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`Cost per Session: A$${scenario.cost_val.toFixed(2)}`, 15, currentY);
    currentY += 5;
    doc.text(`Local: ${scenario.localCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`Wider: ${scenario.widerCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`Weekly: ${scenario.weeklyCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`Monthly: ${scenario.monthlyCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`Virtual: ${scenario.virtualCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`Hybrid: ${scenario.hybridCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`2-Hour: ${scenario.twoHCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`4-Hour: ${scenario.fourHCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`Community: ${scenario.commCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`Counselling: ${scenario.psychCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`VR: ${scenario.vrCheck ? 'Yes' : 'No'}`, 15, currentY);
    currentY += 5;
    doc.text(`Predicted Uptake: ${scenario.predictedUptake}%`, 15, currentY);
    currentY += 5;
    doc.text(`Net Benefit: A$${scenario.netBenefit}`, 15, currentY);
    currentY += 10;
  });
  doc.save("Scenarios_Comparison.pdf");
}

/***************************************************************************
 * Modal Functions for Results
 ***************************************************************************/
function openModal() {
  document.getElementById("resultModal").style.display = "block";
}
function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}

/***************************************************************************
 * Integration: Calculate & View Results from Inputs Tab
 ***************************************************************************/
function openSingleScenario() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;
  renderCostsBenefits();
  const uptakeVal = computeProbability(scenario, mainCoefficients) * 100;
  const recommendation = getRecommendation(scenario, uptakeVal);
  document.getElementById("modalResults").innerHTML = `<h4>Calculation Results</h4>
    <p><strong>Predicted Uptake:</strong> ${uptakeVal.toFixed(1)}%</p>
    <p>${recommendation}</p>`;
  openModal();
  renderProbChart();
}

/***************************************************************************
 * Render Predicted Programme Uptake Chart (Doughnut) with Dynamic Recommendations
 ***************************************************************************/
let uptakeChart = null;  // Single declaration.
function renderProbChart() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;
  const pVal = computeProbability(scenario, mainCoefficients) * 100;
  drawUptakeChart(pVal);
  const recommendation = getRecommendation(scenario, pVal);
  // Update modal if already open.
  document.getElementById("modalResults").innerHTML = `<h4>Calculation Results</h4>
    <p><strong>Predicted Uptake:</strong> ${pVal.toFixed(1)}%</p>
    <p>${recommendation}</p>`;
}

/** Draw Uptake Chart (Doughnut) */
function drawUptakeChart(uptakeVal) {
  const ctx = document.getElementById("uptakeChart").getContext("2d");
  if (uptakeChart) uptakeChart.destroy();
  uptakeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Uptake", "Non‑uptake"],
      datasets: [{
        data: [uptakeVal, 100 - uptakeVal],
        backgroundColor: ["#28a745", "#dc3545"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Predicted Programme Uptake: ${uptakeVal.toFixed(1)}%`,
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.toFixed(1)}%`;
            }
          }
        }
      }
    }
  });
}

/***************************************************************************
 * Dynamic Recommendation for Predicted Programme Uptake
 * (Mutually exclusive support types are not integrated)
 ***************************************************************************/
function getRecommendation(scenario, uptake) {
  let rec = "Recommendation: ";
  
  // Method
  if (!scenario.virtualCheck && !scenario.hybridCheck) {
    rec += "Delivery defaults to in-person. ";
  } else if (scenario.virtualCheck && uptake < 50) {
    rec += "Fully virtual delivery may lower uptake; consider switching to a hybrid or in-person approach. ";
  } else if (scenario.hybridCheck && uptake < 50) {
    rec += "Hybrid delivery may benefit from increasing in-person elements. ";
  }
  
  // Support type (only one is selected)
  if (scenario.commCheck && uptake < 40) {
    rec += "Promote community engagement more strongly. ";
  } else if (scenario.psychCheck && uptake < 40) {
    rec += "Counselling alone may be less appealing; consider additional engagement strategies. ";
  } else if (scenario.vrCheck && uptake < 40) {
    rec += "VR-based sessions may be less effective; consider alternative support methods. ";
  }
  
  // Frequency and Duration
  if (scenario.monthlyCheck && uptake < 50) {
    rec += "Switch from monthly to weekly sessions to improve uptake. ";
  }
  if (scenario.twoHCheck && uptake < 50) {
    rec += "Shorter interactions might attract more participants. ";
  } else if (scenario.fourHCheck && uptake >= 70) {
    rec += "Longer interactions are effective. ";
  }
  
  // Accessibility
  if (scenario.widerCheck && uptake < 50) {
    rec += "Offering the programme locally could boost uptake. ";
  }
  
  if (uptake >= 70) {
    rec = "Uptake is high. The current configuration is effective.";
  }
  
  return rec;
}

/***************************************************************************
 * Render Costs & Benefits Analysis (Combined Bar Chart)
 ***************************************************************************/
let combinedChartInstance = null;
const QALY_SCENARIO_VALUES = { low: 0.02, moderate: 0.05, high: 0.1 };
const VALUE_PER_QALY = 50000;
const FIXED_COSTS = { advertisement: 2978.80 };
const VARIABLE_COSTS = { 
  printing: 0.12 * 10000, 
  postage: 0.15 * 10000, 
  admin: 49.99 * 10, 
  trainer: 223.86 * 100, 
  oncosts: 44.77 * 100, 
  facilitator: 100.00 * 100, 
  materials: 50.00 * 100, 
  venue: 15.00 * 100, 
  sessionTime: 20.00 * 250, 
  travel: 10.00 * 250 
};
const FIXED_TOTAL = FIXED_COSTS.advertisement + 26863.00;
const VARIABLE_TOTAL = VARIABLE_COSTS.printing + VARIABLE_COSTS.postage + VARIABLE_COSTS.admin + VARIABLE_COSTS.trainer +
                         VARIABLE_COSTS.oncosts + VARIABLE_COSTS.facilitator + VARIABLE_COSTS.materials +
                         VARIABLE_COSTS.venue + VARIABLE_COSTS.sessionTime + VARIABLE_COSTS.travel;

function renderCostsBenefits() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;
  const pVal = computeProbability(scenario, mainCoefficients);
  const uptakePercentage = pVal * 100;
  const baseParticipants = 250;
  const numberOfParticipants = baseParticipants * pVal;
  const qalyScenario = document.getElementById("qalySelect").value;
  const qalyPerParticipant = QALY_SCENARIO_VALUES[qalyScenario];
  const totalQALY = numberOfParticipants * qalyPerParticipant;
  const monetizedBenefits = totalQALY * VALUE_PER_QALY;
  const totalInterventionCost = FIXED_TOTAL + (VARIABLE_TOTAL * pVal);
  const costPerPerson = totalInterventionCost / numberOfParticipants;
  const netBenefit = monetizedBenefits - totalInterventionCost;
  
  scenario.predictedUptake = uptakePercentage.toFixed(2);
  scenario.netBenefit = netBenefit.toFixed(2);
  
  const costsTab = document.getElementById("costsBenefitsResults");
  costsTab.innerHTML = "";
  
  const summaryDiv = document.createElement("div");
  summaryDiv.className = "calculation-info";
  summaryDiv.innerHTML = `
    <h4>Cost &amp; Benefits Analysis</h4>
    <p><strong>Uptake:</strong> ${uptakePercentage.toFixed(2)}%</p>
    <p><strong>Participants:</strong> ${numberOfParticipants.toFixed(0)}</p>
    <p><strong>Total Intervention Cost:</strong> A$${totalInterventionCost.toFixed(2)}</p>
    <p><strong>Cost per Participant:</strong> A$${costPerPerson.toFixed(2)}</p>
    <p><strong>Total QALYs:</strong> ${totalQALY.toFixed(2)}</p>
    <p><strong>Monetised Benefits:</strong> A$${monetizedBenefits.toLocaleString()}</p>
    <p><strong>Net Benefit:</strong> A$${netBenefit.toLocaleString()}</p>
    <p>This analysis combines fixed costs (advertisements and training) with variable costs (printing, postage, administrative personnel, trainer cost, on‑costs, facilitator salaries, material costs, venue hire, session time, and travel). Benefits are calculated based on QALY gains multiplied by A$50,000.</p>
  `;
  costsTab.appendChild(summaryDiv);
  
  const combinedChartContainer = document.createElement("div");
  combinedChartContainer.id = "combinedChartContainer";
  combinedChartContainer.innerHTML = `<canvas id="combinedChart"></canvas>`;
  costsTab.appendChild(combinedChartContainer);
  
  const ctxCombined = document.getElementById("combinedChart").getContext("2d");
  if (combinedChartInstance) combinedChartInstance.destroy();
  combinedChartInstance = new Chart(ctxCombined, {
    type: 'bar',
    data: {
      labels: ["Total Cost", "Monetised Benefits", "Net Benefit"],
      datasets: [{
        label: "A$",
        data: [totalInterventionCost, monetizedBenefits, netBenefit],
        backgroundColor: [
          'rgba(220,53,69,0.6)',
          'rgba(40,167,69,0.6)',
          'rgba(255,193,7,0.6)'
        ],
        borderColor: [
          'rgba(220,53,69,1)',
          'rgba(40,167,69,1)',
          'rgba(255,193,7,1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Combined Cost-Benefit Analysis", font: { size: 16 } }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(totalInterventionCost, monetizedBenefits, Math.abs(netBenefit)) * 1.2
        }
      }
    }
  });
}
