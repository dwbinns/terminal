#!/usr/bin/env node
import { setTimeout } from "timers/promises";
import content from "@dwbinns/terminal/content";

const { random, round } = Math;

let target = content();
let loggers = [];
let counters = [];

await target.interact(
    async () => {
        for (let i = 0; i < 100; i++) {
            loggers.push(target.overprinter())
            counters.push(0);
            for (let j = 0; j < loggers.length; j++) {
                counters[j] += round(random() * 10);
                loggers[j](`${j}`.padStart(3), "[" + "".padStart(counters[j], "=") + "]");
            }
            await setTimeout(10);
        }
    }
);

console.log("Goodbye!")