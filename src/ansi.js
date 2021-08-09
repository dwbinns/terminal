// See: https://en.wikipedia.org/wiki/ANSI_escape_code

export const escape = '\x1b';
const csiStart = `${escape}[`;

let isTTY = process.stderr.isTTY || process.env.FORCE_COLOR;

export const csi = (...parameters) =>
    isTTY
        ? `${csiStart}${parameters.slice(0, -1).map(item => item.toString()).join(";")}${parameters.slice(-1)[0]}`
        : '';

export const sgr = (...parameters) => csi(...parameters, "m");

export const wrap = (start, end) => {
    let wrapText = (input) =>
        `${start}${input.toString().replaceAll(end, start)}${end}`;
    wrapText.toString = () => start;
    return wrapText;
}


export function* parseEscape(input) {
    let sequence = '';
    for (let char of input) {
        sequence += char;

        if (sequence == csiStart) continue;

        if ((sequence.startsWith(csiStart) && char < "@")) continue;

        if (sequence == escape) continue;

        if (sequence == `\x1bO`) continue;

        yield sequence;
        sequence = "";
    }

    if (sequence) {
        yield sequence;
    }
}

export function* decodeEscape(input) {
    for (let sequence of parseEscape(input)) {
        if (sequence.startsWith(csiStart)) {
            yield {
                escape: true,
                content: sequence.slice(1),
                csi: true,
                parameters: sequence.slice(2, -1).split(";"),
                terminal: sequence.slice(-1)[0]
            }
        } else if (sequence.startsWith(escape)) {
            yield {
                escape: true,
                content: sequence.slice(1)
            }
        } else {
            yield {
                text: sequence
            };
        }
    }
}