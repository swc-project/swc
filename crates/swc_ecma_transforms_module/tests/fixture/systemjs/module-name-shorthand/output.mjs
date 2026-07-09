System.register([], function(_export, _context) {
    "use strict";
    var meta;
    function local(__moduleName) {
        return {
            __moduleName
        };
    }
    _export({
        local: local,
        meta: void 0
    });
    return {
        setters: [],
        execute: function() {
            _export("meta", meta = {
                __moduleName: _context.meta ? _context.meta.url : _context.id
            });
        }
    };
});
