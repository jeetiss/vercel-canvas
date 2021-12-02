const { registerFont, createCanvas } = require("canvas");

registerFont("./font/MPLUS1Code-VariableFont.ttf", { family: "MPLUS1Code" });

module.exports = (req, res) => {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");
  const { name = "World" } = req.query;

  ctx.font = "30px MPLUS1Code";
  ctx.rotate(0.1);
  ctx.fillText(`${name}!`, 50, 100);

  // Draw line under text
  var text = ctx.measureText(`${name}!`);
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.lineTo(50, 102);
  ctx.lineTo(50 + text.width, 102);
  ctx.stroke();

  canvas.createPNGStream().pipe(res);
};
