var _arguments = arguments;
// @target: es5
var a = function() {
    var arg = _arguments[0]; // error
};
var b = function b() {
    var _arguments1 = arguments;
    var a = function() {
        var arg = _arguments1[0]; // error
    };
};
function baz() {
    var _arguments2 = arguments;
    (function() {
        var arg = _arguments2[0];
    });
}
function foo(inputFunc) {}
foo(function() {
    var arg = _arguments[0]; // error
});
function bar() {
    var arg = arguments[0]; // no error
}
(function() {
    var _$foo = function _$foo() {
        var arg = arguments[0]; // no error
    };
});
