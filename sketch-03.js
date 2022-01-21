const canvasSketch = require("canvas-sketch");
const { random, math } = require("canvas-sketch-util");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  // duration: 1,
  // fps: 1
};

// const animate = () => {
//   console.log('dom');
//   requestAnimationFrame(animate);
// }

// animate();

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width - 10);
    const y = random.range(0, height - 10);

    agents.push(new Agent(x, y, random.range(4, 12)));
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const otherAgent = agents[j];

        const dist = agent.pos.getDistance(otherAgent.pos);

        if (dist > 300) continue;

        context.lineWidth = math.mapRange(dist, 0, 300, 8, 1);

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(otherAgent.pos.x, otherAgent.pos.y);
        context.stroke();
      }
    }

    agents.forEach((agent) => {
      // agent.update();
      agent.draw(context);
      // agent.bounce(width, height);
      agent.wrap(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y, v) {
    this.x = x;
    this.y = y;
  }

  getDistance(p) {
    const dx = this.x - p.x;
    const dy = this.y - p.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y, radius = 10) {
    this.pos = new Vector(x, y);
    this.radius = radius;
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
  }

  bounce(width, height) {
    if (this.pos.x <= this.radius || this.pos.x >= width - this.radius) {
      this.vel.x *= -1;
    }
    if (this.pos.y <= this.radius || this.pos.y >= height - this.radius) {
      this.vel.y *= -1;
    }
  }

  wrap(width, height) {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;

    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();

    context.lineWidth = 4;
    context.translate(this.pos.x, this.pos.y);
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}
