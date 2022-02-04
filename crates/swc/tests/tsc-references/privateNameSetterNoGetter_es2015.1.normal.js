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
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
// @target: es2015
const C = function() {
    var _x = new WeakSet();
    class _class {
        m() {
            _classPrivateFieldSet(this, _x, _classPrivateMethodGet(this, _x, x) + 2); // Error
        }
        constructor(){
            _x.add(this);
        }
    }
    function x(x) {}
    return _class;
}();
console.log(new C().m());
