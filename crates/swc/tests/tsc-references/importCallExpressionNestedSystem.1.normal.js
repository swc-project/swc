//// [foo.ts]
System.register([], function(_export, _context) {
    "use strict";
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
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _async_to_generator(function*() {
            return yield _context.import((yield _context.import("./foo")).default);
        });
        return _foo.apply(this, arguments);
    }
    return {
        setters: [
            function(_async_to_generator1) {
                _async_to_generator = _async_to_generator1._;
            }
        ],
        execute: function() {}
    };
});
