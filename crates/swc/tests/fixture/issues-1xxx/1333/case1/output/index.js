"use strict";
var _classPrivateFieldGetMjs = require("@swc/helpers/lib/_class_private_field_get.js").default;
var _classPrivateFieldInitMjs = require("@swc/helpers/lib/_class_private_field_init.js").default;
var _ws = /*#__PURE__*/ new WeakMap(), _ws2 = /*#__PURE__*/ new WeakMap();
class Foo {
    get connected() {
        return _classPrivateFieldGetMjs(this, _ws2) && _classPrivateFieldGetMjs(this, _ws).readyState === _ws1.default.OPEN;
    }
    constructor(){
        _classPrivateFieldInitMjs(this, _ws, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInitMjs(this, _ws2, {
            writable: true,
            value: void 0
        });
    }
}
