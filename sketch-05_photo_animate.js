const canvasSketch = require("canvas-sketch");
const { random } = require("canvas-sketch-util");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  fps: 15,
};

const params = {
  glyphs: "_= /^",
  pixelSize: 5,
};

let imageData;

const getSize = (v) => {
  // return random.range(10, 30);
  if (v < 30) return 0;
  if (v < 80) return 18;
  return (v + 80) / 10;
};
const getOpacity = (v) => {
  // return v / 255;
  if (v < 30) return 0;
  if (v < 100) return (v * 1.5) / 255;
  return v / 255;
};

let fontFamily = "serif".manager;

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const dots = [];

const sketch = ({ context, width, height, frame }) => {
  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";
    dots.forEach((dot) => {
      dot.update();
      dot.draw(context);
      dot.bounce();
    });
  };
};


const cell = params.pixelSize;
const cols = Math.floor(1080 / cell);
const rows = Math.floor(1080 / cell);

var img = new Image();
img.onload = function () {
  const numCells = cols * rows;
  fontSize = cols * 1.2;
  typeCanvas.width = cols;
  typeCanvas.height = rows;

  typeContext.drawImage(img, 0, 0, cols, (cols * img.height) / img.width);
  // Get image data
  imageData = typeContext.getImageData(0, 0, cols, rows).data;

  for (let i = 0; i < numCells; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = col * cell;
    const y = row * cell;

    const r = imageData[i * 4 + 0];

    const fontSize = getSize(r);
    dots.push(new DotAgent(x, y, r));
  }
  canvasSketch(sketch, settings);

};
img.src = "myphoto.jpg";
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class DotAgent {
  constructor(x, y, intensity) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-.3, 0), random.range(-.3, .3));
    this.velOpacity = random.range(0, 0.001);
    this.x = x;
    this.y = y;
    this.intensity = intensity;
    this.size = getSize(intensity);
    this.opacity = getOpacity(intensity);
    this.originalOpacity = getOpacity(intensity);
    this.maxy = y + random.range(20, 100);
    this.miny = y - random.range(20, 100);
    this.maxx = x + random.range(20, 100);
    this.minx = x - random.range(20, 100);
    this.originalX = x;
    this.originalY = y;
  }

  update() {
    if (this.intensity <= 100) {
      this.x += this.vel.x;
      this.y += this.vel.y;
      this.opacity -= this.velOpacity;
    }
  }

  draw(context) {
    context.save();
    context.font = `${this.size}px ${fontFamily}`;
    context.fillStyle = `rgba(255,255,255,${this.opacity})`;
    context.translate(this.x, this.y);
    context.fillText(".", 0, 0);
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
        this.vel = new Vector(random.range(-.3, 0), random.range(-.3, .3));
      }
    }
  }
}
