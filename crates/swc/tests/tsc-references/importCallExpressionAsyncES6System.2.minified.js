//// [test.ts]
System.register([
    "@swc/helpers/_/_async_to_generator"
], function(_export, _context) {
    var _async_to_generator;
    return _export({
        cl1: void 0,
        cl2: void 0,
        fn: function() {
            return _async_to_generator(function*() {
                yield _context.import('./test');
            })();
        },
        l: void 0,
        obj: void 0
    }), {
        setters: [
            function(_async_to_generator_ns) {
                _async_to_generator = _async_to_generator_ns._;
            }
        ],
        execute: function() {
            _export("cl1", class {
                m() {
                    return _async_to_generator(function*() {
                        yield _context.import('./test');
                    })();
                }
            }), _export("obj", {
                m: ()=>_async_to_generator(function*() {
                        yield _context.import('./test');
                    })()
            }), _export("cl2", class {
                constructor(){
                    this.p = {
                        m: ()=>_async_to_generator(function*() {
                                yield _context.import('./test');
                            })()
                    };
                }
            }), _export("l", ()=>_async_to_generator(function*() {
                    yield _context.import('./test');
                })());
        }
    };
});
