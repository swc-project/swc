"use strict";
var swcHelpers = require("@swc/helpers");
var _ws = /*#__PURE__*/ new WeakMap(), _ws2 = /*#__PURE__*/ new WeakMap();
class Foo {
    get connected() {
        return swcHelpers.classPrivateFieldGet(this, _ws2) && swcHelpers.classPrivateFieldGet(this, _ws).readyState === _ws1.default.OPEN;
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _ws, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _ws2, {
            writable: true,
            value: void 0
        });
    }
}
