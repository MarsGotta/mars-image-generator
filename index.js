const { wrapText, codeStyles, notionAPI } = require('./utils');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

let descriptionHeight = 0;
const canvasWidth = 1080;
const canvasHeight = 1080;

async function drawImage(context, path, x, y, width, height) {
    const image = await loadImage(path);
    const imageX = x || canvasWidth / 2 - image.width / 2;
    const imageY = y || canvasHeight / 2 - image.height / 2;
    const imageWidth = width || image.width;
    const imageHeight = height || image.height;
    context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
}

async function generateImage(element) {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');
    const { description, codeImage, category, key } = element;
    const title = `#${category}`;
    const id = key < 10 ? `0${key}` : key;
    const number = ` ${id}:`;

    context.fillStyle = '#1F1331';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    await drawImage(context, './assets/background.png', 0, 0, canvasWidth, canvasHeight);
    await drawImage(context, './assets/mark.png', 100, 120);
    await drawImage(context, './assets/logo.png', canvasWidth - 270, canvasHeight - 120);

    context.font = codeStyles[category].titleFont;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = codeStyles[category].colorTitle;
    context.fillText(title, codeStyles[category].titleX, 80);

    context.fillStyle = codeStyles[category].colorNumber;
    context.fillText(number, canvasWidth - codeStyles[category].numberX, 80);

    context.rect(20, 20, canvasWidth - 40, canvasHeight - 40);
    context.setLineDash([6, 4]);
    context.strokeStyle = codeStyles[category].colorStroke;
    context.stroke();

    context.fillStyle = '#fff';
    context.font = '300 48px Quicksand';
    const descriptionY = description.length <= 145 ? 280 : 250;

    descriptionHeight = wrapText(context, description, 540, descriptionY, 950, 48, 'Roboto');

    const calculateHeight = descriptionHeight < (canvasHeight - 650) ? canvasHeight - 650 : descriptionHeight;

    await drawImage(context, codeImage, null, calculateHeight);

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(`./result/${category}/${category}-${id}.png`, buffer)
}

async function init() {
    const response = await notionAPI();
    const newResponse = response.map(({ properties }, index) => {
        return {
            description: properties.Description.rich_text[0].plain_text,
            codeImage: properties.Image.files[0].file.url,
            category: properties.Category.select.name
        }
    })
    newResponse.forEach((element, key) => {
        generateImage({ ...element, key: key + 1 });
    });
}

init();
