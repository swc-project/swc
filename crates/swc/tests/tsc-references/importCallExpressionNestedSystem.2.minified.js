//// [foo.ts]
System.register([], function(_export, _context) {
    return {
        setters: [],
        execute: function() {
            _export("default", "./foo");
        }
    };
});
//// [index.ts]
System.register([
    "@swc/helpers/src/_async_to_generator.mjs"
], function(_export, _context) {
    "use strict";
    var _async_to_generator;
    return {
        setters: [
            function(_asyncToGenerator) {
                _async_to_generator = _asyncToGenerator.default;
            }
        ],
        execute: function() {}
    };
});
