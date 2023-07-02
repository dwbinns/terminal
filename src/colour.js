import { sgr, wrap } from "./ansi.js";
import * as format from "./format.js";

const { max, min, round, trunc } = Math;

const colourDepths = [1, 4, 8, 24];

let colourDepth = process.stderr.getColorDepth?.() || colourDepths[Number(process.env.FORCE_COLOR)];

const background = 40;
const foreground = 30;
const underline = 50;

export const normalBG = sgr(49);
export const normal = sgr(39);

const identity = x => x;
identity.toString = () => '';

export function diagnostics() {
    let colour = new Array(60).fill().map((_, index) => hsl2rgb(index * 6, 1, 0.5));
    let spectrum = (convert) => colour.map(([r, g, b]) => convert(r, g, b)("+")).join("");
    let results = [
        `Colour depth: ${colourDepth}`,
        `4 bit foreground : ${spectrum((r, g, b) => colour4(foreground, rgbToColour4(r, g, b)))}`,
        `8 bit foreground : ${spectrum((r, g, b) => colour8(foreground, rgbToColour8(r, g, b)))}`,
        `24 bit foreground: ${spectrum((r, g, b) => colour24(foreground, rgbToColour24(r, g, b)))}`,
        `4 bit background : ${spectrum((r, g, b) => colour4(background, rgbToColour4(r, g, b)))}`,
        `8 bit background : ${spectrum((r, g, b) => colour8(background, rgbToColour8(r, g, b)))}`,
        `24 bit background: ${spectrum((r, g, b) => colour24(background, rgbToColour24(r, g, b)))}`,
        `8 bit underline  : ${format.underline(spectrum((r, g, b) => colour8(underline, rgbToColour8(r, g, b))))}`,
        `24 bit underline : ${format.underline(spectrum((r, g, b) => colour24(underline, rgbToColour24(r, g, b))))}`,
        '',
    ];

    return results.join("\n");
}

function colour(where, code) {
    if (colourDepth >= 4) return colour4(where, code);
    else return identity;
}

function colour4(where, code) {
    return wrap(sgr(where + code), sgr(where + 9));
}

function colour8(where, colourIndex) {
    return wrap(sgr(where + 8, 5, colourIndex), sgr(where + 9));
}

function colour24(where, [r, g, b]) {
    return wrap(sgr(where + 8, 2, r, g, b), sgr(where + 9));
}

function rgbToColour4(r, g, b) {
    const normalize = (v) => v > 128 ? 1 : 0;
    const bright = (r + g + b) > 384;
    return normalize(r) + normalize(g) * 2 + normalize(b) * 4 + (bright ? 60 : 0);
}

function rgbToColour8(r, g, b) {
    const normalize = v => min(5, max(0, trunc(v / 51)));
    return normalize(r) * 36 + normalize(g) * 6 + normalize(b) + 16;
}

function rgbToColour24(r, g, b) {
    const normalize = (v) => min(255, max(0, round(v)));
    return [normalize(r), normalize(g), normalize(b)];
}



const rgbAt = (where) => (r, g, b) => {
    if (colourDepth >= 24) {
        return colour24(where, rgbToColour24(r, g, b));
    }
    if (colourDepth >= 8) {
        return colour8(where, rgbToColour8(r, g, b));
    }
    if (colourDepth >= 4 && where != underline) {
        return colour4(where, rgbToColour4(r, g, b));
    }
    return identity;
}

function hsl2rgb(h, s, l) {
    let a = s * min(l, 1 - l);
    let f = (n, k = (n + h / 30) % 12) => l - a * max(min(k - 3, 9 - k, 1), -1);
    return [f(0) * 256, f(8) * 256, f(4) * 256];
}

export const rgb = rgbAt(foreground);
export const hsl = (h, s, l) => rgb(...hsl2rgb(h, s, l));

export const black = colour(foreground, 0);
export const red = colour(foreground, 1);
export const green = colour(foreground, 2);
export const yellow = colour(foreground, 3);
export const blue = colour(foreground, 4);
export const magenta = colour(foreground, 5);
export const cyan = colour(foreground, 6);
export const white = colour(foreground, 7);

export const brightBlack = colour(foreground, 60);
export const brightRed = colour(foreground, 61);
export const brightGreen = colour(foreground, 62);
export const brightYellow = colour(foreground, 63);
export const brightBlue = colour(foreground, 64);
export const brightMagenta = colour(foreground, 65);
export const brightCyan = colour(foreground, 66);
export const brightWhite = colour(foreground, 67);

export const grey = brightBlack;


export const rgbBG = rgbAt(background);
export const hslBG = (h, s, l) => rgbBG(...hsl2rgb(h, s, l));

export const blackBG = colour(background, 0);
export const redBG = colour(background, 1);
export const greenBG = colour(background, 2);
export const yellowBG = colour(background, 3);
export const blueBG = colour(background, 4);
export const magentaBG = colour(background, 5);
export const cyanBG = colour(background, 6);
export const whiteBG = colour(background, 7);
export const brightBlackBG = colour(background, 60);
export const brightRedBG = colour(background, 61);
export const brightGreenBG = colour(background, 62);
export const brightYellowBG = colour(background, 63);
export const brightBlueBG = colour(background, 64);
export const brightMagentaBG = colour(background, 65);
export const brightCyanBG = colour(background, 66);
export const brightWhiteBG = colour(background, 67);

export const greyBG = brightBlackBG;

export const underlineRGB = rgbAt(underline);
