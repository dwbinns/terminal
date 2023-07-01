import * as colours from "@dwbinns/terminal/colour";
import table from "@dwbinns/terminal/table";
import { wavyUnderline } from "@dwbinns/terminal/format";

let names = ["Black", "Red", "Yellow", "Green", "Cyan", "Blue", "Magenta", "White"];

console.log(
    table(
        names.map(name => [
            name.toLowerCase(),
            `bright${name}`,
            `${name.toLowerCase()}BG`,
            `bright${name}BG`,
        ])
            .map((names, i) =>
                names.map((name, j) =>
                    [
                        `${i == 0 ? "white" : "black"}${j < 2 ? "BG" : ""}`,
                        name.replace("brightBlack", "grey")
                    ]
                )
            )
            .map(names =>
                names.map(([contrast, name]) =>
                    colours[contrast](
                        colours[name](name)
                    )
                )
            ),
        { header: false }
    )
);

console.log(wavyUnderline(colours.underlineRGB(255, 64, 0)("red wavy underline")));

console.log(colours.diagnostics());

