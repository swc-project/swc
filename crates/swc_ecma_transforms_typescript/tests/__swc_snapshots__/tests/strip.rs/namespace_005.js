let A;
(function(A) {
    class Test {
    }
    A.Test = Test;
})(A || (A = {}));
let B;
(function(B) {
    B.a = A;
    console.log(B.a.Test);
    const b = A;
    console.log(b.Test);
})(B || (B = {}));
