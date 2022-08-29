//// [test.ts]
System.register([
    "@swc/helpers/src/_async_to_generator.mjs"
], function(_export, _context) {
    "use strict";
    var _async_to_generator, cl1, cl2, obj, l;
    function fn() {
        return _fn.apply(this, arguments);
    }
    function _fn() {
        _fn = _async_to_generator(function*() {
            const req = yield _context.import('./test') // ONE
            ;
        });
        return _fn.apply(this, arguments);
    }
    _export({
        fn: fn,
        cl1: void 0,
        cl2: void 0
    });
    return {
        setters: [
            function(_asyncToGenerator) {
                _async_to_generator = _asyncToGenerator.default;
            }
        ],
        execute: function() {
            _export("cl1", cl1 = class cl1 {
                m() {
                    return _async_to_generator(function*() {
                        const req = yield import('./test') // TWO
                        ;
                    })();
                }
            });
            _export("obj", obj = {
                m: /*#__PURE__*/ _async_to_generator(function*() {
                    const req = yield import('./test') // THREE
                    ;
                })
            });
            _export("cl2", cl2 = class cl2 {
                constructor(){
                    (void 0).p = {
                        m: /*#__PURE__*/ _async_to_generator(function*() {
                            const req = yield import('./test') // FOUR
                            ;
                        })
                    };
                }
            });
            _export("l", l = function() {
                var _ref = _async_to_generator(function*() {
                    const req = yield import('./test') // FIVE
                    ;
                });
                return function l() {
                    return _ref.apply(this, arguments);
                };
            }());
        }
    };
});
