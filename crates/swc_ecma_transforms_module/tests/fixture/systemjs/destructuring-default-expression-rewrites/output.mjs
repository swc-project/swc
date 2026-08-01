System.register([], function(_export, _context) {
    "use strict";
    var _old, a, meta, next, x;
    _export("a", void 0);
    return {
        setters: [],
        execute: async function() {
            ({ x = await y } = obj);
            ({ meta = _context.meta.url } = obj);
            ({ next = (_old = a++, _export("a", a), _old) } = obj);
            console.log(x, meta, next);
        }
    };
});
