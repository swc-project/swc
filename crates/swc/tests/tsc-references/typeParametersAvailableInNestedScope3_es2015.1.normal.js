// @declaration: true
function foo(v1) {
    function a1(a) {
        return a;
    }
    function b1() {
        return v1;
    }
    function c(v) {
        function a2(a) {
            return a;
        }
        function b() {
            return v;
        }
        return {
            a: a2,
            b
        };
    }
    return {
        a: a1,
        b: b1,
        c
    };
}
