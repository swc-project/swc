System.register([], function(_export, _context) {
    "use strict";
    var first, rest;
    var _export_setters = {
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
        first: void 0,
        rest: void 0
    });
    return {
        setters: [],
        execute: function() {
            for ([_export_setters.first, ..._export_setters.rest] of rows){
                console.log(first, rest);
            }
        }
    };
});
