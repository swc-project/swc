// These are all errors because type parameters cannot reference other type parameters from the same list
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x, y) {
    foo(y, y);
    return new C();
}
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
 //function foo<T, U extends T>(x: T, y: U) {
 //    foo<U, U>(y, y);
 //    return new C<U, T>();
 //}
 //class C<T extends U, U> {
 //    x: T;
 //}
 //interface I<T, U extends T> {
 //    x: C<U, T>;
 //}
