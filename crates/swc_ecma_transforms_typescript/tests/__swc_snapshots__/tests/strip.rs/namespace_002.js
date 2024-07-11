export var util;
(function(util) {
    const c = 3;
    function foo() {}
    util.foo = foo;
    function bar() {}
})(util || (util = {}));
