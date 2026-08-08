(function(T) {
    function f() {
        return 5;
    }
    T.f = f;
    (function(Sub) {
        Sub.v = f();
    })(T.Sub || (T.Sub = {}));
})(T || (T = {}));
var T;
