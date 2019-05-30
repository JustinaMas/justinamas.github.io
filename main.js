
let populationSize = 350;
let aliveAgents = [];
let allAgents = [];
let obstacles = [];
let frameCounter = 0;

//*************Interface********/
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;
let genCount;
let gCount = 1;
let tableBody;
let obstaclesC;
let alive;
//******************************/
let textFile = null;
let create;
let testResults = [];

let bestCbstacleScore = 0;
let highScore = 0;

let runBest = false;
let runBestButton;

let pause = false;
let pauseButton;
/* -------------------GRAPHICS----------- */
let cloudFill,
    catFill,
    backgroundFill;

function preload() {
  cloudFill = loadImage('images/cloud.png');
  catFill = loadImage('images/cat.png');
  catFillLeft = loadImage('images/catL g.png');
  catFillRight = loadImage('images/catRg.png');
}

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('canvascontainer-main');

  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  genCount = select('#gen');
  obstaclesC = select('#obstaclesc');
  bestObstaclesC = select('#bestobstaclesc');
  runBestButton = select('#best');
  pauseButton = select('#pause');
  tableBody= select('#tabledata');
  alive = select('#alive');
  runBestButton.mousePressed(toggleState);
  pauseButton.mousePressed(togglePauseState);
  create = document.getElementById('create');
  create.addEventListener('click', function () {
    var link = document.getElementById('downloadlink');
    link.href = makeTextFile(testResults.join('\n'));
    link.style.display = 'block';
  }, false);

  for (let i = 0; i < populationSize; i++) {
    let agent = new Agent();
    aliveAgents[i] = agent;
    allAgents[i] = agent;
  }
}

function toggleState() {
  runBest = !runBest;

  if (runBest) {
    bestAgent.obstacleScore = 0;
    resetGame();
    runBestButton.html('Continue training');
  } else {
    nextGeneration();
    runBestButton.html('Run best agent');
  }
}

function togglePauseState() {
  pause = !pause;
  if(pause) {
      noLoop();
      pauseButton.html('Continue');
 
      pauseButton.removeClass("btn-secondary");
      pauseButton.addClass("btn-primary");
    } else {
      loop();
      pauseButton.html('Pause');
      pauseButton.removeClass("btn-primary");
      pauseButton.addClass("btn-secondary");
      
    }
}

function draw() {
  background(135,206,235);
  let currentObstacleScore = 0;
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  for (let n = 0; n < cycles; n++) {
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].update();
      if (obstacles[i].offscreen()) {
        obstacles.splice(i, 1);
      }
    }
   

    if (runBest) {
      bestAgent.think(obstacles);
      bestAgent.update();

      for (let j = 0; j < obstacles.length; j++) {
        if (obstacles[j].hits(bestAgent)) {
          resetGame();
          break;
        }
        obstacles[j].isPassed(bestAgent);
        if (bestAgent.obstacleScore > currentObstacleScore) {
          currentObstacleScore = bestAgent.obstacleScore;
        }
        if (bestAgent.obstacleScore> bestCbstacleScore) {
          bestCbstacleScore = bestAgent.obstacleScore;
        }
      }

      if (bestAgent.hitSides()) {
        resetGame();
      }
      obstaclesC.html(currentObstacleScore);
      bestObstaclesC.html(bestCbstacleScore);
    } else {
      for (let i = aliveAgents.length - 1; i >= 0; i--) {
        let agent = aliveAgents[i];
        agent.think(obstacles);
        agent.update();
        for (let j = 0; j < obstacles.length; j++) {
          if (obstacles[j].hits(aliveAgents[i])) {
            aliveAgents.splice(i, 1);
            break;
          }
          obstacles[j].isPassed(aliveAgents[i]);
          if (aliveAgents[i].obstacleScore > currentObstacleScore) {
            currentObstacleScore = aliveAgents[i].obstacleScore;
          }
          if (aliveAgents[i].obstacleScore> bestCbstacleScore) {
            bestCbstacleScore = aliveAgents[i].obstacleScore;
          }
        }
       
        if (agent.hitSides()) {
          aliveAgents.splice(i, 1);
        }

      }
      obstaclesC.html(currentObstacleScore);
      bestObstaclesC.html(bestCbstacleScore);
    }
    ///add obstacle
    if (frameCounter % 80 == 0) {
      obstacles.push(new Obstacle());
    }
    testResults.push(parseInt(currentObstacleScore));
    frameCounter++;
  }

  let tempHighScore = 0;
  if (!runBest) {
    let tempBestAgent = null;
    for (let i = 0; i < aliveAgents.length; i++) {
      let s = aliveAgents[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestAgent = aliveAgents[i];
      }
    }

    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestAgent = tempBestAgent;
    }
  } else {
    tempHighScore = bestAgent.score;
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
    }
  }

  // Update DOM Elements
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);
  genCount.html(gCount);
  alive.html(aliveAgents.length);

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].show();
  }

  if (runBest) {
    bestAgent.show();
  } else {
    for (let i = 0; i < aliveAgents.length; i++) {
      aliveAgents[i].show();
    }

    if (aliveAgents.length == 0) {
      gCount++ ;
      nextGeneration();
    }
  }
}

makeTextFile = function (text) {
  var data = new Blob([text], {type: 'text/csv'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
};
  