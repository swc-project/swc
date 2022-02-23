function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
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
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
// @target: es2015
const C = function() {
    var _bar = new WeakSet();
    class _class {
        foo() {
            _classPrivateFieldSet(this, _bar, console.log("should log this then throw"));
        }
        constructor(){
            _classPrivateMethodInit(this, _bar);
        }
    }
    function bar() {}
    return _class;
}();
console.log(new C().foo());
