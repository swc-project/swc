var a = 1;
function f() {
    a++;
    try {
        x();
    } catch (a) {
        var a;
    }
}
f();
console.log(a);
