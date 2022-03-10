import * as swcHelpers from "@swc/helpers";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakSet(), _c = /*#__PURE__*/ new WeakMap();
// @target: es2015
// @importHelpers: true
// @isolatedModules: true
// @filename: main.ts
export var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    swcHelpers.classPrivateMethodInit(this, _b);
    swcHelpers.classPrivateFieldInit(this, _c, {
        get: void 0,
        set: set_c
    });
    swcHelpers.classPrivateFieldInit(this, _a, {
        writable: true,
        value: 1
    });
};
function b() {
    swcHelpers.classPrivateFieldSet(this, _c, 42);
}
function set_c(v) {
    swcHelpers.classPrivateFieldSet(this, _a, swcHelpers.classPrivateFieldGet(this, _a) + v);
}
