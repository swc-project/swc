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
    "@swc/helpers/src/_async_to_generator.mjs",
    "@swc/helpers/src/_ts_generator.mjs"
], function(_export, _context) {
    "use strict";
    var _async_to_generator, _ts_generator;
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _context.import("./foo")
                        ];
                    case 1:
                        return [
                            4,
                            _context.import(_state.sent().default)
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                }
            });
        });
        return _foo.apply(this, arguments);
    }
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
