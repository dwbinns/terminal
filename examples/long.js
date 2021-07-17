#!/usr/bin/env node
import { setTimeout } from "timers/promises";
import content from "@dwbinns/terminal/content";

let target = content();

let loggers = [];

for (let i = 0; i < 40; i++) {
    loggers.push(target.overprinter())
    for (let j = 0; j < loggers.length; j++) {
        loggers[j](`${j}`.padStart(3), "[" + "".padStart(i - j + 1, "=") + "]");
        await setTimeout(10);
    }
}

target.close();