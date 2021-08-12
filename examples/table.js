#!/usr/bin/env node
import table from "@dwbinns/terminal/table";
import { red, green, yellow, blue } from "@dwbinns/terminal/colour";

console.log(
    table(
        [
            ["Heading", "Information", "check-that-hypens-are-split"],
            [`Row1 ${blue("with colour")} that is wrapped`, red("red") + " wide column"],
            ["Colspan 2", , green("green\nlines")],
            [, yellow("yellow")],
            ["Spanning all columns and needing wrapping"],
        ],
        { border: "single", padding: 1, maxWidth: 42 }
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
