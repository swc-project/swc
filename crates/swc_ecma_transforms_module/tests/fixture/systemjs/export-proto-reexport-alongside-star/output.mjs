System.register([
    "mod"
], function(_export, _context) {
    "use strict";
    _export("__proto__", void 0);
    return {
        setters: [
            function(_mod_ns) {
                var exportObj = {
                    __proto__: null
                };
                for(var key in _mod_ns)if (key !== "default" && key !== "__esModule") exportObj[key] = _mod_ns[key];
                exportObj.__proto__ = _mod_ns.default;
                _export(exportObj);
            }
        ],
        execute: function() {}
    };
});
