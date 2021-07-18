#!/usr/bin/env node
import { box } from "@dwbinns/terminal/box";
let lines = ["heavy", "none", "single", "double", "double", "single", "none", "heavy"];
for (let horizontal of lines) {
    for (let vertical of lines) {
        process.stdout.write(box(vertical, horizontal, vertical, horizontal));
    }
    process.stdout.write("\n");
}
