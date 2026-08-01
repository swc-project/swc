System.register([], function(_export, _context) {
    "use strict";
    var a;
    var _export_setters = {
        set a (_value){
            a = _value;
            _export("renamed", a);
        }
    };
    _export("renamed", void 0);
    return {
        setters: [],
        execute: function() {
            ({ a: _export_setters.a } = obj);
        }
    };
});
