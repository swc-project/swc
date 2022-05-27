var a = 1;
function b() {
    a++;
    try {
        x();
    } catch (a) {
        var a;
    }
}
b();
console.log(a);
