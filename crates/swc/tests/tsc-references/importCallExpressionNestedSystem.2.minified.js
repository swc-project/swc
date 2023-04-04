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
    "@swc/helpers/_/_async_to_generator"
], function(_export, _context) {
    return {
        setters: [
            function(_async_to_generator1) {
                _async_to_generator1._;
            }
        ],
        execute: function() {}
    };
});
