function e(o, l, n, t) {
    const s = o ? o[mergeChildrenPropName] : dataNodes;
    const c = o ? getPosition(n.pos, l) : '0';
    const a = o ? [
        ...t,
        o
    ] : [];
    if (o) {
        const i = syntheticGetKey(o, c);
        const d = {
            node: o,
            index: l,
            pos: c,
            key: i,
            parentPos: n.node ? n.pos : null,
            level: n.level + 1,
            nodes: a
        };
        callback(d);
    }
    if (s) {
        s.forEach((l, t)=>{
            e(l, t, {
                node: o,
                pos: c,
                level: n ? n.level + 1 : -1
            }, a);
        });
    }
}
e(null);
