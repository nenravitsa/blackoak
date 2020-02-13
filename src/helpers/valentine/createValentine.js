const { registerFont, loadImage, createCanvas } = require('canvas');

const createValentine = async text => {
  registerFont(__dirname + '/amatic.ttf', { family: 'Amatic SC' });
  const img = await loadImage(__dirname + '/background.png');

  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  ctx.font = '100px "Amatic SC"';
  ctx.fillStyle = '#EF4758';
  ctx.textAlign = 'center';
  printAtWordWrap(ctx, text, 600, 500, 80, 1000);

  return await canvas.toBuffer();
};

const printAtWordWrap = (context, text, x, y, lineHeight, fitWidth) => {
  fitWidth = fitWidth || 0;

  if (fitWidth <= 0) {
    context.fillText(text, x, y);
    return;
  }
  let words = text.split(' ');
  let currentLine = 0;
  let idx = 1;
  while (words.length > 0 && idx <= words.length) {
    const str = words.slice(0, idx).join(' ');
    let w = context.measureText(str).width;
    if (w > fitWidth) {
      if (idx === 1) {
        idx = 2;
      }
      context.fillText(
        words.slice(0, idx - 1).join(' '),
        x,
        y + lineHeight * currentLine
      );
      currentLine++;
      words = words.splice(idx - 1);
      idx = 1;
    } else {
      idx++;
    }
  }
  if (idx > 0)
    context.fillText(words.join(' '), x, y + lineHeight * currentLine);
};

module.exports = createValentine;
