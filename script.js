/****************************************************************************
 * 1) TAB CONTROL
 ****************************************************************************/
function openTab(evt, tabName) {
  const tabcontents = document.getElementsByClassName("tabcontent");
  for (let tc of tabcontents) {
    tc.style.display = "none";
  }
  const tablinks = document.getElementsByClassName("tablink");
  for (let tl of tablinks) {
    tl.classList.remove("active");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

/****************************************************************************
 * 2) SLIDER LABEL FOR COST
 ****************************************************************************/
function updateCostLabel(val) {
  document.getElementById("cost_label").textContent = val;
}

/****************************************************************************
 * 3) SCENARIO LOGIC
 ****************************************************************************/
let scenarioList = [];

/** Final model coefficients & cost-of-living multipliers (You can modify these) **/
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

/** Cost-of-Living Multipliers **/
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
 * 4) SAVE SCENARIO
 ****************************************************************************/
function saveScenario() {
  let name = prompt("Give a unique name for this scenario:", "Scenario " + (scenarioList.length+1));
  if (!name) return;

  // Gather user inputs
  const state = document.getElementById("state_select").value;
  const adjust_costs = document.getElementById("adjust_costs").value;
  const cost_val = parseInt(document.getElementById("cost_slider").value, 10);

  const local_cb = document.getElementById("local_cb").checked;
  const wider_cb = document.getElementById("wider_cb").checked;
  const weekly_cb = document.getElementById("weekly_cb").checked;
  const monthly_cb = document.getElementById("monthly_cb").checked;
  const virtual_cb = document.getElementById("virtual_cb").checked;
  const hybrid_cb = document.getElementById("hybrid_cb").checked;
  const twoH_cb = document.getElementById("twoH_cb").checked;
  const fourH_cb = document.getElementById("fourH_cb").checked;
  const comm_cb = document.getElementById("comm_cb").checked;
  const psych_cb = document.getElementById("psych_cb").checked;
  const vr_cb = document.getElementById("vr_cb").checked;

  // Basic constraints
  if (local_cb && wider_cb) {
    alert("Cannot select both Local Area and Wider Community.");
    return;
  }
  if (weekly_cb && monthly_cb) {
    alert("Cannot select both Weekly and Monthly.");
    return;
  }
  if (twoH_cb && fourH_cb) {
    alert("Cannot select both 2-Hour and 4-Hour sessions.");
    return;
  }

  if (adjust_costs === 'yes' && !state) {
    alert("Please select a state if adjusting costs for living.");
    return;
  }

  // Build scenario object
  const scenario = {
    name,
    state,
    adjust_costs,
    cost_val,
    local_cb,
    wider_cb,
    weekly_cb,
    monthly_cb,
    virtual_cb,
    hybrid_cb,
    twoH_cb,
    fourH_cb,
    comm_cb,
    psych_cb,
    vr_cb
  };

  scenarioList.push(scenario);
  updateScenarioTable();
}

/****************************************************************************
 * 5) SCENARIO TABLE
 ****************************************************************************/
function updateScenarioTable() {
  const tb = document.getElementById("scenarioTable").querySelector("tbody");
  tb.innerHTML = "";
  scenarioList.forEach(s => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>
        ${s.local_cb ? "Local;" : ""}
        ${s.wider_cb ? "Wider;" : ""}
        ${s.weekly_cb ? "Weekly;" : ""}
        ${s.monthly_cb ? "Monthly;" : ""}
        ${s.virtual_cb ? "Virtual;" : ""}
        ${s.hybrid_cb ? "Hybrid;" : ""}
        ${s.twoH_cb ? "2hr;" : ""}
        ${s.fourH_cb ? "4hr;" : ""}
        ${s.comm_cb ? "Comm;" : ""}
        ${s.psych_cb ? "Psych;" : ""}
        ${s.vr_cb ? "VR;" : ""}
      </td>
      <td>${s.state || '-'}</td>
      <td>${s.adjust_costs === 'yes' ? 'Yes' : 'No'}</td>
      <td>${s.cost_val}</td>
    `;
    tb.appendChild(row);
  });
}

/****************************************************************************
 * 6) BUILD SCENARIO FROM CURRENT INPUTS & OPEN SINGLE-RESULTS WINDOW
 ****************************************************************************/
function openResultsWindow() {
  const sc = buildScenarioFromCurrentInputs();
  if (!sc) return;
  openScenariosWindow([sc], "Single Scenario Results");
}

/****************************************************************************
 * 7) COMPARE ALL SCENARIOS
 ****************************************************************************/
function openComparisonWindow() {
  if (scenarioList.length === 0) {
    alert("No saved scenarios to compare.");
    return;
  }
  openScenariosWindow(scenarioList, "Comparison of Multiple Scenarios");
}

function buildScenarioFromCurrentInputs() {
  const state = document.getElementById("state_select").value;
  const adjust_costs = document.getElementById("adjust_costs").value;
  const cost_val = parseInt(document.getElementById("cost_slider").value, 10);

  const local_cb = document.getElementById("local_cb").checked;
  const wider_cb = document.getElementById("wider_cb").checked;
  const weekly_cb = document.getElementById("weekly_cb").checked;
  const monthly_cb = document.getElementById("monthly_cb").checked;
  const virtual_cb = document.getElementById("virtual_cb").checked;
  const hybrid_cb = document.getElementById("hybrid_cb").checked;
  const twoH_cb = document.getElementById("twoH_cb").checked;
  const fourH_cb = document.getElementById("fourH_cb").checked;
  const comm_cb = document.getElementById("comm_cb").checked;
  const psych_cb = document.getElementById("psych_cb").checked;
  const vr_cb = document.getElementById("vr_cb").checked;

  // Same constraints
  if (local_cb && wider_cb) {
    alert("Cannot select both Local Area and Wider Community.");
    return null;
  }
  if (weekly_cb && monthly_cb) {
    alert("Cannot select both Weekly and Monthly.");
    return null;
  }
  if (twoH_cb && fourH_cb) {
    alert("Cannot select both 2-Hour and 4-Hour.");
    return null;
  }
  if (adjust_costs === 'yes' && !state) {
    alert("Please select a state if adjusting costs for living.");
    return null;
  }

  return {
    name: "Current Selection",
    state,
    adjust_costs,
    cost_val,
    local_cb,
    wider_cb,
    weekly_cb,
    monthly_cb,
    virtual_cb,
    hybrid_cb,
    twoH_cb,
    fourH_cb,
    comm_cb,
    psych_cb,
    vr_cb
  };
}

/****************************************************************************
 * 8) OPEN NEW WINDOW WITH SCENARIOS (INCLUDES WTP & CHARTS)
 ****************************************************************************/
function openScenariosWindow(scenarios, titleText) {
  const w = window.open("", "_blank", "width=1200,height=800,resizable,scrollbars");
  if (!w) {
    alert("Please allow popups in your browser settings.");
    return;
  }

  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <title>${titleText}</title>
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
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          margin: 20px 0;
        }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ccc; padding: 8px; }
        th { background: #2980b9; color: #fff; }
        .charts-wrap {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          gap: 20px;
          margin-top: 20px;
        }
        .chart-box {
          width: 360px;
          height: 300px;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 10px;
          position: relative;
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
          margin: 0 5px;
        }
        button:hover {
          background: #1f6391;
        }
        .loneliness-note {
          background: #f9efdb;
          padding: 10px;
          margin: 10px 0;
          border-left: 4px solid #e67e22;
        }
      </style>
    </head>
    <body>
      <h1>${titleText}</h1>
      <p class="loneliness-note">
        This analysis considers different loneliness categories (Not Lonely, Moderately Lonely, and Severely Lonely) 
        based on the De Jong Gierveld Loneliness Scale. Negative coefficients reduce utility, while positive 
        coefficients increase utility; cost coefficients are negative.
      </p>

      <div id="mainContent"></div>
      <div class="buttons-row">
        <button onclick="downloadPDF()">Download PDF</button>
      </div>

      <!-- Chart.js + jsPDF in new window -->
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

      <script>
        const scenarioData = ${JSON.stringify(scenarios)};
        const finalCoefs = ${JSON.stringify(finalCoefficients)};
        const multipliers = ${JSON.stringify(costOfLivingMultipliers)};

        // Example significance + WTP array if desired:
        const attributeInfo = [
          { name: "Community Engagement", pVal: 0.000, significance: "***" },
          { name: "Psychological Counselling", pVal: 0.245, significance: "" },
          { name: "Virtual Reality", pVal: 0.009, significance: "**" },
          { name: "Virtual Only (Method)", pVal: 0.019, significance: "**" },
          { name: "Hybrid (Method)", pVal: 0.001, significance: "***" },
          { name: "Weekly", pVal: 0.000, significance: "***" },
          { name: "Monthly", pVal: 0.005, significance: "**" },
          { name: "2-Hour", pVal: 0.059, significance: "" },
          { name: "4-Hour", pVal: 0.037, significance: "*" },
          { name: "Local Area", pVal: 0.712, significance: "" },
          { name: "Wider Community", pVal: 0.000, significance: "***" },
          // Cost coefficient is separate
        ];

        window.onload = function() {
          buildAllScenarioViews();
        };

        function buildAllScenarioViews() {
          const container = document.getElementById("mainContent");
          scenarioData.forEach((sc, idx) => {
            const box = document.createElement("div");
            box.className = "scenario-box";

            const h2 = document.createElement("h2");
            h2.textContent = sc.name;
            box.appendChild(h2);

            // Show scenario table
            const scenarioTable = document.createElement("table");
            scenarioTable.innerHTML = \`
              <thead>
                <tr><th>Attribute</th><th>Value</th></tr>
              </thead>
              <tbody>
                <tr><td>State</td><td>\${sc.state||'-'}</td></tr>
                <tr><td>Cost of Living Adjust?</td><td>\${sc.adjust_costs}</td></tr>
                <tr><td>Cost (AUD)</td><td>\${sc.cost_val}</td></tr>
                <tr><td>Local Area?</td><td>\${sc.local_cb}</td></tr>
                <tr><td>Wider Community?</td><td>\${sc.wider_cb}</td></tr>
                <tr><td>Weekly?</td><td>\${sc.weekly_cb}</td></tr>
                <tr><td>Monthly?</td><td>\${sc.monthly_cb}</td></tr>
                <tr><td>Virtual Only?</td><td>\${sc.virtual_cb}</td></tr>
                <tr><td>Hybrid?</td><td>\${sc.hybrid_cb}</td></tr>
                <tr><td>2-Hour?</td><td>\${sc.twoH_cb}</td></tr>
                <tr><td>4-Hour?</td><td>\${sc.fourH_cb}</td></tr>
                <tr><td>Community Engagement?</td><td>\${sc.comm_cb}</td></tr>
                <tr><td>Psych Counselling?</td><td>\${sc.psych_cb}</td></tr>
                <tr><td>Virtual Reality?</td><td>\${sc.vr_cb}</td></tr>
              </tbody>
            \`;
            box.appendChild(scenarioTable);

            // Show predicted probabilities
            const pMain = computeProbability(sc, finalCoefs.main);
            const pNotLonely = computeProbability(sc, finalCoefs.notLonely);
            const pModLonely = computeProbability(sc, finalCoefs.moderatelyLonely);
            const pSevLonely = computeProbability(sc, finalCoefs.severelyLonely);

            // Show WTP table for main model (just an example)
            const wtpTable = document.createElement("table");
            wtpTable.innerHTML = \`<thead><tr><th>Attribute</th><th>Coefficient</th><th>p-value</th><th>Significance</th><th>WTP (AUD)</th></tr></thead><tbody></tbody>\`;
            const tBody = wtpTable.querySelector("tbody");

            // We'll do a few attribute examples here
            const mainCostCoef = finalCoefs.main.cost_cont; 
            if (mainCostCoef === 0) {
              // avoid division by zero
            } else {
              attributeInfo.forEach(attr => {
                // We'll match the attribute name to finalCoefs if possible
                let aCoef = 0;
                if (attr.name === "Community Engagement") aCoef = finalCoefs.main.type_comm;
                if (attr.name === "Psychological Counselling") aCoef = finalCoefs.main.type_psych;
                if (attr.name === "Virtual Reality") aCoef = finalCoefs.main.type_vr;
                if (attr.name === "Virtual Only (Method)") aCoef = finalCoefs.main.mode_virtual;
                if (attr.name === "Hybrid (Method)") aCoef = finalCoefs.main.mode_hybrid;
                if (attr.name === "Weekly") aCoef = finalCoefs.main.freq_weekly;
                if (attr.name === "Monthly") aCoef = finalCoefs.main.freq_monthly;
                if (attr.name === "2-Hour") aCoef = finalCoefs.main.dur_2hrs;
                if (attr.name === "4-Hour") aCoef = finalCoefs.main.dur_4hrs;
                if (attr.name === "Local Area") aCoef = finalCoefs.main.dist_local;
                if (attr.name === "Wider Community") aCoef = finalCoefs.main.dist_signif;

                const wtp = computeWTP(aCoef, mainCostCoef);
                const row = document.createElement("tr");
                row.innerHTML = \`
                  <td>\${attr.name}</td>
                  <td>\${aCoef.toFixed(3)}</td>
                  <td>\${attr.pVal.toFixed(3)}</td>
                  <td>\${attr.significance}</td>
                  <td>\${wtp.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                \`;
                tBody.appendChild(row);
              });
            }

            // Also add cost row as reference
            const costRow = document.createElement("tr");
            costRow.innerHTML = \`
              <td>Cost per Session</td>
              <td>\${mainCostCoef.toFixed(3)}</td>
              <td>0.000</td>
              <td>***</td>
              <td>Reference</td>
            \`;
            tBody.appendChild(costRow);

            // Probability text
            const pBox = document.createElement("p");
            pBox.innerHTML = \`
              <strong>Main Prob:</strong> \${(pMain*100).toFixed(2)}% 
              | <strong>Not Lonely:</strong> \${(pNotLonely*100).toFixed(2)}% 
              | <strong>Moderately Lonely:</strong> \${(pModLonely*100).toFixed(2)}%
              | <strong>Severely Lonely:</strong> \${(pSevLonely*100).toFixed(2)}%
            \`;
            box.appendChild(pBox);

            // Append the WTP table
            box.appendChild(wtpTable);

            // Charts
            const chartWrap = document.createElement("div");
            chartWrap.className = "charts-wrap";
            
            // 1) Main Probability
            chartWrap.appendChild(buildChartCanvas(`mainProb_${idx}`, "Main Probability", pMain));
            // 2) Not Lonely
            chartWrap.appendChild(buildChartCanvas(`notLonely_${idx}`, "Not Lonely Probability", pNotLonely));
            // 3) Moderately Lonely
            chartWrap.appendChild(buildChartCanvas(`modLonely_${idx}`, "Moderately Lonely Probability", pModLonely));
            // 4) Severely Lonely
            chartWrap.appendChild(buildChartCanvas(`sevLonely_${idx}`, "Severely Lonely Probability", pSevLonely));
            
            box.appendChild(chartWrap);
            container.appendChild(box);
          });

          // After DOM is built, init the charts
          scenarioData.forEach((sc, idx) => {
            initDoughnut(`mainProb_${idx}`, computeProbability(sc, finalCoefs.main));
            initDoughnut(`notLonely_${idx}`, computeProbability(sc, finalCoefs.notLonely));
            initDoughnut(`modLonely_${idx}`, computeProbability(sc, finalCoefs.moderatelyLonely));
            initDoughnut(`sevLonely_${idx}`, computeProbability(sc, finalCoefs.severelyLonely));
          });
        }

        function buildChartCanvas(id, label, probVal) {
          const box = document.createElement("div");
          box.className = "chart-box";
          const c = document.createElement("canvas");
          c.id = id;
          box.appendChild(c);
          return box;
        }

        function initDoughnut(canvasId, probability) {
          const ctx = document.getElementById(canvasId).getContext("2d");
          new Chart(ctx, {
            type: "doughnut",
            data: {
              labels: ["Uptake Probability", "Remaining"],
              datasets: [{
                data: [probability, 1-probability],
                backgroundColor: pickColours(probability),
                borderColor: "#fff",
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" }
              }
            }
          });
        }

        function pickColours(p) {
          if (p < 0.3) {
            return ["rgba(231, 76, 60, 0.7)", "rgba(236, 240, 241, 0.3)"];
          } else if (p < 0.7) {
            return ["rgba(241, 196, 15, 0.7)", "rgba(236, 240, 241, 0.3)"];
          } else {
            return ["rgba(39, 174, 96, 0.7)", "rgba(236, 240, 241, 0.3)"];
          }
        }

        function computeProbability(scenario, coefs) {
          // Adjust cost
          let finalCost = scenario.cost_val;
          if (scenario.adjust_costs === "yes" && scenario.state && multipliers[scenario.state]) {
            finalCost = scenario.cost_val * multipliers[scenario.state];
          }

          const dist_local = scenario.local_cb ? 1 : 0;
          const dist_signif = scenario.wider_cb ? 1 : 0;
          const freq_weekly = scenario.weekly_cb ? 1 : 0;
          const freq_monthly = scenario.monthly_cb ? 1 : 0;
          const mode_virtual = scenario.virtual_cb ? 1 : 0;
          const mode_hybrid = scenario.hybrid_cb ? 1 : 0;
          const dur_2hrs = scenario.twoH_cb ? 1 : 0;
          const dur_4hrs = scenario.fourH_cb ? 1 : 0;
          const type_comm = scenario.comm_cb ? 1 : 0;
          const type_psych = scenario.psych_cb ? 1 : 0;
          const type_vr = scenario.vr_cb ? 1 : 0;

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
          const exp_optout = Math.exp(U_optout);
          return exp_alt / (exp_alt + exp_optout);
        }

        function computeWTP(attributeCoef, costCoef) {
          if (costCoef === 0) return 0;
          return - attributeCoef / costCoef; 
        }

        async function downloadPDF() {
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p','pt','a4');
          pdf.setFontSize(14);
          pdf.text("${titleText}", 40, 40);

          let yOff = 60;
          
          const scenarioDivs = document.getElementsByClassName("scenario-box");
          for (let i=0; i<scenarioDivs.length; i++) {
            // Add a page for each scenario
            if (i>0) pdf.addPage();
            yOff = 40;
            pdf.text(scenarioData[i].name, 40, yOff);
            yOff += 10;
            
            // Convert each chart to an image + add
            const mainProbID = "mainProb_" + i;
            const notLonelyID = "notLonely_" + i;
            const modLonelyID = "modLonely_" + i;
            const sevLonelyID = "sevLonely_" + i;

            const mainCanvas = document.getElementById(mainProbID);
            if (mainCanvas) {
              const mainImg = mainCanvas.toDataURL("image/png");
              pdf.addImage(mainImg, "PNG", 40, yOff, 200, 200);
            }
            const notLonelyCanvas = document.getElementById(notLonelyID);
            if (notLonelyCanvas) {
              const notLonelyImg = notLonelyCanvas.toDataURL("image/png");
              pdf.addImage(notLonelyImg, "PNG", 300, yOff, 200, 200);
            }
            yOff += 220;
            if (modLonelyID) {
              const modCanvas = document.getElementById(modLonelyID);
              if (modCanvas) {
                const modImg = modCanvas.toDataURL("image/png");
                pdf.addImage(modImg, "PNG", 40, yOff, 200, 200);
              }
            }
            if (sevLonelyID) {
              const sevCanvas = document.getElementById(sevLonelyID);
              if (sevCanvas) {
                const sevImg = sevCanvas.toDataURL("image/png");
                pdf.addImage(sevImg, "PNG", 300, yOff, 200, 200);
              }
            }
            yOff += 260;
          }

          pdf.save("LonelyLessAustralia_Results.pdf");
        }
      </script>
    </body>
    </html>
  `);
  w.document.close();
}
