var a = 1;
function f() {
    try {
        x();
    } catch (a) {
        var a;
    }
}
f();
console.log(a);
