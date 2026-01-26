var a = 1;
function c() {
    a++;
    try {
        x();
    } catch (a) {
        var a;
    }
}
c();
console.log(a);
