  // soldiers advantages
exports.advantageMap = {
  Militia: ['Spearmen', 'LightCavalry'],
  Spearmen: ['LightCavalry', 'HeavyCavalry'],
  LightCavalry: ['FootArcher', 'CavalryArcher'],
  HeavyCavalry: ['Militia', 'FootArcher', 'LightCavalry'],
  CavalryArcher: ['Spearmen', 'HeavyCavalry'],
  FootArcher: ['Militia', 'CavalryArcher']
};


