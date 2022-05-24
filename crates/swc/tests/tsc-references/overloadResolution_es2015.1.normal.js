class SomeBase {
}
class SomeDerived1 extends SomeBase {
}
class SomeDerived2 extends SomeBase {
}
class SomeDerived3 extends SomeBase {
}
function fn1() {
    return null;
}
var s = fn1(undefined);
var s;
// No candidate overloads found
fn1({}); // Error
function fn2() {
    return undefined;
}
var d = fn2(0, undefined);
var d;
// Generic and non - generic overload where generic overload is the only candidate when called without type arguments
var s = fn2(0, '');
// Generic and non - generic overload where non - generic overload is the only candidate when called with type arguments
fn2('', 0); // Error
// Generic and non - generic overload where non - generic overload is the only candidate when called without type arguments
fn2('', 0); // OK
function fn3() {
    return null;
}
var s = fn3(3);
var s = fn3('', 3, '');
var n = fn3(5, 5, 5);
var n;
// Generic overloads with differing arity called with type arguments matching each overload type parameter count
var s = fn3(4);
var s = fn3('', '', '');
var n = fn3('', '', 3);
// Generic overloads with differing arity called with type argument count that doesn't match any overload
fn3(); // Error
function fn4() {}
fn4('', 3);
fn4(3, ''); // Error
fn4('', 3); // Error
fn4(3, '');
// Generic overloads with constraints called without type arguments but with types that satisfy the constraints
fn4('', 3);
fn4(3, '');
fn4(3, undefined);
fn4('', null);
// Generic overloads with constraints called with type arguments that do not satisfy the constraints
fn4(null, null); // Error
// Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
fn4(true, null); // Error
fn4(null, true); // Error
function fn5() {
    return undefined;
}
var n = fn5((n1)=>n1.toFixed());
var s = fn5((n2)=>n2.substr(0));
