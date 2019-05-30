
function resetGame() {
  frameCounter = 0;
  if (bestAgent) {
    bestAgent.resetPosition();
  }
  obstacles = [];
}

function nextGeneration() {
  resetGame();
  normalizeFitness(allAgents);
  aliveAgents = generate(allAgents);
  allAgents = aliveAgents.slice();
}


function generate(oldAgents) {
  let newAgents = [];
  for (let i = 0; i < oldAgents.length; i++) {
    let agent = poolSelection(oldAgents);
    newAgents[i] = agent;
  }
  return newAgents;
}

function normalizeFitness(agents) {
  for (let i = 0; i < agents.length; i++) {
    agents[i].score = pow(agents[i].score, 2);
  }
  let sum = 0;
  for (let i = 0; i < agents.length; i++) {
    sum += agents[i].score;
  }
  for (let i = 0; i < agents.length; i++) {
    agents[i].fitness = agents[i].score / sum;
  }
}

function poolSelection(agents) {
  let index = 0;

  let r = random(1);
  while (r > 0) {
    r -= agents[index].fitness;
    index += 1;
  }
  index -= 1;
  return agents[index].copy();
}