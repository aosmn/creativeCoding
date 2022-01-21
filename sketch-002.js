const canvasSketch = require("canvas-sketch");
const { math, random } = require("canvas-sketch-util");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

// const toRad = (deg) => (deg / 180) * Math.PI;
// const randomRange = (min, max) => Math.random() * (max - min) + min;
const num = 40;
const sketch = ({ context, width, height }) => {
  const slices = [];
  const arcs = [];

  for (let i = 0; i < num; i++) {
    const cx = width * 0.5,
      cy = height * 0.5,
      w = width * 0.01,
      h = height * 0.1,
      radius = width * 0.3;

    const slice = math.degToRad(360 / num);
    const angle = slice * i;

    let x, y;
    x = cx + radius * Math.sin(angle);
    y = cy + radius * Math.cos(angle);

    slices.push(new SliceAgent(x, y, w, h, angle));
    arcs.push(new ArcAgent(cx, cy, radius, slice, angle))
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // console.log('lala');

    slices.forEach((slice) => {
      slice.update();
      slice.draw(context);
      slice.bounce();
    });

    arcs.forEach((arc) => {
      arc.update();
      arc.draw(context);
      arc.bounce();

    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class SliceAgent {
  constructor(x, y, w, h, angle) {
    this.pos = new Vector(x, y);
    this.angle = angle;
    this.vel = new Vector(random.range(-0.1, 0.1), random.range(-3, 3));
    this.w = w;
    this.h = h;
    this.e = random.range(0, -this.h * 0.7);
  }

  update() {
    this.h += this.vel.y;
    this.w += this.vel.x;
    this.e -= this.vel.y*.2;
    // this.e += random.range(0, -this.h * 0.5);
  }

  draw(context) {
    context.save();
    context.fillStyle = "black";

    context.translate(this.pos.x, this.pos.y);
    context.rotate(-this.angle);
    // context.scale(random.range(0.1, 2), random.range(0.2, 0.5));

    context.beginPath();
    context.rect(-this.w * 0.4, this.e, this.w, this.h);
    context.fill();

    context.restore();
  }

  bounce() {
    if (this.h <= 100 || this.h >= 350) {
      this.vel.y *= -1;
    }

    if (this.w >= 24 || this.w <= 10) {
      this.vel.x *= -1;
    }
  }
}

class ArcAgent {
  constructor(x, y, r, start, angle) {
    this.pos = new Vector(x, y);
    this.angle = angle;
    this.vel = new Vector(random.range(-0.5, 0.5), random.range(-0.5, 0.5));
    this.radius = r;
    this.start = start;

    this.randomRadius = this.radius * random.range(0.7, 1.3);
    this.randomStart = this.start * random.range(1, -8);
    this.randomEnd = this.start * random.range(0, 5);
    this.randomStroke = random.range(5, 20)
  }

  update() {
    this.randomStroke += this.vel.y;
    this.randomStart += .005*this.vel.x;
    this.randomEnd += .005*this.vel.x;
  }

  bounce() {
    if(this.randomStroke >= 18 || this.randomStroke <=3){
      this.vel.y *= -1;
    }

    // if(this.randomEnd <= this.randomStart ) {

    // }
    // this.randomStart += .005*this.vel.x;
    // this.randomEnd += .005*this.vel.y;
    // this.w += this.vel.x;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(-this.angle);
    context.lineWidth = this.randomStroke;

    context.beginPath();
    context.arc(
      0,
      0,
      this.randomRadius,
      this.randomStart,
      this.randomEnd
    );
    context.stroke();
    context.restore();
  }
}
