function a() {
    console.log("a");
}
const a1 = a;
function b() {
    a1();
}
b();
