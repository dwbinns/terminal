import { sgr, wrap } from "./ansi.js";

const { max, min, round } = Math;

let colourDepth = process.stderr.getColorDepth?.() || Number(process.env.FORCE_COLOR);

const background = 40;
const foreground = 30;
const underline = 50;

export const normalBG = sgr(49);
export const normal = sgr(39);

const identity = x => x;
identity.toString = () => '';

function colour(where, code, ...parameters) {
    if (colourDepth >= 4) return wrap(sgr(where + code, ...parameters), sgr(where + 9));
    else return identity;
}

const rgbAt = (where) => (r, g, b) => {
    if (colourDepth >= 24) {
        const normalize = (v) => min(255, max(0, round(v)));
        return colour(where, 8, 2, normalize(r), normalize(g), normalize(b));
    }
    if (colourDepth >= 8) {
        const normalize = v => min(5, max(0, round(v / 42.5)));
        let colourIndex = normalize(r) * 36 + normalize(g) * 6 + normalize(b) + 16;
        return colour(where, 8, 5, colourIndex);
    }
    if (colourDepth >= 4) {
        const normalize = (v) => v > 128 ? 1 : 0;
        let colourIndex = normalize(r) + normalize(g) * 2 + normalize(b) * 4;
        return colour(where, colourIndex);
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
