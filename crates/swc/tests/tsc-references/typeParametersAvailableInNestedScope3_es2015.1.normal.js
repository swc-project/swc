// @declaration: true
function foo(v) {
    function a(a) {
        return a;
    }
    function b() {
        return v;
    }
    function c(v) {
        function a(a) {
            return a;
        }
        function b() {
            return v;
        }
        return {
            a,
            b
        };
    }
    return {
        a,
        b,
        c
    };
}
