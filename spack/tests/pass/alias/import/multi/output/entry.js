function b() {
    console.log("a()");
}
function a() {
    console.log("a()");
}
function a1() {
}
function b1() {
}
const a2 = a;
const foo = a2;
const b2 = b;
const bar = b2;
console.log(a1(), foo(), b1(), bar());
