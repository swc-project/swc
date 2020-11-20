function f1() {
    console.log("f1");
}
const f11 = f1;
function f2() {
    console.log("f2");
}
f11();
const f21 = f2;
f21();
export { f11 as f1 };
