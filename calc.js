// Calculation logic for the site (same math as in report)
function goToStep1(){setVisibility('step1')}
function goToStep2(){setVisibility('step2')}
function goToStep3(){
  // FIX: Set visibility, then automatically run the calculation.
  setVisibility('step3'); 
  calculate();          
}
function setVisibility(id){['step1','step2','step3','final-impact'].forEach(x=>document.getElementById(x).style.display=(x===id?'block':'none'))}

function calculate() {
    // --- Inputs (Assuming these IDs exist in your Step 1 & 2) ---
    const P = Number(document.getElementById('genPower').value) || 0;
    const H = Number(document.getElementById('hours').value) || 0;
    const dailyLiters = Number(document.getElementById('dailyLiters').value) || 0;
    const S = Number(document.getElementById('solarCap').value) || 0;
    const sun = Number(document.getElementById('sunHours').value) || 5.5;
    const install = Number(document.getElementById('installCost').value) || 0;
    const maint = Number(document.getElementById('maintCost').value) || 0;

    // --- Market Data (Dec 2025) ---
    const price = 265.65; // PKR per Liter
    const EF = 2.68;      // kg CO2 per Liter

    // --- 1. Operational & Immediate Financials ---
    const fuelDay = dailyLiters; // Fuel per day (L)
    const co2Day = fuelDay * EF; // CO2 per day (kg)
    const totalAnnualCO2 = co2Day * 365; // Total Annual CO2 (kg)
    const costDay = fuelDay * price; // Diesel cost per day (PKR)
    const annualDieselExpense = costDay * 365; // Annual Diesel Expense (PKR)

    // --- 2. Energy Outputs ---
    const dieselEnergy = P * H; // Diesel energy/day (kWh)
    const solarEnergy = S * sun; // Solar energy/day (kWh)

    // --- 3. Environmental & Mitigation ---
    const replacedFraction = dieselEnergy > 0 ? Math.min(solarEnergy / dieselEnergy, 1) : 0;
    const annualCO2saved = totalAnnualCO2 * replacedFraction; // Annual CO2 saved (kg)
    const residualCO2 = totalAnnualCO2 - annualCO2saved; // Residual CO2 (kg)

    // --- 4. Long-term Financials ---
    const annualSavings = (annualDieselExpense * replacedFraction) - maint;
    const payback = annualSavings > 0 ? (install / annualSavings) : 0; // Payback period (Years)
    const profit10 = (annualSavings * 10) - install; // 10-Year Net Profit (PKR)

    // --- Animate Results in Requested Order ---
    animateValue("fuelDay", 0, fuelDay, 1000);
    animateValue("co2Day", 0, co2Day, 1000);
    animateValue("totalCO2Year", 0, totalAnnualCO2, 1000);
    animateValue("costDay", 0, costDay, 1000);
    animateValue("costYear", 0, annualDieselExpense, 1000);
    animateValue("dieselEnergy", 0, dieselEnergy, 1000);
    animateValue("solarEnergy", 0, solarEnergy, 1000);
    animateValue("annualCO2", 0, annualCO2saved, 1000);
    animateValue("remainingCO2", 0, residualCO2, 1000);
    animateValue("payback", 0, payback, 1000);
    animateValue("profit10", 0, profit10, 1000);

    // Update the Tree Hero (optional)
    const treesNeeded = Math.ceil(residualCO2 / 22);
    if (document.getElementById('tree-count-hero')) {
        document.getElementById('tree-count-hero').innerText = treesNeeded.toLocaleString();
    }
}

  // Final Impact Screen delay
  setTimeout(() => {
    document.getElementById('final-impact').style.display = 'block';
  }, 1500);
}

function animateValue(id, start, end, duration) {
    let obj = document.getElementById(id);
    if (!obj) return;
    let range = end - start;
    let startTime = new Date().getTime();
    let endTime = startTime + duration;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = end - (remaining * range);
        
        // This forces exactly 2 decimal places and adds commas
        obj.innerHTML = value.toLocaleString(undefined, {
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2
        });
        
        if (now < endTime) {
            requestAnimationFrame(run);
        } else {
            obj.innerHTML = end.toLocaleString(undefined, {
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2
            });
        }
    }
    requestAnimationFrame(run);
}

// Add this to the end of calc.js to make the calculation LIVE
document.addEventListener("DOMContentLoaded", function() {
    const hoursInput = document.getElementById('hours');
    const litersInput = document.getElementById('dailyLiters');
    const efficiencyDisplay = document.getElementById('calcEfficiency');

    function updateLiveEfficiency() {
        const H = Number(hoursInput.value) || 0;
        const L = Number(litersInput.value) || 0;
        
        if (H > 0 && L > 0) {
            const efficiency = L / H;
            efficiencyDisplay.value = efficiency.toFixed(2);
        } else {
            efficiencyDisplay.value = "";
        }
    }

    // Listen for typing in both boxes
    hoursInput.addEventListener('input', updateLiveEfficiency);
    litersInput.addEventListener('input', updateLiveEfficiency);
});















