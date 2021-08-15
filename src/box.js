
const lookup = (table, verticalLUT, horizontalLUT) =>
    (up, right, down, left) => {
        let vIndex = verticalLUT.findIndex((v) => v[0] == up && v[1] == down);
        let hIndex = horizontalLUT.findIndex((h) => h[0] == left && h[1] == right);
        if (vIndex >= 0 && hIndex >= 0) return table[vIndex][hIndex];
    }

const booleanTransform = (table, defaultValue) =>
    (up, right, down, left) =>
        table(
            up ? defaultValue : "none",
            right ? defaultValue : "none",
            down ? defaultValue : "none",
            left ? defaultValue : "none"
        );


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

export const single = booleanTransform(mixed, "single");
export const heavy = booleanTransform(mixed, "heavy");

const mixedAlternative = (up, right, down, left) =>
    mixed(
        up == "double" ? "heavy" : up,
        right == "double" ? "heavy" : right,
        down == "double" ? "heavy" : down,
        left == "double" ? "heavy" : left,
    )


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


const doubleDouble = lookup([
    '  ═ ',
    ' ╔╦╗',
    '║╠╬╣',
    ' ╚╩╝',
], doubleLUT, doubleLUT);

export const double = booleanTransform(doubleDouble, "double");

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


export const rounded = booleanTransform(lookup([
    ' ╶─╴',
    '╷╭┬╮',
    '│├┼┤',
    '╵╰┴╯',
], singleLUT, singleLUT), 'single');


export const box = (up, right, down, left) =>
    mixed(up, right, down, left)
    || doubleDouble(up, right, down, left)
    || singleDouble(up, right, down, left)
    || doubleSingle(up, right, down, left)
    || mixedAlternative(up, right, down, left)
    || " ";


