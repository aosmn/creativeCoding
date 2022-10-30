const canvasSketch = require('canvas-sketch');
const { math, random, color } = require('canvas-sketch-util');
const riso = require('riso-colors');

const settings = {
  dimensions: [1080, 1080]
  // animate: true
};

const sketch = ({ context, width, height }) => {
  const numRects = 40;

  const rects = [];
  const rectColors = [
    random.pick(riso).hex,
    random.pick(riso).hex,
    random.pick(riso).hex
  ];
  const bgColor = random.pick(riso).hex;
  const mask = {
    radius: width*0.4,
    sides: 3,
    x: width *0.5,
    y: height * 0.5
  }

  for (let i = 0; i < numRects; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    const w = random.range(600, width);
    const h = random.range(40, 200);
    // const blend = 'overlay';
    const blend = random.range(0, 1) > 0.2 ? 'overlay' : 'source-over';

    const fill = random.pick(rectColors);
    const stroke = fill + 'a0';
    // const stroke = random.pick(rectColors)+'c0';

    rects.push({ x, y, w, h, fill, stroke, blend });
  }
  // context.save();
  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(width * 0.5, height * 0.5);

    drawPolygon({ context, radius: mask.radius, sides: mask.sides });

    // outlin under overlay
    // context.lineWidth = 10;
    // context.strokeStyle = 'rgba(255,255,255,.7)';
    // context.stroke();
    // outlin under overlay

    context.clip();

    rects.forEach(({ x, y, w, h, fill, stroke, blend }) => {
      context.save();
      context.translate(-mask.x, -mask.y);
      context.translate(x, y);
      context.globalCompositeOperation = blend;

      drawSkewedRect({
        context,
        w,
        h,
        fill,
        stroke
      });
      context.restore();
    });
    context.restore();

    // // outline over drawing
    context.save();
    context.translate(mask.x, mask.y);
    context.globalCompositeOperation = 'overlay';
    context.lineWidth = 20;
    context.strokeStyle = 'rgba(255,255,255,.7)';
    // context.strokeStyle = random.pick(rectColors).hex;
    drawPolygon({ context, radius: mask.radius - context.lineWidth, sides: mask.sides });
    context.stroke();
    context.restore();
    // // outline over drawing

  };
};

const drawSkewedRect = ({
  context,
  w = 600,
  h = 200,
  degrees = -45,
  fill,
  stroke
}) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = 10;
  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

  const shadowColor = color.offsetHSL(fill, 0, 0, 20);
  // shadowColor.rgba[3] = 0.5;
  context.shadowColor = color.style(shadowColor.rgba);
  context.shadowOffsetX = 10;
  context.shadowOffsetY = 20;
  context.fill();
  context.shadowColor = 'null';
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.stroke();

  context.lineWidth = 2;
  context.strokeStyle = 'white';

  context.stroke();
  // context.restore();
};

const drawPolygon = ({ context, radius = 100, sides = 3 }) => {
  const slice = (Math.PI * 2) / sides;

  context.beginPath();
  context.moveTo(0, radius);

  for (let i = 1; i < sides; i++) {
    const theta = (i * slice) + (Math.PI * 0.5);
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  context.closePath();
};

// const drawPolygon = ({context, radius=100, sides=3}) => {
//   const slice = Math.PI *2/sides;
//   context.beginPath();
//   context.moveTo(0, radius);

//   for (let i = 0; i < sides; i++) {
//     const theta = i*slice;
//     context.lineTo(Math.cos(theta)*radius,Math.sin(theta)*radius)
//   }
//   context.closePath();
// }

canvasSketch(sketch, settings);
