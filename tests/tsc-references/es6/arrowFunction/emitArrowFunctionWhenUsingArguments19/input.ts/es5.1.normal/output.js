// @target: es5
function f() {
    var g = function g() {
        var _arguments = 10; // No capture in 'g', so no conflict.
        function h() {
            var _arguments1 = arguments;
            var capture = function() {
                return _arguments1;
            }; // Should trigger an '_arguments' capture into function 'h'
            foo(_arguments); // Error as this does not resolve to the user defined '_arguments'
        }
    };
    var foo = function foo(x) {
        return 100;
    };
}
