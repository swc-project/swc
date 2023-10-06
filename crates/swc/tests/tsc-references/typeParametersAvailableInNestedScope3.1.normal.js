//// [typeParametersAvailableInNestedScope3.ts]
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
            a: a,
            b: b
        };
    }
    return {
        a: a,
        b: b,
        c: c
    };
}
