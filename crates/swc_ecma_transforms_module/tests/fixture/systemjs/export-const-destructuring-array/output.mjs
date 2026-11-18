System.register([], function(_export, _context) {
    "use strict";
    var bar, foo;
    var _export_setters = {
        set bar (_value){
            bar = _value;
            _export("bar", bar);
        },
        set foo (_value){
            foo = _value;
            _export("foo", foo);
        }
    };
    _export({
        bar: void 0,
        foo: void 0
    });
    return {
        setters: [],
        execute: function() {
            [_export_setters.foo, _export_setters.bar] = [];
        }
    };
});
