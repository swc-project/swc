export function treeSubTree(tree, pathObj) {
    // TODO: Require pathObj to be Path?
    let path = pathObj instanceof Path ? pathObj : new Path(pathObj);
    let child = tree,
        next = pathGetFront(path);
    while (next !== null) {
        const childNode = safeGet(child.node.children, next) || {
            children: {},
            childCount: 0,
        };
        child = new Tree(next, child, childNode);
        path = pathPopFront(path);
        next = pathGetFront(path);
    }

    return child;
}
