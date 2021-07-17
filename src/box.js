
const lookup = (table, verticalLUT, horizontalLUT) =>
    (up, right, down, left) => {
        let vIndex = verticalLUT.findIndex((v) => v[0] == up && v[1] == down);
        let hIndex = horizontalLUT.findIndex((h) => h[0] == left && h[1] == right);
        if (vIndex >= 0 && hIndex >= 0) return table[vIndex][hIndex];
    }



const mixedLUT = [
    ["none", "none"],
    ["none", "single"],
    ["single", "heavy"],
    ["heavy", "heavy"],
    ["heavy", "single"],
    ["single", "single"],
    ["single", "none"],
    ["none", "heavy"],
    ["heavy", "none"],
];


const mixed = lookup(
    [
        ' ╶╼━╾─╴╺╸',
        '╷┌┮┯┭┬┐┍┑',
        '╽┟╆╈╅╁┧┢┪',
        '┃┠╊╋╉╂┨┣┫',
        '╿┞╄╇╃╀┦┡┩',
        '│├┾┿┽┼┤┝┥',
        '╵└┶┷┵┴┘┕┙',
        '╻┎┲┳┱┰┒┏┓',
        '╹┖┺┻┹┸┚┗┛',
    ],
    mixedLUT,
    mixedLUT
);

const doubleLUT = [
    ["none", "none"],
    ["none", "double"],
    ["double", "double"],
    ["double", "none"],
];

const singleLUT = [
    ["none", "none"],
    ["none", "single"],
    ["single", "single"],
    ["single", "none"],
];


const double = lookup([
    '  ═ ',
    ' ╔╦╗',
    '║╠╬╣',
    ' ╚╩╝',
], doubleLUT, doubleLUT);

const singleDouble = lookup([
    '  ═ ',
    ' ╒╤╕',
    '│╞╪╡',
    ' ╘╧╛',
], singleLUT, doubleLUT);

const doubleSingle = lookup([
    '  ─ ',
    ' ╓╥╖',
    '║╟╫╢',
    ' ╙╨╜',
], doubleLUT, singleLUT);


export const rounded = lookup([
    ' ╶─╴',
    '╷╭┬╮',
    '│├┼┤',
    '╵╰┴╯',
], singleLUT, singleLUT);


export default (up, right, down, left) =>
    mixed(up, right, down, left)
    || double(up, right, down, left)
    || singleDouble(up, right, down, left)
    || doubleSingle(up, right, down, left)
    || " ";


