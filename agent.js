
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Agent {
  constructor(brain) {
    this.x = width / 2;
    this.y = 60;
    this.r = 12;
    this.gravity = 0.05;
    this.lift = 4;
    this.velocity = 0;
    this.score = 0;
    this.obstacleScore = 0;
    this.movingDirection = 0;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(5, 4, 2);
    }

    this.score = 0;
    // Fitness is normalized version of score
    this.fitness = 0;
  }

  copy() {
    return new Agent(this.brain);
  }

  show() {
    fill(255, 100);
    stroke(255);
    if(this.movingDirection == -1) {
      image(catFillLeft, this.x, this.y, this.r * 5, this.r * 5);
    }
    else if(this.movingDirection == 1) {
      image(catFillRight, this.x, this.y, this.r * 5, this.r * 5);
    }
    else {
      image(catFill, this.x, this.y, this.r * 5, this.r * 5);
    }
    
  }

  resetPosition(){
    this.score = 0;
    this.x = width / 2;
    this.y = 60;
  }
  think(obstacles) {
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < obstacles.length; i++) {
      let diff = obstacles[i].y - this.y;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = obstacles[i];
      }
    }

    if (closest != null) {
      let inputs = [];
      // y position of closest obstacle
      inputs[0] = map(closest.y, this.y, height, 0, 1);
      // right closest obstacle opening border
      inputs[1] = map(closest.rightPipeCorner, 0, width, 0, 1);
      // left closest obstacle opening border
      inputs[2] = map(closest.leftPipeCorner, 0, width, 0, 1);
      // agent's x position
      inputs[3] = map(this.x, 0, width, 0, 1);
      // agent's velocity
      inputs[4] = map(this.lift, -2, 2, 0, 1);

      let action = this.brain.prediction(inputs);
      if (action[1] > action[0]) {
        this.left();
      } else{
        this.right();
      }
    }
  }
  left() {
    this.x -= this.lift;
    this.movingDirection = -1;
  }
  right() {
    this.x += this.lift;
    this.movingDirection = 1;
  }

  hitSides() {
    return (this.x + this.r > width || this.x - this.r < 0);
  }

  update() {
    this.score++;
  }
}