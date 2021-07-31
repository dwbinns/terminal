import { visiblePadEnd, visibleLength, visibleSlice, visibleText } from "./string.js";
import { underline } from "./format.js";
import { box } from "./box.js";

const { max } = Math;

function visibleWidth(lines) {
    if (lines == null) return null;
    return max(...lines.map(visibleLength));
}

function visibleSplit(string, separator) {
    let index = 0;
    let text = visibleText(string);
    let results = [];
    while (true) {
        let nextIndex = text.indexOf(separator, index);
        results.push(visibleSlice(string, index, nextIndex < 0 ? undefined : nextIndex));
        if (nextIndex < 0) break;
        index = nextIndex + separator.length;
    }
    return results;
}

function getColspan(row, index, length) {
    return (row.slice(index + 1).findIndex(item => item != null) + 1) || length - index;
}

function rowLine(above, below, right, horizontalStyle, upStyle, downStyle) {
    if (!horizontalStyle) return null;
    let line = "";
    for (let i = 0; i <= right; i++) {
        line += box(
            above?.includes(i) ? upStyle : 'none',
            i < right ? horizontalStyle : 'none',
            below?.includes(i) ? downStyle : 'none',
            i > 0 ? horizontalStyle : 'none',
        );
    }
    return line;
}

export default function table(content, { header, padding = 0, border } = {}) {
    let columnCount = content.reduce((count, row) => max(count, row.length), 0);

    let pad = "".padStart(padding);
    let divider = border ? box(border, 'none', border, 'none') : "";
    let columnGap = pad + (divider || ' ') + pad;
    let lineStart = divider + pad;
    let lineEnd = pad + divider;


    let rows = content.map(row => {
        let cells = row
            .map(cell => cell == null ? null : visibleSplit(`${cell}`, "\n"))
            .map((lines, index) =>
                lines == null
                    ? null
                    : ({
                        lines,
                        width: visibleWidth(lines),
                        start: index,
                        end: index + getColspan(row, index, columnCount) - 1,
                        height: lines.length
                    })
            )
            .filter(Boolean);
        if (!cells.length || cells[0].start > 0) cells.unshift({
            lines: [],
            width: 0,
            start: 0,
            end: getColspan(row, 0, columnCount) - 1,
            height: 0,
        });

        return cells;
    });

    let rowHeights = rows.map(cells => max(...cells.map(({ height }) => height)));

    let columnDividers = [];
    let columnStarts = [];
    let columnEnds = [];
    let position = 0;

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        if (border || columnIndex > 0) {
            columnDividers.push(position);
            position += 1;
        }
        position += padding
        columnStarts.push(position);
        let end = max(
            ...rows
                .map(cells => cells.find(({ end }) => end == columnIndex))
                .filter(Boolean)
                .map(({ width, start }) => width + columnStarts[start])
        );
        columnEnds.push(end);
        position = end + padding;
    }

    let cellDividers = rows.map(row =>
        [...row.map(({ start }) => columnDividers[start]), position]
    );

    return rows
        .map((row, rowIndex) =>
            new Array(rowHeights[rowIndex]).fill().map((_, lineIndex) =>
                lineStart +
                row
                    .map(({ lines, start, end }) => visiblePadEnd(lines[lineIndex] || '', columnEnds[end] - columnStarts[start]))
                    .join(columnGap) +
                lineEnd

            )
        )
        .flatMap((lines, rowIndex) => [
            rowIndex == 0 && rowLine(null, cellDividers[rowIndex], position, border, border, border),
            ...lines.map((line, index) =>
                rowIndex == 0 && index == lines.length - 1 && header == "underline" ? underline(line) : line
            ),
            rowLine(cellDividers[rowIndex], cellDividers[rowIndex + 1], position, rowIndex == 0 && header && header != "underline" ? header : border, border, border)
        ].filter(Boolean))
        .join("\n")


}
