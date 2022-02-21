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
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// @filename: main.ts
import { Foo as A } from "./a";
import { Foo as B } from "./b";
// @target: es2015
// @filename: a.ts
export var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
    _createClass(Foo, [
        {
            key: "copy",
            value: function copy(other) {
                _classPrivateFieldGet(other, _x); // error
            }
        }
    ]);
    return Foo;
}();
var _x = new WeakMap();
// @filename: b.ts
export var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
    _classPrivateFieldInit(this, _x1, {
        writable: true,
        value: void 0
    });
};
var _x1 = new WeakMap();
var a = new A();
var b = new B();
a.copy(b); // error
