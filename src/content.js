#!/usr/bin/env node
import { decodeKeys } from "../src/keyboard.js";
import { format } from "util";
import { visibleLength, visiblePadEnd, visibleSlice } from "./string.js";
import { clearLineFromCursor, clearScreenFromCursor, up } from "./cursor.js";
import { on } from "events";

const { min, max } = Math;

export default class Content {

    offsetX = 0;
    offsetY = 0;
    follow = true;
    written = 0;
    lines = [];
    width = process.stderr.columns;
    height = process.stderr.rows - 1;
    closed = false;
    allowExit = false;

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
        if (this.closed) return;
        this.timeout = null;
        if (this.written > 1) process.stderr.write(up(this.written - 1));

        process.stderr.write("\r");

        let printLines = this.follow
            ? this.lines.slice(-this.height)
            : this.lines.slice(this.offsetY, this.offsetY + this.height);


        printLines.forEach((line, index) =>
            process.stderr.write(clearLineFromCursor + visibleSlice(line, this.offsetX, this.offsetX + this.width) + "\n")
        );

        if (this.isInteractive) process.stderr.write(`Arrow to scroll ${this.allowExit ? "escape to exit" : ""}`.slice(0, this.width));

        this.written = printLines.length + 1;
    }

    async interact(generate) {
        this.stop = new AbortController();
        this.isInteractive = true;

        await Promise.all([
            (async () => {
                if (generate) {
                    await generate(this.stop.signal);
                    this.allowExit = true;
                    this.requestRender();
                }
            })(),
            (async () => {
                process.stdin.setRawMode(true);

                try {
                    this.requestRender();
                    for await (let { keyName } of decodeKeys(on(process.stdin, "data", { signal: this.stop.signal }))) {
                        if (keyName == "escape" && this.allowExit) this.close();
                        if (keyName == "left") this.offsetX--;
                        if (keyName == "home") this.offsetX = 0;
                        if (keyName == "end") this.offsetX = this.maxWidth - this.width;
                        if (keyName == "right") this.offsetX++;
                        if ((keyName == "up" || keyName == "pageup") && this.follow) {
                            this.follow = false;
                            this.offsetY = this.lines.length - this.height;
                        }
                        if (keyName == "up") this.offsetY--;
                        if (keyName == "down") this.offsetY++;
                        if (keyName == "pageup") this.offsetY -= this.height;
                        if (keyName == "pagedown") this.offsetY += this.height;

                        this.offsetX = max(0, min(this.offsetX, this.maxWidth - this.width));
                        this.offsetY = max(0, this.offsetY);
                        if (this.offsetY >= this.lines.length - this.height) this.follow = true;

                        this.requestRender();
                    }
                } catch (e) {
                    if (e.name != "AbortError") throw e;
                } finally {
                    process.stdin.pause();
                    this.close();
                }
            })()
        ]);



    }

    close() {
        if (this.closed) return;
        this.timeout && clearTimeout(this.timeout);
        this.closed = true;

        this.stop.abort();

        if (this.written > 1) process.stderr.write(up(this.written - 1));

        process.stderr.write("\r" + clearScreenFromCursor);

        this.lines.forEach((line, index) =>
            process.stderr.write(visiblePadEnd(visibleSlice(line, this.offsetX, this.offsetX + this.width), this.width) + "\n")
        );
    }

}



