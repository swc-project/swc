function a() {
    console.log("a");
}
const a1 = a;
const a2 = a1;
function b() {
    a2();
}
b();
