export function treeSubTree(a, b) {
    let c = b instanceof Path ? b : new Path(b);
    let d = a, e = pathGetFront(c);
    while(e !== null){
        const f = safeGet(d.node.children, e) || {
            children: {},
            childCount: 0
        };
        d = new Tree(e, d, f);
        c = pathPopFront(c);
        e = pathGetFront(c);
    }
    return d;
}
