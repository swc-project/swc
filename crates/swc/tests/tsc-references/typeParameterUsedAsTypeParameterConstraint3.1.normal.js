//// [typeParameterUsedAsTypeParameterConstraint3.ts]
 //interface I < T, U extends T, V extends U > {
 //    x: T;
 //    y: U;
 //    z: V;
 //    foo<W extends V>(x: W): T;
 //}
 //interface I2<V extends U, T, U extends T> {
 //    x: T;
 //    y: U;
 //    z: V;
 //    foo<W extends V>(x: W): T;
 //}
