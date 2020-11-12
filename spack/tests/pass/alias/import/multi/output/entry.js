function a() {
    console.log("a()");
}
const foo = a;
function b() {
    console.log("a()");
}
const bar = b;
function a1() {
}
function b1() {
}
console.log(a1(), foo(), b1(), bar());
