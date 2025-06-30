const { advantageMap } = require("./constant");

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

module.exports = {conversionArmies,getBattleResult,getPermutations}