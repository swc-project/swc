function f2() {
    console.log("f2");
}
function f11() {
    console.log("f1");
}
f1();
const f21 = f2;
f21();
export { f11 as f1 };
