import { single } from "@dwbinns/terminal/box";

export default function tree(
    {
        label = "",
        node,
        getDescription = x => x.toString(),
        getChildren = x => x.children,
        format,
        path = []
    }
) {
    let { indent = 2, style = single } = format || {};
    let childPath = [...path, node];
    return `${label} ${getDescription(node)}`
        + getChildren(node, path)
            .map(([childLabel, child], index, list) => {
                let isLast = index < list.length - 1;
                let hasChildren = !!getChildren(child, childPath).length;
                let joiner = style(true, true, isLast, false).padEnd(indent, style(false, true, false, true))
                    + style(false, true, hasChildren, true)
                    + " ";
                let margin = style(isLast, false, isLast, false).padEnd(indent);
                return "\n"
                    + joiner
                    + tree({
                        label: childLabel,
                        node: child,
                        getDescription,
                        getChildren,
                        format,
                        path: childPath
                    }).replaceAll(/\n/g, `\n${margin}`)
            })
            .join("");
}
