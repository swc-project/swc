System.register([], function(_export, _context) {
    "use strict";
    var baz, qux;
    var _export_setters = {
        set baz (_value){
            baz = _value;
            _export("baz", baz);
        },
        set qux (_value){
            qux = _value;
            _export("qux", qux);
        }
    };
    _export({
        baz: void 0,
        qux: void 0
    });
    return {
        setters: [],
        execute: function() {
            ({ foo: { bar: [_export_setters.baz, _export_setters.qux] } } = {});
        }
    };
});
