function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @noUnusedLocals:true 
// @noEmit: true
// @target: es2015
export var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _used.set(this, {
        writable: true,
        value: "used"
    });
    _unused.set(this, {
        writable: true,
        value: "unused"
    });
    console.log(_classPrivateFieldGet(this, _used));
};
var _used = new WeakMap();
var _unused = new WeakMap();
