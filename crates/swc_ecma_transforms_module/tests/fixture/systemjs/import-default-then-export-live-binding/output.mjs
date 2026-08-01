System.register([
    "mod"
], function(_export, _context) {
    "use strict";
    var foo;
    _export("bar", void 0);
    return {
        setters: [
            function(_mod_ns) {
                foo = _mod_ns.default;
                _export("bar", foo);
            }
        ],
        execute: function() {}
    };
});
