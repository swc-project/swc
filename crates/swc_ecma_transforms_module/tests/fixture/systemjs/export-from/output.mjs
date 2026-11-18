System.register([
    "foo"
], function(_export, _context) {
    "use strict";
    return {
        setters: [
            function(_foo_ns) {
                var exportObj = {
                    __proto__: null
                };
                for(var key in _foo_ns)if (key !== "default" && key !== "__esModule") exportObj[key] = _foo_ns[key];
                _export(exportObj);
            }
        ],
        execute: function() {}
    };
});
