export function treeSubTree(e, n) {
    let t = n instanceof Path ? n : new Path(n);
    let l = e, r = pathGetFront(t);
    while(r !== null){
        const c = safeGet(l.node.children, r) || {
            children: {},
            childCount: 0
        };
        l = new Tree(r, l, c);
        t = pathPopFront(t);
        r = pathGetFront(t);
    }
    return l;
}
