System.register([], function(_export, _context) {
    "use strict";
    var a, first, rest;
    var _export_setters = {
        set a (_value){
            a = _value;
            _export("a", a);
        },
        set first (_value){
            first = _value;
            _export("first", first);
        },
        set rest (_value){
            rest = _value;
            _export("rest", rest);
        }
    };
    _export({
        a: void 0,
        first: void 0,
        rest: void 0
    });
    return {
        setters: [],
        execute: function() {
            [_export_setters.first, ..._export_setters.rest] = values;
            ({ a: _export_setters.a, ..._export_setters.rest } = obj);
        }
    };
});
