#!/usr/bin/env node
import box from "@dwbinns/terminal/box";
import { normalBG, red, rgb, rgbBG, yellow } from "@dwbinns/terminal/colour";
import { underline } from "@dwbinns/terminal/format";
import { decodeKeys } from "@dwbinns/terminal/keyboard";
import { visiblePadEnd, visibleSlice } from "@dwbinns/terminal/string";
import { performance } from 'perf_hooks';
import { clearLineFromCursor } from "@dwbinns/terminal/cursor";

const { random, round, sin } = Math;

class Colours {
    constructor(frame) {
        this.frame = frame;
    }

    render(frameCounter, grid) {
        const computeColour = (x, y) => {
            let r = x * 256 / this.frame.width;
            let g = y * 128 / this.frame.height;
            let b = 128 + sin(frameCounter / 32 * Math.PI) * 127;
            return [r, g, b];
        };

        for (let y = 0; y < this.frame.height; y++) {
            for (let x = 0; x < this.frame.width; x++) {
                grid[y][x] = rgbBG(...computeColour(x, y * 2)) + rgb(...computeColour(x, y * 2 + 1)) + "▄";
                //grid[y][x] = rgbBG(...computeColour(x, y * 2)) + "▄";
            }
        }
    }
}

class Worm {
    worm = [];
    direction = 0;
    newDirection = 0;

    constructor(frame) {
        this.frame = frame;
        this.x = round(this.frame.width / 2);
        this.y = round(this.frame.height / 2);
    }

    render(grid) {
        if (this.y < 0
            || this.y >= this.frame.height
            || this.x < 0
            || this.x >= this.frame.width
            || this.worm.find(({ x, y }) => x == this.x && y == this.y)
        ) {
            throw "Game over!";
        }

        this.worm.push({
            x: this.x,
            y: this.y,
            text: box(
                this.direction == 2 || this.newDirection == 0 ? 'heavy' : "none",
                this.direction == 3 || this.newDirection == 1 ? 'heavy' : "none",
                this.direction == 0 || this.newDirection == 2 ? 'heavy' : "none",
                this.direction == 1 || this.newDirection == 3 ? 'heavy' : "none",            )
        });

        this.worm = this.worm.slice(-16);

        this.worm.forEach(({ x, y, text }, index) => {
            let v = 255 - (this.worm.length - index) * 16;
            grid[y][x] = rgb(v, v, v)(text);
        });

        this.direction = this.newDirection;

        switch (this.direction) {
            case 0: this.y -= 1; break;
            case 1: this.x += 1; break;
            case 2: this.y += 1; break;
            case 3: this.x -= 1; break;
        }
    }

    async readInput() {
        for await (let { keyName } of decodeKeys(process.stdin)) {
            if (keyName == "left") this.newDirection = (this.direction + 3) % 4;
            if (keyName == "right") this.newDirection = (this.direction + 1) % 4;
            if (keyName == "escape") break;
        }
    }
}

class TextScroller {
    constructor(y) {
        let text = `${yellow(`Welcome! Press ${red(underline('left'))} or ${red(underline('right'))} to move or ${red(underline('escape'))} to exit`)}`;
        this.paddedText = visiblePadEnd(text, frame.width) + text + ' ';
        this.y = y;
    }

    render(frameCounter) {
        process.stderr.cursorTo(0, this.y);
        let width = process.stderr.columns;
        let start = frameCounter % width;

        process.stderr.write(visibleSlice(this.paddedText, start, start + width));
    }
}

let frame = { x: 0, y: 1, width: process.stderr.columns, height: process.stderr.rows - 2 };

let worm = new Worm(frame);
let colours = new Colours(frame);
let textScroller = new TextScroller(process.stderr.rows);

let frameCounter = 0;
let interval = setInterval(() => {
    let start = performance.now();
    let grid = new Array(frame.height).fill().map(() => new Array(frame.width).fill(" "));
    colours.render(frameCounter, grid);
    worm.render(grid);
    grid.forEach((line, index) => {
        process.stderr.cursorTo(frame.x, frame.y + index);
        process.stderr.write(line.join("") + normalBG);
    });

    textScroller.render(frameCounter);
    let end = performance.now();
    process.stderr.cursorTo(0, 0);
    process.stderr.write(`Render time ${end - start} ms ` + clearLineFromCursor);

    frameCounter++;
}, 100);

await worm.readInput();

clearInterval(interval);
