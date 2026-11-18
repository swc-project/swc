System.register([], function(_export, _context) {
    "use strict";
    var _old, c;
    function a() {
        alert("a");
        _old = c++, _export("c", c), _old;
    }
    function b() {
        a();
    }
    function foo(c) {
        alert("a");
        c++;
    }
    _export({
        a: a,
        c: void 0
    });
    return {
        setters: [],
        execute: function() {
            _export("c", c = 5);
            b();
        }
    };
});
