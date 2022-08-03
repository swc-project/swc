export function treeSubTree(n, e) {
    let l = e instanceof Path ? e : new Path(e);
    let t = n, c = pathGetFront(l);
    while(c !== null){
        const i = safeGet(t.node.children, c) || {
            children: {},
            childCount: 0
        };
        t = new Tree(c, t, i);
        l = pathPopFront(l);
        c = pathGetFront(l);
    }
    return t;
}
