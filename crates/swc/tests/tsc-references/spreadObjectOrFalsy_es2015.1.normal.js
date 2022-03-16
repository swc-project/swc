import * as swcHelpers from "@swc/helpers";
// @strict: true
// @declaration: true
function f1(a) {
    return swcHelpers.objectSpread({}, a); // Error
}
function f2(a) {
    return swcHelpers.objectSpread({}, a);
}
function f3(a) {
    return swcHelpers.objectSpread({}, a); // Error
}
function f4(a) {
    return swcHelpers.objectSpread({}, a);
}
function f5(a) {
    return swcHelpers.objectSpread({}, a);
}
function f6(a) {
    return swcHelpers.objectSpread({}, a);
}
// Repro from #46976
function g1(a) {
    const { z  } = a;
    return swcHelpers.objectSpread({}, z);
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
