//// [privateNameStaticAndStaticInitializer.ts]
var _foo = new WeakMap(), _prop = new WeakMap();
class A {
}
_foo.set(A, {
    writable: !0,
    value: 1
}), _prop.set(A, {
    writable: !0,
    value: 2
});
