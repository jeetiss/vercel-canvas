const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");

GlobalFonts.registerFromPath('../assets/inter-medium.ttf', 'inter')

module.exports = async (req, res) => {
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext("2d");

  const { name = "World" } = req.query;

  ctx.font = "30px inter";
  ctx.rotate(0.1);
  ctx.fillText(`${name}!`, 50, 100);
  
  // Draw line under text
  var text = ctx.measureText(`${name}!`);
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.lineTo(50, 102);
  ctx.lineTo(50 + text.width, 102);
  ctx.stroke();

  res.setHeader('content-type', 'image/png');
  res.send(await canvas.encode("png"));
};

