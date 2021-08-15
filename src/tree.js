import { single } from "@dwbinns/terminal/box";

export default function tree(label, top, format) {
    let {indent = 2, style = single} = format || {};
    return `${label} ${top}`
        + [...top.children]
            .map(([key, value], index, list) => {
                let isLast = index < list.length - 1;
                let hasChildren = !!value.children.size;
                let joiner = style(true, true, isLast, false).padEnd(indent, style(false, true, false, true))
                    + style(false, true, hasChildren, true)
                    + " ";
                let margin = style(isLast, false, isLast, false).padEnd(indent);
                return "\n"
                    + joiner
                    + tree(key, value, format).replaceAll(/\n/g, `\n${margin}`)
            })
            .join("");
}
