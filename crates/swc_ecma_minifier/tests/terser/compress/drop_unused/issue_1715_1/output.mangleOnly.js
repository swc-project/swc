var c = 1;
function o() {
    c++;
    try {
        x();
    } catch (c) {
        var c;
    }
}
o();
console.log(c);
