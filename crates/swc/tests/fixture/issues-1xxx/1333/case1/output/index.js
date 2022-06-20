"use strict";
var _classPrivateFieldGetMjs = require("@swc/helpers/lib/_class_private_field_get.js");
var _classPrivateFieldInitMjs = require("@swc/helpers/lib/_class_private_field_init.js");
var _ws = /*#__PURE__*/ new WeakMap(), _ws2 = /*#__PURE__*/ new WeakMap();
class Foo {
    get connected() {
        return (0, _classPrivateFieldGetMjs.default)(this, _ws2) && (0, _classPrivateFieldGetMjs.default)(this, _ws).readyState === _ws1.default.OPEN;
    }
    constructor(){
        (0, _classPrivateFieldInitMjs.default)(this, _ws, {
            writable: true,
            value: void 0
        });
        (0, _classPrivateFieldInitMjs.default)(this, _ws2, {
            writable: true,
            value: void 0
        });
    }
}
