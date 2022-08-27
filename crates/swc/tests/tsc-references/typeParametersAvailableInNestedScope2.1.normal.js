//// [typeParametersAvailableInNestedScope2.ts]
function foo(x, y) {
    var bar = function bar(z) {
        function baz(a) {
            var c;
            var d;
            var e;
        }
    };
}
