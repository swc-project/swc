!function() {
    let l = new WeakMap();
    let e = class o {
        static lookup(e) {
            return l.get(e);
        }
    };
    l.set(globalThis, "found"), console.log(e.lookup(globalThis), e.name);
}();
