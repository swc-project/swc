function f2() {
    console.log("f2");
}
const f21 = f2;
function f1() {
    console.log("f1");
}
const f11 = f1;
export { f11 as f1 };
f11();
f21();
