System.register([
    "./self.mjs"
], function(_export, _context) {
    "use strict";
    var a, b, c;
    var _export_setters = {
        set b (_value){
            b = _value;
            _export({
                a: b,
                b: b
            });
        },
        set c (_value){
            c = _value;
            _export("c", c);
        }
    };
    _export({
        a: void 0,
        b: void 0,
        c: void 0
    });
    return {
        setters: [
            function(_self_ns) {
                a = _self_ns.a;
            }
        ],
        execute: function() {
            [_export_setters.b, _export_setters.c = a] = [
                2
            ];
            console.log(a, b, c);
        }
    };
});
