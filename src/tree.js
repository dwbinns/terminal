import { rounded } from "@dwbinns/terminal/box";

export default function tree(
    {
        node,
        getDescription = x => x.toString(),
        getChildren = x => x.children,
        indent = 2,
        style = rounded,
        path = []
    }
) {
    let childPath = [...path, node];
    let children = getChildren(node, path);
    return getDescription(node)
        + children
            .map((child, index, list) => {
                let isLast = index < list.length - 1;
                //let hasChildren = !!getChildren(child, childPath).length;
                let joiner = style(true, true, isLast, false).padEnd(indent, style(false, true, false, true)) + " ";
                let margin = style(isLast, false, isLast, false).padEnd(indent) + " ";
                return "\n"
                    + joiner
                    + tree({
                        node: child,
                        getDescription,
                        getChildren,
                        indent,
                        style,
                        path: childPath
                    }).replaceAll(/\n/g, `\n${margin}`)
            })
            .join("");
}
