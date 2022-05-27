export function treeSubTree(e, d) {
    let a = d instanceof Path ? d : new Path(d);
    let b = e, c = pathGetFront(a);
    while(c !== null){
        const f = safeGet(b.node.children, c) || {
            children: {},
            childCount: 0
        };
        b = new Tree(c, b, f);
        a = pathPopFront(a);
        c = pathGetFront(a);
    }
    return b;
}
