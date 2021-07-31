const { max } = Math;

export const visibleText = (string) => string.replaceAll(/\x1b[[ -?]*./g, "");

export const visibleLength = (string) => visibleText(string).length;

export const visibleSlice = (string, start, end) => {
    let inputLength = visibleLength(string);
    if (end == undefined) end = inputLength;
    if (end < 0) end = inputLength + end;
    if (start < 0) start = inputLength + start;
    let output = '';
    let length = 0;
    for (let part of string.split(/(\x1b[[ -?]*.)/)) {
        if (part.startsWith("\x1b")) {
            output += part;
        } else {
            output += part.slice(max(0, start - length), max(0, end - length));
            length += part.length;
        }
    }

    return output;
};

export const visiblePadStart = (string, size, fill) => {
    return "".padStart(max(0, size - visibleLength(string)), fill) + string;
};

export const visiblePadEnd = (string, size, fill) => {
    return string + "".padEnd(max(0, size - visibleLength(string)), fill);
};



