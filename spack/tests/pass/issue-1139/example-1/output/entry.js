function f2() {
    console.log("f2");
}
function f11() {
    console.log("f1");
}
f2();
f11();
export { f11 as f1 };
