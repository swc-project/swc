// These are all errors because type parameters cannot reference other type parameters from the same list
function foo(x, y) {
    foo(y, y);
    return new C();
}
class C {
}
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
