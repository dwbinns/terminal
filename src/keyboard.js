import { decodeEscape } from "./ansi.js";

let keyCharacters = new Map([
    ["A", "up"],
    ["B", "down"],
    ["D", "left"],
    ["C", "right"],
    ["H", "home"],
    ["F", "end"],
    ["P", "F1"],
    ["Q", "F2"],
    ["R", "F3"],
    ["S", "F4"]
]);

let keyCodes = new Map([
    [1, "home"],
    [2, "insert"],
    [3, "delete"],
    [4, "end"],
    [5, "pageup"],
    [6, "pagedown"],
    [7, "home"],
    [8, "end"],
    [11, "F1"],
    [12, "F2"],
    [13, "F3"],
    [14, "F4"],
    [15, "F5"],
    [17, "F6"],
    [18, "F7"],
    [19, "F8"],
    [20, "F9"],
    [21, "F10"],
    [23, "F11"],
    [24, "F12"],
]);

function explainCharacter(char) {
    if (char == "\x7f") return { keyName: "backspace" };
    if (char == "\x1b") return { keyName: "escape" };
    if (char == "\b") return { keyName: "backspace", ctrl: true };
    if (char == "\r") return { keyName: "return" };
    if (char == "\t") return { keyName: "tab" };
    if (char < " ") return { keyName: String.fromCharCode(char.charCodeAt() + 96), ctrl: true };
    return { text: char, keyName: char };
}

export async function* decodeKeys(stream) {
    stream.setRawMode?.(true);
    for await (let block of stream) {
        for (let { text, csi, terminal, parameters, escape, content } of decodeEscape(block.toString())) {
            if (text) yield explainCharacter(text);
            else if (csi && terminal == "~") {
                let keyName = keyCodes.get(Number(parameters[0]))
                let modifiers = Number(parameters[1] || 1) - 1;
                let [shift = false, alt = false, ctrl = false] = [...modifiers.toString(2)].reverse().map(c => c == "1");
                if (keyName) yield { keyName, shift, alt, ctrl };
                else yield { unknown: content };
            }
            else if (csi && keyCharacters.has(terminal)) {
                let keyName = keyCharacters.get(terminal);
                let modifiers = parameters[0] == "1" ? Number(parameters[1] || 1) - 1 : 0;
                let [shift = false, alt = false, ctrl = false] = [...modifiers.toString(2)].reverse().map(c => c == "1");
                if (keyName) yield { keyName, shift, alt, ctrl };
                else yield { unknown: content };
            }
            else if (escape) {
                if (content == "") yield { keyName: 'escape', alt: false };
                else if (content == "[Z") yield { keyName: 'tab', shift: true };
                else if (content.startsWith("O") && keyCharacters.has(content.slice(1))) {
                    let keyName = keyCharacters.get(content.slice(1));
                    yield { keyName, shift: false, alt: false, ctrl: false };
                }
                else if (content.length == 1) {
                    let { text, ...explanation } = explainCharacter(content);
                    yield { ...explanation, alt: true };
                }
                else yield { unknown: content };
            }
        }
    }
}