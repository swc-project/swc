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
    "@swc/helpers/src/_async_to_generator.mjs",
    "@swc/helpers/src/_ts_generator.mjs"
], function(_export, _context) {
    "use strict";
    var _async_to_generator, _ts_generator;
    return {
        setters: [
            function(_asyncToGenerator) {
                _async_to_generator = _asyncToGenerator.default;
            },
            function(_tsGenerator) {
                _ts_generator = _tsGenerator.default;
            }
        ],
        execute: function() {}
    };
});
