import { sgr, wrap } from "./ansi.js";

const { max, min, round } = Math;

let colourDepth = process.stderr.getColorDepth();

export const normalBG = sgr(49);
export const normal = sgr(39);

const identity = x => x;
identity.toString = () => '';

function colour(fore, code, ...parameters) {
    if (colourDepth >= 4) return wrap(sgr((fore ? 30 : 40) + code, ...parameters), sgr(fore ? 39 : 49));
    else return identity;
}

const rgbAt = (fore) => (r, g, b) => {
    if (colourDepth >= 24) {
        const normalize = (v) => min(255, max(0, round(v)));
        return colour(fore, 8, 2, normalize(r), normalize(g), normalize(b));
    }
    if (colourDepth >= 8) {
        const normalize = v => min(5, max(0, round(v / 42.5)));
        let colourIndex = normalize(r) * 36 + normalize(g) * 6 + normalize(b) + 16;
        return colour(fore, 8, 5, colourIndex);
    }
    if (colourDepth >= 4) {
        const normalize = (v) => v > 128 ? 1 : 0;
        let colourIndex = normalize(r) + normalize(g) * 2 + normalize(b) * 4;
        return colour(fore, colourIndex);
    }
    return identity;
}

export const rgb = rgbAt(true);

export const black = colour(true, 0);
export const red = colour(true, 1);
export const green = colour(true, 2);
export const yellow = colour(true, 3);
export const blue = colour(true, 4);
export const magenta = colour(true, 5);
export const cyan = colour(true, 6);
export const white = colour(true, 7);

export const brightBlack = colour(true, 60);
export const brightRed = colour(true, 61);
export const brightGreen = colour(true, 62);
export const brightYellow = colour(true, 63);
export const brightBlue = colour(true, 64);
export const brightMagenta = colour(true, 65);
export const brightCyan = colour(true, 66);
export const brightWhite = colour(true, 67);

export const grey = brightBlack;


export const rgbBG = rgbAt(false);

export const blackBG = colour(false, 0);
export const redBG = colour(false, 1);
export const greenBG = colour(false, 2);
export const yellowBG = colour(false, 3);
export const blueBG = colour(false, 4);
export const magentaBG = colour(false, 5);
export const cyanBG = colour(false, 6);
export const whiteBG = colour(false, 7);
export const brightBlackBG = colour(false, 60);
export const brightRedBG = colour(false, 61);
export const brightGreenBG = colour(false, 62);
export const brightYellowBG = colour(false, 63);
export const brightBlueBG = colour(false, 64);
export const brightMagentaBG = colour(false, 65);
export const brightCyanBG = colour(false, 66);
export const brightWhiteBG = colour(false, 67);

export const greyBG = brightBlackBG;