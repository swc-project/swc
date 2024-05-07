var _class_private_field_get = require("@swc/helpers/_/_class_private_field_get");
var _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
var _ws = /*#__PURE__*/ new WeakMap(), _ws2 = /*#__PURE__*/ new WeakMap();
class Foo {
    get connected() {
        return _class_private_field_get._(this, _ws2) && _class_private_field_get._(this, _ws).readyState === _ws1.default.OPEN;
    }
    constructor(){
        _class_private_field_init._(this, _ws, {
            writable: true,
            value: void 0
        });
        _class_private_field_init._(this, _ws2, {
            writable: true,
            value: void 0
        });
    }
}
