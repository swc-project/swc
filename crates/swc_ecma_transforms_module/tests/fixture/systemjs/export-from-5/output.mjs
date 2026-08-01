System.register([
    "foo"
], function(_export, _context) {
    "use strict";
    _export("default", void 0);
    return {
        setters: [
            function(_foo_ns) {
                _export("default", _foo_ns.foo);
            }
        ],
        execute: function() {}
    };
});
