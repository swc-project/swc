const _c = function() {
    const c = "c";
    class C {
    }
    return {
        c,
        default: C
    };
}();
const c = _c;
const b = "b";
console.log(b); // "b"
console.log(c); // { c: "c", default: class C }
