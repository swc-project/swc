// @declaration: true
function foo(v1) {
    var a1 = function a1(a) {
        return a;
    };
    var b = function b() {
        return v1;
    };
    var c = function c(v) {
        function a2(a) {
            return a;
        }
        function b() {
            return v;
        }
        return {
            a: a2,
            b: b
        };
    };
    return {
        a: a1,
        b: b,
        c: c
    };
}
