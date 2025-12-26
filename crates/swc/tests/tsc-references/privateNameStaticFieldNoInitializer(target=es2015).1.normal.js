//// [privateNameStaticFieldNoInitializer.ts]
var _x = new WeakMap(), _class, _x1 = new WeakMap();
const C = (_class = class {
}, _x.set(_class, {
    writable: true,
    value: void 0
}), _class);
class C2 {
}
_x1.set(C2, {
    writable: true,
    value: void 0
});
