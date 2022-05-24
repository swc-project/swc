import _object_spread from "@swc/helpers/lib/_object_spread.js";
// @strict: true
// @declaration: true
function f1(a) {
    return _object_spread({}, a); // Error
}
function f2(a) {
    return _object_spread({}, a);
}
function f3(a) {
    return _object_spread({}, a); // Error
}
function f4(a) {
    return _object_spread({}, a);
}
function f5(a) {
    return _object_spread({}, a);
}
function f6(a) {
    return _object_spread({}, a);
}
// Repro from #46976
function g1(a) {
    const { z  } = a;
    return _object_spread({}, z);
}
class Foo {
    bar() {
        if (this.hasData()) {
            this.data.toLocaleLowerCase();
        }
    }
    hasData() {
        return true;
    }
}
