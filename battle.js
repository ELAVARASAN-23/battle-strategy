// soldiers advantages
const advantageMap = {
  Militia: ['Spearmen', 'LightCavalry'],
  Spearmen: ['LightCavalry', 'HeavyCavalry'],
  LightCavalry: ['FootArcher', 'CavalryArcher'],
  HeavyCavalry: ['Militia', 'FootArcher', 'LightCavalry'],
  CavalryArcher: ['Spearmen', 'HeavyCavalry'],
  FootArcher: ['Militia', 'CavalryArcher']
};

// conversion the input 
function conversionArmies(input) {
  return input.split(';').map(str => {
    const [unit, count] = str.split('#');
    return { unit: unit.trim(), count: parseInt(count.trim()) };
  });
}
// check and add power up to soldiers
function advantagePower(attacker, defender) {
  return advantageMap[attacker.unit]?.includes(defender.unit)
    ? attacker.count * 2
    : attacker.count;
}
// check battle won and enemy soldiers and result
function getBattleResult(attacker, defender) {
  const power = advantagePower(attacker, defender);
  if (power > defender.count) return 'win';
  if (power === defender.count) return 'draw';
  return 'loss';
}
// get all possibilities of battle orders
function getPermutations(arr) {
  const result = [];

  function backtrack(start) {
    if (start === arr.length) {
      result.push(arr.map(p => ({ ...p }))); // Copy objects to avoid reference issues
      return;
    }

    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]]; // Swap
      backtrack(start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]]; // Swap back
    }
  }

  backtrack(0);
  return result;
}


 // Main Function
function findOptimalMatchup(own, enemy) {
  if(!own && !enemy) return "Input is required";
  const ownPlatoons = conversionArmies(own);  // conversion own army input
  const enemyPlatoons = conversionArmies(enemy); // conversion enemy army input
  if(ownPlatoons.length==5 && enemyPlatoons.length==5) return "own and enemy platoons should be equal to 5";
  const allPermutations = getPermutations(ownPlatoons); // get all possible arrangements of army

  // loop with all permutations
  for (const arrangement of allPermutations) {
    let wins = 0;
    let result = [];
    for (let i = 0; i < 5; i++) {
      if (getBattleResult(arrangement[i], enemyPlatoons[i]) === 'win') {
        wins++;
        result.push(arrangement[i])
      }else{
        result.push(arrangement[i])
      }
    }
    if (wins >= 3) {
      return arrangement.map(p => `${p.unit}#${p.count}`).join(';');
    }
  }

  return 'There is no chance of winning';
}

// Sample inputs
let ownPlatoons = "Spearmen#10;Militia#30;FootArcher#20;LightCavalry#1000;HeavyCavalry#120"
let enemyPlatoons = "Militia#10;Spearmen#10;FootArcher#1000;LightCavalry#120;CavalryArcher#100"

const winningBattleOrder = findOptimalMatchup(ownPlatoons, enemyPlatoons);

// output
console.log({winningBattleOrder})