System.register([
    "foo"
], function(_export, _context) {
    "use strict";
    _export("some exports", void 0);
    return {
        setters: [
            function(_foo_ns) {
                _export("some exports", _foo_ns["some imports"]);
            }
        ],
        execute: function() {}
    };
});
