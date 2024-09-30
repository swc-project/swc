(function(A) {
    A.v = 25;
    function a() {
        console.log(A.v);
    }
    A.a = a;
})(A || (A = {}));
var A;
