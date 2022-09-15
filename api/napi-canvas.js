const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const webcrypto = require("crypto").webcrypto;

GlobalFonts.registerFromPath("../assets/inter-medium.ttf", "inter");

/**
 * @param {number} width
 * @param {number} height
 * @param {!CanvasPattern} pattern
 * @constructor
 */
function Texture(width, height, pattern) {
  this.width = width;
  this.height = height;
  this.pattern = pattern;
}

/**
 * Draws a texture into a canvas patterns.
 * @param {number} width
 * @param {number} height
 * @param {boolean} repeat
 * @param {function(!CanvasRenderingContext2D)} draw
 * @return {!Texture}
 */
function createTexture(width, height, repeat, draw) {
  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext("2d");
  draw(ctx);
  let pattern = ctx.createPattern(canvas, repeat ? "repeat" : "no-repeat");
  return new Texture(width, height, pattern);
}

/**
 * Generates a noise texture.
 * @param {number} width
 * @param {number} height
 * @param {number} intensity
 * @return {!Texture}
 */
function createNoise(width, height, intensity) {
  return createTexture(width, height, true, (ctx) => {
    let pixels = ctx.createImageData(width, height);
    let noise = new Uint8Array(width * height);
    webcrypto.getRandomValues(noise);
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i + 3] = noise[i >> 2] * intensity;
    }
    ctx.putImageData(pixels, 0, 0);
  });
}

module.exports = async (req, res) => {
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext("2d");

  const { name = "World" } = req.query;

  ctx.save();

  const texture = createNoise(200, 200, 0.2);
  ctx.fillStyle = texture.pattern;
  ctx.fillRect(0, 0, 300, 300);

  ctx.restore();

  ctx.font = "30px inter";
  ctx.rotate(0.2);
  ctx.fillText(`${name}!`, 50, 100);

  // Draw line under text
  var text = ctx.measureText(`${name}!`);
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.lineTo(50, 102);
  ctx.lineTo(50 + text.width, 102);
  ctx.stroke();

  res.setHeader("content-type", "image/png");
  res.send(await canvas.encode("png"));
};
