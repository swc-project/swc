export function treeSubTree(tree, pathObj) {
    let path = pathObj instanceof Path ? pathObj : new Path(pathObj), child = tree, next = pathGetFront(path);
    for(; null !== next;){
        const childNode = safeGet(child.node.children, next) || {
            children: {},
            childCount: 0
        };
        child = new Tree(next, child, childNode), path = pathPopFront(path), next = pathGetFront(path);
    }
    return child;
}
