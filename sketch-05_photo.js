const canvasSketch = require("canvas-sketch");
const { random } = require("canvas-sketch-util");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  // animate: true,
};

const params = {
  glyphs: "_= /^",
  pixelSize: 5,
  letterSize: 1200,
  // rows: 10,
  // scaleMin: 1,
  // scaleMax: 30,
  // freq: 0.001,
  // amp: 0.2,
  // animate: true,
  // frame: 0,
  // lineCap: "butt",
};

// const getGlyph = (v) => {
//   if (v < 50) return "";
//   if (v < 100) return ".";
//   if (v < 150) return ":";
//   if (v < 200) return ";";
//   if (v < 220) return ".";

//   const glyphs = params.glyphs.split("");
//   return random.pick(glyphs);
// };

const getSize = (v) => {
  if (v < 50) return 0;
  // if (v < 100) return 4;
  // if (v < 120) return 6;
  // if (v < 150) return 8;
  // if (v < 200) return 12;
  // if (v < 210) return 14;
  // if (v < 220) return 16;
  return (v / 25)+8;
  return 0;
};

let fontFamily = "serif".manager;

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height, frame }) => {
  return ({ context, width, height }) => {
    const cell = params.pixelSize;
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    const numCells = cols * rows;
    fontSize = cols * 1.2;
    typeCanvas.width = cols;
    typeCanvas.height = rows;
    //===== kan barra
    // drawImage

    drawImage(typeContext, cols, rows, () => {
      // Get image data
      const typeData = typeContext.getImageData(0, 0, cols, rows).data;
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

        const glyph = ".";
        const fontSize = getSize(r);

        context.font = `${fontSize}px ${fontFamily}`;
        // if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

        
        context.fillStyle = "white";

        context.save();

        context.translate(x, y);

        context.fillText(glyph, 0, 0);
        context.restore();
      }
    });
  };
};

// const start = async () => {
//   manager = await canvasSketch(sketch, settings);
// };

// start();

// const createPane = () => {
//   const pane = new Tweakpane.Pane();
//   let folder;

//   folder = pane.addFolder({ title: "Settings" });
//   folder.addInput(params, "pixelSize", { min: 1, max: 50, step: 1 });
//   folder.addInput(params, "glyphs");
//   // folder.addInput(params, "scaleMin", { min: 1, max: 100 });
//   // folder.addInput(params, "scaleMax", { min: 1, max: 100 });

//   // folder = pane.addFolder({ title: "Noise" });
//   // folder.addInput(params, "freq", { min: -0.01, max: 0.01 });
//   // folder.addInput(params, "amp", { min: 0, max: 1 });
//   // folder.addInput(params, "animate");
//   // folder.addInput(params, "frame", { min: 0, max: 1000 });

//   pane.on("change", (ev) => {
//     // console.log(ev);
//     manager.render();
//   });
// };

// createPane();

canvasSketch(sketch, settings);

function drawImage(ctx, width, height, callback) {
  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0, width, (width * img.height) / img.width);
    callback();
  };
  img.src = "myphoto.jpg";
}
