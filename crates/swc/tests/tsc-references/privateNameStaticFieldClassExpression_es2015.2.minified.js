import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
class B {
    m() {
        console.log(_class_static_private_field_spec_get(B, B, _foo).test), _class_static_private_field_spec_get(B, B, _foo).test = 10, new (_class_static_private_field_spec_get(B, B, _foo))().field;
    }
}
var _class, _Foo, _foo = {
    writable: !0,
    value: ((_class = class {
        constructor(){
            this.field = 10, console.log("hello"), new (_class_static_private_field_spec_get(B, B, _foo2))();
        }
    }).test = 123, _class)
}, _foo2 = {
    writable: !0,
    value: ((_Foo = class {
    }).otherClass = 123, _Foo)
};
