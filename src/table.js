import { visiblePadEnd, visibleLength, visibleSlice, visibleText } from "./string.js";
import { underline } from "./format.js";
import { box } from "./box.js";

const { max } = Math;

function visibleWidth(lines) {
    if (lines == null) return null;
    return max(...lines.map(visibleLength));
}


function* wrap(text, length) {
    let start = 0;
    let end = 0;
    for (let { index, [0]: matched } of text.matchAll(/\w+[^\w\s]*/gu)) {
        let wordEnd = index + matched.length;
        if (wordEnd - start > length) {
            if (end > start) yield [start, end];
            start = index;
        }
        end = wordEnd;
        while (end - start > length) {
            yield [start, start + length];
            start += length;
        }
    }

    if (end > start) yield [start, end];
}

function* visibleWrap(string, length) {
    for (let [start, end] of wrap(visibleText(string), length)) {
        yield visibleSlice(string, start, end);
    }
}

function* visibleSplit(string, separator) {
    let text = visibleText(string);
    let index = 0;
    while (index < text.length) {
        let nextIndex = text.indexOf(separator, index);
        if (nextIndex < 0) nextIndex = text.length;
        yield visibleSlice(string, index, nextIndex);
        index = nextIndex + separator.length;
    }
}



function getColspan(row, index, length) {
    return (row.slice(index + 1).findIndex(item => item != null) + 1) || length - index;
}

function rowLine(above, below, width, horizontalStyle) {
    if (!horizontalStyle) return null;
    let line = "";
    for (let i = 0; i < width; i++) {
        line += box(
            above?.find(({ position }) => position == i)?.style || 'none',
            i < width - 1 ? horizontalStyle : 'none',
            below?.find(({ position }) => position == i)?.style || 'none',
            i > 0 ? horizontalStyle : 'none',
        );
    }
    return line;
}

function makeCells(content, columnCount) {
    return content.map(row => {
        let cells = row
            .map(cell => cell == null ? null : [...visibleSplit(`${cell}`, "\n")])
            .map((lines, index) =>
                lines == null
                    ? null
                    : ({
                        lines,
                        width: visibleWidth(lines),
                        start: index,
                        end: index + getColspan(row, index, columnCount) - 1,
                    })
            )
            .filter(Boolean);
        if (!cells.length || cells[0].start > 0) cells.unshift({
            lines: [],
            width: 0,
            start: 0,
            end: getColspan(row, 0, columnCount) - 1,
        });

        return cells;
    });
}

function computeColumnLocations(rows, columnCount, leftBorder, middleBorder, rightBorder, padding) {
    let columns = [];
    let position = 0;
    let columnIndex = 0;

    while (columnIndex < columnCount) {
        let leftDivider = columnIndex == 0 ? leftBorder : middleBorder;
        let left = { position, style: leftDivider };
        if (leftDivider) position++;

        position += padding
        let start = position;

        let column = { left, start, end: null, right: null, after: null };
        columns.push(column);

        let end = max(
            ...rows
                .map(cells => cells.find(({ end }) => end == columnIndex))
                .filter(Boolean)
                .map(({ width, start }) => width + columns[start].start)
        );

        column.end = end;
        column.width = column.end - column.start;

        position = end + padding;

        let rightDivider = columnIndex < columnCount - 1 ? middleBorder : rightBorder;
        column.right = { position, style: rightDivider };

        if (rightDivider && columnIndex == columnCount - 1) position++;

        column.after = position;

        columnIndex++;
    }

    return columns;
}

function wrapCells(rows, columns, maximumWidth) {
    while (true) {
        let width = columns.slice(-1)[0].after;
        if (width <= maximumWidth) break;
        let [widest] = [...columns].sort((c1, c2) => c2.width - c1.width);
        columns.forEach(c => {
            if (c == widest) {
                c.width--;
            }
            if (c.end > widest.start) {
                c.end--;
                c.after--;
                c.right.position--;
            }
            if (c.start > widest.start) {
                c.left.position--;
                c.start--;
            }
        });
    }

    rows.forEach(cells =>
        cells.forEach(cell => {
            let width = columns[cell.end].end - columns[cell.start].start;
            if (width == 0) throw new Error("Column too narrow");
            cell.lines = cell.lines.flatMap(line => [...visibleWrap(line, width)]);
        })
    );
}

export default function table(content, { header, padding = 0, border, maxWidth = process.stderr.columns } = {}) {
    let columnCount = content.reduce((count, row) => max(count, row.length), 0);

    let pad = "".padStart(padding);
    let divider = border ? box(border, 'none', border, 'none') : "";
    let columnGap = pad + (divider || ' ') + pad;
    let lineStart = divider + pad;
    let lineEnd = pad + divider;

    let rows = makeCells(content, columnCount);

    let columns = computeColumnLocations(rows, columnCount, border, border || 'none', border, padding);

    if (maxWidth) wrapCells(rows, columns, maxWidth);

    rows.forEach(cells => cells.forEach(cell => cell.height = cell.lines.length))

    let rowHeights = rows.map(cells => max(...cells.map(({ height }) => height)));

    let cellDividers = rows.map(cells =>
        cells.flatMap(({ start, end }) => [columns[start].left, columns[end].right])
    );

    let width = columns.slice(-1)[0].after;

    return rows
        .map((row, rowIndex) =>
            new Array(rowHeights[rowIndex]).fill().map((_, lineIndex) =>
                lineStart +
                row
                    .map(({ lines, start, end }) => visiblePadEnd(lines[lineIndex] || '', columns[end].end - columns[start].start))
                    .join(columnGap) +
                lineEnd

            )
        )
        .flatMap((lines, rowIndex) => [
            rowIndex == 0 && rowLine(null, cellDividers[rowIndex], width, border),
            ...lines.map((line, index) =>
                rowIndex == 0 && index == lines.length - 1 && header == "underline" ? underline(line) : line
            ),
            rowLine(cellDividers[rowIndex], cellDividers[rowIndex + 1], width, rowIndex == 0 && header && header != "underline" ? header : border)
        ].filter(Boolean))
        .join("\n")


}
