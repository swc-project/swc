//// [innerTypeParameterShadowingOuterOne.ts]
// inner type parameters shadow outer ones of the same name
// no errors expected
 //function f2<T extends Date, U extends T>() {
 //    function g<T extends Number, U extends T>() {
 //        var x: U;
 //        x.toFixed();
 //    }
 //    var x: U;
 //    x.getDate();
 //}
