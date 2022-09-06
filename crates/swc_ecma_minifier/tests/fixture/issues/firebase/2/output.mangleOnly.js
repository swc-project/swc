export function treeSubTree(e, t) {
    let n = t instanceof Path ? t : new Path(t);
    let r = e, o = pathGetFront(n);
    while(o !== null){
        const h = safeGet(r.node.children, o) || {
            children: {},
            childCount: 0
        };
        r = new Tree(o, r, h);
        n = pathPopFront(n);
        o = pathGetFront(n);
    }
    return r;
}
