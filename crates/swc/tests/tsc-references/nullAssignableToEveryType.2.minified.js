//// [nullAssignableToEveryType.ts]
var E, E1;
import "@swc/helpers/_/_class_call_check";
(E1 = E || (E = {}))[E1.A = 0] = "A";
 //function foo<T, U extends T, V extends Date>(x: T, y: U, z: V) {
 //    x = null;
 //    y = null;
 //    z = null;
 //}
