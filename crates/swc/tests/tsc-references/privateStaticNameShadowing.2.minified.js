//// [privateStaticNameShadowing.ts]
var _f = new WeakMap();
class X {
    constructor(){
        m.call(X);
    }
}
function m() {
    return m.call({}), 1;
}
_f.set(X, {
    writable: !0,
    value: m.call(X)
});
