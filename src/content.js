#!/usr/bin/env node
import { decodeKeys } from "../src/keyboard.js";
import { format } from "util";
import { visibleLength, visiblePadEnd, visibleSlice } from "./string.js";
import { clearLineFromCursor, up } from "./cursor.js";

const { max } = Math;

class Content {

    offsetX = 0;
    offsetY = 0;
    follow = true;
    written = 0;
    lines = [];
    width = process.stderr.columns;
    height = process.stderr.rows - 1;

    constructor() {

    }

    requestRender() {
        this.timeout ||= setTimeout(() => this.render(), 16);
    }

    set(y, text) {
        while (y >= this.lines.length) this.lines.push('');
        this.lines[y] = text;
        this.maxWidth = max(...this.lines.map(line => visibleLength(line)));
        this.requestRender();
    }

    log(...args) {
        let y = this.lines.length;
        this.set(y, format(...args));
    }

    overprinter(y = this.lines.length) {
        this.set(y, '');
        return (...args) => this.set(y, format(...args));
    }

    render() {
        this.timeout = null;
        if (this.written > 1) process.stderr.write(up(this.written - 1));
        let printLines = this.follow
            ? this.lines.slice(-this.height)
            : this.lines.slice(this.offsetY, this.offsetY + this.height);


        printLines.forEach((line, index) =>
            process.stderr.write((index > 0 ? "\n" : "\r") + clearLineFromCursor + visibleSlice(line, this.offsetX, this.offsetX + this.width))
        );

        process.stderr.write("Arrow to scroll, escape to interrupt".slice(0, this.width));

        this.written = printLines.length + 1;


    }

    async interact() {
        for await (let { keyName } of decodeKeys(process.stdin)) {
            if (keyName == "escape") break;
            if (keyName == "left") {
                if (this.offsetX > 0) this.offsetX -= 1;
            }
            if (keyName == "right") {
                if (this.offsetX < this.maxWidth - this.width) this.offsetX += 1;
            }
            if (keyName == "up") {
                if (this.follow) {
                    this.follow = false;
                    this.offsetY = this.lines.length - this.height - 1;
                } else this.offsetY -= 1;
                if (this.offsetY < 0) this.offsetY = 0;
            }

            if (keyName == "down") {
                if (this.offsetY < this.lines.length - this.height) this.offsetY += 1;
                else this.follow = true;
            }
            this.requestRender();
        }
        this.close();
        process.exit(1);
    }

    close() {
        process.stdin.destroy();

        if (this.written > 1) process.stderr.write(up(this.written - 1));

        process.stderr.write("\r");

        this.lines.forEach((line, index) =>
            process.stderr.write(visiblePadEnd(visibleSlice(line, this.offsetX, this.offsetX + this.width), this.width) + "\n")
        );
    }

}



export default function () {
    let content = new Content();
    content.interact().catch(console.error)
    return content;
}