"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _class_private_field_get = require("@swc/helpers/lib/_class_private_field_get.js").default;
const _class_private_field_init = require("@swc/helpers/lib/_class_private_field_init.js").default;
var _ws = /*#__PURE__*/ new WeakMap(), _ws2 = /*#__PURE__*/ new WeakMap();
class Foo {
    get connected() {
        return _class_private_field_get(this, _ws2) && _class_private_field_get(this, _ws).readyState === _ws1.default.OPEN;
    }
    constructor(){
        _class_private_field_init(this, _ws, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _ws2, {
            writable: true,
            value: void 0
        });
    }
}
