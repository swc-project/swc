//// [privateNameStaticAndStaticInitializer.ts]
var _foo = new WeakMap(), _prop = new WeakMap();
class A {
}
_foo.set(A, {
    writable: true,
    value: 1
});
_prop.set(A, {
    writable: true,
    value: 2
});
