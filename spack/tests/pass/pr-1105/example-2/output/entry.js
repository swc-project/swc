const c = "c";
class C {
}
const mod = function() {
    return {
        mod: c,
        default: C
    };
}();
const b = "b";
console.log(b); // "b"
console.log(mod); // { c: "c", default: class C }
