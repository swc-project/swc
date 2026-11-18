var c, d, e, f = (0, function() {}), g = (0, ()=>{}), h = (0, class {
}), o = {
    k: (0, function() {})
}, { a = (0, function() {}) } = {}, [b = (0, ()=>{})] = [];
c ||= (0, function() {}), d ??= (0, ()=>{}), e = 1, e &&= (0, class {
});
class C {
    x = (0, function() {});
    static y = (0, ()=>{});
    static z = (0, class {
    });
}
function p(q = (0, function() {})) {
    return q.name;
}
var named = function inner() {}, Named = class Inner {
};
console.log(JSON.stringify([
    f.name,
    g.name,
    h.name,
    o.k.name,
    a.name,
    b.name,
    c.name,
    d.name,
    e.name,
    new C().x.name,
    C.y.name,
    C.z.name,
    p(),
    named.name,
    Named.name
]));
