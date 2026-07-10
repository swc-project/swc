System.register([
    "mod"
], function(_export, _context) {
    "use strict";
    var x;
    _export("y", void 0);
    return {
        setters: [
            function(_mod_ns) {
                x = _mod_ns.x;
                _export("y", x);
            }
        ],
        execute: function() {
            console.log(x);
        }
    };
});
