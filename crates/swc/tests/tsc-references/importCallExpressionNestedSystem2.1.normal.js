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
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_ts_generator"
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
            function(_async_to_generator1) {
                _async_to_generator = _async_to_generator1._;
            },
            function(_ts_generator1) {
                _ts_generator = _ts_generator1._;
            }
        ],
        execute: function() {}
    };
});
