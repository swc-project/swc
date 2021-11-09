// Generic typed parameters with initializers
function foo(param) {
    var x = param === void 0 ? null : param;
    return x;
} // ok
function foo2(param) {
    var x = param === void 0 ? undefined : param;
    return x;
} // ok
function foo3(param) {
    var x = param === void 0 ? 1 : param;
} // error
function foo4(x, param) {
    var y = param === void 0 ? x : param;
} // error
function foo5(x, param) {
    var y = param === void 0 ? x : param;
} // ok
function foo6(x, y, param) {
    var z = param === void 0 ? y : param;
} // error
function foo7(x, param) {
    var y = param === void 0 ? x : param;
} // should be ok
