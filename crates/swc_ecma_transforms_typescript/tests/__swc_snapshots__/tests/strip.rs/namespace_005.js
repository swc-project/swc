var A;
(function(A) {
    class Test {
    }
    A.Test = Test;
})(A || (A = {}));
var B;
(function(B) {
    B.a = A;
    console.log(B.a.Test);
    const b = A;
    console.log(b.Test);
})(B || (B = {}));
