var _prop1 = new WeakMap(), _prop2 = new WeakMap();
class Foo {
}
_prop1.set(Foo, {
    writable: true,
    value: 42
});
_prop2.set(Foo, {
    writable: true,
    value: (()=>{
        console.log(_class_private_field_get(Foo, _prop1));
    })()
});
