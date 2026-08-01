System.register([], function(_export, _context) {
    "use strict";
    var _old, a, b, d, test;
    _export({
        a: void 0,
        c: void 0,
        e: void 0,
        f: void 0,
        test: void 0
    });
    return {
        setters: [],
        execute: function() {
            _export("test", test = 2);
            test = 5, _export("test", test), test;
            _old = test++, _export("test", test), _old;
            (function() {
                var test = 2;
                test = 3;
                test++;
            })();
            _export("a", a = 2);
            a = 3, _export("a", a), a;
            _export("c", b = 2);
            b = 3, _export("c", b), b;
            _export("f", _export("e", d = 3));
            d = 4, _export({
                e: d,
                f: d
            }), d;
        }
    };
});
