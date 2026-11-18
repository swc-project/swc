System.register([], function(_export, _context) {
    "use strict";
    var a;
    var _export_setters = {
        set a (_value){
            a = _value;
            _export("a", a);
        }
    };
    _export("a", void 0);
    return {
        setters: [],
        execute: function() {
            for (_export_setters.a of [
                1,
                2
            ])console.log(a);
            for(_export_setters.a in {
                x: 1
            }){}
        }
    };
});
