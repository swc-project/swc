const c = function() {
    const c1 = "c";
    class C {
    }
    return {
        c: c1,
        default: C
    };
}();
const c1 = c;
const b = "b";
console.log(b); // "b"
console.log(c1); // { c: "c", default: class C }
