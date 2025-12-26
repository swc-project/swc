//// [privateNameStaticFieldInitializer.ts]
var _field = new WeakMap(), _uninitialized = new WeakMap();
class A {
}
_field.set(A, {
    writable: !0,
    value: 10
}), _uninitialized.set(A, {
    writable: !0,
    value: void 0
});
