var c = 1;
function o() {
    c++;
    try {
        x();
    } catch (c) {
        var c = 2;
    }
}
o();
console.log(c);
