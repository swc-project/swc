(function(N) {
    function f() {
        return N.value;
    }
    N.f = f;
    class C {
        get() {
            return N.value;
        }
    }
    N.C = C;
    f();
})(N || (N = {}));
(function(N) {
    N.value = 1;
    N.result = N.f() + new N.C().get();
})(N || (N = {}));
console.log(N.result);
var N;
