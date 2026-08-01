System.register([], function(_export, _context) {
    "use strict";
    var name;
    _export("name", void 0);
    return {
        setters: [],
        execute: function() {
            _export("name", name = _context.meta ? _context.meta.url : _context.id);
        }
    };
});
