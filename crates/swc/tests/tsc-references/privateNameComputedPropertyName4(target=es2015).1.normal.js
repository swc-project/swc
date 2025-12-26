//// [privateNameComputedPropertyName4.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var _qux = new WeakMap(), _qux1 = new WeakMap(), _qux2 = new WeakMap();
// https://github.com/microsoft/TypeScript/issues/44113
class C1 {
    ["bar"]() {}
}
class C2 {
    static ["bar"]() {}
}
class C3 {
}
_qux2.set(C3, {
    writable: true,
    value: 42
});
_define_property(C3, "bar", "test");
