// Generic typed parameters with initializers
function foo(x = null) {
    return x;
} // ok
function foo2(x = undefined) {
    return x;
} // ok
function foo3(x = 1) {
} // error
function foo4(x, y = x) {
} // error
function foo5(x, y = x) {
} // ok
function foo6(x, y, z = y) {
} // error
function foo7(x, y = x) {
} // should be ok
