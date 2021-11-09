function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @noUnusedLocals:true 
// @noEmit: true
// @target: es2015
export class A {
    constructor(){
        _used.set(this, {
            writable: true,
            value: "used"
        });
        _unused.set(this, {
            writable: true,
            value: "unused"
        });
        console.log(_classPrivateFieldGet(this, _used));
    }
}
var _used = new WeakMap();
var _unused = new WeakMap();
