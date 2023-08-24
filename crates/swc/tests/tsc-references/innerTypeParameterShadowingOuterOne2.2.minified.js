//// [innerTypeParameterShadowingOuterOne2.ts]
// inner type parameters shadow outer ones of the same name
// no errors expected
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
 //class C2<T extends Date, U extends T> {
 //    g<T extends Number, U extends T>() {
 //        var x: U;
 //        x.toFixed();
 //    }
 //    h() {
 //        var x: U;
 //        x.getDate();
 //    }
 //}
