//// [privateNameStaticFieldInitializer.ts]
var _field = new WeakMap(), _uninitialized = new WeakMap();
class A {
}
_field.set(A, {
    writable: true,
    value: 10
});
_uninitialized.set(A, {
    writable: true,
    value: void 0
});
