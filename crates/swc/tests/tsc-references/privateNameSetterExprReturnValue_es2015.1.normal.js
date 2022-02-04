function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
var _foo = new WeakSet();
// @target: es2019
class C {
    bar() {
        let x = _classPrivateFieldSet(this, _foo, 42 * 2);
        console.log(x); // 84
    }
    constructor(){
        _foo.add(this);
    }
}
function foo(a) {}
new C().bar();
