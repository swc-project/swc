//// [genericCallWithObjectTypeArgsAndInitializers.ts]
// Generic typed parameters with initializers
function foo() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    return x;
} // ok
function foo2() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : undefined;
    return x;
} // ok
function foo3() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
} // error
function foo4(x) {
    var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
} // error
function foo5(x) {
    var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
} // ok
function foo6(x, y) {
    var z = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : y;
} // error
function foo7(x) {
    var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
} // should be ok
