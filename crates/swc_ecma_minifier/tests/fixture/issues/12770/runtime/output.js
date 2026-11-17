!function() {
    let o = new WeakMap();
    let t = class e {
        static lookup(t) {
            return o.get(t);
        }
        static create(o) {
            return new e(o);
        }
        constructor(o){
            this.value = o;
        }
    };
    o.set(globalThis, "found"), console.log(t.lookup(globalThis), t.name), console.log(t.create(1) instanceof t, t.create(2).value);
}();
