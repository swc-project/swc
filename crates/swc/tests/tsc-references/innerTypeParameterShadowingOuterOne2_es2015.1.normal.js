// inner type parameters shadow outer ones of the same name
// no errors expected
class C {
    g() {
        var x;
        x.toFixed();
    }
    h() {
        var x;
        x.getDate();
    }
}
class C2 {
    g() {
        var x;
        x.toFixed();
    }
    h() {
        var x;
        x.getDate();
    }
} //class C2<T extends Date, U extends T> {
 //    g<T extends Number, U extends T>() {
 //        var x: U;
 //        x.toFixed();
 //    }
 //    h() {
 //        var x: U;
 //        x.getDate();
 //    }
 //}
