var _key;
var tmp = "bar";
// @target: esnext, es2022, es2015
// @useDefineForClassFields: true
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/44113
class C1 {
    [tmp]() {}
}
var _qux = {
    writable: true,
    value: 42
};
var tmp1 = "bar";
class C2 {
    static [tmp1]() {}
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
_key = "bar";
C3[_key] = "test";
