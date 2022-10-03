import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { webcrypto } from "node:crypto";
import { performance } from "node:perf_hooks";

GlobalFonts.registerFromPath("../assets/inter-medium.ttf", "inter");

/**
 * @typedef {import('@vercel/node').VercelRequest} Request
 * @typedef {import('@vercel/node').VercelResponse} Response
 */

function createTexture(width, height, repeat, draw) {
  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext("2d");
  draw(ctx);
  return ctx.createPattern(canvas, repeat ? "repeat" : "no-repeat");
}

function ease(x) {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

function createNoise(width, height, intensity) {
  return createTexture(width, height, true, (ctx) => {
    let pixels = ctx.createImageData(width, height);
    let noise = new Uint8Array(width * height);
    webcrypto.getRandomValues(noise);
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i + 3] = ease((noise[i >> 2] * intensity) / 255) * 255;
    }
    ctx.putImageData(pixels, 0, 0);
  });
}

/**
 * @param req {Request}
 * @param res {Response}
 */

export default async (req, res) => {
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext("2d");

  const { name = "World" } = req.query;

  ctx.save();
  ctx.filter = "blur(25px)";
  ctx.fillStyle = "rgba(122,122,0,0.5)";
  ctx.beginPath();
  ctx.arc(200, 175, 100, 0, 2 * Math.PI);
  ctx.fill();

  ctx.restore();

  ctx.save();

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

  ctx.restore();
  ctx.save();

  performance.mark("start");
  // ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = createNoise(100, 100, 0.5);
  ctx.fillRect(0, 0, 300, 300);
  performance.measure("generate noise", "start");

  ctx.restore();

  // Pull out all of the measurements.
  console.log(performance.getEntriesByType("measure"));

  // Finally, clean up the entries.
  performance.clearMarks();
  performance.clearMeasures();

  const format = "jpeg";

  res.setHeader("content-type", `image/${format}`);
  res.send(await canvas.encode(format, 80));
};
