(function(A) {
    class Test {
    }
    A.Test = Test;
})(A || (A = {}));
(function(B) {
    var a = A;
    console.log(a.Test);
    var b = A;
    console.log(b.Test);
})(B || (B = {}));
