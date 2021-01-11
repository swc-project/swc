function a() {
}
function a1() {
    console.log("a()");
}
const a2 = a1;
const foo = a2;
console.log(a(), foo());
