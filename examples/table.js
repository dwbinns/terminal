#!/usr/bin/env node
import table from "@dwbinns/terminal/table";
import { red, green } from "@dwbinns/terminal/colour";

console.log(
    table(
        [
            ["Heading", "Information"],
            ["Row1", red("red")],
            ["Row2", green("green")],
            ["Row3"],
        ]
    )
);
