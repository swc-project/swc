function a() {
    console.log("a");
}
const a1 = a;
const a2 = a1;
const a3 = a2;
function b() {
    a3();
}
b();
