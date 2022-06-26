var A;
(function(A) {
    class A1 {
    }
    A.A = A1;
    class AG {
    }
    A.AG = AG;
    class A2 {
    }
    class AG2 {
    }
})(A || (A = {}));
// no errors expected, these are all exported
var a;
var a = new A.A();
var AG = new A.AG();
// errors expected, these are not exported
var a2 = new A.A2();
var ag2 = new A.A2();
