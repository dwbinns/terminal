import { sgr, wrap } from "./ansi.js";

export const underline = wrap(sgr(4), sgr(24));

export const doubleUnderline = wrap(sgr('4:2'), sgr(24));

export const wavyUnderline = wrap(sgr('4:3'), sgr(24));

export const dottedUnderline = wrap(sgr('4:4'), sgr(24));

export const dashedUnderline = wrap(sgr('4:5'), sgr(24));
