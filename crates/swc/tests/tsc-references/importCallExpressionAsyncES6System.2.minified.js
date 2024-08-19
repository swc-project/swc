//// [test.ts]
System.register([
    "@swc/helpers/_/_async_to_generator"
], function(_export, _context) {
    var _async_to_generator;
    function _fn() {
        return (_fn = _async_to_generator(function*() {
            yield _context.import('./test');
        })).apply(this, arguments);
    }
    return _export({
        fn: function() {
            return _fn.apply(this, arguments);
        },
        cl1: void 0,
        cl2: void 0
    }), {
        setters: [
            function(_async_to_generator1) {
                _async_to_generator = _async_to_generator1._;
            }
        ],
        execute: function() {
            var _ref;
            _export("cl1", class {
                m() {
                    return _async_to_generator(function*() {
                        yield _context.import('./test');
                    })();
                }
            }), _export("obj", {
                m: /*#__PURE__*/ _async_to_generator(function*() {
                    yield _context.import('./test');
                })
            }), _export("cl2", class {
                constructor(){
                    this.p = {
                        m: /*#__PURE__*/ _async_to_generator(function*() {
                            yield _context.import('./test');
                        })
                    };
                }
            }), _export("l", (_ref = _async_to_generator(function*() {
                yield _context.import('./test');
            }), function() {
                return _ref.apply(this, arguments);
            }));
        }
    };
});
