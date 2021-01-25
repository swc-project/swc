function a() {
    console.log("a()");
}
function a1() {
}
const a2 = a;
const foo = a2;
console.log(a1(), foo());
