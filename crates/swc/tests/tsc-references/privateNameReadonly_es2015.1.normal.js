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
// @target: es2015
const C = function() {
    var _bar = new WeakSet();
    class _class {
        foo() {
            _classPrivateFieldSet(this, _bar, console.log("should log this then throw"));
        }
        constructor(){
            _bar.add(this);
        }
    }
    function bar() {}
    return _class;
}();
console.log(new C().foo());
