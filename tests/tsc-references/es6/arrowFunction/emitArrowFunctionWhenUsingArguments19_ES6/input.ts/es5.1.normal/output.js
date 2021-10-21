// @target: es6
function f() {
    var g = function g() {
        var _arguments1 = 10; // No capture in 'g', so no conflict.
        function h() {
            var _arguments = arguments;
            var capture = function() {
                return _arguments;
            }; // Should trigger an '_arguments' capture into function 'h'
            foo(_arguments1); // Error as this does not resolve to the user defined '_arguments'
        }
    };
    var foo = function foo(x) {
        return 100;
    };
}
