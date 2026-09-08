//// [foo.ts]
System.register([], function(_export, _context) {
    "use strict";
    _export("default", void 0);
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
    "use strict";
    var _async_to_generator;
    function foo() {
        return _async_to_generator(function*() {
            return yield _context.import((yield _context.import("./foo")).default);
        })();
    }
    return {
        setters: [
            function(_async_to_generator_ns) {
                _async_to_generator = _async_to_generator_ns._;
            }
        ],
        execute: function() {}
    };
});
