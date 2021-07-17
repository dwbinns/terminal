import { sgr, wrap } from "./ansi.js";

export const underline = wrap(sgr(4), sgr(24));
