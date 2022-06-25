"use strict";
const _classPrivateFieldGet = require("@swc/helpers/lib/_class_private_field_get.js").default;
const _classPrivateFieldInit = require("@swc/helpers/lib/_class_private_field_init.js").default;
var _ws = /*#__PURE__*/ new WeakMap(), _ws2 = /*#__PURE__*/ new WeakMap();
class Foo {
    get connected() {
        return _classPrivateFieldGet(this, _ws2) && _classPrivateFieldGet(this, _ws).readyState === _ws1.default.OPEN;
    }
    constructor(){
        _classPrivateFieldInit(this, _ws, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInit(this, _ws2, {
            writable: true,
            value: void 0
        });
    }
}
