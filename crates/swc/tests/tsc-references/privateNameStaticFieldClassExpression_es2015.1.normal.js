import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
var _class, _Foo;
// @target: es2015
class B {
    m() {
        console.log(_class_static_private_field_spec_get(B, B, _foo).test);
        _class_static_private_field_spec_get(B, B, _foo).test = 10;
        new (_class_static_private_field_spec_get(B, B, _foo))().field;
    }
}
var _foo = {
    writable: true,
    value: (_class = class {
        constructor(){
            this.field = 10;
            console.log("hello");
            new (_class_static_private_field_spec_get(B, B, _foo2))();
        }
    }, _class.test = 123, _class)
};
var _foo2 = {
    writable: true,
    value: (_Foo = class Foo {
    }, _Foo.otherClass = 123, _Foo)
};
