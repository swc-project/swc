//// [foo.ts]
System.register([], function(_export, _context) {
    return _export("default", void 0), {
        setters: [],
        execute: function() {
            _export("default", "./foo");
        }
    };
});
//// [index.ts]
System.register([
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_ts_generator"
], function(_export, _context) {
    return {
        setters: [
            function(_async_to_generator_ns) {
                _async_to_generator_ns._;
            },
            function(_ts_generator_ns) {
                _ts_generator_ns._;
            }
        ],
        execute: function() {}
    };
});
