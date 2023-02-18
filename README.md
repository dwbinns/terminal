# Node Terminal Library

Formatting and keyboard input handling for the terminal in NodeJS.

```js
import { red, magentaBG } from "@dwbinns/terminal/colour";
import { underline } from "@dwbinns/terminal/format";
console.log(`${magentaBG("Magenta")} ${underline(`underline ${red("red")}`)}`);
```

![Formatting example](https://raw.githubusercontent.com/dwbinns/terminal/main/docs/format.png)

## Installation

    npm install @dwbinns/terminal

Alternatively clone the git repository to try the examples:

    git clone https://github.com/dwbinns/terminal.git

## Notes

This library is ES module (import/export) only. CommonJS (require) is not supported.

Only ANSI compatible terminals are supported.

British English spelling is used (note the spelling of colour and grey).

## Format

Function to format strings.

```js
import { underline, doubleUnderline, wavyUnderline } from "@dwbinns/terminal/format";

console.log(underline('underlined text'), 'normal');
console.log(doubleUnderline('double underlined text'), 'normal');
console.log(wavyUnderline('wavy underlined text'), 'normal');
```

## Colours

Functions to apply colouring to strings.

```js
import { cyan, cyanBG, rgb, rgbBG, underlineRGB } from "@dwbinns/terminal/colour";
import { underline } from "@dwbinns/terminal/format";

console.log(cyan('cyan text'), 'normal');
console.log(cyanBG('cyan background'), 'normal');

const red = 255;
const green = 128;
const blue = 0;
console.log(rgb(red, green, blue)('orange text'), 'normal');

console.log(rgbBG(red, green, blue)('orange background'), 'normal');
console.log(underline(underlineRGB(red, green, blue)('orange underline')), 'normal');
```

formats a string with a given background colour.

RGB colours will be rendered as 3 bit, 8 bit or 24 bit depending on terminal capabilites.

## Hyperlink

**hyperlink** - create a clickable link to a URL

```js
import {hyperlink} from "@dwbinns/terminal/hyperlink";
const options = {};
const url = "https://github.com/dwbinns/terminal";
const text = "dwbinns/terminal";

console.log(hyperlink(options, url, text));
```


## Keyboard

**decodeKeys** - an async generator which takes a stream and yields objects
describing keyboard events.

A stream which is passed in will be set to raw mode.

Alternatively any async iterable yielding buffers or strings may be supplied.

Each object may contain fields:

- text
- keyName
- shift
- alt
- ctrl

Not all keys are distinguishable, for example [ctrl]+[m] is the same as [return]. For some keys the modifiers (ctrl, shift, alt) cannot be determined.

```js
import { decodeKeys } from "@dwbinns/terminal/keyboard";
for await (let input of decodeKeys(process.stdin)) {
  console.log(input);
  if (input.keyName == "escape") break;
}
```

Example output:

```
{ text: '4', keyName: '4' }
{ keyName: 'pageup', shift: false, alt: true, ctrl: false }
{ keyName: 'tab', shift: true }
{ text: '8', keyName: '8' }
{ keyName: '*', alt: true }
```

## Box drawing characters

```js
import { box } from "@dwbinns/terminal/box";
const up = "single";
const down = "single";
const left = "double";
const right = "double";
console.log(box(up, right, down, left));
```

**box** - return a single box drawing character
where up, right, down and left represent the line styles in the specified direction and can be "none", "single", "double" or "heavy".

Limitations:

- "heavy" and "double" cannot be combined
- "single" and "double" cannot be combined on the same axis

In these cases "double" will be replaced with "heavy".

examples/box.js

```js
import { box } from "@dwbinns/terminal/box";
let lines = [
  "heavy",
  "none",
  "single",
  "double",
  "double",
  "single",
  "none",
  "heavy",
];
for (let horizontal of lines) {
  for (let vertical of lines) {
    process.stdout.write(box(vertical, horizontal, vertical, horizontal));
  }
  process.stdout.write("\n");
}
```

![Box drawing](https://raw.githubusercontent.com/dwbinns/terminal/main/docs/boxes.png)

```js
import { rounded } from "@dwbinns/terminal/box";
const up = true;
const down = false;
const left = true;
const right = false;
console.log(rounded(up, right, down, left));
```

Returns a single box drawing character with rounded corners where up, right, down and left can be true (to draw a line) or false (to draw nothing).

## Format aware string functions

String functions that are aware of the visible length of the string, not including formatting characters.

```js
import { visiblePadEnd, visiblePadStart, visibleLength } from "@dwbinns/terminal/string";
let string = "hello";
let length = 20;
let fill = " ";

// Pad a string at the end to the specified visible length with the optional fill character.
visiblePadEnd(string, length, fill);

// Pad a string at the start to the specified visible length with the optional fill character.
visiblePadStart(string, length, fill);

// Get the visible length of a string.
visibleLength(string);
```

## Table formatting

**table** - format tables in aligned columns, even if cells contain formatting characters.

Data should be an array of rows each of which is an array of cells for that row.

```js
import table from "@dwbinns/terminal/table";
import { red, green } from "@dwbinns/terminal/colour";

console.log(
  table([
    ["Heading", "Information"],
    ["Row1", red("red")],
    ["Row2", green("green")],
  ])
);
```

![Table](https://raw.githubusercontent.com/dwbinns/terminal/main/docs/table.png)

## Tree formatting

```js
import tree from "@dwbinns/terminal/tree";
import { rounded } from "@dwbinns/terminal/box";
const node = {
  description: "parent",
  children: [{ description: "child" }],
};
const getChildren = (node) => node.children || [];
const getDescription = (node) => node.description;
const indent = 2;
const style = rounded;
console.log(tree({ node, getChildren, getDescription, indent, style }));
```

**tree** - format a tree:

- `node`: top level node
- `getChildren`: function returning array of children for each node (default: `node => node.children`)
- `getDescription`: function returning a string as a label for each node (default: `node => node.toString()`)
- `indent`: number of characters of indent (default: 2)
- `style`: box drawing characters to use (default: rounded)

```js
import tree from "@dwbinns/terminal/tree";
import { statSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

function getChildren(path) {
  if (!statSync(path).isDirectory()) return [];
  return readdirSync(path)
    .filter((item) => !item.startsWith("."))
    .map((item) => join(path, item));
}

function getDescription(path) {
  return basename(path);
}

console.log(tree({ node: ".", getChildren, getDescription }));
```

![Tree](https://raw.githubusercontent.com/dwbinns/terminal/main/docs/tree.png)
