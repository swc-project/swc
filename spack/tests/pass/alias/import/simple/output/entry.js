function a() {
    console.log("a()");
}
const foo = a;
function a1() {
}
console.log(a1(), foo());
