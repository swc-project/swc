//// [privateStaticNameShadowing.ts]
var _f = new WeakMap();
class X {
    constructor(){
        m.call(X);
    }
}
function m() {
    const X = {}; // shadow the class
    const _a = {}; // shadow the first generated var
    m.call(X); // Should check with X as the receiver with _b as the class constructor 
    return 1;
}
_f.set(X, {
    writable: true,
    value: m.call(X)
});
