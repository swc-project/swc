import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
var _class, _Foo;
// @target: es2015
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.m = function m() {
        console.log(_class_static_private_field_spec_get(B, B, _foo).test);
        _class_static_private_field_spec_get(B, B, _foo).test = 10;
        new (_class_static_private_field_spec_get(B, B, _foo))().field;
    };
    return B;
}();
var _foo = {
    writable: true,
    value: (_class = function _class1() {
        "use strict";
        _class_call_check(this, _class1);
        this.field = 10;
        console.log("hello");
        new (_class_static_private_field_spec_get(B, B, _foo2))();
    }, _class.test = 123, _class)
};
var _foo2 = {
    writable: true,
    value: (_Foo = function Foo() {
        "use strict";
        _class_call_check(this, Foo);
    }, _Foo.otherClass = 123, _Foo)
};
