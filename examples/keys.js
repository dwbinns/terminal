#!/usr/bin/env node
import { decodeKeys } from "@dwbinns/terminal/keyboard";

console.log("Press [escape] to exit")
for await (let input of decodeKeys(process.stdin)) {
    console.log(input);
    if (input.keyName == "escape") break;
}