class BattlePlanner {
  constructor() {
    this.advantageMap = {
      Militia: ['Spearmen', 'LightCavalry'],
      Spearmen: ['LightCavalry', 'HeavyCavalry'],
      LightCavalry: ['FootArcher', 'CavalryArcher'],
      HeavyCavalry: ['Militia', 'FootArcher', 'LightCavalry'],
      CavalryArcher: ['Spearmen', 'HeavyCavalry'],
      FootArcher: ['Militia', 'CavalryArcher']
    };
  }

  // Convert input string to structured object
  conversionArmies(input) {
    return input.split(';').map(str => {
      const [unit, count] = str.split('#');
      return { unit: unit.trim(), count: parseInt(count.trim()) };
    });
  }

  // soldiers advantages
  advantagePower(attacker, defender) {
    return this.advantageMap[attacker.unit]?.includes(defender.unit)
      ? attacker.count * 2
      : attacker.count;
  }

  //check battle won and enemy soldiers and result
  getBattleResult(attacker, defender) {
    const power = this.advantagePower(attacker, defender);
    if (power > defender.count) return 'win';
    if (power === defender.count) return 'draw';
    return 'loss';
  }

  // get all possibilities of battle orders
  getPermutations(arr) {
    const result = [];

    function backtrack(start) {
      if (start === arr.length) {
        result.push(arr.map(p => ({ ...p })));
        return;
      }

      for (let i = start; i < arr.length; i++) {
        [arr[start], arr[i]] = [arr[i], arr[start]];
        backtrack(start + 1);
        [arr[start], arr[i]] = [arr[i], arr[start]];
      }
    }

    backtrack(0);
    return result;
  }

  // Main function
  findOptimalMatchup(own, enemy) {
    if (!own || !enemy) return "Input is required";
 
    const ownPlatoons = this.conversionArmies(own); // conversion own army input
    const enemyPlatoons = this.conversionArmies(enemy); // conversion enemy army input

    if (ownPlatoons.length !== 5 || enemyPlatoons.length !== 5)
      return "own and enemy platoons should be equal to 5";

    const allPermutations = this.getPermutations(ownPlatoons);

    for (const arrangement of allPermutations) {
      let wins = 0;

      for (let i = 0; i < 5; i++) {
        if (this.getBattleResult(arrangement[i], enemyPlatoons[i]) === 'win') {
          wins++;
        }
      }
      // check if win battle more than 3 times
      if (wins >= 3) {
        return arrangement.map(p => `${p.unit}#${p.count}`).join(';');
      }
    }

    return 'There is no chance of winning';
  }
}

// Usage Example
const planner = new BattlePlanner();
// sample input
const ownPlatoons = "Spearmen#30;Militia#30;FootArcher#20;LightCavalry#1000;HeavyCavalry#120";
const enemyPlatoons = "Militia#10;Spearmen#10;FootArcher#1000;LightCavalry#120;CavalryArcher#100";

const winningBattleOrder = planner.findOptimalMatchup(ownPlatoons, enemyPlatoons);

//output
console.log({ winningBattleOrder });

// To run the code
// Install nodejs
// node battle.js
