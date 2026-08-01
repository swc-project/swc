System.register([], function(_export, _context) {
    "use strict";
    var bar, baz;
    var _export_setters = {
        set bar (_value){
            bar = _value;
            _export("bar", bar);
        },
        set baz (_value){
            baz = _value;
            _export("baz", baz);
        }
    };
    _export({
        bar: void 0,
        baz: void 0
    });
    return {
        setters: [],
        execute: function() {
            ({ foo: _export_setters.bar, baz: _export_setters.baz } = {});
        }
    };
});
