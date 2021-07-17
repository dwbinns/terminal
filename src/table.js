import { visiblePadStart, visibleLength, visibleSlice } from "./string.js";
import { underline } from "./format.js";

const { max } = Math;

export default function table(content) {
    let stringified = content.map(row => row.map(cell => `${cell}`));
    let columnLengths = stringified
        .map((row) => row.map(visibleLength))
        .reduce(
            (lengths, row) => [
                ...row.map((length, index) => max(lengths[index] || 0, length)),
                ...lengths.slice(row.length),
            ],
            []
        );

    return stringified
        .map((row) =>
            row
                .map((item, index) =>
                    visiblePadStart(item, columnLengths[index])
                )
                .join(" "),

        )
        .map((row, index) => index == 0 ? underline(row) : row)
        .join("\n");
}
