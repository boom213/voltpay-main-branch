import { Component, OnInit } from '@angular/core';

interface Impact {
  co2Month: number;
  co2Year: number;
  treesConservative: number;
  treesOptimistic: number;
  moneyMonth: number;
  moneyYear: number;
}

@Component({
  selector: 'app-green-energy',
  templateUrl: './green-energy.component.html',
  styleUrls: ['./green-energy.component.css']
})
export class GreenEnergyComponent implements OnInit {
  selectedGrid: string = 'India';
  // Known emission factors (kg CO2 / kWh)
  emissionFactors: Record<string, number> = {
    India: 0.73,
    USA: 0.3935,
    China: 0.70,         // approximate, depends heavily on coal share
    Germany: 0.35,
    France: 0.05,        // due to substantial nuclear + renewables
    UK: 0.20,
    Australia: 0.85,
    Canada: 0.10,
    Brazil: 0.10,
    Japan: 0.45,
    Russia: 0.48,
    SouthAfrica: 0.90,
    SaudiArabia: 0.78,
    UAE: 0.65,
    SouthKorea: 0.50
  };


  gridOptions = [
    { key: 'India', label: 'India (default)' },
    { key: 'USA', label: 'United States (example)' },
    { key: 'Custom', label: 'Custom (enter below)' }
  ];

  // state
  emissionFactor: number = 0.73;               // current emission factor in use
  customEmissionFactor: number | null = null;  // if user chooses 'Custom'

  // tree absorption values (kg CO2 absorbed per tree per year — conservative → optimistic)
  treeAbsorption = { conservative: 10, mid: 22, optimistic: 25 };

  // derived values for 1 kWh
  carbonAvoided: number = 0;
  treesPer1kWhMin: number = 0;
  treesPer1kWhMax: number = 0;

  // money
  pricePerKwhINR = 6.47;

  // user inputs & computed impact
  userKwhMonth: number = 15;
  impact: Impact = { co2Month: 0, co2Year: 0, treesConservative: 0, treesOptimistic: 0, moneyMonth: 0, moneyYear: 0 };

  avgHouseholdKwh = 97;

  savingTips = [
    { icon: '💡', title: 'Switch to LED lighting', description: 'LEDs use up to 80% less energy than incandescent bulbs — quick wins.' },
    { icon: '🔌', title: 'Unplug idle chargers', description: 'Standby ("vampire") power adds up — unplug or use smart strips.' },
    { icon: '🌬️', title: 'Raise AC temp 1°C', description: 'Every degree can save ~3–6% of AC energy — use fans + shading.' },
    { icon: '❄️', title: 'Upgrade fridge / AC', description: 'Newer inverters save substantially; consider energy-star rated appliances.' }
  ];

  examples: Array<any> = [];

  ngOnInit(): void {
    // build gridOptions dynamically
    this.gridOptions = Object.keys(this.emissionFactors).map(key => ({
      key,
      label: key
    }));

    // add "Custom" as last option
    this.gridOptions.push({ key: 'Custom', label: 'Custom (enter below)' });

    // initialize emission factor from selection (defensive)
    this.emissionFactor = this.emissionFactors[this.selectedGrid] ?? this.customEmissionFactor ?? 0;
    this.updateDerivedValues();
    this.recompute();
    this.populateExamples();
  }


  // called when select changes
  onGridChange(key: string) {
    this.selectedGrid = key;
    if (key !== 'Custom') {
      this.customEmissionFactor = null;
      this.emissionFactor = this.emissionFactors[key] ?? this.emissionFactors['India'];
      this.updateDerivedValues();
      this.recompute();
      this.populateExamples();
    } else {
      // custom selected — keep current emissionFactor until user enters custom value
      this.emissionFactor = this.customEmissionFactor ?? 0;
      this.updateDerivedValues();
      this.recompute();
      this.populateExamples();
    }
  }

  // user enters a custom emission factor (string from input will be converted)
  setCustomEmissionFactor(value: string | number) {
    const v = Number(value);
    if (!isNaN(v) && v >= 0) {
      this.customEmissionFactor = v;
      this.emissionFactor = v;
      this.updateDerivedValues();
      this.recompute();
      this.populateExamples();
    }
  }

  // update derived per-1kWh values
  updateDerivedValues() {
    this.carbonAvoided = +(1 * (this.emissionFactor || 0));
    // guard against divide-by-zero
    this.treesPer1kWhMin = this.carbonAvoided / (this.treeAbsorption.optimistic || 1);
    this.treesPer1kWhMax = this.carbonAvoided / (this.treeAbsorption.conservative || 1);
  }

  // recompute impacts based on current userKwhMonth and emissionFactor
  recompute() {
    const kwhMonth = Number(this.userKwhMonth) || 0;
    const kwhYear = kwhMonth * 12;
    const co2Month = kwhMonth * (this.emissionFactor || 0);
    const co2Year = kwhYear * (this.emissionFactor || 0);
    const moneyMonth = kwhMonth * this.pricePerKwhINR;
    const moneyYear = kwhYear * this.pricePerKwhINR;
    this.impact = {
      co2Month,
      co2Year,
      treesConservative: co2Year / this.treeAbsorption.conservative,
      treesOptimistic: co2Year / this.treeAbsorption.mid,
      moneyMonth,
      moneyYear
    };
  }

  // helper used by small in-template demos (safe, pure computation)
  calculateImpact(kwh: number) {
    const co2 = (kwh || 0) * (this.emissionFactor || 0);
    const trees = co2 / this.treeAbsorption.mid;
    return { co2, trees };
  }

  // fill examples and refresh when emissionFactor changes
  populateExamples() {
    this.examples = [];
    const f = this.emissionFactor || 0;
    const price = this.pricePerKwhINR;

    // Replace 5 bulbs example (savings per bulb = (60W - 9W), 5 hours/day)
    const perBulbYearKwh = ((60 - 9) / 1000) * 5 * 365; // kWh saved per bulb per year
    const fiveBulbsKwh = perBulbYearKwh * 5;
    this.examples.push({
      action: 'Replace 5 incandescent bulbs (5h/day) → LED',
      kwh: fiveBulbsKwh,
      co2: fiveBulbsKwh * f,
      trees: (fiveBulbsKwh * f) / this.treeAbsorption.conservative,
      money: fiveBulbsKwh * price
    });

    // Unplug 10 idle chargers (1W each) — always on
    const standbyKwh = (10 * 1 / 1000) * 24 * 365;
    this.examples.push({
      action: 'Unplug 10 idle chargers / devices (1W each)',
      kwh: standbyKwh,
      co2: standbyKwh * f,
      trees: (standbyKwh * f) / this.treeAbsorption.conservative,
      money: standbyKwh * price
    });

    // Replace old fridge example
    const fridgeSaved = 600 - 300;
    this.examples.push({
      action: 'Replace old fridge (600→300 kWh/year)',
      kwh: fridgeSaved,
      co2: fridgeSaved * f,
      trees: (fridgeSaved * f) / this.treeAbsorption.conservative,
      money: fridgeSaved * price
    });
  }

  startChallenge() {
    // keep it simple for now — integrate a real tracker later
    alert('Challenge started — log daily actions to build momentum!');
  }
}
