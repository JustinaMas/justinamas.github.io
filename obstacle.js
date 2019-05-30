
class Obstacle {
  constructor() {
    let spacing = 125;
  
    let centery = random(spacing, width-50 - spacing);

    this.rightPipeCorner = centery - spacing / 2;
    this.leftPipeCorner = width - (centery + spacing / 2);
    this.w = 80;
    this.y = height + this.w;
    this.speed = 7;
    this.checked = false;
  }

  hits(agent) {
    if ((agent.y + agent.r) > this.y && (agent.y - agent.r) < (this.y + this.w) ) {
      if ((agent.x - agent.r) < this.rightPipeCorner || (agent.x + agent.r) > (width - this.leftPipeCorner)) {
        return true;
      }
    }
    return false;
  }

  isPassed(agent) {
    if ((agent.y - agent.r) > (this.y + this.w) && this.checked == false) {
      agent.obstacleScore ++;
      this.checked = true;
    }
  }

  show() {
    stroke(255);
    // fill(200);
    image(cloudFill, 0, this.y, this.rightPipeCorner, this.w);
    image(cloudFill, width - this.leftPipeCorner, this.y, width, this.w);
  }

  update() {
    this.y -= this.speed;
  }

  offscreen() {
    if (this.y < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}