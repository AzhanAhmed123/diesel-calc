// Calculation logic for the site (same math as in report)
function goToStep1(){setVisibility('step1')}
function goToStep2(){setVisibility('step2')}
function goToStep3(){
  // FIX: Set visibility, then automatically run the calculation.
  setVisibility('step3'); 
  calculate();          
}
function setVisibility(id){['step1','step2','step3'].forEach(x=>document.getElementById(x).style.display=(x===id?'block':'none'))}

function calculate(){
  const P = Number(document.getElementById('genPower').value)||0;
  const H = Number(document.getElementById('hours').value)||0;
  const F = Number(document.getElementById('fuelEff').value)||0;
  const price = Number(document.getElementById('dieselPrice').value)||285;
  const EF = Number(document.getElementById('co2Factor').value)||2.68;
  const S = Number(document.getElementById('solarCap').value)||0;
  const sun = Number(document.getElementById('sunHours').value)||5.5;
  const install = Number(document.getElementById('installCost').value)||0;
  const maint = Number(document.getElementById('maintCost').value)||0;

  const fuelDay = F * H;
  const co2Day = fuelDay * EF;
  const costDay = fuelDay * price;
  const dieselEnergy = P * H;
  const solarEnergy = S * sun;
  const replacedFraction = dieselEnergy>0? Math.min(solarEnergy/dieselEnergy,1):0;
  const annualCO2saved = co2Day * 365 * replacedFraction;
  const annualFuelCost = costDay * 365;
  const annualSavings = Math.max(0, annualFuelCost * replacedFraction - maint);
  const payback = annualSavings>0? (install/annualSavings):null;

  document.getElementById('fuelDay').innerText = fuelDay.toFixed(2);
  document.getElementById('co2Day').innerText = co2Day.toFixed(2);
  document.getElementById('costDay').innerText = costDay.toFixed(0);
  document.getElementById('dieselEnergy').innerText = dieselEnergy.toFixed(2);
  document.getElementById('solarEnergy').innerText = solarEnergy.toFixed(2);
  document.getElementById('annualCO2').innerText = annualCO2saved.toFixed(0);
  document.getElementById('payback').innerText = payback? payback.toFixed(1): 'N/A';
}