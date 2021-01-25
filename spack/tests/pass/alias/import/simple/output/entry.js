function a() {
    console.log("a()");
}
const a1 = a;
const foo = a1;
function a2() {
}
console.log(a2(), foo());
