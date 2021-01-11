function a() {
}
function b() {
}
function a1() {
    console.log("a()");
}
const a2 = a1;
const foo = a2;
function b1() {
    console.log("a()");
}
const b2 = b1;
const bar = b2;
console.log(a(), foo(), b(), bar());
