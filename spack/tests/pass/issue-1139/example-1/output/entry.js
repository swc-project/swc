function f11() {
    console.log("f1");
}
export { f11 as f1 };
const f12 = f11;
function f2() {
    console.log("f2");
}
const f21 = f2;
f12();
f21();
