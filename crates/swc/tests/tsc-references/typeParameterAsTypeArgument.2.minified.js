//// [typeParameterAsTypeArgument.ts]
// These are all errors because type parameters cannot reference other type parameters from the same list
import "@swc/helpers/_/_class_call_check";
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
