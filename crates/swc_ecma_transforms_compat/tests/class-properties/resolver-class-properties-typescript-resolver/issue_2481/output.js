class Foo {
}
var _prop1 = {
    writable: true,
    value: 42
};
var _prop2 = {
    writable: true,
    value: (()=>{
        console.log(_class_static_private_field_spec_get(Foo, Foo, _prop1));
    })()
};
