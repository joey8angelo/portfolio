// Stochastic grammar

/*
T-Terminal character
NT-Non-terminal character
{
    "NT": [
        ["T NT", prob],
        ["T NT", prob]...
    ],
    "NT":...
}
*/
class Grammar {
  constructor(rules) {
    this.rules = rules || {};
  }

  produce(from) {
    if (this.rules[from]) {
      const productions = this.rules[from];
      const rand_prob = Math.random();
      let cumulative_prob = 0;
      for (let i = 0; i < productions.length; i++) {
        cumulative_prob += productions[i][1];
        if (rand_prob <= cumulative_prob) {
          return productions[i][0]; // Return the production with the selected probability
        }
      }
    }
    return [from]; // Return the original character if no rules apply
  }
}

