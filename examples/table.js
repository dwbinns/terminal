#!/usr/bin/env node
import table from "@dwbinns/terminal/table";
import { red, green, yellow } from "@dwbinns/terminal/colour";

console.log(
    table(
        [
            ["Heading", "Information", ""],
            ["Row1\nMultiline", red("red") + " wide column"],
            ["Colspan 2", , green("green\nlines")],
            [, yellow("yellow")],
            ["Spanning all columns"],
        ],
        { border: "single", header: "heavy", padding: 1 }
    )
);

console.log(
    table(
        [
            ["Heading", "row"],
            ["compact", "table"],
        ],
        { header: "underline" }
    )
);
