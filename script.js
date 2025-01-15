/**********************************************************************
 * 1) TAB SWITCHING
 **********************************************************************/
function openTab(tabId, element) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  const tablinks = document.getElementsByClassName("tablink");
  for (let j = 0; j < tablinks.length; j++) {
    tablinks[j].classList.remove("active");
  }
  document.getElementById(tabId).style.display = "block";
  element.classList.add("active");
}

/**********************************************************************
 * 2) DCE CALCULATIONS + COSTS + LONELINESS
 *    (You can modify these to suit your final data)
 **********************************************************************/
const finalCoefficients = {
  main: {
    ASC_mean: -0.112,
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

// Example cost-of-living multipliers
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

// Basic function to compute logit probability
function computeProbability(scenario, coefs) {
  let finalCost = scenario.cost_val;
  if (scenario.adjustCosts === "yes" && scenario.state && costOfLivingMultipliers[scenario.state]) {
    finalCost = scenario.cost_val * costOfLivingMultipliers[scenario.state];
  }
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

  const exp_alt = Math.exp(U_alt);
  const exp_opt = Math.exp(coefs.ASC_optout || 0);
  return exp_alt / (exp_alt + exp_opt);
}

// For cost-benefit analysis
// Simple example: we assume 10,000 AUD benefit per 1% probability
const benefitPerPercent = 10000;

/**********************************************************************
 * 3) UPDATE COST LABEL
 **********************************************************************/
function updateCostDisplay(val) {
  document.getElementById("costLabel").textContent = val;
}

/**********************************************************************
 * 4) SCENARIO BUILDERS + SAVING
 **********************************************************************/
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

  // Basic constraints
  if (localCheck && widerCheck) {
    alert("You cannot select both Local Area and Wider Community for the same scenario.");
    return null;
  }
  if (weeklyCheck && monthlyCheck) {
    alert("You cannot select both Weekly and Monthly for the same scenario.");
    return null;
  }
  if (twoHCheck && fourHCheck) {
    alert("You cannot select both 2-Hour and 4-Hour sessions simultaneously.");
    return null;
  }
  if (adjustCosts === "yes" && !state) {
    alert("Please select a state if you choose to adjust costs.");
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

function saveScenario() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;
  scenarioList.push(scenario);
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

/**********************************************************************
 * 5) OPEN SINGLE-SCENARIO RESULTS WINDOW
 **********************************************************************/
function openSingleScenario() {
  const sc = buildScenarioFromInputs();
  if (!sc) return;
  openResultsWindow([sc], "Single Scenario Results");
}

/**********************************************************************
 * 6) OPEN COMPARISON WINDOW
 **********************************************************************/
function openComparison() {
  if (scenarioList.length === 0) {
    alert("No scenarios to compare!");
    return;
  }
  openResultsWindow(scenarioList, "Compare Multiple Scenarios");
}

/**********************************************************************
 * 7) MAIN RESULTS WINDOW + PDF
 **********************************************************************/
function openResultsWindow(scenarios, windowTitle) {
  const w = window.open("", "_blank", "width=1400,height=800,resizable,scrollbars");
  if (!w) {
    alert("Please allow popups to see the results window.");
    return;
  }

  // Basic HTML
  w.document.write(`
  <!DOCTYPE html>
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
      h1, h2 {
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
        text-align: left;
      }
      th {
        background: #2980b9;
        color: #fff;
        font-weight: normal;
      }
      .charts-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 20px;
      }
      .chart-box {
        width: 300px; 
        height: 300px; 
        background: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 6px;
        position: relative;
      }
      .pdf-button {
        text-align: center;
        margin: 20px 0;
      }
      .pdf-button button {
        background: #2980b9;
        color: #fff;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        margin: 0 10px;
      }
      .pdf-button button:hover {
        background: #1f6391;
      }
      .loneliness-note {
        background: #fff3db;
        padding: 10px;
        margin: 10px 0;
        border-left: 4px solid #f39c12;
      }
    </style>
  </head>
  <body>
    <h1>${windowTitle}</h1>
    <p class="loneliness-note">
      This report includes main DCE-based probability calculations, plus 
      separate analyses by loneliness categories (Not Lonely, Moderately Lonely, Severely Lonely).
      Negative coefficients reduce utility, positive coefficients increase utility, and cost 
      coefficients are negative.
    </p>
    <div id="resultsContainer"></div>
    <div class="pdf-button">
      <button onclick="downloadPDF()">Download PDF</button>
    </div>

    <!-- Chart.js + jsPDF in child window -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    
    <script>
      const scenariosData = ${JSON.stringify(scenarios)};
      const finalCoefs = ${JSON.stringify(finalCoefficients)};
      const costMultipliers = ${JSON.stringify(costOfLivingMultipliers)};
      const benefitPerPercent = ${benefitPerPercent};

      window.onload = function() {
        buildScenarioViews();
      };

      function buildScenarioViews() {
        const container = document.getElementById('resultsContainer');
        scenariosData.forEach((sc, idx) => {
          const box = document.createElement('div');
          box.className = 'scenario-box';

          // Basic scenario table
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
              <tr><td>Adjust Costs?</td><td>\${sc.adjustCosts}</td></tr>
              <tr><td>Base Cost (AUD)</td><td>\${sc.cost_val}</td></tr>
              <tr><td>Local Area?</td><td>\${sc.localCheck}</td></tr>
              <tr><td>Wider Community?</td><td>\${sc.widerCheck}</td></tr>
              <tr><td>Weekly?</td><td>\${sc.weeklyCheck}</td></tr>
              <tr><td>Monthly?</td><td>\${sc.monthlyCheck}</td></tr>
              <tr><td>Virtual Only?</td><td>\${sc.virtualCheck}</td></tr>
              <tr><td>Hybrid?</td><td>\${sc.hybridCheck}</td></tr>
              <tr><td>2-Hour?</td><td>\${sc.twoHCheck}</td></tr>
              <tr><td>4-Hour?</td><td>\${sc.fourHCheck}</td></tr>
              <tr><td>Community Engagement?</td><td>\${sc.commCheck}</td></tr>
              <tr><td>Psych Counselling?</td><td>\${sc.psychCheck}</td></tr>
              <tr><td>Virtual Reality?</td><td>\${sc.vrCheck}</td></tr>
            </tbody>
          \`;
          box.appendChild(table);

          // Compute probabilities
          const pMain = computeProb(sc, finalCoefs.main);
          const pNotLonely = computeProb(sc, finalCoefs.notLonely);
          const pModLonely = computeProb(sc, finalCoefs.moderatelyLonely);
          const pSevLonely = computeProb(sc, finalCoefs.severelyLonely);

          // Compute cost-benefit
          const totalBenefits = pMain * 100 * benefitPerPercent; // example
          const totalCost = sc.cost_val * 1000; // a dummy total cost if you want (modify as needed)
          const netBenefit = totalBenefits - totalCost;
          const bcr = totalCost === 0 ? 0 : (totalBenefits / totalCost);

          // Show Probability + CBA
          const pBox = document.createElement('p');
          pBox.innerHTML = \`
            <strong>Main Probability:</strong> \${(pMain*100).toFixed(2)}% <br/>
            <strong>Not Lonely:</strong> \${(pNotLonely*100).toFixed(2)}% | 
            <strong>Moderately Lonely:</strong> \${(pModLonely*100).toFixed(2)}% | 
            <strong>Severely Lonely:</strong> \${(pSevLonely*100).toFixed(2)}% <br/>
            <strong>Estimated Benefits:</strong> \$\${totalBenefits.toFixed(0)} <br/>
            <strong>Estimated Cost:</strong> \$\${totalCost.toFixed(0)} <br/>
            <strong>Net Benefit:</strong> \$\${netBenefit.toFixed(0)} | 
            <strong>BCR:</strong> \${bcr.toFixed(2)}
          \`;
          box.appendChild(pBox);

          // Show charts
          const chartDiv = document.createElement('div');
          chartDiv.className = 'charts-container';

          // 1) main prob
          chartDiv.appendChild(buildChartCanvas('main_' + idx));
          // 2) not lonely
          chartDiv.appendChild(buildChartCanvas('notLonely_' + idx));
          // 3) mod lonely
          chartDiv.appendChild(buildChartCanvas('modLonely_' + idx));
          // 4) sev lonely
          chartDiv.appendChild(buildChartCanvas('sevLonely_' + idx));

          box.appendChild(chartDiv);
          container.appendChild(box);

          // after DOM insert, init charts
          initDoughnutChart('main_' + idx, 'Main Probability', pMain);
          initDoughnutChart('notLonely_' + idx, 'Not Lonely', pNotLonely);
          initDoughnutChart('modLonely_' + idx, 'Moderately Lonely', pModLonely);
          initDoughnutChart('sevLonely_' + idx, 'Severely Lonely', pSevLonely);
        });
      }

      function buildChartCanvas(id) {
        const cDiv = document.createElement('div');
        cDiv.className = 'chart-box';
        const cnv = document.createElement('canvas');
        cnv.id = id;
        cDiv.appendChild(cnv);
        return cDiv;
      }

      function initDoughnutChart(canvasId, label, prob) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Uptake Probability', 'Remaining'],
            datasets: [{
              data: [prob, 1-prob],
              backgroundColor: pickColour(prob),
              borderColor: '#fff',
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
                text: label + ' (' + (prob*100).toFixed(2) + '%)'
              }
            }
          }
        });
      }

      function pickColour(prob) {
        if (prob < 0.3) return ['rgba(231,76,60,0.7)','rgba(236,240,241,0.3)'];
        if (prob < 0.7) return ['rgba(241,196,15,0.7)','rgba(236,240,241,0.3)'];
        return ['rgba(39,174,96,0.7)','rgba(236,240,241,0.3)'];
      }

      function computeProb(sc, coefs) {
        // replicate parent's computeProbability logic
        let finalCost = sc.cost_val;
        if (sc.adjustCosts === 'yes' && sc.state && costMultipliers[sc.state]) {
          finalCost = sc.cost_val * costMultipliers[sc.state];
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

        const exp_alt = Math.exp(U_alt);
        const exp_opt = Math.exp(coefs.ASC_optout);
        return exp_alt / (exp_alt + exp_opt);
      }

      function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p','pt','a4');
        pdf.setFontSize(14);
        pdf.text("${windowTitle}", 40, 40);
        let yOff = 60;

        const scenarioDivs = document.getElementsByClassName("scenario-box");
        for (let i=0; i<scenarioDivs.length; i++) {
          if (i>0) pdf.addPage();
          yOff = 40;
          pdf.text(scenariosData[i].name, 40, yOff);
          yOff+=15;

          // Attempt to embed the main chart images in PDF
          const mainCanvas = document.getElementById("main_" + i);
          if (mainCanvas) {
            const mainImg = mainCanvas.toDataURL("image/png");
            pdf.addImage(mainImg, "PNG", 40, yOff, 200, 200);
          }
          const notCanvas = document.getElementById("notLonely_" + i);
          if (notCanvas) {
            const notImg = notCanvas.toDataURL("image/png");
            pdf.addImage(notImg, "PNG", 300, yOff, 200, 200);
          }
          yOff += 220;
          const modCanvas = document.getElementById("modLonely_" + i);
          if (modCanvas) {
            const modImg = modCanvas.toDataURL("image/png");
            pdf.addImage(modImg, "PNG", 40, yOff, 200, 200);
          }
          const sevCanvas = document.getElementById("sevLonely_" + i);
          if (sevCanvas) {
            const sevImg = sevCanvas.toDataURL("image/png");
            pdf.addImage(sevImg, "PNG", 300, yOff, 200, 200);
          }
          yOff += 250;
        }

        pdf.save("LonelyLessAustralia_Results.pdf");
      }
    </script>
  </body>
  </html>
  `);

  w.document.close();
}
