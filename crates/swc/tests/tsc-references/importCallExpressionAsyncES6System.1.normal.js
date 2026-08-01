//// [test.ts]
System.register([
    "@swc/helpers/_/_async_to_generator"
], function(_export, _context) {
    "use strict";
    var _async_to_generator, cl1, cl2, l, obj;
    function fn() {
        return _async_to_generator(function*() {
            const req = yield _context.import('./test') // ONE
            ;
        })();
    }
    _export({
        cl1: void 0,
        cl2: void 0,
        fn: fn,
        l: void 0,
        obj: void 0
    });
    return {
        setters: [
            function(_async_to_generator_ns) {
                _async_to_generator = _async_to_generator_ns._;
            }
        ],
        execute: function() {
            _export("cl1", cl1 = class cl1 {
                m() {
                    return _async_to_generator(function*() {
                        const req = yield _context.import('./test') // TWO
                        ;
                    })();
                }
            });
            _export("obj", obj = {
                m: ()=>_async_to_generator(function*() {
                        const req = yield _context.import('./test') // THREE
                        ;
                    })()
            });
            _export("cl2", cl2 = class cl2 {
                constructor(){
                    this.p = {
                        m: ()=>_async_to_generator(function*() {
                                const req = yield _context.import('./test') // FOUR
                                ;
                            })()
                    };
                }
            });
            _export("l", l = ()=>_async_to_generator(function*() {
                    const req = yield _context.import('./test') // FIVE
                    ;
                })());
        }
    };
});
