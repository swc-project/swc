let c = new class {
    explicitThis(m) {
        return this.n + m;
    }
    implicitThis(m1) {
        return this.n + m1;
    }
    explicitVoid(m2) {
        return m2 + 1;
    }
}();
c.explicitVoid = c.explicitThis;
let o = {
    n: 101,
    explicitThis: function(m) {
        return m + this.n.length;
    },
    implicitThis (m) {
        return m;
    }
}, i = o;
(0, i.explicitThis)(12), (0, (void 0).implicitNoThis)(12), c.explicitVoid = c.implicitThis, o.implicitThis = c.implicitThis, o.implicitThis = c.explicitThis, o.implicitThis = i.explicitThis, i.explicitThis = function(m) {
    return this.n.length;
};
