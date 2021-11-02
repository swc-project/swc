// inner type parameters shadow outer ones of the same name
// no errors expected
function f() {
    var g = function g() {
        var x;
        x.toFixed();
    };
    var x1;
    x1.getDate();
}
function f2() {
    var g = function g() {
        var x;
        x.toFixed();
    };
    var x2;
    x2.getDate();
} //function f2<T extends Date, U extends T>() {
 //    function g<T extends Number, U extends T>() {
 //        var x: U;
 //        x.toFixed();
 //    }
 //    var x: U;
 //    x.getDate();
 //}
