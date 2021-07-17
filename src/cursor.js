import { csi } from "./ansi.js";

export const saveCursor = csi("s");
export const restoreCursor = csi("u");
export const up = (lines) => csi(lines, "A");
export const previous = (lines) => csi(lines, "T");
export const clearScreenFromCursor = csi("J");
export const clearLineFromCursor = csi("K");
