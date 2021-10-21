function f1() {
    console.log("f1");
}
function f2() {
    console.log("f2");
}
f2();
f1();
export { f1 as f1 };
