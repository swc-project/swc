function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _classPrivateFieldInit(this, _foo, {
        writable: true,
        value: void 0
    });
};
var _foo = new WeakMap();
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
    _classPrivateFieldInit(this, _foo1, {
        writable: true,
        value: void 0
    });
};
var _foo1 = new WeakMap();
var b = new B();
