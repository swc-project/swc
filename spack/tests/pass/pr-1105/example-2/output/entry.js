const mod = function() {
    const c = "c";
    const c1 = c;
    class C {
    }
    const __default = C;
    return {
        c,
        default: __default
    };
}();
const c = mod;
const b = "b";
const c1 = c;
const b1 = b;
console.log(b1); // "b"
console.log(c1); // { c: "c", default: class C }
