const canvasSketch = require("canvas-sketch");
const { random } = require("canvas-sketch-util");
const Tweakpane = require("tweakpane");


const settings = {
  dimensions: [1080, 1080],
};

const params = {
  glyphs: '_= /^',
  pixelSize: 20,
  letterSize: 1200
  // rows: 10,
  // scaleMin: 1,
  // scaleMax: 30,
  // freq: 0.001,
  // amp: 0.2,
  // animate: true,
  // frame: 0,
  // lineCap: "butt",
};

const getGlyph = (v) => {
  if (v < 50) return "";
  if (v < 100) return ".";
  if (v < 150) return "-";
  if (v < 200) return "+";

  const glyphs = params.glyphs.split("");
  return random.pick(glyphs);
};

let text = "A",
  fontSize = 1200,
  fontFamily = "serif".manager;

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  return ({ context, width, height }) => {
    const cell = params.pixelSize;
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    const numCells = cols * rows;
    fontSize = cols*1.2;
    typeCanvas.width = cols;
    typeCanvas.height = rows;
    //===== kan barra


    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    typeContext.fillStyle = "white";
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = "top";
    // typeContext.textAlign='center';

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft,
      my = metrics.actualBoundingBoxAscent * -1,
      mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
      mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
      tx = (cols - mw) / 2 - mx,
      ty = (rows - mh) / 2 - my;

    typeContext.save();
    typeContext.translate(tx, ty);

    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    // Get image data
    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    // context.drawImage(typeCanvas, 0, 0);
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

      // context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      context.fillStyle = "white";

      context.save();

      context.translate(x, y);

      context.fillText(glyph, 0, 0);
      // square pixels
      // context.fillRect(0, 0, cell, cell);
      // === circle pixels
      // context.translate(cell/2, cell/2);
      // context.beginPath();
      // context.arc(0, 0, cell / 2, 0, 2 * Math.PI);
      // context.fill();
      // === end circle pixels
      context.restore();
    }
  };
};

// const onKeyUp = (e) => {
//   text = e.key.toUpperCase();
//   manager.render();
// };

// document.addEventListener("keyup", onKeyUp);

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();


const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Settings" });
  folder.addInput(params, "pixelSize", { min: 10, max: 50, step: 1 });
  folder.addInput(params, "glyphs");
  // folder.addInput(params, "scaleMin", { min: 1, max: 100 });
  // folder.addInput(params, "scaleMax", { min: 1, max: 100 });

  // folder = pane.addFolder({ title: "Noise" });
  // folder.addInput(params, "freq", { min: -0.01, max: 0.01 });
  // folder.addInput(params, "amp", { min: 0, max: 1 });
  // folder.addInput(params, "animate");
  // folder.addInput(params, "frame", { min: 0, max: 1000 });

  pane.on('change', (ev) => {
    console.log(ev);
    manager.render();
  });
};

createPane();

// canvasSketch(sketch, settings);