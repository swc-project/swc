function a() {
    console.log("a()");
}
const a1 = a, foo = a1;
function b() {
    console.log("a()");
}
const b1 = b, bar = b1;
function a2() {
}
function b2() {
}
console.log(a2(), foo(), b2(), bar());
