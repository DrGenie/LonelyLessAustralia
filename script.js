/************************************************************
 * SCENARIO DATA & COEFFICIENTS
 * (All signs carefully applied so that negative cost_coefs
 *  reduce utility, positive attribute_coefs increase it, etc.)
 ************************************************************/

/** Final DCE Coefficients (Sample) for Predicted Probability **/
const finalCoefficients = {
  main: {
    // Intercept
    ASC_mean: -0.112, 
    // Alternative specific constant: opt-out
    ASC_optout: 0.131,
    // Attributes
    type_comm: 0.527,       // +ve -> increases utility
    type_psych: 0.156,      // +ve
    type_vr: -0.349,        // -ve
    mode_virtual: -0.426,   // -ve
    mode_hybrid: -0.289,    // -ve
    freq_weekly: 0.617,     // +ve
    freq_monthly: 0.336,    // +ve
    dur_2hrs: 0.185,        // +ve
    dur_4hrs: 0.213,        // +ve
    dist_local: 0.059,      // +ve
    dist_signif: -0.509,    // -ve
    cost_cont: -0.036       // -ve -> higher cost lowers utility
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

/** COST OF LIVING MULTIPLIERS **/
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

/** SCENARIO ARRAY - for multiple comparisons **/
let scenarioList = [];

/************************************************************
 * TABS: Show/Hide logic
 ************************************************************/
function openTab(evt, tabName) {
  // Hide all .tabcontent
  const tabcontents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }
  // Remove "active" from all tablinks
  const tablinks = document.getElementsByClassName("tablink");
  for (let j = 0; j < tablinks.length; j++) {
    tablinks[j].classList.remove("active");
  }
  // Show current tab, add "active" to this button
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

/************************************************************
 * SLIDER for COST
 ************************************************************/
function updateCostLabel(val) {
  document.getElementById("cost_label").textContent = val;
}

/************************************************************
 * SAVE SCENARIO
 ************************************************************/
function saveScenario() {
  const scenarioName = prompt("Enter a name for this scenario:", "Scenario " + (scenarioList.length + 1));
  if (!scenarioName) return; // user cancelled

  // Gather inputs
  const state = document.getElementById("state_select").value;
  const adjustCosts = document.getElementById("adjust_costs").value;
  const cost_val = parseInt(document.getElementById("cost_slider").value, 10);

  // Checkboxes
  const localSelected = document.getElementById("local_cb").checked;
  const widerSelected = document.getElementById("wider_cb").checked;
  const weeklySelected = document.getElementById("weekly_cb").checked;
  const monthlySelected = document.getElementById("monthly_cb").checked;
  const virtualSelected = document.getElementById("virtual_cb").checked;
  const hybridSelected = document.getElementById("hybrid_cb").checked;
  const twoHSelected = document.getElementById("twoH_cb").checked;
  const fourHSelected = document.getElementById("fourH_cb").checked;
  const commSelected = document.getElementById("comm_cb").checked;
  const psychSelected = document.getElementById("psych_cb").checked;
  const vrSelected = document.getElementById("vr_cb").checked;

  // Quick validation for contradictory selections
  if (localSelected && widerSelected) {
    alert("Cannot select both Local Area and Wider Community for one scenario.");
    return;
  }
  if (weeklySelected && monthlySelected) {
    alert("Cannot select both Weekly and Monthly for one scenario.");
    return;
  }
  if (twoHSelected && fourHSelected) {
    alert("Cannot select both 2-Hour and 4-Hour sessions for one scenario.");
    return;
  }
  
  // Make scenario object
  const scenario = {
    name: scenarioName,
    state,
    adjustCosts,
    cost_val,
    localSelected,
    widerSelected,
    weeklySelected,
    monthlySelected,
    virtualSelected,
    hybridSelected,
    twoHSelected,
    fourHSelected,
    commSelected,
    psychSelected,
    vrSelected
  };

  scenarioList.push(scenario);
  updateScenarioTable();
}

/************************************************************
 * UPDATE SCENARIO TABLE
 ************************************************************/
function updateScenarioTable() {
  const tbody = document.getElementById("scenarioTable").querySelector("tbody");
  tbody.innerHTML = "";
  
  scenarioList.forEach(sc => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sc.name}</td>
      <td>
        ${sc.localSelected ? "Local;" : ""}
        ${sc.widerSelected ? "Wider;" : ""}
        ${sc.weeklySelected ? "Weekly;" : ""}
        ${sc.monthlySelected ? "Monthly;" : ""}
        ${sc.virtualSelected ? "Virtual;" : ""}
        ${sc.hybridSelected ? "Hybrid;" : ""}
        ${sc.twoHSelected ? "2Hr;" : ""}
        ${sc.fourHSelected ? "4Hr;" : ""}
        ${sc.commSelected ? "CommEng;" : ""}
        ${sc.psychSelected ? "Psych;" : ""}
        ${sc.vrSelected ? "VR;" : ""}
      </td>
      <td>${sc.state || "-"}</td>
      <td>${sc.adjustCosts === 'yes' ? "Yes" : "No"}</td>
      <td>${sc.cost_val}</td>
    `;
    tbody.appendChild(row);
  });
}

/************************************************************
 * OPEN RESULTS WINDOW (SINGLE SCENARIO)
 ************************************************************/
function openResultsWindow() {
  const scenario = buildScenarioFromCurrentForm();
  if (!scenario) return; // user canceled or invalid input
  openResultsPopup([scenario], "Single Scenario Results");
}

/************************************************************
 * OPEN COMPARISON WINDOW (MULTI-SCENARIO)
 ************************************************************/
function openComparisonWindow() {
  if (scenarioList.length === 0) {
    alert("No saved scenarios to compare!");
    return;
  }
  openResultsPopup(scenarioList, "Comparison Results");
}

/************************************************************
 * BUILD SCENARIO FROM CURRENT FORM (for single 'View Results')
 ************************************************************/
function buildScenarioFromCurrentForm() {
  // Gather inputs from the form
  const state = document.getElementById("state_select").value;
  const adjustCosts = document.getElementById("adjust_costs").value;
  const cost_val = parseInt(document.getElementById("cost_slider").value, 10);

  const localSelected = document.getElementById("local_cb").checked;
  const widerSelected = document.getElementById("wider_cb").checked;
  const weeklySelected = document.getElementById("weekly_cb").checked;
  const monthlySelected = document.getElementById("monthly_cb").checked;
  const virtualSelected = document.getElementById("virtual_cb").checked;
  const hybridSelected = document.getElementById("hybrid_cb").checked;
  const twoHSelected = document.getElementById("twoH_cb").checked;
  const fourHSelected = document.getElementById("fourH_cb").checked;
  const commSelected = document.getElementById("comm_cb").checked;
  const psychSelected = document.getElementById("psych_cb").checked;
  const vrSelected = document.getElementById("vr_cb").checked;

  if (localSelected && widerSelected) {
    alert("Cannot select both Local Area and Wider Community for a single scenario.");
    return null;
  }
  if (weeklySelected && monthlySelected) {
    alert("Cannot select both Weekly and Monthly for a single scenario.");
    return null;
  }
  if (twoHSelected && fourHSelected) {
    alert("Cannot select both 2-Hour and 4-Hour sessions for a single scenario.");
    return null;
  }

  return {
    name: "CurrentForm",
    state,
    adjustCosts,
    cost_val,
    localSelected,
    widerSelected,
    weeklySelected,
    monthlySelected,
    virtualSelected,
    hybridSelected,
    twoHSelected,
    fourHSelected,
    commSelected,
    psychSelected,
    vrSelected
  };
}

/************************************************************
 * OPEN A NEW WINDOW WITH RESULTS/COMPARISON
 * (Displays dynamic charts, WTP, predicted probabilities)
 ************************************************************/
function openResultsPopup(scenarios, windowTitle) {
  // Generate a new window
  const w = window.open("", "_blank", "width=1400,height=800,scrollbars=yes,resizable=yes");
  if (!w) {
    alert("Please allow popups in your browser settings.");
    return;
  }

  // Write the basic HTML structure
  w.document.write(`
    <html>
    <head>
      <title>${windowTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2, h3 { color: #2c3e50; text-align: center; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #2980b9; color: #fff; }
        .chart-box { width: 100%; height: 400px; margin-top: 20px; }
        .buttons-row { text-align: center; margin-top: 20px; }
        button { background: #2980b9; color: #fff; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #1f6391; }
        .intro-text { text-align: center; margin: 10px 0; }
        .loneliness-info { background: #f9f9f9; padding: 10px; margin-top: 10px; border-left: 4px solid #f39c12; }
      </style>
    </head>
    <body>
      <h1>${windowTitle}</h1>
      <p class="intro-text">
        These results show the predicted probabilities of programme uptake and 
        willingness to pay (WTP) for each scenario, alongside separate analyses 
        by loneliness category (Not Lonely, Moderately Lonely, Severely Lonely).
      </p>
      <div class="loneliness-info">
        <strong>Loneliness Categories</strong>: 
        Derived from the De Jong Gierveld Loneliness Scale, 
        which measures both emotional and social loneliness. 
        Individuals are then grouped into Not Lonely, Moderately Lonely, or Severely Lonely 
        based on their total loneliness scores.
      </div>
      <div id="scenarioContainer"></div>
      <div class="buttons-row">
        <button onclick="downloadPDF()">Download PDF</button>
      </div>

      <!-- Scripts for Chart + PDF generation in new window -->
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      
      <script>
        const scenariosData = ${JSON.stringify(scenarios)};

        // Coefficients & cost-of-living from parent window
        const finalCoefficients = ${JSON.stringify(finalCoefficients)};
        const costOfLivingMultipliers = ${JSON.stringify(costOfLivingMultipliers)};

        // Container references
        const container = document.getElementById("scenarioContainer");
        
        // On load, build scenario tables, charts
        window.onload = function() {
          buildScenarioViews();
        };

        function buildScenarioViews() {
          scenariosData.forEach((sc, index) => {
            // Build a separate area for each scenario
            const div = document.createElement("div");
            div.style.margin = "30px 0";

            const header = document.createElement("h2");
            header.textContent = sc.name;
            div.appendChild(header);

            // Show key inputs
            const table = document.createElement("table");
            table.innerHTML = \`<thead>
              <tr><th>Attribute</th><th>Value</th></tr>
            </thead><tbody>
              <tr><td>State</td><td>\${sc.state || "-"}</td></tr>
              <tr><td>Adjust Costs?</td><td>\${sc.adjustCosts}</td></tr>
              <tr><td>Cost (AUD)</td><td>\${sc.cost_val}</td></tr>
              <tr><td>Local Area?</td><td>\${sc.localSelected}</td></tr>
              <tr><td>Wider Community?</td><td>\${sc.widerSelected}</td></tr>
              <tr><td>Weekly?</td><td>\${sc.weeklySelected}</td></tr>
              <tr><td>Monthly?</td><td>\${sc.monthlySelected}</td></tr>
              <tr><td>Virtual Only?</td><td>\${sc.virtualSelected}</td></tr>
              <tr><td>Hybrid?</td><td>\${sc.hybridSelected}</td></tr>
              <tr><td>2-Hour?</td><td>\${sc.twoHSelected}</td></tr>
              <tr><td>4-Hour?</td><td>\${sc.fourHSelected}</td></tr>
              <tr><td>Community Engagement?</td><td>\${sc.commSelected}</td></tr>
              <tr><td>Psych Counselling?</td><td>\${sc.psychSelected}</td></tr>
              <tr><td>Virtual Reality?</td><td>\${sc.vrSelected}</td></tr>
            </tbody>\`;
            div.appendChild(table);

            // Probability + charts
            const chartContainer = document.createElement("div");
            chartContainer.style.display = "flex";
            chartContainer.style.flexWrap = "wrap";
            chartContainer.style.justifyContent = "space-around";
            
            // MAIN Probability chart
            const mainProbCanvas = document.createElement("canvas");
            mainProbCanvas.id = "mainProb_" + index;
            mainProbCanvas.className = "chart-box";
            chartContainer.appendChild(mainProbCanvas);

            // By Categories: Not Lonely, Moderately Lonely, Severely Lonely
            const catNotLonely = document.createElement("canvas");
            catNotLonely.id = "catNotLonely_" + index;
            catNotLonely.className = "chart-box";
            chartContainer.appendChild(catNotLonely);

            const catModLonely = document.createElement("canvas");
            catModLonely.id = "catModLonely_" + index;
            catModLonely.className = "chart-box";
            chartContainer.appendChild(catModLonely);

            const catSevLonely = document.createElement("canvas");
            catSevLonely.id = "catSevLonely_" + index;
            catSevLonely.className = "chart-box";
            chartContainer.appendChild(catSevLonely);

            div.appendChild(chartContainer);

            // Compute + display predicted probabilities
            const resultsP = document.createElement("p");
            resultsP.style.textAlign = "center";
            const mainProb = computeProbability(sc, finalCoefficients.main);
            const notLonelyProb = computeProbability(sc, finalCoefficients.notLonely);
            const modLonelyProb = computeProbability(sc, finalCoefficients.moderatelyLonely);
            const sevLonelyProb = computeProbability(sc, finalCoefficients.severelyLonely);

            resultsP.innerHTML = \`
              <strong>Main Probability:</strong> \${(mainProb*100).toFixed(2)}% &nbsp; 
              | <strong>Not Lonely:</strong> \${(notLonelyProb*100).toFixed(2)}% &nbsp; 
              | <strong>Moderately Lonely:</strong> \${(modLonelyProb*100).toFixed(2)}% &nbsp; 
              | <strong>Severely Lonely:</strong> \${(sevLonelyProb*100).toFixed(2)}%
            \`;
            div.appendChild(resultsP);

            // Create charts
            buildDoughnutChart(mainProbCanvas, "Main Probability", mainProb);
            buildDoughnutChart(catNotLonely, "Not Lonely", notLonelyProb);
            buildDoughnutChart(catModLonely, "Moderately Lonely", modLonelyProb);
            buildDoughnutChart(catSevLonely, "Severely Lonely", sevLonelyProb);

            container.appendChild(div);
          });
        }

        function computeProbability(sc, coef) {
          // Adjust cost
          let finalCost = sc.cost_val;
          if (sc.adjustCosts === "yes" && sc.state && costOfLivingMultipliers[sc.state]) {
            finalCost = sc.cost_val * costOfLivingMultipliers[sc.state];
          }
          // Build inputs (1 or 0) for each attribute
          const dist_local = sc.localSelected ? 1 : 0;
          const dist_signif = sc.widerSelected ? 1 : 0;
          const freq_weekly = sc.weeklySelected ? 1 : 0;
          const freq_monthly = sc.monthlySelected ? 1 : 0;
          const mode_virtual = sc.virtualSelected ? 1 : 0;
          const mode_hybrid = sc.hybridSelected ? 1 : 0;
          const dur_2hrs = sc.twoHSelected ? 1 : 0;
          const dur_4hrs = sc.fourHSelected ? 1 : 0;
          const type_comm = sc.commSelected ? 1 : 0;
          const type_psych = sc.psychSelected ? 1 : 0;
          const type_vr = sc.vrSelected ? 1 : 0;

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
             + coef.cost_cont * finalCost;

          const U_optout = coef.ASC_optout;
          const exp_alt = Math.exp(U_alt);
          const exp_optout = Math.exp(U_optout);
          return exp_alt / (exp_alt + exp_optout);
        }

        function buildDoughnutChart(canvas, title, probability) {
          new Chart(canvas.getContext("2d"), {
            type: "doughnut",
            data: {
              labels: ["Uptake Probability", "Remaining"],
              datasets: [{
                data: [probability, 1 - probability],
                backgroundColor: pickChartColours(probability),
                borderColor: ["rgba(236, 240, 241, 1)", "rgba(236, 240, 241, 1)"],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
                title: {
                  display: true,
                  text: title + " = " + (probability * 100).toFixed(2) + "%",
                  font: { size: 16 },
                  color: "#2c3e50"
                }
              }
            }
          });
        }

        function pickChartColours(prob) {
          if (prob < 0.3) {
            return ["rgba(231, 76, 60, 0.6)", "rgba(236, 240, 241, 0.3)"];
          } else if (prob < 0.7) {
            return ["rgba(241, 196, 15, 0.6)", "rgba(236, 240, 241, 0.3)"];
          } else {
            return ["rgba(39, 174, 96, 0.6)", "rgba(236, 240, 241, 0.3)"];
          }
        }

        // Download PDF with charts
        function downloadPDF() {
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF("p", "pt", "a4");
          pdf.setFontSize(14);
          pdf.text("${windowTitle}", 40, 40);
          let yPos = 70;

          // For each scenario: add some text + 4 charts (base64)
          scenariosData.forEach((sc, idx) => {
            pdf.setFontSize(12);
            pdf.text("Scenario: " + sc.name, 40, yPos);
            yPos += 20;
            
            // Grab canvases: #mainProb_idx, #catNotLonely_idx, ...
            // Convert them to images + add to PDF
            const mainCanvas = document.getElementById("mainProb_" + idx);
            if (mainCanvas) {
              const mainImg = mainCanvas.toDataURL("image/png");
              pdf.addImage(mainImg, "PNG", 40, yPos, 200, 200);
            }
            const catNL = document.getElementById("catNotLonely_" + idx);
            if (catNL) {
              const catNLImg = catNL.toDataURL("image/png");
              pdf.addImage(catNLImg, "PNG", 300, yPos, 200, 200);
            }
            yPos += 220; 
            const catML = document.getElementById("catModLonely_" + idx);
            if (catML) {
              const catMLImg = catML.toDataURL("image/png");
              pdf.addImage(catMLImg, "PNG", 40, yPos, 200, 200);
            }
            const catSL = document.getElementById("catSevLonely_" + idx);
            if (catSL) {
              const catSLImg = catSL.toDataURL("image/png");
              pdf.addImage(catSLImg, "PNG", 300, yPos, 200, 200);
            }
            yPos += 250; 
            pdf.addPage(); 
            yPos = 70;
          });

          pdf.save("LonelyLessAustralia_Results.pdf");
        }
      </script>
    </body>
    </html>
  `);

  w.document.close();
}

/************************************************************
 * END OF NEW WINDOW LOGIC
 ************************************************************/
