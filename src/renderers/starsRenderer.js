import { theme } from "../config/theme.js";

export function createStarsRenderer({ context }) {
  const starImage = new Image();
  starImage.src = theme.globe.stars;

  function drawStars(width, height, rotation) {
    if (!starImage.complete) return;

    const { width: imgW, height: imgH } = starImage;

    context.save();

    let offsetX = rotation[0] % imgW;
    let offsetY = rotation[1] % imgH;

    if (offsetX < 0) offsetX += imgW;
    if (offsetY < 0) offsetY += imgH;

    context.translate(-offsetX, -offsetY);

    for (let x = -imgW; x < width + imgW; x += imgW) {
      for (let y = -imgH; y < height + imgH; y += imgH) {
        context.drawImage(starImage, x, y, imgW, imgH);
      }
    }

    context.restore();
  }

  return drawStars;
}