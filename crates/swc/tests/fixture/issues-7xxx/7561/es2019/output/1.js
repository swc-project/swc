var _class_private_field_get = require("@swc/helpers/_/_class_private_field_get");
var _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
var _x = /*#__PURE__*/ new WeakMap();
class Foo {
    test() {
        var _this;
        var _this_y, _this_y1;
        _this_y === null || _this_y === void 0 ? void 0 : _class_private_field_get._(_this_y1 = (_this = this) === null || _this === void 0 ? void 0 : _this.y, _x);
    }
    constructor(){
        _class_private_field_init._(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
