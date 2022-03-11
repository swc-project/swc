import * as swcHelpers from "@swc/helpers";
var _foo = /*#__PURE__*/ new WeakMap(), _prop = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022, es2015
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: true,
        value: 1
    });
    swcHelpers.classPrivateFieldInit(this, _prop, {
        writable: true,
        value: 2
    });
};
A.inst = new A();
