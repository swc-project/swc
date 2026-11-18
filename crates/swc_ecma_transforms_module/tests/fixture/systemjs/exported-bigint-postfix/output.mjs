System.register([], function(_export, _context) {
    "use strict";
    var _old, a, before;
    _export("a", void 0);
    return {
        setters: [],
        execute: function() {
            _export("a", a = 1n);
            before = (_old = a++, _export("a", a), _old);
            console.log(before, a);
        }
    };
});
