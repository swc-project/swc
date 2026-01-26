var a = 1;
function c() {
    a++;
    try {
        x();
    } catch (a) {
        var a = 2;
    }
}
c();
console.log(a);
