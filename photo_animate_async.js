const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const Tweakpane = require('tweakpane');
const load = require('load-asset');
const { param } = require('express/lib/request');

const containerW = 2400;
const containerH = 1080;
const photoW = 1200;
const photoH = 1200;
const photoX = 0;
const photoY = 0;
const shiftX = containerW - photoW;

const settings = {
  dimensions: [containerW, containerH],
  animate: true
  // fps: 15
};

const params = {
  pixelSize: 8,
  character: '',
  slowVel: 1,
  fastVel: 2,
  velY: 0.01,
  minDistance: 100,
  maxDistance: 800,
  maxFont: 80,
  fontFactor: 6,
  movementThreshold: 100,
  velSize: 0.01
};

let imageData;

const getSize = v => {
  // return random.range(12, 50);
  if (v < 30) return 0;
  // if (v < 80) return 12;
  return Math.min(params.maxFont, v / params.fontFactor);
};
const getOpacity = v => {
  // return v / 255;
  if (v < 30) return 0;
  // if (v < 100) return (v * 1.5) / 255;
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
    if (intensity > params.movementThreshold) {
      this.vel = new Vector(
        random.range(-1 * .1, .1),
        random.range(-1 * .1, .1)
      );
    } else if (intensity > 70 && intensity <= params.movementThreshold) {
      this.vel = new Vector(
        random.range(-1 * params.slowVel, params.slowVel),
        random.range(-1 * params.velY, params.velY)
      );
    } else if (intensity < 70) {
      this.vel = new Vector(
        random.range(-1 * params.fastVel, params.fastVel),
        random.range(-1 * params.velY, params.velY)
      );
    }
    //  else if (intensity > 100 && intensity > 150) {
    //   // this.vel = new Vector(random.range(-0.05, 0), random.range(-0.05, 0));
    // }
    this.x = x;
    this.y = y;
    this.intensity = intensity;
    if (param.character === '.') this.size = getSize(intensity);
    else this.size = ((params.pixelSize / 1.5) * this.intensity) / 255;

    this.velOpacity = 0;

    if (Math.abs(this.vel.x) > 0.1) {
      this.velOpacity = random.range(0, 0.001);
    }
    this.velSize = Math.abs(this.vel.x) > 0.1 ? params.velSize : 0;
    this.opacity = getOpacity(intensity);
    this.originalOpacity = getOpacity(intensity);
    this.maxy = y + random.range(params.minDistance, params.maxDistance);
    this.miny = y - random.range(params.minDistance, params.maxDistance);
    this.maxx = x + random.range(params.minDistance, params.maxDistance);
    this.minx = x - random.range(params.minDistance, params.maxDistance);
    this.originalX = x;
    this.originalY = y;
  }

  // getSize() {
  //   return ;
  // }

  update() {
    // if (this.intensity <= 100) {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.opacity -= this.velOpacity;
    // console.log(this.size);

    this.size += this.velSize;
    // if (this.intensity < 70) {
      this.vel.x -= 0.001;
    // }
    // } else {
    //   this.x += this.vel.x;
    //   this.y += this.vel.y;
    // }
  }

  draw(context) {
    context.save();
    if (params.character === '.') {
      context.font = `${this.size}px ${fontFamily}`;
      context.fillStyle = `rgba(255,255,255,${this.opacity})`;
      context.translate(this.x, this.y);
      context.fillText(params.character, 0, 0);
    } else {
      context.lineWidth = this.size;
      context.strokeStyle = `rgba(255,255,255,${this.opacity})`;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(this.x + this.size, this.y);
      context.stroke();
    }
    context.restore();
  }

  bounce() {
    if (this.intensity > params.movementThreshold) {
      if (
        this.y <= this.originalY - 1 ||
        this.y >= this.originalY + 1 ||
        this.x <= this.originalX - 1 ||
        this.x >= this.originalX + 1
      ) {
        this.vel.y *= -1;
        this.vel.x *= -1;
      }
    }
    if (this.intensity <= params.movementThreshold) {
      // if (this.size >= 6 || this.size<=0.6) {
      //   this.velSize *= -1;
      // }
      if (
        this.y <= this.miny ||
        this.y >= this.maxy ||
        this.opacity <= 0 ||
        this.x <= this.minx ||
        this.x >= this.maxx
      ) {
        this.y = this.originalY;
        this.x = this.originalX;
        this.opacity = this.originalOpacity;
        this.vel = new Vector(random.range(-0.3, 0), random.range(-0.3, 0.3));
        if (param.character === '.') this.size = getSize(intensity);
        else this.size = ((params.pixelSize / 1.5) * this.intensity) / 255;
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

// const start = async () => {
//   manager = await canvasSketch(sketch, settings);
// };

// start();

// const createPane = () => {
//   const pane = new Tweakpane.Pane();
//   let folder;

//   folder = pane.addFolder({ title: 'Settings' });
//   folder.addInput(params, 'pixelSize', { min: 1, max: 50, step: 1 });
//   folder.addInput(params, 'character');
//   folder.addInput(params, 'slowVel', { min: 0, max: 5, step: .1 });
//   folder.addInput(params, 'fastVel', { min: 0, max: 5, step: .1 });
//   folder.addInput(params, 'velY', { min: 0, max: 5, step: .1 });
//   // folder.addInput(params, 'minDistance', { min: 10, max: 100, step: 1 });
//   // folder.addInput(params, 'maxDistance', { min: 101, max: 1000, step: 1 });
//   // folder.addInput(params, 'maxFont', { min: 20, max: 50, step: .5 });
//   // folder.addInput(params, 'fontFactor', { min: 1, max: 8, step: .5 });
//   folder.addInput(params, 'movementThreshold', { min: 80, max: 255, step: 1 });

//   // folder.addInput(params, "scaleMin", { min: 1, max: 100 });
//   // folder.addInput(params, "scaleMax", { min: 1, max: 100 });

//   // folder = pane.addFolder({ title: "Noise" });
//   // folder.addInput(params, "freq", { min: -0.01, max: 0.01 });
//   // folder.addInput(params, "amp", { min: 0, max: 1 });
//   // folder.addInput(params, "animate");
//   // folder.addInput(params, "frame", { min: 0, max: 1000 });

//   pane.on('change', ev => {
//     // console.log(ev);
//     manager.render();
//   });
// };

// createPane();
//
canvasSketch(sketch, settings);
