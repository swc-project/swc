const b = "b";
const b1 = b;
console.log(b1); // "b"
const mod = function() {
    const c = "c";
    class C {
    }
    const c1 = c;
    const __default = C;
    const __default1 = __default;
    return {
        c: c1,
        default: __default1
    };
}();
const c = mod;
const c1 = c;
console.log(c1); // { c: "c", default: class C }
