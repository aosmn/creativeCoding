const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const Tweakpane = require('tweakpane');
const load = require('load-asset');

const character = '.';
const containerW = 2400;
const containerH = 1080;
const photoW = 1200;
const photoH = 1200;
const photoX = 0;
const photoY = 0;
const shiftX = containerW - photoW;
// const slowVel = 0.1;
// const fastVel = 0.2;
const slowVel = 1;
const fastVel = 2;
const minDistance = 100;
const maxDistance = 800;

const settings = {
  dimensions: [containerW, containerH],
  animate: true
  // fps: 15
};

const params = {
  pixelSize: 8
};

let imageData;

const getSize = v => {
  // return random.range(12, 50);
  if (v < 30) return 0;
  // if (v < 80) return 12;
  return Math.min(40, v / 5);
};
const getOpacity = v => {
  // return v / 255;
  if (v < 30) return 0;
  if (v < 100) return (v * 1.5) / 255;
  return v / 255;
};

let fontFamily = 'serif'.manager;

const imageCanvas = document.createElement('canvas');
const imageContext = imageCanvas.getContext('2d');

const dots = [];
// ==================================

// ==================================
const sketch = async ({ context, width, height, frame }) => {
  // Await the image loader, it returns the loaded <img>
  const img = await load('myphoto.jpg');

  const cell = params.pixelSize;
  const cols = Math.floor(photoW / cell);
  const rows = Math.floor(photoH / cell);
  const numCells = cols * rows;
  fontSize = cols * 1.2;
  imageCanvas.width = cols;
  imageCanvas.height = rows;

  imageContext.drawImage(
    img,
    photoX,
    photoY,
    cols,
    (cols * img.height) / img.width
  );
  // Get image data
  imageData = imageContext.getImageData(0, 0, cols, rows).data;

  for (let i = 0; i < numCells; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = col * cell + shiftX;
    const y = row * cell;

    const r = imageData[i * 4 + 0];

    const fontSize = getSize(r);
    dots.push(new DotAgent(x, y, r));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    dots.forEach(dot => {
      dot.update();
      dot.draw(context);
      dot.bounce();
    });
  };
};

// var img = new Image();
// img.onload = function () {

canvasSketch(sketch, settings);

// };
// img.src = "myphoto.jpg";
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class DotAgent {
  constructor(x, y, intensity) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(0, 0), random.range(0, 0));
    if (intensity > 70 && intensity <= 100) {
      this.vel = new Vector(
        random.range(-1 * slowVel, slowVel),
        0
      );
    } else if (intensity < 70) {
      this.vel = new Vector(
        random.range(-1 * fastVel, fastVel),
        0
      );
    }
    //  else if (intensity > 100 && intensity > 150) {
    //   // this.vel = new Vector(random.range(-0.05, 0), random.range(-0.05, 0));
    // }
    this.x = x;
    this.y = y;
    this.intensity = intensity;
    this.size = getSize(intensity);
    this.velOpacity = 0;

    if (this.vel > 0) {
      this.velOpacity = random.range(0, 0.05);
    }
    this.velSize = 0.005;
    this.opacity = getOpacity(intensity);
    this.originalOpacity = getOpacity(intensity);
    this.maxy = y + random.range(minDistance, maxDistance);
    this.miny = y - random.range(minDistance, maxDistance);
    this.maxx = x + random.range(minDistance, maxDistance);
    this.minx = x - random.range(minDistance, maxDistance);
    this.originalX = x;
    this.originalY = y;
  }

  update() {
    // if (this.intensity <= 100) {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.opacity -= this.velOpacity;
    this.size += this.velSize;
    if (this.intensity < 70) {
      this.vel.x -= 0.001;
    }
    // } else {
    //   this.x += this.vel.x;
    //   this.y += this.vel.y;
    // }
  }

  draw(context) {
    context.save();
    context.font = `${this.size}px ${fontFamily}`;
    context.fillStyle = `rgba(255,255,255,${this.opacity})`;
    context.translate(this.x, this.y);
    context.fillText(character, 0, 0);
    context.restore();
  }

  bounce() {
    if (this.intensity <= 100) {
      if (
        this.y <= this.miny ||
        this.y >= this.maxy ||
        this.opacity === 0 ||
        this.x <= this.minx ||
        this.x >= this.maxx
      ) {
        this.y = this.originalY;
        this.x = this.originalX;
        this.opacity = this.originalOpacity;
        this.vel = new Vector(random.range(-0.3, 0), random.range(-0.3, 0.3));
        this.size = getSize(this.intensity);
      }
    } else {
      if (
        this.y <= this.originalY - 50 ||
        this.y >= this.originalY + 50 ||
        this.x <= this.originalX - 50 ||
        this.x >= this.originalX + 50
      ) {
        this.y = this.originalY;
        this.x = this.originalX;
      }
    }
  }
}
