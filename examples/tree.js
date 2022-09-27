#!/usr/bin/env node
import tree from "@dwbinns/terminal/tree"
import { statSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

function getChildren(path) {
    if (!statSync(path).isDirectory()) return [];
    return readdirSync(path)
        .filter(item => !item.startsWith("."))
        .map(item => join(path, item));
}

function getDescription(path) {
    return basename(path);
}

console.log(tree({ node: ".", getChildren, getDescription }));