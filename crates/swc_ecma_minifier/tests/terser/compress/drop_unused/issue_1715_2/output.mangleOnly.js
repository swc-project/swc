var a = 1;
function b() {
    a++;
    try {
        x();
    } catch (a) {
        var a = 2;
    }
}
b();
console.log(a);
