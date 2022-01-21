const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1000, 1000],
  // dimensions: 'A4',
  // pixelsPerInch: 300,
  // orientation: 'landscape'
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.01;
    context.strokeStyle = "#ffffff"

    const gap = width * 0.03,
      w = width * 0.1,
      h = height * 0.1,
      ix = width * 0.17,
      iy = height * 0.17,
      offset = width * 0.02;
    let x, y;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = ix + (w + gap) * i;
        y = iy + (h + gap) * j;

        context.beginPath();
        context.rect(x, y, w, h);
        context.stroke();

        if (Math.random() > 0.5) {
          context.beginPath();
          context.rect(x + 8, y + 8, w - 16, h - 16);
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
