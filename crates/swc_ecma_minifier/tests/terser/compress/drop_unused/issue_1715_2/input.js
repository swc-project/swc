var a = 1;
function f() {
    a++;
    try {
        x();
    } catch (a) {
        var a = 2;
    }
}
f();
console.log(a);
