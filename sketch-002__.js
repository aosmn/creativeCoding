const canvasSketch = require("canvas-sketch");
const { math, random } = require("canvas-sketch-util");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "black";

    const cx = width * 0.5,
      cy = height * 0.5,
      w = width * 0.01,
      h = height * 0.1,
      num = 30,
      radius = width * 0.3;

    let x, y;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save();
      context.fillStyle = '#'+Math.floor(random.range(0,16777215)).toString(16);

      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.1, 2), random.range(0.2, 1.5));

      context.beginPath();
      context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
      context.fill();
      context.restore();

      context.save();
      context.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
      context.translate(cx, cy);
      context.rotate(-angle);
      context.lineWidth = random.range(5, 20);


      context.beginPath();
      context.arc(
        0,
        0,
        radius * random.range(0.5, 1.5),
        slice * random.range(1, -8),
        slice * random.range(0, 5)
      );
      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
