System.register([
    "foo"
], function(_export, _context) {
    "use strict";
    _export("foo", void 0);
    return {
        setters: [
            function(_foo_ns) {
                _export("foo", _foo_ns.foo);
            }
        ],
        execute: function() {}
    };
});
