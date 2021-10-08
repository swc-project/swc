const c = "c";
class C {
}
const mod = {
    c: c,
    default: C
};
const b = "b";
console.log(b); // "b"
console.log(mod); // { c: "c", default: class C }
