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
var _class, _class1;
var _foo = new WeakMap(), _foo2 = new WeakMap();
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
    _classPrivateFieldInit(this, _foo, {
        writable: true,
        value: (_class = function _class2() {
            _classCallCheck(this, _class2);
            console.log("hello");
        }, _class.test = 123, _class)
    });
    _classPrivateFieldInit(this, _foo2, {
        writable: true,
        value: (_class1 = function Foo() {
            _classCallCheck(this, Foo);
        }, _class1.otherClass = 123, _class1)
    });
};
