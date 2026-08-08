(function(T) {
    function f() {
        return 10;
    }
    T.f = f;
})(T || (T = {}));
(function(T) {
    function g() {
        return T.f();
    }
    T.g = g;
    class K {
        constructor(){
            this.v = 2;
        }
    }
    T.K = K;
    T.k = new K().v;
    T.h = g() * T.k;
})(T || (T = {}));
var T;
