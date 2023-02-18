import { osc, wrap } from "./ansi.js";

export const hyperlink = (options, url, content) =>
    wrap(
        osc(
            8,
            Object.entries(options).map(([key, value]) => `${key}=${value}`).join(":"),
            url
        ),
        osc(8, '', '')
    )(content);