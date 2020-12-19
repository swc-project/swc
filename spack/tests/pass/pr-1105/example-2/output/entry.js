const b = "b";
const mod = function() {
    const c = "c";
    class C {
    }
    const c1 = c;
    const __default = C;
    return {
        c,
        default: __default
    };
}();
const c = mod;
const c1 = c;
const b1 = b;
console.log(b1); // "b"
console.log(c1); // { c: "c", default: class C }
