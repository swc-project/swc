var a = 1;
function f() {
    a++;
    try {
        x();
    } catch (a1) {
        var a1;
    }
}
f();
console.log(a);
