//// [typeParametersAvailableInNestedScope3.ts]
function foo(v) {
    return {
        a: function(a) {
            return a;
        },
        b: function() {
            return v;
        },
        c: function(v) {
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
    };
}
