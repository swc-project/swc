var a = 1;
function f() {
    try {
        x();
    } catch (a) {}
}
f();
console.log(a);
