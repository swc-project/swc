function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
!function(config) {
    return (function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = null != arguments[i] ? arguments[i] : {
            }, ownKeys = Object.keys(source);
            "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }))), ownKeys.forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        }
        return target;
    })({
    }, void 0 !== config.a && {
        a: config.a.toString()
    }, void 0 !== config.b && {
        b: config.b.toString()
    }, void 0 !== config.c && {
        c: config.c.toString()
    }, void 0 !== config.d && {
        d: config.d.toString()
    }, void 0 !== config.e && {
        e: config.e.toString()
    }, void 0 !== config.f && {
        f: config.f.toString()
    }, void 0 !== config.g && {
        g: config.g.toString()
    }, void 0 !== config.h && {
        h: config.h.toString()
    }, void 0 !== config.i && {
        i: config.i.toString()
    }, void 0 !== config.j && {
        j: config.j.toString()
    }, void 0 !== config.k && {
        k: config.k.toString()
    }, void 0 !== config.l && {
        l: config.l.toString()
    }, void 0 !== config.m && {
        m: config.m.toString()
    }, void 0 !== config.n && {
        n: config.n.toString()
    }, void 0 !== config.o && {
        o: config.o.toString()
    }, void 0 !== config.p && {
        p: config.p.toString()
    }, void 0 !== config.q && {
        q: config.q.toString()
    }, void 0 !== config.r && {
        r: config.r.toString()
    }, void 0 !== config.s && {
        s: config.s.toString()
    }, void 0 !== config.t && {
        t: config.t.toString()
    }, void 0 !== config.u && {
        u: config.u.toString()
    }, void 0 !== config.v && {
        v: config.v.toString()
    }, void 0 !== config.w && {
        w: config.w.toString()
    }, void 0 !== config.x && {
        x: config.x.toString()
    }, void 0 !== config.y && {
        y: config.y.toString()
    }, void 0 !== config.z && {
        z: config.z.toString()
    });
}({
    a: 1,
    b: 2,
    z: 26
});
