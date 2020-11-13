function f2() {
    console.log("f2");
}
f1();
const f21 = f2;
export function f1() {
    console.log("f1");
}
f21();
