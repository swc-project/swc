// @declaration: true
function foo(v) {
    var a = function a(a1) {
        return a1;
    };
    var b = function b() {
        return v;
    };
    var c = function c(v) {
        function a(a) {
            return a;
        }
        function b() {
            return v;
        }
        return {
            a: a,
            b: b
        };
    };
    return {
        a: a,
        b: b,
        c: c
    };
}
