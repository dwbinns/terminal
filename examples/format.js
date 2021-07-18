#!/usr/bin/env node

import { red, magentaBG } from "@dwbinns/terminal/colour";
import { underline } from "@dwbinns/terminal/format";
console.log(`${magentaBG("Magenta")} ${underline(`underline ${red("red")}`)}`);

