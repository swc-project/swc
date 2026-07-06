System.register([
    "./self.js"
], function(_export, _context) {
    "use strict";
    var a, b, c;
    _export({
        a: void 0,
        b: void 0
    });
    return {
        setters: [
            function(_self_ns) {
                c = _self_ns.a;
            }
        ],
        execute: function() {
            _export("a", a = 1);
            _export("b", b = c);
            console.log(a, b, c);
        }
    };
});
