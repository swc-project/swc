function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @target: es2015
class A {
    constructor(){
        _myField.set(this, {
            writable: true,
            value: "hello world"
        });
        console.log(_classPrivateFieldGet(this, _myField));
    }
}
var _myField = new WeakMap();
