var _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
var _class_private_field_set = require("@swc/helpers/_/_class_private_field_set");
var _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _class_private_field_init._(this, _b, {
            writable: true,
            value: void 0
        });
        this.a = 1;
        _class_private_field_set._(this, _b, 2);
    }
}
Foo.c = 3;
var _d = {
    writable: true,
    value: 4
};
