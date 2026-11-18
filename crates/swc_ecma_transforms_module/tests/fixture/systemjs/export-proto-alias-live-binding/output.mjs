System.register([], function(_export, _context) {
    "use strict";
    var a;
    _export({
        ["__proto__"]: void 0,
        b: void 0
    });
    return {
        setters: [],
        execute: function() {
            _export("b", _export("__proto__", a = 1));
            a = 2, _export({
                ["__proto__"]: a,
                b: a
            }), a;
        }
    };
});
