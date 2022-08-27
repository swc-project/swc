//// [privateNameComputedPropertyName4.ts]
// https://github.com/microsoft/TypeScript/issues/44113
class C1 {
    ["bar"]() {}
}
var _qux = {
    writable: true,
    value: 42
};
class C2 {
    static ["bar"]() {}
}
var _qux1 = {
    writable: true,
    value: 42
};
class C3 {
}
var _qux2 = {
    writable: true,
    value: 42
};
C3["bar"] = "test";
