//// [privateNameComputedPropertyName4.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
class C1 {
    bar() {}
}
var _qux = {
    writable: !0,
    value: 42
};
class C2 {
    static bar() {}
}
var _qux1 = {
    writable: !0,
    value: 42
};
class C3 {
}
var _qux2 = {
    writable: !0,
    value: 42
};
_define_property(C3, "bar", "test");
