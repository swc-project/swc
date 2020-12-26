const b = "b";
const b1 = b;
console.log(b1); // "b"
const mod = function() {
    const c = "c";
    class C {
    }
    const __default = C;
    const c1 = c;
    return {
        c,
        default: __default
    };
}();
const c = mod;
const c1 = c;
console.log(c1); // { c: "c", default: class C }
